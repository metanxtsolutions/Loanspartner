import "server-only";
import { redirect } from "next/navigation";
import type { AdminRole, UserRole } from "@prisma/client";
import { getSession, type SessionPayload } from "@/server/auth/session";
import { prisma } from "@/server/db";
import type { Permission } from "@/lib/dashboard/permissions";
import { adminRoleHasPermission } from "@/lib/dashboard/permissions";

export class AccessDeniedError extends Error {
  constructor(message = "You do not have access to this.") {
    super(message);
    this.name = "AccessDeniedError";
  }
}

/** Full actor record for the current session, or null if signed out. */
export async function getActor() {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.status === "SUSPENDED") return null;
  return user;
}

export function loginPathFor(role: UserRole) {
  if (role === "PARTNER") return "/partners/login";
  if (role === "ADMIN") return "/console/login";
  return "/login";
}

export function dashboardPathFor(role: UserRole) {
  if (role === "PARTNER") return "/partners";
  if (role === "ADMIN") return "/console";
  return "/dashboard";
}

async function requireRole(role: UserRole) {
  const session: SessionPayload | null = await getSession();
  if (!session || session.role !== role) redirect(loginPathFor(role));
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || user.status === "SUSPENDED") redirect(loginPathFor(role));
  return user;
}

/** Redirects to /login if there is no valid CUSTOMER session. Use in Server Components/layouts. */
export async function requireCustomer() {
  return requireRole("CUSTOMER");
}

/** Redirects to /partners/login if there is no valid PARTNER session. */
export async function requirePartner() {
  return requireRole("PARTNER");
}

/**
 * Redirects to /console/login if there is no valid ADMIN session. When
 * `permission` is given, an admin without that permission is redirected to
 * /console (their overview) rather than allowed to view the page.
 */
export async function requireAdmin(permission?: Permission) {
  const user = await requireRole("ADMIN");
  if (permission && !adminRoleHasPermission(user.adminRole, permission)) redirect("/console");
  return user;
}

/** Throws instead of redirecting — for use inside server actions, where a redirect can't carry a form error back to the caller. */
export async function assertCustomer() {
  const actor = await getActor();
  if (!actor || actor.role !== "CUSTOMER") throw new AccessDeniedError();
  return actor;
}

export async function assertPartner() {
  const actor = await getActor();
  if (!actor || actor.role !== "PARTNER") throw new AccessDeniedError();
  return actor;
}

export async function assertAdmin(permission?: Permission) {
  const actor = await getActor();
  if (!actor || actor.role !== "ADMIN") throw new AccessDeniedError();
  if (permission && !adminRoleHasPermission(actor.adminRole, permission)) throw new AccessDeniedError();
  return actor;
}

/** True if `actor` may view/act on this application: its customer, its sourcing partner, or any admin. */
export function canAccessApplication(
  actor: { id: string; role: UserRole },
  application: { customerId: string; partnerId: string | null },
) {
  if (actor.role === "ADMIN") return true;
  if (actor.role === "CUSTOMER") return actor.id === application.customerId;
  if (actor.role === "PARTNER") return actor.id === application.partnerId;
  return false;
}

/** True if `actor` may view/download this document. */
export function canAccessDocument(
  actor: { id: string; role: UserRole },
  document: { ownerUserId: string; application: { partnerId: string | null } | null },
) {
  if (actor.role === "ADMIN") return true;
  if (actor.role === "CUSTOMER") return actor.id === document.ownerUserId;
  if (actor.role === "PARTNER") return actor.id === document.application?.partnerId;
  return false;
}

export function assertOwnsApplication(
  actor: { id: string; role: UserRole },
  application: { customerId: string; partnerId: string | null },
) {
  if (!canAccessApplication(actor, application)) throw new AccessDeniedError();
}

export function assertOwnsDocument(
  actor: { id: string; role: UserRole },
  document: { ownerUserId: string; application: { partnerId: string | null } | null },
) {
  if (!canAccessDocument(actor, document)) throw new AccessDeniedError();
}

export type { AdminRole };
