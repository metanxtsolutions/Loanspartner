"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/server/outreach/db";
import { requireAdmin } from "@/server/outreach/auth";
import { logActivity } from "@/server/outreach/activity";
import { discoverLenderContacts } from "@/server/outreach/contactDiscovery";
import { generateProposal } from "@/server/outreach/ai";
import { hasExistingProposal } from "@/server/outreach/email";
import type { LenderStatus } from "@prisma/client";

export type ActionResult = { ok: boolean; message?: string };

export async function runContactDiscoveryAction(lenderId: string): Promise<ActionResult> {
  const actor = await requireAdmin();
  const lender = await prisma.lender.findUniqueOrThrow({ where: { id: lenderId }, include: { contacts: true } });
  const discovered = await discoverLenderContacts(lender.website);
  let created = 0;
  for (const d of discovered) {
    if (lender.contacts.some((c) => c.email === d.email)) continue;
    await prisma.contact.create({
      data: { lenderId, email: d.email, confidence: d.confidence, sourceUrl: d.sourceUrl, sourceNote: d.sourceNote, isPrimary: false },
    });
    created++;
  }
  const hasHigh = discovered.some((d) => d.confidence === "HIGH") || lender.contacts.some((c) => c.confidence === "HIGH");
  if (lender.status === "NEW") {
    await prisma.lender.update({ where: { id: lenderId }, data: { status: discovered.length ? (hasHigh ? "READY" : "CONTACT_NEEDED") : "CONTACT_NEEDED" } });
  }
  const noPrimary = !(await prisma.contact.findFirst({ where: { lenderId, isPrimary: true } }));
  if (noPrimary) {
    const best = await prisma.contact.findFirst({ where: { lenderId }, orderBy: [{ confidence: "asc" }] });
    if (best) await prisma.contact.update({ where: { id: best.id }, data: { isPrimary: true } });
  }
  await logActivity({ lenderId, actor, action: "contact.discovery_run", meta: { found: discovered.length, created } });
  revalidatePath(`/admin/outreach/${lenderId}`);
  revalidatePath("/admin/outreach");
  if (discovered.length === 0) return { ok: true, message: "No email found automatically on the lender's site. Add one manually below." };
  return { ok: true, message: `Found ${discovered.length} candidate contact(s), ${created} new.` };
}

const manualContactSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  sourceNote: z.string().trim().max(300).optional().or(z.literal("")),
  makePrimary: z.literal("on").optional(),
});

export async function addManualContactAction(lenderId: string, _prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await requireAdmin();
  const parsed = manualContactSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { ok: false, message: "Enter a valid email address." };
  const makePrimary = parsed.data.makePrimary === "on";
  if (makePrimary) await prisma.contact.updateMany({ where: { lenderId }, data: { isPrimary: false } });
  await prisma.contact.upsert({
    where: { lenderId_email: { lenderId, email: parsed.data.email.toLowerCase() } },
    create: {
      lenderId,
      email: parsed.data.email.toLowerCase(),
      name: parsed.data.name || null,
      title: parsed.data.title || null,
      confidence: "HIGH",
      sourceNote: parsed.data.sourceNote || `Entered manually by ${actor}`,
      isPrimary: makePrimary,
    },
    update: { name: parsed.data.name || undefined, title: parsed.data.title || undefined, isPrimary: makePrimary || undefined },
  });
  await prisma.lender.updateMany({ where: { id: lenderId, status: { in: ["NEW", "CONTACT_NEEDED"] } }, data: { status: "READY" } });
  await logActivity({ lenderId, actor, action: "contact.added_manually", meta: { email: parsed.data.email } });
  revalidatePath(`/admin/outreach/${lenderId}`);
  return { ok: true, message: "Contact saved." };
}

const noteSchema = z.object({ body: z.string().trim().min(1).max(2000) });

export async function addNoteAction(lenderId: string, _prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await requireAdmin();
  const parsed = noteSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { ok: false, message: "Note cannot be empty." };
  await prisma.note.create({ data: { lenderId, author: actor, body: parsed.data.body } });
  revalidatePath(`/admin/outreach/${lenderId}`);
  return { ok: true, message: "Note added." };
}

export async function updateLenderStatusAction(lenderId: string, status: LenderStatus): Promise<ActionResult> {
  const actor = await requireAdmin();
  await prisma.lender.update({ where: { id: lenderId }, data: { status } });
  await logActivity({ lenderId, actor, action: "lender.status_changed", meta: { status } });
  revalidatePath(`/admin/outreach/${lenderId}`);
  revalidatePath("/admin/outreach");
  return { ok: true };
}

export async function generateProposalAction(lenderId: string, contactId: string): Promise<ActionResult> {
  const actor = await requireAdmin();
  const lender = await prisma.lender.findUniqueOrThrow({ where: { id: lenderId } });
  const contact = await prisma.contact.findUniqueOrThrow({ where: { id: contactId } });
  if (contact.optedOut) return { ok: false, message: "This contact has opted out and cannot be emailed." };
  if (await hasExistingProposal(lenderId, contactId)) {
    return { ok: false, message: "A proposal has already been sent to this contact. Use a follow-up instead, or delete the old draft first if this is intentional." };
  }
  const draft = await generateProposal(lender, { contactName: contact.name, contactTitle: contact.title });
  const message = await prisma.outreachMessage.create({
    data: {
      lenderId,
      contactId,
      threadId: "",
      direction: "OUTBOUND",
      kind: "PROPOSAL",
      status: "PENDING_APPROVAL",
      subject: draft.subject,
      body: draft.body,
      aiModel: "claude-sonnet-5",
    },
  });
  await prisma.outreachMessage.update({ where: { id: message.id }, data: { threadId: message.id } });
  await logActivity({ lenderId, actor, action: "proposal.drafted", meta: { messageId: message.id, contactId } });
  revalidatePath(`/admin/outreach/${lenderId}`);
  revalidatePath("/admin/outreach/approvals");
  return { ok: true, message: "Draft ready for review." };
}
