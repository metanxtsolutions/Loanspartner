import Link from "next/link";
import { ArrowRight, FileClock, FileText } from "lucide-react";
import { requireCustomer } from "@/server/dashboard/access";
import { listApplicationsForCustomer } from "@/server/dashboard/applications";
import { listDocumentsForOwner } from "@/server/dashboard/documents";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Banner } from "@/components/dashboard/banner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusPill } from "@/components/dashboard/status-pill";
import { ButtonLink } from "@/components/shared/button";
import { APPLICATION_STATUS_META } from "@/lib/dashboard/statuses";
import { productOption } from "@/data/lite";
import { formatINR, readableDate } from "@/lib/utils";

const TERMINAL_STATUSES = new Set(["DISBURSED", "REJECTED", "WITHDRAWN"]);

export default async function DashboardOverviewPage() {
  const actor = await requireCustomer();
  const [applications, documents] = await Promise.all([listApplicationsForCustomer(actor.id), listDocumentsForOwner(actor.id)]);

  const active = applications.filter((a) => !TERMINAL_STATUSES.has(a.status));
  const needsDocs = applications.filter((a) => a.status === "DOCS_REQUIRED");
  const pendingDocs = documents.filter((d) => d.status === "PENDING_REVIEW");
  const recent = applications.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${actor.name.split(" ")[0]}`}
        subtitle="Track your loan applications and documents in one place."
        action={
          <ButtonLink href="/dashboard/applications/new" size="md">
            New loan enquiry
          </ButtonLink>
        }
      />

      {needsDocs.length > 0 ? (
        <Banner
          tone="warning"
          title={needsDocs.length > 1 ? `${needsDocs.length} applications need documents` : "1 application needs documents"}
          body="Upload the requested documents to keep things moving."
          action={
            <ButtonLink href="/dashboard/documents" variant="secondary" size="sm">
              Upload documents
            </ButtonLink>
          }
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active applications" value={active.length} icon={<FileText className="size-4" />} />
        <StatCard
          label="Documents pending review"
          value={pendingDocs.length}
          icon={<FileClock className="size-4" />}
          tone={pendingDocs.length > 0 ? "brass" : "default"}
        />
        <StatCard label="Total applications" value={applications.length} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-ink-950 text-base font-bold">Recent applications</h2>
          {applications.length > 0 ? (
            <Link href="/dashboard/applications" className="text-mute hover:text-ink-900 flex items-center gap-1 text-sm font-medium">
              View all <ArrowRight className="size-3.5" />
            </Link>
          ) : null}
        </div>
        {recent.length === 0 ? (
          <EmptyState
            title="No applications yet"
            body="Start a loan enquiry and our desk will take it from there."
            action={
              <ButtonLink href="/dashboard/applications/new" size="sm">
                New loan enquiry
              </ButtonLink>
            }
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {recent.map((app) => {
              const product = productOption(app.productSlug);
              const meta = APPLICATION_STATUS_META[app.status];
              return (
                <li key={app.id}>
                  <Link
                    href={`/dashboard/applications/${app.id}`}
                    className="border-line hover:bg-cream flex flex-col gap-1 border p-4 transition sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-ink-900 text-sm font-semibold">
                        {product?.name ?? app.productSlug} &middot; {app.code}
                      </p>
                      <p className="text-mute mt-0.5 text-xs">
                        {formatINR(app.requestedAmount, { compact: true })} &middot; {readableDate(app.createdAt)}
                      </p>
                    </div>
                    <StatusPill label={meta.label} tone={meta.tone} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
