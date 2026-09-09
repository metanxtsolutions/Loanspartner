import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/server/outreach/db";
import { logActivity } from "@/server/outreach/activity";

/**
 * Resend signs webhooks the way Svix does: verify svix-id.svix-timestamp.body
 * against the signature(s) in the svix-signature header, using the base64
 * portion of RESEND_WEBHOOK_SECRET (the "whsec_..." value from the Resend
 * dashboard's webhook settings) as the HMAC key. No svix dependency needed
 * for this one check.
 */
function verifySignature(rawBody: string, headers: Headers): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return false;
  const id = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signatureHeader = headers.get("svix-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const signedContent = `${id}.${timestamp}.${rawBody}`;
  const expected = createHmac("sha256", secretBytes).update(signedContent).digest("base64");

  return signatureHeader.split(" ").some((entry) => {
    const [, sig] = entry.split(",");
    if (!sig) return false;
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

type ResendEvent = { type: string; data: { email_id?: string; bounce?: { message?: string } } };

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let event: ResendEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const resendMessageId = event.data?.email_id;
  if (!resendMessageId) return NextResponse.json({ ok: true, ignored: "no email_id" });

  const message = await prisma.outreachMessage.findFirst({ where: { resendMessageId } });
  if (!message) return NextResponse.json({ ok: true, ignored: "no matching message" });

  switch (event.type) {
    case "email.delivered":
      await prisma.outreachMessage.update({ where: { id: message.id }, data: { status: "DELIVERED", deliveredAt: new Date() } });
      break;
    case "email.opened":
      await prisma.outreachMessage.update({ where: { id: message.id }, data: { status: "OPENED", openedAt: message.openedAt ?? new Date() } });
      break;
    case "email.bounced":
      await prisma.outreachMessage.update({ where: { id: message.id }, data: { status: "BOUNCED", bouncedAt: new Date(), bounceReason: event.data.bounce?.message ?? "bounced" } });
      if (message.contactId) await prisma.contact.update({ where: { id: message.contactId }, data: { optedOut: true, optedOutAt: new Date() } });
      await logActivity({ lenderId: message.lenderId, actor: "system (resend webhook)", action: "message.bounced", meta: { messageId: message.id } });
      break;
    case "email.complained":
      if (message.contactId) await prisma.contact.update({ where: { id: message.contactId }, data: { optedOut: true, optedOutAt: new Date() } });
      await prisma.lender.update({ where: { id: message.lenderId }, data: { status: "OPTED_OUT" } });
      await logActivity({ lenderId: message.lenderId, actor: "system (resend webhook)", action: "message.complained", meta: { messageId: message.id } });
      break;
    default:
      break;
  }

  return NextResponse.json({ ok: true });
}
