import type { Metadata } from "next";
import { requireAdmin } from "@/server/dashboard/access";
import { listPayoutsForAdmin, listCommissionsForAdmin } from "@/server/dashboard/commissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Banner } from "@/components/dashboard/banner";
import { PayoutCreateForm, type PayoutEligiblePartner } from "@/components/console/payout-create-form";
import { PayoutMarkPaidForm } from "@/components/console/payout-mark-paid-form";
import { PAYOUT_STATUS_META } from "@/lib/dashboard/statuses";
import { formatINR, readableDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Payouts", robots: { index: false, follow: false } };

type PayoutRow = Awaited<ReturnType<typeof listPayoutsForAdmin>>[number];

export default async function ConsolePayoutsPage() {
  await requireAdmin("payouts.manage");
  const [payouts, entries] = await Promise.all([listPayoutsForAdmin(), listCommissionsForAdmin()]);

  const eligible = entries.filter((e) => e.status === "ACCRUED" || e.status === "APPROVED");
  const byPartner = new Map<string, PayoutEligiblePartner>();
  for (const e of eligible) {
    const partner = byPartner.get(e.partnerId) ?? { id: e.partnerId, name: e.partner.name, entries: [] };
    partner.entries.push({ id: e.id, amount: e.amount, applicationCode: e.application.code });
    byPartner.set(e.partnerId, partner);
  }
  const eligiblePartners = [...byPartner.values()];

  const columns: Column<PayoutRow>[] = [
    { key: "partner", header: "Partner", render: (p) => p.partner.name },
    { key: "period", header: "Period", render: (p) => p.periodLabel },
    { key: "entries", header: "Entries", render: (p) => p.entries.length },
    { key: "amount", header: "Amount", render: (p) => `₹${formatINR(p.totalAmount)}` },
    {
      key: "status",
      header: "Status",
      render: (p) => {
        const meta = PAYOUT_STATUS_META[p.status];
        return <StatusPill label={meta.label} tone={meta.tone} />;
      },
    },
    { key: "reference", header: "Reference", render: (p) => p.reference || "-" },
    { key: "created", header: "Created", render: (p) => readableDate(p.createdAt) },
    { key: "actions", header: "", className: "text-right", render: (p) => (p.status === "PENDING" || p.status === "PROCESSING" ? <PayoutMarkPaidForm payoutId={p.id} /> : null) },
  ];

  return (
    <div>
      <PageHeader title="Payouts" subtitle="Batch approved commission entries into a payout, then record when it's actually been paid." />

      <Banner
        tone="info"
        title="This is a record-keeping tool, not a payment rail"
        body="LoansPartner does not move money on your behalf. Creating a payout groups commission entries for your own reference; marking one paid only logs that you already transferred the funds via your own banking."
      />

      <section className="mb-8">
        <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Create a payout</h2>
        <PayoutCreateForm partners={eligiblePartners} />
      </section>

      <section>
        <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">All payouts</h2>
        <DataTable columns={columns} rows={payouts} emptyTitle="No payouts yet" />
      </section>
    </div>
  );
}
