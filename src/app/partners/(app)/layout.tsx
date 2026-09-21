import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, ClipboardList, FileText, Wallet, Bell, Settings } from "lucide-react";
import { requirePartner } from "@/server/dashboard/access";
import { prisma } from "@/server/db";
import { listNotifications, unreadCount } from "@/server/dashboard/notifications";
import { logoutPartnerAction } from "@/actions/auth/partner";
import { markNotificationsReadAction } from "@/actions/partner/leads";
import { DashboardShell, type NavSection } from "@/components/dashboard/dashboard-shell";
import { Banner } from "@/components/dashboard/banner";
import { PARTNER_KYC_STATUS_META } from "@/lib/dashboard/statuses";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV: NavSection[] = [
  {
    items: [
      { href: "/partners", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
      { href: "/partners/leads", label: "Leads", icon: <ClipboardList className="size-4" /> },
      { href: "/partners/documents", label: "Documents", icon: <FileText className="size-4" /> },
      { href: "/partners/earnings", label: "Earnings", icon: <Wallet className="size-4" /> },
      { href: "/partners/notifications", label: "Notifications", icon: <Bell className="size-4" /> },
      { href: "/partners/settings", label: "Settings", icon: <Settings className="size-4" /> },
    ],
  },
];

export default async function PartnerAppLayout({ children }: { children: ReactNode }) {
  const user = await requirePartner();
  const [profile, notifications, unread] = await Promise.all([
    prisma.partnerProfile.findUnique({ where: { userId: user.id } }),
    listNotifications(user.id),
    unreadCount(user.id),
  ]);

  const kycStatus = profile?.kycStatus ?? "NOT_SUBMITTED";
  const kycMeta = PARTNER_KYC_STATUS_META[kycStatus];

  const banner =
    kycStatus !== "APPROVED" ? (
      <Banner
        tone={kycStatus === "REJECTED" ? "danger" : "warning"}
        title={
          kycStatus === "PENDING_REVIEW"
            ? "Your KYC is under review"
            : kycStatus === "REJECTED"
              ? "Your KYC needs attention"
              : "Complete your KYC to start earning"
        }
        body={
          kycStatus === "PENDING_REVIEW"
            ? "We're reviewing your details. You can submit leads once it's approved."
            : kycStatus === "REJECTED"
              ? profile?.kycNote || "Your KYC submission needs a correction. Please review and resubmit."
              : "Submit your firm, PAN and bank details so we can approve you and process your commission payouts."
        }
        action={
          <Link href="/partners/onboarding" className="bg-ink-900 hover:bg-ink-800 shrink-0 px-4 py-2 text-sm font-semibold text-white transition">
            {kycStatus === "NOT_SUBMITTED" ? "Complete KYC" : "Review KYC"}
          </Link>
        }
      />
    ) : null;

  return (
    <DashboardShell
      brand="Partner"
      sections={NAV}
      userName={user.name}
      userSubtitle={kycMeta.label}
      banner={banner}
      notifications={notifications}
      unreadCount={unread}
      markAllReadAction={markNotificationsReadAction}
      signOutAction={logoutPartnerAction}
    >
      {children}
    </DashboardShell>
  );
}
