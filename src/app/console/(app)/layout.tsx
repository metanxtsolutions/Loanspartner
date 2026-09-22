import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  Inbox,
  Landmark,
  Package,
  FileCheck2,
  Percent,
  Wallet,
  Bell,
  BarChart3,
  ScrollText,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { requireAdmin } from "@/server/dashboard/access";
import { logoutAdminAction } from "@/actions/auth/admin";
import { markNotificationsReadAction } from "@/actions/console/notifications";
import { listNotifications, unreadCount } from "@/server/dashboard/notifications";
import { adminRoleHasPermission, ADMIN_ROLE_LABELS, type Permission } from "@/lib/dashboard/permissions";
import { DashboardShell, type NavItem } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV: { href: string; label: string; icon: ReactNode; permission?: Permission }[] = [
  { href: "/console", label: "Overview", icon: <LayoutDashboard className="size-4" /> },
  { href: "/console/users", label: "Users", icon: <Users className="size-4" />, permission: "users.manage" },
  { href: "/console/partners", label: "Partners", icon: <UserCheck className="size-4" />, permission: "partners.review_kyc" },
  { href: "/console/applications", label: "Applications", icon: <FileText className="size-4" />, permission: "applications.manage" },
  { href: "/console/leads", label: "Website leads", icon: <Inbox className="size-4" />, permission: "leads.manage" },
  { href: "/console/lenders", label: "Lenders", icon: <Landmark className="size-4" />, permission: "lenders.manage" },
  { href: "/console/products", label: "Products", icon: <Package className="size-4" /> },
  { href: "/console/documents", label: "Documents", icon: <FileCheck2 className="size-4" />, permission: "documents.review" },
  { href: "/console/commissions", label: "Commissions", icon: <Percent className="size-4" />, permission: "commissions.manage" },
  { href: "/console/payouts", label: "Payouts", icon: <Wallet className="size-4" />, permission: "payouts.manage" },
  { href: "/console/notifications", label: "Notifications", icon: <Bell className="size-4" /> },
  { href: "/console/reports", label: "Reports", icon: <BarChart3 className="size-4" />, permission: "reports.view" },
  { href: "/console/activity-log", label: "Activity log", icon: <ScrollText className="size-4" />, permission: "activity_log.view" },
  { href: "/console/roles", label: "Roles", icon: <ShieldCheck className="size-4" />, permission: "roles.manage" },
  { href: "/console/settings", label: "Settings", icon: <Settings className="size-4" />, permission: "settings.manage" },
];

export default async function ConsoleAppLayout({ children }: { children: ReactNode }) {
  const actor = await requireAdmin();

  const items: NavItem[] = NAV.filter((item) => !item.permission || adminRoleHasPermission(actor.adminRole, item.permission)).map((item) => ({
    href: item.href,
    label: item.label,
    icon: item.icon,
  }));

  const [notifications, unread] = await Promise.all([listNotifications(actor.id), unreadCount(actor.id)]);

  return (
    <DashboardShell
      brand="Admin Control Center"
      sections={[{ items }]}
      userName={actor.name}
      userSubtitle={actor.adminRole ? ADMIN_ROLE_LABELS[actor.adminRole] : "Admin"}
      notifications={notifications}
      unreadCount={unread}
      markAllReadAction={markNotificationsReadAction}
      signOutAction={logoutAdminAction}
    >
      {children}
    </DashboardShell>
  );
}
