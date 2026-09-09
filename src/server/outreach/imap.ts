import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { prisma } from "@/server/outreach/db";
import { logActivity } from "@/server/outreach/activity";
import { classifyReply, draftReplyToInbound } from "@/server/outreach/ai";

const UNSUBSCRIBE_PHRASES = ["unsubscribe", "remove me from", "stop emailing", "do not contact", "opt out", "opt-out", "stop contacting"];

function imapConfigured() {
  return Boolean(process.env.OUTREACH_IMAP_HOST && process.env.OUTREACH_IMAP_USER && process.env.OUTREACH_IMAP_PASSWORD);
}

async function threadSummaryFor(lenderId: string, contactId: string, beforeId?: string) {
  const messages = await prisma.outreachMessage.findMany({
    where: { lenderId, contactId, status: { notIn: ["DRAFT", "FAILED"] }, ...(beforeId ? { id: { not: beforeId } } : {}) },
    orderBy: { createdAt: "asc" },
    take: 20,
  });
  return messages.map((m) => `[${m.direction === "OUTBOUND" ? "LoansPartner" : "Lender"}, ${m.createdAt.toISOString().slice(0, 10)}] Subject: ${m.subject}\n${m.body}`).join("\n\n");
}

export type PollResult = { checked: number; matched: number; unmatched: number; optedOut: number; errors: string[] };

/**
 * Polls the connected mailbox for replies to outreach emails, matches each
 * one to a lender by sender address, classifies it, and drafts a reply that
 * waits in the approval queue. It never sends anything itself: every draft
 * this produces has requiresApproval set, so a human always makes the
 * decision to send. Intended to run on a schedule via the cron API route.
 */
export async function pollInboundReplies(actor: string): Promise<PollResult> {
  const result: PollResult = { checked: 0, matched: 0, unmatched: 0, optedOut: 0, errors: [] };
  if (!imapConfigured()) {
    result.errors.push("IMAP is not configured (OUTREACH_IMAP_HOST/USER/PASSWORD). Reply monitoring is off.");
    return result;
  }

  const lastPollSetting = await prisma.setting.findUnique({ where: { key: "lastImapPollAt" } });
  const since = lastPollSetting?.value ? new Date(lastPollSetting.value as string) : new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const client = new ImapFlow({
    host: process.env.OUTREACH_IMAP_HOST!,
    port: Number(process.env.OUTREACH_IMAP_PORT ?? 993),
    secure: true,
    auth: { user: process.env.OUTREACH_IMAP_USER!, pass: process.env.OUTREACH_IMAP_PASSWORD! },
    logger: false,
  });

  await client.connect();
  try {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const uids = await client.search({ since });
      for (const uid of uids || []) {
        result.checked++;
        try {
          const raw = await client.download(String(uid), undefined, { uid: true });
          if (!raw) continue;
          const parsed = await simpleParser(raw.content);
          const messageId = parsed.messageId ?? undefined;
          if (messageId) {
            const already = await prisma.outreachMessage.findFirst({ where: { rawHeaders: { path: ["messageId"], equals: messageId } } });
            if (already) continue;
          }
          const fromAddress = parsed.from?.value?.[0]?.address?.toLowerCase();
          if (!fromAddress) continue;

          const contact = await prisma.contact.findFirst({ where: { email: fromAddress }, include: { lender: true } });
          if (!contact) {
            result.unmatched++;
            continue;
          }
          result.matched++;

          const text = (parsed.text ?? "").trim();
          const isUnsubscribeRequest = UNSUBSCRIBE_PHRASES.some((p) => text.toLowerCase().includes(p));

          const threadSummary = await threadSummaryFor(contact.lenderId, contact.id);
          const classification = isUnsubscribeRequest ? ({ classification: "UNSUBSCRIBE", confidence: "high", note: "Matched an unsubscribe phrase in the reply text." } as const) : await classifyReply(threadSummary || "(no prior thread found)", text || parsed.subject || "(empty message)");

          const inbound = await prisma.outreachMessage.create({
            data: {
              lenderId: contact.lenderId,
              contactId: contact.id,
              threadId: contact.id,
              direction: "INBOUND",
              kind: "REPLY",
              status: "SENT",
              subject: parsed.subject ?? "(no subject)",
              body: text || "(no plain-text body)",
              fromEmail: fromAddress,
              toEmail: Array.isArray(parsed.to) ? parsed.to.map((a) => a.text).join(", ") : parsed.to?.text,
              rawHeaders: { messageId, inReplyTo: parsed.inReplyTo ?? null },
              replyClassification: classification.classification,
              classificationNote: classification.note,
              requiresApproval: true,
            },
          });

          if (classification.classification === "UNSUBSCRIBE" || isUnsubscribeRequest) {
            await prisma.contact.update({ where: { id: contact.id }, data: { optedOut: true, optedOutAt: new Date() } });
            await prisma.lender.update({ where: { id: contact.lenderId }, data: { status: "OPTED_OUT" } });
            result.optedOut++;
          } else if (classification.classification !== "OUT_OF_OFFICE") {
            await prisma.lender.update({ where: { id: contact.lenderId }, data: { status: "REPLIED" } });
          }

          if (classification.classification !== "OUT_OF_OFFICE" && classification.classification !== "UNSUBSCRIBE") {
            const draft = await draftReplyToInbound(contact.lender, threadSummary, text, classification.classification);
            await prisma.outreachMessage.create({
              data: {
                lenderId: contact.lenderId,
                contactId: contact.id,
                threadId: contact.id,
                direction: "OUTBOUND",
                kind: "REPLY",
                status: "PENDING_APPROVAL",
                subject: draft.subject,
                body: draft.body,
                inReplyToMessageId: inbound.id,
                aiModel: "claude-sonnet-5",
                requiresApproval: true,
              },
            });
          }

          await logActivity({ lenderId: contact.lenderId, actor, action: "reply.received_and_classified", meta: { classification: classification.classification, confidence: classification.confidence } });
        } catch (err) {
          result.errors.push(`uid ${uid}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => client.close());
  }

  await prisma.setting.upsert({ where: { key: "lastImapPollAt" }, create: { key: "lastImapPollAt", value: new Date().toISOString() }, update: { value: new Date().toISOString() } });
  return result;
}
