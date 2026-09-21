import type { Metadata } from "next";
import { Bell, FileText, FolderOpen, LayoutDashboard, Settings } from "lucide-react";
import { requireCustomer } from "@/server/dashboard/access";
import { listNotifications, unreadCount } from "@/server/dashboard/notifications";
import { logoutCustomerAction } from "@/actions/auth/customer";
import { markNotificationsReadAction } from "@/actions/customer/applications";
import { DashboardShell, type NavSection } from "@/components/dashboard/dashboard-shell";
import { Banner } from "@/components/dashboard/banner";

// Authenticated account pages: never indexed.
export const metadata: Metadata = { robots: { index: false, follow: false } };

const SECTIONS: NavSection[] = [
  {
    items: [
      { href: "/dashboard", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
      { href: "/dashboard/applications", label: "My Applications", icon: <FileText className="size-4" /> },
      { href: "/dashboard/documents", label: "Documents", icon: <FolderOpen className="size-4" /> },
      { href: "/dashboard/notifications", label: "Notifications", icon: <Bell className="size-4" /> },
      { href: "/dashboard/settings", label: "Settings", icon: <Settings className="size-4" /> },
    ],
  },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Belt-and-braces: middleware already guards /dashboard/**, this re-checks server-side.
  const actor = await requireCustomer();
  const [notifications, unread] = await Promise.all([listNotifications(actor.id), unreadCount(actor.id)]);

  const banner = !actor.emailVerifiedAt ? (
    <Banner tone="warning" title="Verify your email" body="Check your inbox for a verification link so we can keep you posted on your applications." />
  ) : null;

  return (
    <DashboardShell
      brand="Dashboard"
      sections={SECTIONS}
      userName={actor.name}
      userSubtitle={actor.email}
      banner={banner}
      notifications={notifications}
      unreadCount={unread}
      markAllReadAction={markNotificationsReadAction}
      signOutAction={logoutCustomerAction}
    >
      {children}
    </DashboardShell>
  );
}
