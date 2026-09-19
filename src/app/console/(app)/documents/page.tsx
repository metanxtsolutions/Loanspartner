import type { Metadata } from "next";
import Link from "next/link";
import type { DocumentStatus } from "@prisma/client";
import { requireAdmin } from "@/server/dashboard/access";
import { listDocumentsForAdmin } from "@/server/dashboard/documents";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { DocumentReviewForm } from "@/components/console/document-review-form";
import { DOCUMENT_STATUS_META, DOCUMENT_TYPE_LABELS } from "@/lib/dashboard/statuses";
import { readableDate, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Documents", robots: { index: false, follow: false } };

type DocRow = Awaited<ReturnType<typeof listDocumentsForAdmin>>[number];

const STATUSES = Object.keys(DOCUMENT_STATUS_META) as DocumentStatus[];

export default async function ConsoleDocumentsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin("documents.review");
  const params = await searchParams;
  const status = STATUSES.includes(params.status as DocumentStatus) ? (params.status as DocumentStatus) : "PENDING_REVIEW";

  const documents = await listDocumentsForAdmin(status);

  const columns: Column<DocRow>[] = [
    {
      key: "type",
      header: "Document",
      render: (d) => (
        <Link href={`/api/documents/${d.id}`} className="text-ink-950 hover:text-brass-600 font-semibold underline underline-offset-2">
          {DOCUMENT_TYPE_LABELS[d.type] ?? d.type}
        </Link>
      ),
    },
    { key: "owner", header: "Owner", render: (d) => `${d.owner.name} (${d.owner.role.toLowerCase()})` },
    { key: "application", header: "Application", render: (d) => d.application?.code ?? "-" },
    {
      key: "status",
      header: "Status",
      render: (d) => {
        const meta = DOCUMENT_STATUS_META[d.status];
        return <StatusPill label={meta.label} tone={meta.tone} />;
      },
    },
    { key: "uploaded", header: "Uploaded", render: (d) => readableDate(d.uploadedAt) },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (d) => (d.status === "PENDING_REVIEW" ? <DocumentReviewForm documentId={d.id} applicationId={d.applicationId} /> : null),
    },
  ];

  const hrefFor = (s: DocumentStatus) => `/console/documents?status=${s}`;

  return (
    <div>
      <PageHeader title="Documents" subtitle="Review uploaded KYC and income documents." />

      <nav className="mb-4 flex flex-wrap gap-2" aria-label="Filter by status">
        {STATUSES.map((s) => (
          <a key={s} href={hrefFor(s)} className={cn("border-line px-3 py-1.5 text-xs font-semibold", status === s ? "bg-ink-900 border-ink-900 text-white" : "hover:bg-cream border")}>
            {DOCUMENT_STATUS_META[s].label}
          </a>
        ))}
      </nav>

      <DataTable columns={columns} rows={documents} emptyTitle="No documents in this status" />
    </div>
  );
}
