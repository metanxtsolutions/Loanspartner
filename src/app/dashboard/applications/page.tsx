import type { LoanApplication } from "@prisma/client";
import { requireCustomer } from "@/server/dashboard/access";
import { listApplicationsForCustomer } from "@/server/dashboard/applications";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { ButtonLink } from "@/components/shared/button";
import { APPLICATION_STATUS_META } from "@/lib/dashboard/statuses";
import { productOption } from "@/data/lite";
import { formatINR, readableDate } from "@/lib/utils";

export default async function ApplicationsPage() {
  const actor = await requireCustomer();
  const applications = await listApplicationsForCustomer(actor.id);

  const columns: Column<LoanApplication>[] = [
    { key: "code", header: "Application", render: (a) => a.code },
    { key: "product", header: "Product", render: (a) => productOption(a.productSlug)?.name ?? a.productSlug },
    { key: "amount", header: "Amount", render: (a) => formatINR(a.requestedAmount) },
    {
      key: "status",
      header: "Status",
      render: (a) => {
        const meta = APPLICATION_STATUS_META[a.status];
        return <StatusPill label={meta.label} tone={meta.tone} />;
      },
    },
    { key: "submitted", header: "Submitted", render: (a) => (a.submittedAt ? readableDate(a.submittedAt) : "Not submitted") },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My applications"
        subtitle="Every loan enquiry you've started with us."
        action={
          <ButtonLink href="/dashboard/applications/new" size="md">
            New loan enquiry
          </ButtonLink>
        }
      />
      <DataTable
        columns={columns}
        rows={applications}
        rowHref={(a) => `/dashboard/applications/${a.id}`}
        emptyTitle="No applications yet"
        emptyBody="Start a loan enquiry and our desk will take it from there."
      />
    </div>
  );
}
