import Link from "next/link";
import { requirePartner } from "@/server/dashboard/access";
import { prisma } from "@/server/db";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusPill } from "@/components/dashboard/status-pill";
import { ProfileForm } from "@/components/partner/profile-form";
import { PasswordForm } from "@/components/partner/password-form";
import { PARTNER_KYC_STATUS_META } from "@/lib/dashboard/statuses";

export default async function PartnerSettingsPage() {
  const user = await requirePartner();
  const profile = await prisma.partnerProfile.findUnique({ where: { userId: user.id } });
  const kycStatus = profile?.kycStatus ?? "NOT_SUBMITTED";
  const kycMeta = PARTNER_KYC_STATUS_META[kycStatus];

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your profile, password and KYC details." />

      <div className="flex flex-col gap-8">
        <section className="border-line bg-cream max-w-2xl border p-6">
          <h2 className="text-ink-900 text-sm font-semibold">Profile</h2>
          <div className="mt-4">
            <ProfileForm defaultValues={{ name: user.name, phone: user.phone ?? "", city: profile?.city ?? "" }} />
          </div>
        </section>

        <section className="border-line bg-cream max-w-2xl border p-6">
          <h2 className="text-ink-900 text-sm font-semibold">Change password</h2>
          <div className="mt-4">
            <PasswordForm />
          </div>
        </section>

        <section className="border-line bg-cream max-w-2xl border p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-ink-900 text-sm font-semibold">KYC &amp; bank details</h2>
            <StatusPill label={kycMeta.label} tone={kycMeta.tone} />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-mute text-xs">Firm name</dt>
              <dd className="text-ink-900 font-semibold">{profile?.firmName || "-"}</dd>
            </div>
            <div>
              <dt className="text-mute text-xs">PAN</dt>
              <dd className="text-ink-900 font-semibold">{profile?.panNumber || "-"}</dd>
            </div>
            <div>
              <dt className="text-mute text-xs">GST number</dt>
              <dd className="text-ink-900 font-semibold">{profile?.gstNumber || "-"}</dd>
            </div>
            <div>
              <dt className="text-mute text-xs">Bank account</dt>
              <dd className="text-ink-900 font-semibold">{profile?.bankAccountNumber ? `•••• ${profile.bankAccountNumber.slice(-4)}` : "-"}</dd>
            </div>
          </dl>
          <Link href="/partners/onboarding" className="text-ink-900 mt-4 inline-block text-sm font-semibold underline underline-offset-2">
            Update KYC / bank details
          </Link>
        </section>
      </div>
    </>
  );
}
