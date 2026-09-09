import { Resend } from "resend";
import { prisma } from "@/server/outreach/db";
import { logActivity } from "@/server/outreach/activity";
import { canSendMore, secondsSinceLastSend } from "@/server/outreach/rateLimiter";
import { getSettings } from "@/server/outreach/settings";

let resend: Resend | null = null;
function client() {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set.");
    resend = new Resend(key);
  }
  return resend;
}

function toHtml(body: string) {
  const escaped = body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px">${p.replace(/\n/g, "<br />")}</p>`)
    .join("");
  return `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#0b1b33;max-width:560px">${paragraphs}</div>`;
}

export type SendOutcome = { sent: true; resendMessageId: string } | { sent: false; reason: "opted_out" | "rate_limited" | "throttled" | "send_failed" | "not_approved"; detail?: string };

/**
 * Sends one approved outreach message. Every branch that does not send
 * writes back a status and reason, so nothing silently stays "approved"
 * without either sending or explaining why not.
 */
export async function sendOutreachMessage(messageId: string, actor: string): Promise<SendOutcome> {
  const message = await prisma.outreachMessage.findUniqueOrThrow({
    where: { id: messageId },
    include: { lender: true, contact: true },
  });

  if (!["APPROVED", "QUEUED"].includes(message.status)) {
    return { sent: false, reason: "not_approved", detail: `message status is ${message.status}` };
  }
  if (!message.contact) {
    return { sent: false, reason: "send_failed", detail: "message has no contact" };
  }
  if (message.contact.optedOut) {
    await prisma.outreachMessage.update({ where: { id: message.id }, data: { status: "SKIPPED", skippedReason: "Contact has opted out." } });
    return { sent: false, reason: "opted_out" };
  }

  const settings = await getSettings();
  if (settings.paused) {
    return { sent: false, reason: "throttled", detail: "sending is paused in outreach settings" };
  }
  const { allowed, sentToday } = await canSendMore(settings.dailySendLimit);
  if (!allowed) {
    await prisma.outreachMessage.update({ where: { id: message.id }, data: { status: "QUEUED" } });
    return { sent: false, reason: "rate_limited", detail: `daily limit ${settings.dailySendLimit} reached (${sentToday} sent today)` };
  }
  const sinceLast = await secondsSinceLastSend();
  if (sinceLast !== null && sinceLast < settings.sendDelaySeconds) {
    await prisma.outreachMessage.update({ where: { id: message.id }, data: { status: "QUEUED" } });
    return { sent: false, reason: "throttled", detail: `next send available in ${Math.ceil(settings.sendDelaySeconds - sinceLast)}s` };
  }

  const from = process.env.OUTREACH_FROM_EMAIL ?? "LoansPartner Partnerships <partnerships@loanspartner.in>";
  const replyTo = process.env.OUTREACH_REPLY_TO;

  let lastError: string | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const { data, error } = await client().emails.send({
      from,
      to: message.contact.email,
      replyTo: replyTo || undefined,
      subject: message.subject,
      text: message.body,
      html: message.bodyHtml ?? toHtml(message.body),
      headers: message.inReplyToMessageId ? { "In-Reply-To": message.inReplyToMessageId, References: message.inReplyToMessageId } : undefined,
    });
    if (!error && data) {
      await prisma.outreachMessage.update({
        where: { id: message.id },
        data: { status: "SENT", sentAt: new Date(), resendMessageId: data.id, approvedBy: message.approvedBy ?? actor },
      });
      if (message.kind === "PROPOSAL" || message.kind === "FOLLOW_UP") {
        await prisma.lender.updateMany({ where: { id: message.lenderId, status: { in: ["NEW", "CONTACT_NEEDED", "READY"] } }, data: { status: "CONTACTED" } });
      }
      await logActivity({ lenderId: message.lenderId, actor, action: "message.sent", meta: { messageId: message.id, kind: message.kind, resendMessageId: data.id } });
      return { sent: true, resendMessageId: data.id };
    }
    lastError = error?.message ?? "unknown error";
    if (error?.name !== "rate_limit_exceeded" && error?.name !== "internal_server_error") break;
    await new Promise((r) => setTimeout(r, attempt * 1500));
  }

  await prisma.outreachMessage.update({ where: { id: message.id }, data: { status: "FAILED", failedReason: lastError ?? "send failed" } });
  await logActivity({ lenderId: message.lenderId, actor, action: "message.send_failed", meta: { messageId: message.id, error: lastError } });
  return { sent: false, reason: "send_failed", detail: lastError ?? undefined };
}

/** True if a proposal has already gone out to this lender/contact pair, so a second send is a deliberate choice, not an accident. */
export async function hasExistingProposal(lenderId: string, contactId: string) {
  const existing = await prisma.outreachMessage.findFirst({
    where: { lenderId, contactId, kind: "PROPOSAL", status: { in: ["SENT", "DELIVERED", "OPENED", "BOUNCED"] } },
  });
  return existing !== null;
}
