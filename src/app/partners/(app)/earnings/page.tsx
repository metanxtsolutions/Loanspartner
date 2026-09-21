import { requirePartner } from "@/server/dashboard/access";
import { listCommissionsForPartner, listPayoutsForPartner } from "@/server/dashboard/commissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { ButtonLink } from "@/components/shared/button";
import { formatINR, readableDate } from "@/lib/utils";
import { COMMISSION_STATUS_META, PAYOUT_STATUS_META } from "@/lib/dashboard/statuses";

type CommissionRow = Awaited<ReturnType<typeof listCommissionsForPartner>>[number];
type PayoutRow = Awaited<ReturnType<typeof listPayoutsForPartner>>[number];

export default async function EarningsPage() {
  const user = await requirePartner();
  const [commissions, payouts] = await Promise.all([listCommissionsForPartner(user.id), listPayoutsForPartner(user.id)]);

  const commissionColumns: Column<CommissionRow>[] = [
    { key: "application", header: "Application", render: (r) => r.application.code },
    { key: "base", header: "Base amount", render: (r) => `₹${formatINR(r.baseAmount)}` },
    { key: "rate", header: "Rate", render: (r) => `${r.rate}%` },
    { key: "amount", header: "Commission", render: (r) => `₹${formatINR(r.amount)}` },
    {
      key: "status",
      header: "Status",
      render: (r) => {
        const m = COMMISSION_STATUS_META[r.status];
        return <StatusPill label={m.label} tone={m.tone} />;
      },
    },
    { key: "date", header: "Date", render: (r) => readableDate(r.createdAt) },
  ];

  const payoutColumns: Column<PayoutRow>[] = [
    { key: "period", header: "Period", render: (r) => r.periodLabel },
    { key: "amount", header: "Amount", render: (r) => `₹${formatINR(r.totalAmount)}` },
    {
      key: "status",
      header: "Status",
      render: (r) => {
        const m = PAYOUT_STATUS_META[r.status];
        return <StatusPill label={m.label} tone={m.tone} />;
      },
    },
    { key: "reference", header: "Reference", render: (r) => r.reference ?? "-" },
    { key: "date", header: "Processed", render: (r) => (r.processedAt ? readableDate(r.processedAt) : "-") },
  ];

  return (
    <>
      <PageHeader
        title="Earnings"
        subtitle="Commission accrued on your disbursed leads and your payout history."
        action={
          <ButtonLink href="/partners/earnings/export" size="sm" variant="secondary">
            Export CSV
          </ButtonLink>
        }
      />

      <div className="mb-8">
        <h2 className="text-ink-900 mb-3 text-sm font-semibold">Commissions</h2>
        <DataTable
          columns={commissionColumns}
          rows={commissions}
          emptyTitle="No commissions yet"
          emptyBody="Commission accrues automatically once a lead you sourced is disbursed."
        />
      </div>

      <div>
        <h2 className="text-ink-900 mb-3 text-sm font-semibold">Payouts</h2>
        <DataTable columns={payoutColumns} rows={payouts} emptyTitle="No payouts yet" />
      </div>
    </>
  );
}
