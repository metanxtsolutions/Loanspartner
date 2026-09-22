import type { Metadata } from "next";
import type { ApplicationStatus } from "@prisma/client";
import { requireAdmin } from "@/server/dashboard/access";
import { listApplicationsForAdmin, type ApplicationSource } from "@/server/dashboard/applications";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { APPLICATION_STATUS_META } from "@/lib/dashboard/statuses";
import { productOption } from "@/data/lite";
import { formatINR, readableDate, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Applications", robots: { index: false, follow: false } };

type AppRow = Awaited<ReturnType<typeof listApplicationsForAdmin>>[number];

const STATUS_ORDER = Object.keys(APPLICATION_STATUS_META) as ApplicationStatus[];
const SOURCES: { value: ApplicationSource; label: string; subtitle: string }[] = [
  { value: "direct", label: "Direct", subtitle: "Applications customers made themselves, with no channel partner attached." },
  { value: "partner", label: "By partner", subtitle: "Applications submitted through a channel partner." },
];

export default async function ConsoleApplicationsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin("applications.manage");
  const params = await searchParams;
  const status = STATUS_ORDER.includes(params.status as ApplicationStatus) ? (params.status as ApplicationStatus) : undefined;
  const sourceMeta = SOURCES.find((s) => s.value === params.source);
  const source = sourceMeta?.value;
  const search = params.q?.trim() || undefined;

  const applications = await listApplicationsForAdmin({ status, source, search });

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

  const hrefFor = (next: { status?: string; source?: string }) => {
    const p = new URLSearchParams();
    const st = "status" in next ? next.status : status;
    const so = "source" in next ? next.source : source;
    if (so) p.set("source", so);
    if (st) p.set("status", st);
    if (search) p.set("q", search);
    const qs = p.toString();
    return qs ? `/console/applications?${qs}` : "/console/applications";
  };
  const chip = (active: boolean) => cn("border-line px-3 py-1.5 text-xs font-semibold", active ? "bg-ink-900 border-ink-900 text-white" : "hover:bg-cream border");

  return (
    <div>
      <PageHeader
        title={sourceMeta ? `Applications: ${sourceMeta.label.toLowerCase()}` : "Applications"}
        subtitle={sourceMeta?.subtitle ?? "The full loan application pipeline across every product."}
      />

      <div className="mb-4 flex flex-col gap-3">
        <nav className="flex flex-wrap gap-2" aria-label="Filter by source">
          <a href={hrefFor({ source: undefined })} className={chip(!source)}>
            All sources
          </a>
          {SOURCES.map((s) => (
            <a key={s.value} href={hrefFor({ source: s.value })} className={chip(source === s.value)}>
              {s.label}
            </a>
          ))}
        </nav>
        <nav className="flex flex-wrap gap-2" aria-label="Filter by status">
          <a href={hrefFor({ status: undefined })} className={chip(!status)}>
            All
          </a>
          {STATUS_ORDER.map((s) => (
            <a key={s} href={hrefFor({ status: s })} className={chip(status === s)}>
              {APPLICATION_STATUS_META[s].label}
            </a>
          ))}
        </nav>
        <form method="get" className="flex gap-2">
          {source ? <input type="hidden" name="source" value={source} /> : null}
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
        emptyBody="Try a different source or status filter, or another search term."
      />
    </div>
  );
}
