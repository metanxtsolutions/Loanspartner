import { notFound } from "next/navigation";
import Link from "next/link";
import { requirePartner, AccessDeniedError } from "@/server/dashboard/access";
import { getApplicationForActor } from "@/server/dashboard/applications";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Timeline, type TimelineEntry } from "@/components/dashboard/timeline";
import { FileUploader } from "@/components/dashboard/file-uploader";
import { LeadNoteForm } from "@/components/partner/lead-note-form";
import { uploadPartnerDocumentAction } from "@/actions/partner/leads";
import { formatINR, readableDate } from "@/lib/utils";
import { APPLICATION_STATUS_META, DOCUMENT_STATUS_META, DOCUMENT_TYPE_LABELS } from "@/lib/dashboard/statuses";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requirePartner();

  let application;
  try {
    application = await getApplicationForActor(id, user);
  } catch (error) {
    if (error instanceof AccessDeniedError) notFound();
    throw error;
  }
  if (!application) notFound();

  const meta = APPLICATION_STATUS_META[application.status];
  const timelineEntries: TimelineEntry[] = application.events.map((e) => ({
    id: e.id,
    label: APPLICATION_STATUS_META[e.toStatus].label,
    note: e.note,
    actorName: e.actor?.name ?? null,
    createdAt: e.createdAt,
  }));

  return (
    <>
      <PageHeader
        title={`${application.customer.name} · ${application.code}`}
        subtitle={application.product?.name ?? application.productSlug}
        action={<StatusPill label={meta.label} tone={meta.tone} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <section className="border-line bg-cream border p-5">
            <h2 className="text-ink-900 text-sm font-semibold">Application details</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-mute text-xs">Requested amount</dt>
                <dd className="text-ink-900 font-semibold">₹{formatINR(application.requestedAmount)}</dd>
              </div>
              <div>
                <dt className="text-mute text-xs">City</dt>
                <dd className="text-ink-900 font-semibold">{application.city}</dd>
              </div>
              <div>
                <dt className="text-mute text-xs">Submitted</dt>
                <dd className="text-ink-900 font-semibold">{application.submittedAt ? readableDate(application.submittedAt) : "-"}</dd>
              </div>
              {application.sanctionedAmount ? (
                <div>
                  <dt className="text-mute text-xs">Sanctioned amount</dt>
                  <dd className="text-ink-900 font-semibold">₹{formatINR(application.sanctionedAmount)}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="border-line bg-cream border p-5">
            <h2 className="text-ink-900 text-sm font-semibold">Customer contact</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-mute text-xs">Name</dt>
                <dd className="text-ink-900 font-semibold">{application.customer.name}</dd>
              </div>
              <div>
                <dt className="text-mute text-xs">Email</dt>
                <dd className="text-ink-900 font-semibold">{application.customer.email}</dd>
              </div>
              <div>
                <dt className="text-mute text-xs">Phone</dt>
                <dd className="text-ink-900 font-semibold">{application.customer.phone ?? "-"}</dd>
              </div>
            </dl>
          </section>

          <section className="border-line bg-cream border p-5">
            <h2 className="text-ink-900 text-sm font-semibold">Documents</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {application.documents.length === 0 ? (
                <li className="text-mute text-sm">No documents uploaded yet.</li>
              ) : (
                application.documents.map((doc) => {
                  const docMeta = DOCUMENT_STATUS_META[doc.status];
                  return (
                    <li key={doc.id} className="border-line flex items-center justify-between gap-3 border px-3 py-2 text-sm">
                      <Link href={`/api/documents/${doc.id}`} className="text-ink-900 hover:text-brass-600 font-medium underline underline-offset-2">
                        {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
                      </Link>
                      <StatusPill label={docMeta.label} tone={docMeta.tone} />
                    </li>
                  );
                })
              )}
            </ul>
            <div className="mt-4">
              <FileUploader action={uploadPartnerDocumentAction} applicationId={application.id} />
            </div>
          </section>

          <section className="border-line bg-cream border p-5">
            <h2 className="text-ink-900 text-sm font-semibold">Notes</h2>
            <ul className="mt-3 flex flex-col gap-3">
              {application.notes.length === 0 ? (
                <li className="text-mute text-sm">No notes yet.</li>
              ) : (
                application.notes.map((n) => (
                  <li key={n.id} className="border-line border-b pb-3 last:border-b-0">
                    <p className="text-ink-900 text-sm">{n.body}</p>
                    <p className="text-mute-2 mt-1 text-xs">
                      {n.author.name} · {readableDate(n.createdAt)}
                      {n.visibleToCustomer ? " · visible to customer" : ""}
                    </p>
                  </li>
                ))
              )}
            </ul>
            <div className="mt-4">
              <LeadNoteForm applicationId={application.id} />
            </div>
          </section>
        </div>

        <div className="border-line bg-cream border p-5">
          <h2 className="text-ink-900 text-sm font-semibold">Timeline</h2>
          <div className="mt-4">
            <Timeline entries={timelineEntries} />
          </div>
        </div>
      </div>
    </>
  );
}
