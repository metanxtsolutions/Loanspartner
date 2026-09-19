import type { AdminRole } from "@prisma/client";

/**
 * Fixed permission matrix for the four AdminRoles, rather than a dynamic
 * roles/permissions editor. A SUPER_ADMIN can reassign a user's AdminRole
 * (/console/roles) but cannot invent a new permission from the UI: new
 * permissions are added here, in code, deliberately.
 */
export const PERMISSIONS = [
  "users.manage",
  "partners.review_kyc",
  "applications.manage",
  "applications.change_status",
  "documents.review",
  "lenders.manage",
  "commissions.manage",
  "payouts.manage",
  "notifications.broadcast",
  "reports.view",
  "settings.manage",
  "roles.manage",
  "activity_log.view",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const MATRIX: Record<AdminRole, readonly Permission[]> = {
  SUPER_ADMIN: PERMISSIONS,
  OPS: [
    "partners.review_kyc",
    "applications.manage",
    "applications.change_status",
    "documents.review",
    "lenders.manage",
    "notifications.broadcast",
    "reports.view",
    "activity_log.view",
  ],
  FINANCE: ["commissions.manage", "payouts.manage", "reports.view", "activity_log.view"],
  SUPPORT: ["applications.change_status", "documents.review", "reports.view"],
};

export function adminRoleHasPermission(adminRole: AdminRole | null, permission: Permission) {
  if (!adminRole) return false;
  return MATRIX[adminRole].includes(permission);
}

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  OPS: "Operations",
  FINANCE: "Finance",
  SUPPORT: "Support",
};
