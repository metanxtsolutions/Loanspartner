import type { Metadata } from "next";
import { requireAdmin } from "@/server/dashboard/access";
import { prisma } from "@/server/db";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { Pagination, paginate } from "@/components/dashboard/pagination";
import { readableDate, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Activity log", robots: { index: false, follow: false } };

const ENTITY_TYPES = ["User", "PartnerProfile", "LoanApplication", "Document", "CommissionEntry", "LenderOpsSetting"];

export default async function ConsoleActivityLogPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin("activity_log.view");
  const params = await searchParams;
  const entityType = params.entity && ENTITY_TYPES.includes(params.entity) ? params.entity : undefined;
  const page = Number(params.page) || 1;

  const logs = await prisma.auditLog.findMany({
    where: { entityType },
    orderBy: { createdAt: "desc" },
    include: { actor: { select: { name: true, email: true } } },
    take: 500,
  });

  const { rows, totalPages } = paginate(logs, page, 25);

  const columns: Column<(typeof rows)[number]>[] = [
    { key: "createdAt", header: "When", render: (l) => readableDate(l.createdAt) },
    { key: "actor", header: "Actor", render: (l) => l.actor?.name ?? "System" },
    { key: "action", header: "Action", render: (l) => l.action },
    { key: "entity", header: "Entity", render: (l) => (l.entityType ? `${l.entityType}${l.entityId ? ` (${l.entityId})` : ""}` : "-") },
    {
      key: "meta",
      header: "Details",
      render: (l) =>
        l.meta ? (
          <details>
            <summary className="text-mute hover:text-ink-900 cursor-pointer text-xs">View</summary>
            <pre className="text-mute-2 mt-1 max-w-xs overflow-x-auto text-[11px]">{JSON.stringify(l.meta, null, 2)}</pre>
          </details>
        ) : (
          "-"
        ),
    },
  ];

  const hrefFor = (e?: string) => {
    const p = new URLSearchParams();
    if (e) p.set("entity", e);
    const qs = p.toString();
    return qs ? `/console/activity-log?${qs}` : "/console/activity-log";
  };

  return (
    <div>
      <PageHeader title="Activity log" subtitle="Every admin action across the platform, newest first." />

      <nav className="mb-4 flex flex-wrap gap-2" aria-label="Filter by entity type">
        <a href={hrefFor()} className={cn("border-line px-3 py-1.5 text-xs font-semibold", !entityType ? "bg-ink-900 border-ink-900 text-white" : "hover:bg-cream border")}>
          All
        </a>
        {ENTITY_TYPES.map((e) => (
          <a key={e} href={hrefFor(e)} className={cn("border-line px-3 py-1.5 text-xs font-semibold", entityType === e ? "bg-ink-900 border-ink-900 text-white" : "hover:bg-cream border")}>
            {e}
          </a>
        ))}
      </nav>

      <DataTable columns={columns} rows={rows} emptyTitle="No activity recorded yet" />
      <Pagination page={page} totalPages={totalPages} basePath="/console/activity-log" searchParams={{ entity: entityType }} />
    </div>
  );
}
