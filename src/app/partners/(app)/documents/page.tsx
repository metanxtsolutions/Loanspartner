import Link from "next/link";
import { requirePartner } from "@/server/dashboard/access";
import { listDocumentsForOwner } from "@/server/dashboard/documents";
import { PageHeader } from "@/components/dashboard/page-header";
import { FileUploader } from "@/components/dashboard/file-uploader";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusPill } from "@/components/dashboard/status-pill";
import { uploadPartnerDocumentAction } from "@/actions/partner/leads";
import { DOCUMENT_STATUS_META, DOCUMENT_TYPE_LABELS } from "@/lib/dashboard/statuses";
import { readableDate } from "@/lib/utils";

const PARTNER_KYC_DOCUMENT_TYPES = ["PAN", "AADHAAR", "PHOTO", "GST_CERTIFICATE", "BANK_STATEMENT", "BUSINESS_PROOF", "OTHER"];

export default async function PartnerDocumentsPage() {
  const user = await requirePartner();
  const documents = await listDocumentsForOwner(user.id);

  return (
    <>
      <PageHeader title="Your documents" subtitle="KYC documents you've uploaded for your partner profile." />

      <div className="border-line bg-cream mb-6 border p-6">
        <FileUploader action={uploadPartnerDocumentAction} documentTypes={PARTNER_KYC_DOCUMENT_TYPES} />
      </div>

      {documents.length === 0 ? (
        <EmptyState title="No documents yet" body="Upload your PAN, GST certificate and other KYC documents above." />
      ) : (
        <ul className="flex flex-col gap-2">
          {documents.map((doc) => {
            const meta = DOCUMENT_STATUS_META[doc.status];
            return (
              <li key={doc.id} className="border-line flex items-center justify-between gap-3 border px-4 py-3 text-sm">
                <div>
                  <Link href={`/api/documents/${doc.id}`} className="text-ink-900 hover:text-brass-600 font-semibold underline underline-offset-2">
                    {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
                  </Link>
                  <p className="text-mute-2 mt-0.5 text-xs">
                    {doc.fileName} · {readableDate(doc.uploadedAt)}
                  </p>
                </div>
                <StatusPill label={meta.label} tone={meta.tone} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
