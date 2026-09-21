import type { Metadata } from "next";
import type { ApplicationStatus } from "@prisma/client";
import { requireAdmin } from "@/server/dashboard/access";
import { listApplicationsForAdmin } from "@/server/dashboard/applications";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { APPLICATION_STATUS_META } from "@/lib/dashboard/statuses";
import { productOption } from "@/data/lite";
import { formatINR, readableDate, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Applications", robots: { index: false, follow: false } };

type AppRow = Awaited<ReturnType<typeof listApplicationsForAdmin>>[number];

const STATUS_ORDER = Object.keys(APPLICATION_STATUS_META) as ApplicationStatus[];

export default async function ConsoleApplicationsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin("applications.manage");
  const params = await searchParams;
  const status = STATUS_ORDER.includes(params.status as ApplicationStatus) ? (params.status as ApplicationStatus) : undefined;
  const search = params.q?.trim() || undefined;

  const applications = await listApplicationsForAdmin({ status, search });

  const columns: Column<AppRow>[] = [
    { key: "code", header: "Code", render: (a) => a.code },
    { key: "customer", header: "Customer", render: (a) => a.customer.name },
    { key: "product", header: "Product", render: (a) => productOption(a.productSlug)?.name ?? a.productSlug },
    { key: "amount", header: "Requested", render: (a) => `₹${formatINR(a.requestedAmount)}` },
    { key: "partner", header: "Partner", render: (a) => a.partner?.name ?? "Direct" },
    {
      key: "status",
      header: "Status",
      render: (a) => {
        const meta = APPLICATION_STATUS_META[a.status];
        return <StatusPill label={meta.label} tone={meta.tone} />;
      },
    },
    { key: "updated", header: "Updated", render: (a) => readableDate(a.updatedAt) },
  ];

  const hrefFor = (s?: string) => {
    const p = new URLSearchParams();
    if (s) p.set("status", s);
    if (search) p.set("q", search);
    const qs = p.toString();
    return qs ? `/console/applications?${qs}` : "/console/applications";
  };

  return (
    <div>
      <PageHeader title="Applications" subtitle="The full loan application pipeline across every product." />

      <div className="mb-4 flex flex-col gap-3">
        <nav className="flex flex-wrap gap-2" aria-label="Filter by status">
          <a href={hrefFor()} className={cn("border-line px-3 py-1.5 text-xs font-semibold", !status ? "bg-ink-900 border-ink-900 text-white" : "hover:bg-cream border")}>
            All
          </a>
          {STATUS_ORDER.map((s) => (
            <a
              key={s}
              href={hrefFor(s)}
              className={cn("border-line px-3 py-1.5 text-xs font-semibold", status === s ? "bg-ink-900 border-ink-900 text-white" : "hover:bg-cream border")}
            >
              {APPLICATION_STATUS_META[s].label}
            </a>
          ))}
        </nav>
        <form method="get" className="flex gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <input type="search" name="q" defaultValue={search} placeholder="Search code, customer name or email" className="field h-10 w-72 py-1.5 text-sm" />
          <button type="submit" className="bg-ink-900 hover:bg-ink-800 h-10 px-4 text-sm font-semibold text-white transition">
            Search
          </button>
        </form>
      </div>

      <DataTable
        columns={columns}
        rows={applications}
        rowHref={(a) => `/console/applications/${a.id}`}
        emptyTitle="No applications found"
        emptyBody="Try a different status filter or search term."
      />
    </div>
  );
}
