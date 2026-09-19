import type { Document } from "@prisma/client";
import { requireCustomer } from "@/server/dashboard/access";
import { listDocumentsForOwner } from "@/server/dashboard/documents";
import { uploadDocumentAction } from "@/actions/customer/applications";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { FileUploader } from "@/components/dashboard/file-uploader";
import { DOCUMENT_STATUS_META, DOCUMENT_TYPE_LABELS } from "@/lib/dashboard/statuses";
import { readableDate } from "@/lib/utils";

export default async function DocumentsPage() {
  const actor = await requireCustomer();
  const documents = await listDocumentsForOwner(actor.id);

  const columns: Column<Document>[] = [
    {
      key: "name",
      header: "Document",
      // Never render doc.fileUrl directly: /api/documents/[id] re-checks ownership on every request.
      render: (d) => (
        <a href={`/api/documents/${d.id}`} className="text-ink-950 hover:text-brass-600 font-semibold underline decoration-transparent underline-offset-2 hover:decoration-current">
          {DOCUMENT_TYPE_LABELS[d.type] ?? d.type}
        </a>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (d) => {
        const meta = DOCUMENT_STATUS_META[d.status];
        return <StatusPill label={meta.label} tone={meta.tone} />;
      },
    },
    { key: "uploaded", header: "Uploaded", render: (d) => readableDate(d.uploadedAt) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Documents" subtitle="Everything you've uploaded across all your applications." />
      <FileUploader action={uploadDocumentAction} />
      <DataTable columns={columns} rows={documents} emptyTitle="No documents yet" emptyBody="Upload a document above to get started." />
    </div>
  );
}
