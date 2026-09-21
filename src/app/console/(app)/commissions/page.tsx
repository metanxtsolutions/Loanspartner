import type { Metadata } from "next";
import { requireAdmin } from "@/server/dashboard/access";
import { listCommissionsForAdmin } from "@/server/dashboard/commissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { CommissionStatusForm } from "@/components/console/commission-status-form";
import { COMMISSION_STATUS_META } from "@/lib/dashboard/statuses";
import { productOption } from "@/data/lite";
import { formatINR, readableDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Commissions", robots: { index: false, follow: false } };

type EntryRow = Awaited<ReturnType<typeof listCommissionsForAdmin>>[number];

export default async function ConsoleCommissionsPage() {
  await requireAdmin("commissions.manage");
  const entries = await listCommissionsForAdmin();

  const columns: Column<EntryRow>[] = [
    { key: "application", header: "Application", render: (e) => e.application.code },
    { key: "product", header: "Product", render: (e) => productOption(e.application.productSlug)?.name ?? e.application.productSlug },
    { key: "partner", header: "Partner", render: (e) => e.partner.name },
    { key: "base", header: "Base amount", render: (e) => `₹${formatINR(e.baseAmount)}` },
    { key: "rate", header: "Rate", render: (e) => `${e.rate}%` },
    { key: "amount", header: "Commission", render: (e) => `₹${formatINR(e.amount)}` },
    {
      key: "status",
      header: "Status",
      render: (e) => {
        const meta = COMMISSION_STATUS_META[e.status];
        return <StatusPill label={meta.label} tone={meta.tone} />;
      },
    },
    { key: "created", header: "Accrued", render: (e) => readableDate(e.createdAt) },
    { key: "actions", header: "", className: "text-right", render: (e) => <CommissionStatusForm id={e.id} status={e.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Commissions" subtitle="Approve, dispute or void partner commission entries before they're batched into a payout." />
      <DataTable columns={columns} rows={entries} emptyTitle="No commission entries yet" />
    </div>
  );
}
