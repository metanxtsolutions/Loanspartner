import type { Metadata } from "next";
import { prisma } from "@/server/outreach/db";

export const metadata: Metadata = { title: "Analytics", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function pct(n: number, d: number) {
  if (d === 0) return "0%";
  return `${((n / d) * 100).toFixed(1)}%`;
}

export default async function AnalyticsPage() {
  const [sent, delivered, opened, bounced, failed, inboundReplies, positiveReplies, lenderStatusCounts, byType] =
    await Promise.all([
      prisma.outreachMessage.count({
        where: { direction: "OUTBOUND", status: { in: ["SENT", "DELIVERED", "OPENED", "BOUNCED"] } },
      }),
      prisma.outreachMessage.count({ where: { direction: "OUTBOUND", status: { in: ["DELIVERED", "OPENED"] } } }),
      prisma.outreachMessage.count({ where: { direction: "OUTBOUND", status: "OPENED" } }),
      prisma.outreachMessage.count({ where: { direction: "OUTBOUND", status: "BOUNCED" } }),
      prisma.outreachMessage.count({ where: { direction: "OUTBOUND", status: "FAILED" } }),
      prisma.outreachMessage.count({ where: { direction: "INBOUND" } }),
      prisma.outreachMessage.count({
        where: { direction: "INBOUND", replyClassification: { in: ["INTERESTED", "REQUEST_CALL"] } },
      }),
      prisma.lender.groupBy({ by: ["status"], _count: true }),
      prisma.lender.groupBy({ by: ["type"], _count: true }),
    ]);

  const lendersContacted = await prisma.lender.count({
    where: { status: { notIn: ["NEW", "CONTACT_NEEDED", "READY"] } },
  });
  const meetings =
    (lenderStatusCounts.find((s) => s.status === "CALL_SCHEDULED")?._count ?? 0) +
    (lenderStatusCounts.find((s) => s.status === "ONBOARDING")?._count ?? 0);
  const partnerships = lenderStatusCounts.find((s) => s.status === "PARTNERSHIP_LIVE")?._count ?? 0;

  const repliedLenderIds = await prisma.outreachMessage.findMany({
    where: { direction: "INBOUND" },
    select: { lenderId: true },
    distinct: ["lenderId"],
  });

  const typeReplyRates = await Promise.all(
    byType.map(async (t) => {
      const lendersOfType = await prisma.lender.findMany({ where: { type: t.type }, select: { id: true } });
      const ids = new Set(lendersOfType.map((l) => l.id));
      const contactedOfType = await prisma.lender.count({
        where: { type: t.type, status: { notIn: ["NEW", "CONTACT_NEEDED", "READY"] } },
      });
      const repliedOfType = repliedLenderIds.filter((r) => ids.has(r.lenderId)).length;
      return { type: t.type, total: t._count, contacted: contactedOfType, replied: repliedOfType };
    }),
  );

  const tiles = [
    { label: "Emails sent", value: sent },
    { label: "Delivered", value: delivered, sub: pct(delivered, sent) },
    { label: "Opened", value: opened, sub: pct(opened, delivered) },
    { label: "Bounced", value: bounced, sub: pct(bounced, sent) },
    { label: "Failed to send", value: failed },
    { label: "Replies received", value: inboundReplies, sub: pct(inboundReplies, sent) },
    { label: "Positive replies", value: positiveReplies, sub: pct(positiveReplies, inboundReplies) },
    { label: "Lenders contacted", value: lendersContacted },
    { label: "Calls / meetings", value: meetings },
    { label: "Partnerships live", value: partnerships, sub: pct(partnerships, lendersContacted) },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-ink-950 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">Analytics</h1>
        <p className="text-mute mt-1 text-sm">Counted from actual send and reply events, not estimates.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((t) => (
          <div key={t.label} className="border-line bg-cream border p-4">
            <p className="text-mute-2 text-xs tracking-wide uppercase">{t.label}</p>
            <p className="text-ink-950 mt-1 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
              {t.value}
            </p>
            {t.sub ? <p className="text-mute mt-0.5 text-xs">{t.sub} of prior stage</p> : null}
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-ink-900 text-sm font-semibold">Reply rate by lender type</h2>
        <div className="border-line bg-cream mt-3 overflow-x-auto border">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="border-line bg-ink-50 text-mute-2 border-b text-xs tracking-wide uppercase">
              <tr>
                <th className="px-4 py-2 font-medium">Lender type</th>
                <th className="px-4 py-2 font-medium">Lenders</th>
                <th className="px-4 py-2 font-medium">Contacted</th>
                <th className="px-4 py-2 font-medium">Replied</th>
                <th className="px-4 py-2 font-medium">Reply rate</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {typeReplyRates.map((r) => (
                <tr key={r.type}>
                  <td className="text-ink-900 px-4 py-2">{r.type}</td>
                  <td className="text-mute px-4 py-2">{r.total}</td>
                  <td className="text-mute px-4 py-2">{r.contacted}</td>
                  <td className="text-mute px-4 py-2">{r.replied}</td>
                  <td className="text-mute px-4 py-2">{pct(r.replied, r.contacted)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
