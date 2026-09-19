import type { Metadata } from "next";
import { requireAdmin } from "@/server/dashboard/access";
import { listLendersWithOpsStatus } from "@/server/dashboard/lenders";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { LenderToggleForm } from "@/components/console/lender-toggle-form";

export const metadata: Metadata = { title: "Lenders", robots: { index: false, follow: false } };

type LenderRow = Awaited<ReturnType<typeof listLendersWithOpsStatus>>[number] & { id: string };

export default async function ConsoleLendersPage() {
  await requireAdmin("lenders.manage");
  const lenders = (await listLendersWithOpsStatus()).map((l) => ({ ...l, id: l.slug }));

  const columns: Column<LenderRow>[] = [
    { key: "name", header: "Lender", render: (l) => l.name },
    { key: "type", header: "Type", render: (l) => l.type },
    { key: "products", header: "Products", render: (l) => l.products.length },
    {
      key: "status",
      header: "Status",
      render: (l) => <StatusPill label={l.isAcceptingApplications ? "Accepting" : "Paused"} tone={l.isAcceptingApplications ? "success" : "warning"} />,
    },
    { key: "note", header: "Internal note", render: (l) => l.internalNote || "-" },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (l) => <LenderToggleForm lenderSlug={l.slug} isAcceptingApplications={l.isAcceptingApplications} internalNote={l.internalNote} />,
    },
  ];

  return (
    <div>
      <PageHeader title="Lenders" subtitle="Pause a lender when it stops accepting new applications, without touching the public catalog." />
      <DataTable columns={columns} rows={lenders} emptyTitle="No lenders configured" />
    </div>
  );
}
