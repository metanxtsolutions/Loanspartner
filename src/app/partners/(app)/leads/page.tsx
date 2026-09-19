import { requirePartner } from "@/server/dashboard/access";
import { listApplicationsForPartner } from "@/server/dashboard/applications";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { ButtonLink } from "@/components/shared/button";
import { formatINR, readableDate } from "@/lib/utils";
import { APPLICATION_STATUS_META } from "@/lib/dashboard/statuses";
import { productOption } from "@/data/lite";

type Row = Awaited<ReturnType<typeof listApplicationsForPartner>>[number];

export default async function PartnerLeadsPage() {
  const user = await requirePartner();
  const applications = await listApplicationsForPartner(user.id);

  const columns: Column<Row>[] = [
    { key: "customer", header: "Customer", render: (r) => r.customer.name },
    { key: "product", header: "Product", render: (r) => productOption(r.productSlug)?.shortName ?? r.productSlug },
    { key: "amount", header: "Amount", render: (r) => `₹${formatINR(r.requestedAmount)}` },
    { key: "city", header: "City", render: (r) => r.city },
    {
      key: "status",
      header: "Status",
      render: (r) => {
        const meta = APPLICATION_STATUS_META[r.status];
        return <StatusPill label={meta.label} tone={meta.tone} />;
      },
    },
    { key: "submitted", header: "Submitted", render: (r) => (r.submittedAt ? readableDate(r.submittedAt) : "-") },
  ];

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle="Every application you've sourced."
        action={
          <ButtonLink href="/partners/leads/new" size="sm">
            Submit a lead
          </ButtonLink>
        }
      />
      <DataTable
        columns={columns}
        rows={applications}
        emptyTitle="No leads yet"
        emptyBody="Submit your first customer lead to start tracking it here."
        rowHref={(r) => `/partners/leads/${r.id}`}
      />
    </>
  );
}
