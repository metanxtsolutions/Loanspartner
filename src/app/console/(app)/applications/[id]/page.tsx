import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/server/dashboard/access";
import { getApplicationForActor } from "@/server/dashboard/applications";
import { listLendersWithOpsStatus } from "@/server/dashboard/lenders";
import { adminRoleHasPermission } from "@/lib/dashboard/permissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Timeline, type TimelineEntry } from "@/components/dashboard/timeline";
import { ApplicationStatusForm } from "@/components/console/application-status-form";
import { ApplicationNoteForm } from "@/components/console/application-note-form";
import { DocumentReviewForm } from "@/components/console/document-review-form";
import { APPLICATION_STATUS_META, DOCUMENT_STATUS_META, DOCUMENT_TYPE_LABELS } from "@/lib/dashboard/statuses";
import { formatINR, readableDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Application detail", robots: { index: false, follow: false } };

export default async function ConsoleApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAdmin("applications.manage");
  const { id } = await params;

  const app = await getApplicationForActor(id, { id: actor.id, role: actor.role });
  if (!app) notFound();

  const canChangeStatus = adminRoleHasPermission(actor.adminRole, "applications.change_status");
  const canReviewDocuments = adminRoleHasPermission(actor.adminRole, "documents.review");

  const lenders = canChangeStatus ? await listLendersWithOpsStatus() : [];

  const timelineEntries: TimelineEntry[] = app.events.map((e) => ({
    id: e.id,
    label: APPLICATION_STATUS_META[e.toStatus].label,
    note: e.note,
    actorName: e.actor?.name ?? (e.actorRole ? e.actorRole.charAt(0) + e.actorRole.slice(1).toLowerCase() : null),
    createdAt: e.createdAt,
  }));

  const statusMeta = APPLICATION_STATUS_META[app.status];

  return (
    <div>
      <PageHeader
        title={app.code}
        subtitle={`${app.product?.name ?? app.productSlug} · Requested ₹${formatINR(app.requestedAmount)}`}
        action={<StatusPill label={statusMeta.label} tone={statusMeta.tone} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="border-line border p-5">
            <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Customer &amp; partner</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-mute text-xs font-semibold tracking-wide uppercase">Customer</p>
                <p className="text-ink-950 mt-1 text-sm font-semibold">{app.customer.name}</p>
                <p className="text-mute text-sm">{app.customer.email}</p>
                <p className="text-mute text-sm">{app.customer.phone}</p>
              </div>
              <div>
                <p className="text-mute text-xs font-semibold tracking-wide uppercase">Sourcing partner</p>
                {app.partner ? (
                  <>
                    <p className="text-ink-950 mt-1 text-sm font-semibold">{app.partner.name}</p>
                    <p className="text-mute text-sm">{app.partner.email}</p>
                    <p className="text-mute text-sm">{app.partner.phone}</p>
                  </>
                ) : (
                  <p className="text-mute mt-1 text-sm">Direct application, no sourcing partner.</p>
                )}
              </div>
              <div>
                <p className="text-mute text-xs font-semibold tracking-wide uppercase">City</p>
                <p className="text-ink-950 mt-1 text-sm">{app.city}</p>
              </div>
              <div>
                <p className="text-mute text-xs font-semibold tracking-wide uppercase">Employment</p>
                <p className="text-ink-950 mt-1 text-sm">{app.employmentType || "-"}</p>
              </div>
              {app.assignedLenderSlug ? (
                <div>
                  <p className="text-mute text-xs font-semibold tracking-wide uppercase">Assigned lender</p>
                  <p className="text-ink-950 mt-1 text-sm">{app.assignedLenderSlug}</p>
                </div>
              ) : null}
              {app.sanctionedAmount ? (
                <div>
                  <p className="text-mute text-xs font-semibold tracking-wide uppercase">Sanctioned amount</p>
                  <p className="text-ink-950 mt-1 text-sm">₹{formatINR(app.sanctionedAmount)}</p>
                </div>
              ) : null}
            </div>
          </section>

          <section className="border-line border p-5">
            <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Documents</h2>
            {app.documents.length === 0 ? (
              <p className="text-mute text-sm">No documents uploaded yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {app.documents.map((doc) => {
                  const meta = DOCUMENT_STATUS_META[doc.status];
                  return (
                    <li key={doc.id} className="border-line flex flex-col gap-2 border p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link href={`/api/documents/${doc.id}`} className="text-ink-950 hover:text-brass-600 text-sm font-semibold underline underline-offset-2">
                          {DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type}
                        </Link>
                        <p className="text-mute-2 mt-0.5 text-xs">
                          {doc.fileName} · Uploaded {readableDate(doc.uploadedAt)}
                        </p>
                        <div className="mt-1">
                          <StatusPill label={meta.label} tone={meta.tone} />
                        </div>
                        {doc.reviewNote ? <p className="text-mute mt-1 text-xs">Note: {doc.reviewNote}</p> : null}
                      </div>
                      {canReviewDocuments && doc.status === "PENDING_REVIEW" ? (
                        <DocumentReviewForm documentId={doc.id} applicationId={app.id} />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="border-line border p-5">
            <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Notes</h2>
            <ApplicationNoteForm applicationId={app.id} />
            <ul className="mt-4 flex flex-col gap-3">
              {app.notes.length === 0 ? (
                <p className="text-mute text-sm">No notes yet.</p>
              ) : (
                app.notes.map((note) => (
                  <li key={note.id} className="border-line border-b pb-3 last:border-b-0">
                    <p className="text-ink-900 text-sm">{note.body}</p>
                    <p className="text-mute-2 mt-1 text-xs">
                      {note.author.name} · {readableDate(note.createdAt)}
                      {note.visibleToCustomer ? " · Visible to customer" : " · Internal only"}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          {canChangeStatus ? (
            <section className="border-line border p-5">
              <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Change status</h2>
              <ApplicationStatusForm
                applicationId={app.id}
                currentStatus={app.status}
                lenders={lenders.map((l) => ({ slug: l.slug, name: l.name }))}
                assignedLenderSlug={app.assignedLenderSlug}
                sanctionedAmount={app.sanctionedAmount}
              />
            </section>
          ) : null}

          <section className="border-line border p-5">
            <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Timeline</h2>
            <Timeline entries={timelineEntries} />
          </section>
        </div>
      </div>
    </div>
  );
}
