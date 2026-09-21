import { requirePartner } from "@/server/dashboard/access";
import { prisma } from "@/server/db";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusPill } from "@/components/dashboard/status-pill";
import { Banner } from "@/components/dashboard/banner";
import { KycForm } from "@/components/partner/kyc-form";
import { PARTNER_KYC_STATUS_META } from "@/lib/dashboard/statuses";

export default async function PartnerOnboardingPage() {
  const user = await requirePartner();
  const profile = await prisma.partnerProfile.findUnique({ where: { userId: user.id } });
  const kycStatus = profile?.kycStatus ?? "NOT_SUBMITTED";
  const meta = PARTNER_KYC_STATUS_META[kycStatus];

  return (
    <>
      <PageHeader
        title="Partner KYC"
        subtitle="We need these details to approve you as a partner and process your commission payouts."
        action={<StatusPill label={meta.label} tone={meta.tone} />}
      />

      {kycStatus === "REJECTED" ? (
        <Banner tone="danger" title="Your KYC was not approved" body={profile?.kycNote || "Please review your details and resubmit."} />
      ) : null}
      {kycStatus === "PENDING_REVIEW" ? (
        <Banner tone="info" title="Under review" body="Your KYC details are being reviewed. You can still update them below if something needs fixing." />
      ) : null}

      <div className="border-line bg-cream max-w-2xl border p-6">
        <KycForm
          defaultValues={{
            firmName: profile?.firmName ?? "",
            panNumber: profile?.panNumber ?? "",
            gstNumber: profile?.gstNumber ?? "",
            city: profile?.city ?? "",
            bankAccountName: profile?.bankAccountName ?? "",
            bankAccountNumber: profile?.bankAccountNumber ?? "",
            bankIfsc: profile?.bankIfsc ?? "",
          }}
        />
      </div>
    </>
  );
}
