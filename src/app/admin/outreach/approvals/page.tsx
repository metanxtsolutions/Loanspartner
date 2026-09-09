import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/server/outreach/db";
import { MessageCard } from "@/components/outreach/message-card";

export const metadata: Metadata = { title: "Approvals", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const pending = await prisma.outreachMessage.findMany({
    where: { direction: "OUTBOUND", status: { in: ["DRAFT", "PENDING_APPROVAL"] } },
    include: { lender: true, contact: true },
    orderBy: { createdAt: "asc" },
  });

  const byKind = {
    PROPOSAL: pending.filter((m) => m.kind === "PROPOSAL"),
    FOLLOW_UP: pending.filter((m) => m.kind === "FOLLOW_UP"),
    REPLY: pending.filter((m) => m.kind === "REPLY"),
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-ink-950 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">Approval queue</h1>
        <p className="text-mute mt-1 text-sm">
          {pending.length} draft{pending.length === 1 ? "" : "s"} waiting for review. Nothing sends until you approve it
          here.
        </p>
      </div>

      {(["REPLY", "PROPOSAL", "FOLLOW_UP"] as const).map((kind) =>
        byKind[kind].length ? (
          <section key={kind} className="flex flex-col gap-3">
            <h2 className="text-ink-900 text-sm font-semibold">
              {kind === "PROPOSAL" ? "New proposals" : kind === "FOLLOW_UP" ? "Follow-ups" : "Replies"} (
              {byKind[kind].length})
            </h2>
            {byKind[kind].map((m) => (
              <div key={m.id} className="flex flex-col gap-2">
                <Link
                  href={`/admin/outreach/${m.lenderId}`}
                  className="text-ink-700 text-xs font-medium hover:underline"
                >
                  {m.lender.name} {m.contact ? `· ${m.contact.email}` : ""}
                </Link>
                <MessageCard
                  lenderName={m.lender.name}
                  message={{
                    id: m.id,
                    direction: m.direction,
                    kind: m.kind,
                    status: m.status,
                    subject: m.subject,
                    body: m.body,
                    createdAt: m.createdAt.toISOString(),
                    sentAt: m.sentAt?.toISOString() ?? null,
                    editedByHuman: m.editedByHuman,
                    aiModel: m.aiModel,
                    replyClassification: m.replyClassification,
                    classificationNote: m.classificationNote,
                    toEmail: m.toEmail,
                    bounceReason: m.bounceReason,
                    failedReason: m.failedReason,
                    skippedReason: m.skippedReason,
                  }}
                />
              </div>
            ))}
          </section>
        ) : null,
      )}

      {pending.length === 0 ? <p className="text-mute text-sm">Nothing waiting for review right now.</p> : null}
    </div>
  );
}
