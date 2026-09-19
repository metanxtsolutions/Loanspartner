import type { Metadata } from "next";
import { requireAdmin } from "@/server/dashboard/access";
import { funnelByStatus, conversionByProduct, partnerLeaderboard, commissionPayableSummary } from "@/server/dashboard/reports";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { FunnelChart } from "@/components/console/funnel-chart";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Reports", robots: { index: false, follow: false } };

type ConversionRow = Awaited<ReturnType<typeof conversionByProduct>>[number] & { id: string };
type LeaderboardRow = Awaited<ReturnType<typeof partnerLeaderboard>>[number];

export default async function ConsoleReportsPage() {
  await requireAdmin("reports.view");
  const [funnel, conversion, leaderboard, payable] = await Promise.all([
    funnelByStatus(),
    conversionByProduct(),
    partnerLeaderboard(10),
    commissionPayableSummary(),
  ]);

  const conversionRows: ConversionRow[] = conversion.map((c) => ({ ...c, id: c.slug }));

  const conversionColumns: Column<ConversionRow>[] = [
    { key: "name", header: "Product", render: (r) => r.name },
    { key: "total", header: "Applications", render: (r) => r.total },
    { key: "disbursed", header: "Disbursed", render: (r) => r.disbursed },
    { key: "rate", header: "Conversion", render: (r) => `${r.rate}%` },
  ];

  const leaderboardColumns: Column<LeaderboardRow>[] = [
    { key: "name", header: "Partner", render: (r) => r.name },
    { key: "leads", header: "Total leads", render: (r) => r.totalLeads },
    { key: "disbursed", header: "Disbursed", render: (r) => r.disbursedCount },
    { key: "volume", header: "Disbursed volume", render: (r) => `₹${formatINR(r.disbursedVolume, { compact: true })}` },
  ];

  return (
    <div>
      <PageHeader title="Reports" subtitle="Pipeline funnel, product conversion, partner performance and commission payables." />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Accrued, unapproved" value={`₹${formatINR(payable.accrued.amount, { compact: true })}`} hint={`${payable.accrued.count} entries`} tone="brass" />
        <StatCard label="Approved, awaiting payout" value={`₹${formatINR(payable.approved.amount, { compact: true })}`} hint={`${payable.approved.count} entries`} />
        <StatCard label="Paid out" value={`₹${formatINR(payable.paid.amount, { compact: true })}`} hint={`${payable.paid.count} entries`} tone="verdant" />
      </div>

      <section className="mb-8">
        <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Application funnel</h2>
        <div className="border-line border p-5">
          <FunnelChart counts={funnel} />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Conversion by product</h2>
          <DataTable columns={conversionColumns} rows={conversionRows} emptyTitle="No applications yet" />
        </section>

        <section>
          <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Partner leaderboard</h2>
          <DataTable columns={leaderboardColumns} rows={leaderboard} emptyTitle="No partner activity yet" />
        </section>
      </div>
    </div>
  );
}
