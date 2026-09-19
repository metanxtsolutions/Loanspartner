import { notFound } from "next/navigation";
import { AccessDeniedError, requireCustomer } from "@/server/dashboard/access";
import { getApplicationForActor } from "@/server/dashboard/applications";
import { uploadDocumentAction } from "@/actions/customer/applications";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Timeline, type TimelineEntry } from "@/components/dashboard/timeline";
import { FileUploader } from "@/components/dashboard/file-uploader";
import { EmptyState } from "@/components/dashboard/empty-state";
import { APPLICATION_STATUS_META, DOCUMENT_STATUS_META, DOCUMENT_TYPE_LABELS } from "@/lib/dashboard/statuses";
import { formatINR, readableDate } from "@/lib/utils";

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireCustomer();
  const { id } = await params;

  let app: Awaited<ReturnType<typeof getApplicationForActor>>;
  try {
    app = await getApplicationForActor(id, actor);
  } catch (error) {
    if (error instanceof AccessDeniedError) notFound();
    throw error;
  }
  if (!app) notFound();

  const meta = APPLICATION_STATUS_META[app.status];
  const timelineEntries: TimelineEntry[] = app.events.map((e) => ({
    id: e.id,
    label: APPLICATION_STATUS_META[e.toStatus].label,
    note: e.note,
    actorName: e.actor?.name ?? null,
    createdAt: e.createdAt,
  }));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`${app.product?.name ?? app.productSlug} enquiry`}
        subtitle={`${app.code} · ${app.submittedAt ? `Submitted ${readableDate(app.submittedAt)}` : "Not yet submitted"}`}
        action={<StatusPill label={meta.label} tone={meta.tone} />}
      />

      {meta.customerHint ? <p className="border-ink-300 bg-cream text-ink-800 border-l-4 px-4 py-3 text-sm">{meta.customerHint}</p> : null}

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="text-ink-950 mb-3 text-base font-bold">Application details</h2>
            <dl className="border-line bg-line grid grid-cols-2 gap-px border">
              <div className="bg-cream p-4">
                <dt className="text-mute text-xs font-semibold uppercase">Amount requested</dt>
                <dd className="text-ink-900 mt-1 text-sm font-semibold">{formatINR(app.requestedAmount)}</dd>
              </div>
              <div className="bg-cream p-4">
                <dt className="text-mute text-xs font-semibold uppercase">City</dt>
                <dd className="text-ink-900 mt-1 text-sm font-semibold">{app.city}</dd>
              </div>
              {app.sanctionedAmount ? (
                <div className="bg-cream p-4">
                  <dt className="text-mute text-xs font-semibold uppercase">Sanctioned amount</dt>
                  <dd className="text-ink-900 mt-1 text-sm font-semibold">{formatINR(app.sanctionedAmount)}</dd>
                </div>
              ) : null}
              {app.employmentType ? (
                <div className="bg-cream p-4">
                  <dt className="text-mute text-xs font-semibold uppercase">Employment type</dt>
                  <dd className="text-ink-900 mt-1 text-sm font-semibold">{app.employmentType}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section>
            <h2 className="text-ink-950 mb-3 text-base font-bold">Status history</h2>
            <Timeline entries={timelineEntries} />
          </section>

          {app.notes.length > 0 ? (
            <section>
              <h2 className="text-ink-950 mb-3 text-base font-bold">Notes</h2>
              <ul className="flex flex-col gap-3">
                {app.notes.map((n) => (
                  <li key={n.id} className="border-line bg-cream border p-4">
                    <p className="text-ink-900 text-sm">{n.body}</p>
                    <p className="text-mute-2 mt-1 text-xs">
                      {n.author.name} &middot; {readableDate(n.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-ink-950 text-base font-bold">Documents</h2>
          {app.documents.length === 0 ? (
            <EmptyState title="No documents yet" body="Upload the documents our desk requests below." />
          ) : (
            <ul className="flex flex-col gap-2">
              {app.documents.map((d) => {
                const dMeta = DOCUMENT_STATUS_META[d.status];
                return (
                  <li key={d.id}>
                    {/* Never render doc.fileUrl directly: this gated route re-checks ownership on every request. */}
                    <a
                      href={`/api/documents/${d.id}`}
                      className="border-line hover:bg-cream flex items-center justify-between gap-3 border p-3 text-sm transition"
                    >
                      <span className="text-ink-900 font-medium">{DOCUMENT_TYPE_LABELS[d.type] ?? d.type}</span>
                      <StatusPill label={dMeta.label} tone={dMeta.tone} />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          <FileUploader action={uploadDocumentAction} applicationId={app.id} />
        </div>
      </div>
    </div>
  );
}
