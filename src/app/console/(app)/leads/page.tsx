import type { Metadata } from "next";
import type { WebsiteLeadKind, WebsiteLeadStatus } from "@prisma/client";
import { requireAdmin } from "@/server/dashboard/access";
import { listWebsiteLeads } from "@/server/dashboard/leads";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Pagination, paginate } from "@/components/dashboard/pagination";
import { WEBSITE_LEAD_KIND_META, WEBSITE_LEAD_STATUS_META } from "@/lib/dashboard/statuses";
import { productOption } from "@/data/lite";
import { cn, formatINR, readableDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Website leads", robots: { index: false, follow: false } };

type LeadRow = Awaited<ReturnType<typeof listWebsiteLeads>>[number];

const KINDS = Object.keys(WEBSITE_LEAD_KIND_META) as WebsiteLeadKind[];
const STATUSES = Object.keys(WEBSITE_LEAD_STATUS_META) as WebsiteLeadStatus[];

function whatFor(lead: LeadRow) {
  const d = lead.data as Record<string, unknown>;
  if (lead.kind === "CONTACT") return typeof d.subject === "string" ? `Subject: ${d.subject}` : "Message";
  if (lead.kind === "PARTNER_INTEREST") return typeof d.profession === "string" ? d.profession : "Partner enquiry";
  const product = lead.productSlug ? (productOption(lead.productSlug)?.name ?? lead.productSlug) : null;
  const amount = lead.amount ? `₹${formatINR(lead.amount)}` : null;
  return [product, amount].filter(Boolean).join(" · ") || "-";
}

export default async function ConsoleLeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin("leads.manage");
  const params = await searchParams;
  const kind = KINDS.includes(params.kind as WebsiteLeadKind) ? (params.kind as WebsiteLeadKind) : undefined;
  const status = STATUSES.includes(params.status as WebsiteLeadStatus) ? (params.status as WebsiteLeadStatus) : undefined;
  const search = params.q?.trim() || undefined;
  const page = Number(params.page) || 1;

  const leads = await listWebsiteLeads({ kind, status, search });
  const { rows, page: safePage, totalPages, total } = paginate(leads, page);

  const columns: Column<LeadRow>[] = [
    { key: "name", header: "Name", render: (l) => l.name ?? "(no name)" },
    {
      key: "kind",
      header: "Type",
      render: (l) => {
        const meta = WEBSITE_LEAD_KIND_META[l.kind];
        return <StatusPill label={meta.label} tone={meta.tone} />;
      },
    },
    { key: "phone", header: "Phone", render: (l) => l.phone ?? "-" },
    { key: "email", header: "Email", render: (l) => l.email ?? "-", className: "max-w-[220px] truncate" },
    { key: "what", header: "Enquiry", render: whatFor },
    { key: "city", header: "City", render: (l) => l.city ?? "-" },
    { key: "source", header: "Source", render: (l) => <span className="text-mute text-xs">{l.source ?? "-"}</span> },
    {
      key: "status",
      header: "Status",
      render: (l) => {
        const meta = WEBSITE_LEAD_STATUS_META[l.status];
        return <StatusPill label={meta.label} tone={meta.tone} />;
      },
    },
    { key: "received", header: "Received", render: (l) => readableDate(l.createdAt) },
  ];

  const hrefFor = (next: { kind?: string; status?: string }) => {
    const p = new URLSearchParams();
    const k = "kind" in next ? next.kind : kind;
    const s = "status" in next ? next.status : status;
    if (k) p.set("kind", k);
    if (s) p.set("status", s);
    if (search) p.set("q", search);
    const qs = p.toString();
    return qs ? `/console/leads?${qs}` : "/console/leads";
  };
  const chip = (active: boolean) => cn("border-line px-3 py-1.5 text-xs font-semibold", active ? "bg-ink-900 border-ink-900 text-white" : "hover:bg-cream border");

  return (
    <div>
      <PageHeader title="Website leads" subtitle={`Everyone who has filled a form on the public site. ${total} ${total === 1 ? "lead" : "leads"} match.`} />

      <div className="mb-4 flex flex-col gap-3">
        <nav className="flex flex-wrap gap-2" aria-label="Filter by type">
          <a href={hrefFor({ kind: undefined })} className={chip(!kind)}>
            All types
          </a>
          {KINDS.map((k) => (
            <a key={k} href={hrefFor({ kind: k })} className={chip(kind === k)}>
              {WEBSITE_LEAD_KIND_META[k].label}
            </a>
          ))}
        </nav>
        <nav className="flex flex-wrap gap-2" aria-label="Filter by status">
          <a href={hrefFor({ status: undefined })} className={chip(!status)}>
            Any status
          </a>
          {STATUSES.map((s) => (
            <a key={s} href={hrefFor({ status: s })} className={chip(status === s)}>
              {WEBSITE_LEAD_STATUS_META[s].label}
            </a>
          ))}
        </nav>
        <form method="get" className="flex gap-2">
          {kind ? <input type="hidden" name="kind" value={kind} /> : null}
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <input type="search" name="q" defaultValue={search} placeholder="Search name, phone, email or city" className="field h-10 w-72 py-1.5 text-sm" />
          <button type="submit" className="bg-ink-900 hover:bg-ink-800 h-10 px-4 text-sm font-semibold text-white transition">
            Search
          </button>
        </form>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        rowHref={(l) => `/console/leads/${l.id}`}
        emptyTitle="No leads yet"
        emptyBody="Every enquiry, partner application, callback and contact message from the public site will show up here as it arrives."
      />
      <Pagination page={safePage} totalPages={totalPages} basePath="/console/leads" searchParams={{ kind, status, q: search }} />
    </div>
  );
}
