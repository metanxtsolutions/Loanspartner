import { prisma } from "@/server/outreach/db";
import { getSettings } from "@/server/outreach/settings";
import { generateFollowUp } from "@/server/outreach/ai";
import { sendOutreachMessage } from "@/server/outreach/email";
import { logActivity } from "@/server/outreach/activity";

export type FollowUpRunResult = { evaluated: number; queued: number; sent: number; skipped: number; errors: string[] };

/**
 * Finds every lender that was contacted, has not replied, and is due for
 * the next step in the follow-up sequence, then drafts (and, only if the
 * admin has explicitly turned on auto-send, sends) that follow-up. A
 * lender drops out of this loop the moment its status leaves CONTACTED,
 * which happens the instant a reply is matched or a contact opts out, so
 * follow-ups stop immediately as required.
 */
export async function runFollowUpSequence(actor: string): Promise<FollowUpRunResult> {
  const result: FollowUpRunResult = { evaluated: 0, queued: 0, sent: 0, skipped: 0, errors: [] };
  const settings = await getSettings();
  if (settings.paused) return result;

  const contactedLenders = await prisma.lender.findMany({
    where: { status: "CONTACTED", OR: [{ pausedUntil: null }, { pausedUntil: { lte: new Date() } }] },
    include: { contacts: { where: { optedOut: false } } },
  });

  for (const lender of contactedLenders) {
    const contact = lender.contacts.find((c) => c.isPrimary) ?? lender.contacts[0];
    if (!contact) continue;

    const threadMessages = await prisma.outreachMessage.findMany({
      where: { lenderId: lender.id, contactId: contact.id, direction: "OUTBOUND", status: { in: ["SENT", "DELIVERED", "OPENED", "BOUNCED"] } },
      orderBy: { sentAt: "asc" },
    });
    const proposal = threadMessages.find((m) => m.kind === "PROPOSAL");
    if (!proposal?.sentAt) continue;

    const followUpsSent = threadMessages.filter((m) => m.kind === "FOLLOW_UP");
    const stepIndex = followUpsSent.length;
    if (stepIndex >= settings.followUpDays.length) continue;

    const daysSinceProposal = (Date.now() - proposal.sentAt.getTime()) / (24 * 60 * 60 * 1000);
    if (daysSinceProposal < settings.followUpDays[stepIndex]) continue;

    const pendingAlready = await prisma.outreachMessage.findFirst({ where: { lenderId: lender.id, contactId: contact.id, kind: "FOLLOW_UP", status: { in: ["DRAFT", "PENDING_APPROVAL", "APPROVED", "QUEUED"] } } });
    if (pendingAlready) continue;

    result.evaluated++;
    try {
      const latest = threadMessages[threadMessages.length - 1];
      const draft = await generateFollowUp(lender, latest.subject, latest.body, stepIndex + 1);
      const created = await prisma.outreachMessage.create({
        data: {
          lenderId: lender.id,
          contactId: contact.id,
          threadId: proposal.threadId,
          direction: "OUTBOUND",
          kind: "FOLLOW_UP",
          status: settings.autoSendFollowUps ? "APPROVED" : "PENDING_APPROVAL",
          subject: draft.subject,
          body: draft.body,
          aiModel: "claude-sonnet-5",
          approvedBy: settings.autoSendFollowUps ? "system (auto-send follow-ups enabled)" : null,
          approvedAt: settings.autoSendFollowUps ? new Date() : null,
        },
      });
      await logActivity({ lenderId: lender.id, actor, action: "followup.drafted", meta: { step: stepIndex + 1, messageId: created.id, autoSend: settings.autoSendFollowUps } });

      if (settings.autoSendFollowUps) {
        const outcome = await sendOutreachMessage(created.id, "system (auto-send follow-ups)");
        if (outcome.sent) result.sent++;
        else result.queued++;
      } else {
        result.queued++;
      }
    } catch (err) {
      result.errors.push(`${lender.slug}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return result;
}
