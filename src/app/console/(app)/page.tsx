import { Users, UserCheck, FileText, FileCheck2, Banknote, Clock } from "lucide-react";
import { requireAdmin } from "@/server/dashboard/access";
import { platformOverviewCounts } from "@/server/dashboard/users";
import { adminRoleHasPermission } from "@/lib/dashboard/permissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ButtonLink } from "@/components/shared/button";

export default async function ConsoleOverviewPage() {
  const actor = await requireAdmin();
  const counts = await platformOverviewCounts();

  const canReviewKyc = adminRoleHasPermission(actor.adminRole, "partners.review_kyc");
  const canReviewDocuments = adminRoleHasPermission(actor.adminRole, "documents.review");

  return (
    <div>
      <PageHeader title="Overview" subtitle="Platform-wide snapshot across customers, partners and applications." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Customers" value={counts.customers} icon={<Users className="size-4" />} />
        <StatCard label="Partners" value={counts.partners} icon={<UserCheck className="size-4" />} />
        <StatCard label="Pending KYC" value={counts.pendingKyc} icon={<Clock className="size-4" />} tone={counts.pendingKyc > 0 ? "brass" : "default"} />
        <StatCard label="Applications" value={counts.applications} icon={<FileText className="size-4" />} />
        <StatCard label="Active applications" value={counts.activeApplications} icon={<FileText className="size-4" />} tone="verdant" />
        <StatCard label="Disbursed" value={counts.disbursed} icon={<Banknote className="size-4" />} tone="verdant" />
        <StatCard
          label="Documents pending review"
          value={counts.pendingDocuments}
          icon={<FileCheck2 className="size-4" />}
          tone={counts.pendingDocuments > 0 ? "brass" : "default"}
        />
      </div>

      {(canReviewKyc && counts.pendingKyc > 0) || (canReviewDocuments && counts.pendingDocuments > 0) ? (
        <div className="mt-8">
          <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Needs attention</h2>
          <div className="flex flex-wrap gap-3">
            {canReviewKyc && counts.pendingKyc > 0 ? (
              <ButtonLink href="/console/partners" variant="brass" size="sm">
                {counts.pendingKyc} partner KYC {counts.pendingKyc === 1 ? "review" : "reviews"} pending
              </ButtonLink>
            ) : null}
            {canReviewDocuments && counts.pendingDocuments > 0 ? (
              <ButtonLink href="/console/documents" variant="brass" size="sm">
                {counts.pendingDocuments} document {counts.pendingDocuments === 1 ? "review" : "reviews"} pending
              </ButtonLink>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
