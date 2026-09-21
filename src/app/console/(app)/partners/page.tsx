import type { Metadata } from "next";
import { requireAdmin } from "@/server/dashboard/access";
import { listPartnersForAdmin } from "@/server/dashboard/partners";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatusPill } from "@/components/dashboard/status-pill";
import { KycReviewForm } from "@/components/console/kyc-review-form";
import { PARTNER_KYC_STATUS_META } from "@/lib/dashboard/statuses";
import { readableDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Partners", robots: { index: false, follow: false } };

type PartnerRow = Awaited<ReturnType<typeof listPartnersForAdmin>>[number];

export default async function ConsolePartnersPage() {
  await requireAdmin("partners.review_kyc");
  const partners = await listPartnersForAdmin();

  const columns: Column<PartnerRow>[] = [
    { key: "name", header: "Partner", render: (p) => p.name },
    { key: "email", header: "Email", render: (p) => p.email },
    { key: "firm", header: "Firm", render: (p) => p.partnerProfile?.firmName || "-" },
    { key: "leads", header: "Leads", render: (p) => p._count.applicationsAsPartner },
    {
      key: "kyc",
      header: "KYC status",
      render: (p) => {
        const status = p.partnerProfile?.kycStatus ?? "NOT_SUBMITTED";
        const meta = PARTNER_KYC_STATUS_META[status];
        return <StatusPill label={meta.label} tone={meta.tone} />;
      },
    },
    { key: "joined", header: "Joined", render: (p) => readableDate(p.createdAt) },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (p) => (p.partnerProfile?.kycStatus === "PENDING_REVIEW" ? <KycReviewForm partnerId={p.id} /> : null),
    },
  ];

  return (
    <div>
      <PageHeader title="Partners" subtitle="Review KYC submissions and see each partner's lead volume." />
      <DataTable columns={columns} rows={partners} emptyTitle="No partners yet" />
    </div>
  );
}
