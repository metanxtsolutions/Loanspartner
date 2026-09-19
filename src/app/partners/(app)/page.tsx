import Link from "next/link";
import { ClipboardList, Wallet, TrendingUp } from "lucide-react";
import { requirePartner } from "@/server/dashboard/access";
import { prisma } from "@/server/db";
import { listApplicationsForPartner } from "@/server/dashboard/applications";
import { listCommissionsForPartner } from "@/server/dashboard/commissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Banner } from "@/components/dashboard/banner";
import { StatusPill } from "@/components/dashboard/status-pill";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ButtonLink } from "@/components/shared/button";
import { formatINR, readableDate } from "@/lib/utils";
import { APPLICATION_STATUS_META } from "@/lib/dashboard/statuses";

const TERMINAL_STATUSES = new Set(["DISBURSED", "REJECTED", "WITHDRAWN"]);

export default async function PartnerOverviewPage() {
  const user = await requirePartner();
  const [profile, applications, commissions] = await Promise.all([
    prisma.partnerProfile.findUnique({ where: { userId: user.id } }),
    listApplicationsForPartner(user.id),
    listCommissionsForPartner(user.id),
  ]);

  const activeLeads = applications.filter((a) => !TERMINAL_STATUSES.has(a.status)).length;

  const now = new Date();
  const disbursedThisMonth = applications
    .filter(
      (a) =>
        a.status === "DISBURSED" &&
        a.disbursedAt &&
        a.disbursedAt.getMonth() === now.getMonth() &&
        a.disbursedAt.getFullYear() === now.getFullYear(),
    )
    .reduce((sum, a) => sum + (a.sanctionedAmount ?? 0), 0);

  const pendingPayout = commissions
    .filter((c) => c.status === "ACCRUED" || c.status === "APPROVED")
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        subtitle="Here's how your leads and earnings are doing."
        action={
          <ButtonLink href="/partners/leads/new" size="sm">
            Submit a lead
          </ButtonLink>
        }
      />

      {profile && profile.kycStatus !== "APPROVED" ? (
        <Banner
          tone={profile.kycStatus === "REJECTED" ? "danger" : "warning"}
          title="Finish your partner KYC"
          body="Complete your KYC to start earning commission on disbursed leads."
          action={
            <Link href="/partners/onboarding" className="bg-ink-900 hover:bg-ink-800 shrink-0 px-4 py-2 text-sm font-semibold text-white transition">
              Go to onboarding
            </Link>
          }
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active leads" value={activeLeads} icon={<ClipboardList className="size-4" />} />
        <StatCard label="Disbursed this month" value={`₹${formatINR(disbursedThisMonth, { compact: true })}`} icon={<TrendingUp className="size-4" />} />
        <StatCard label="Pending payout" value={`₹${formatINR(pendingPayout, { compact: true })}`} icon={<Wallet className="size-4" />} tone="brass" />
      </div>

      <div className="mt-8">
        <PageHeader title="Recent leads" />
        {applications.length === 0 ? (
          <EmptyState
            title="No leads yet"
            body="Submit your first customer lead to see it here."
            action={
              <ButtonLink href="/partners/leads/new" size="sm">
                Submit a lead
              </ButtonLink>
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            {applications.slice(0, 5).map((a) => {
              const meta = APPLICATION_STATUS_META[a.status];
              return (
                <Link
                  key={a.id}
                  href={`/partners/leads/${a.id}`}
                  className="border-line hover:bg-cream flex items-center justify-between gap-3 border px-4 py-3 text-sm transition"
                >
                  <div>
                    <p className="text-ink-900 font-semibold">{a.customer.name}</p>
                    <p className="text-mute text-xs">
                      {a.code} · {readableDate(a.createdAt)}
                    </p>
                  </div>
                  <StatusPill label={meta.label} tone={meta.tone} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
