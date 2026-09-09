"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/server/outreach/db";
import { requireAdmin } from "@/server/outreach/auth";
import { logActivity } from "@/server/outreach/activity";
import { sendOutreachMessage } from "@/server/outreach/email";
import { generateProposal, generateFollowUp, draftReplyToInbound } from "@/server/outreach/ai";

export type ActionResult = { ok: boolean; message?: string };

export async function approveAndSendAction(messageId: string): Promise<ActionResult> {
  const actor = await requireAdmin();
  const message = await prisma.outreachMessage.findUniqueOrThrow({ where: { id: messageId } });
  if (message.status !== "APPROVED") {
    await prisma.outreachMessage.update({ where: { id: messageId }, data: { status: "APPROVED", approvedBy: actor, approvedAt: new Date() } });
  }
  await logActivity({ lenderId: message.lenderId, actor, action: "message.approved", meta: { messageId, kind: message.kind } });
  const outcome = await sendOutreachMessage(messageId, actor);
  revalidatePath(`/admin/outreach/${message.lenderId}`);
  revalidatePath("/admin/outreach/approvals");
  if (outcome.sent) return { ok: true, message: "Sent." };
  if (outcome.reason === "rate_limited" || outcome.reason === "throttled") return { ok: true, message: `Approved and queued: ${outcome.detail}` };
  return { ok: false, message: `Could not send: ${outcome.reason}${outcome.detail ? `, ${outcome.detail}` : ""}` };
}

const editSchema = z.object({ subject: z.string().trim().min(1).max(200), body: z.string().trim().min(1).max(8000) });

export async function editMessageAction(messageId: string, _prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await requireAdmin();
  const parsed = editSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { ok: false, message: "Subject and body cannot be empty." };
  const message = await prisma.outreachMessage.findUniqueOrThrow({ where: { id: messageId } });
  if (!["DRAFT", "PENDING_APPROVAL"].includes(message.status)) return { ok: false, message: "This message has already been sent or skipped and cannot be edited." };
  await prisma.outreachMessage.update({ where: { id: messageId }, data: { subject: parsed.data.subject, body: parsed.data.body, bodyHtml: null, editedByHuman: true } });
  await logActivity({ lenderId: message.lenderId, actor, action: "message.edited", meta: { messageId } });
  revalidatePath(`/admin/outreach/${message.lenderId}`);
  revalidatePath("/admin/outreach/approvals");
  return { ok: true, message: "Saved." };
}

export async function skipMessageAction(messageId: string, reason: string): Promise<ActionResult> {
  const actor = await requireAdmin();
  const message = await prisma.outreachMessage.update({ where: { id: messageId }, data: { status: "SKIPPED", skippedReason: reason || "Skipped by reviewer." } });
  await logActivity({ lenderId: message.lenderId, actor, action: "message.skipped", meta: { messageId, reason } });
  revalidatePath(`/admin/outreach/${message.lenderId}`);
  revalidatePath("/admin/outreach/approvals");
  return { ok: true };
}

export async function regenerateMessageAction(messageId: string): Promise<ActionResult> {
  const actor = await requireAdmin();
  const message = await prisma.outreachMessage.findUniqueOrThrow({ where: { id: messageId }, include: { lender: true, contact: true } });
  if (!["DRAFT", "PENDING_APPROVAL"].includes(message.status)) return { ok: false, message: "Only an unsent draft can be regenerated." };

  let draft: { subject: string; body: string };
  if (message.kind === "PROPOSAL") {
    draft = await generateProposal(message.lender, { contactName: message.contact?.name, contactTitle: message.contact?.title });
  } else if (message.kind === "FOLLOW_UP") {
    const priorOutbound = await prisma.outreachMessage.findFirst({
      where: { threadId: message.threadId, direction: "OUTBOUND", id: { not: message.id }, status: { in: ["SENT", "DELIVERED", "OPENED", "BOUNCED"] } },
      orderBy: { sentAt: "desc" },
    });
    const stepNumber = await prisma.outreachMessage.count({ where: { threadId: message.threadId, kind: "FOLLOW_UP", id: { not: message.id }, status: { in: ["SENT", "DELIVERED", "OPENED", "BOUNCED"] } } });
    if (!priorOutbound) return { ok: false, message: "Cannot regenerate: no prior sent message found in this thread." };
    draft = await generateFollowUp(message.lender, priorOutbound.subject, priorOutbound.body, stepNumber + 1);
  } else {
    const inbound = message.inReplyToMessageId ? await prisma.outreachMessage.findUnique({ where: { id: message.inReplyToMessageId } }) : null;
    if (!inbound || !message.contact) return { ok: false, message: "Cannot regenerate: original reply this was answering was not found." };
    const thread = await prisma.outreachMessage.findMany({ where: { lenderId: message.lenderId, contactId: message.contactId, id: { notIn: [message.id, inbound.id] }, status: { notIn: ["DRAFT", "FAILED"] } }, orderBy: { createdAt: "asc" } });
    const threadSummary = thread.map((m) => `[${m.direction === "OUTBOUND" ? "LoansPartner" : "Lender"}] ${m.subject}: ${m.body}`).join("\n\n");
    draft = await draftReplyToInbound(message.lender, threadSummary, inbound.body, inbound.replyClassification ?? "UNCLEAR");
  }

  await prisma.outreachMessage.update({ where: { id: messageId }, data: { subject: draft.subject, body: draft.body, bodyHtml: null, editedByHuman: false } });
  await logActivity({ lenderId: message.lenderId, actor, action: "message.regenerated", meta: { messageId } });
  revalidatePath(`/admin/outreach/${message.lenderId}`);
  revalidatePath("/admin/outreach/approvals");
  return { ok: true, message: "Regenerated." };
}
