import "server-only";
import type { AdminRole } from "@prisma/client";
import { prisma } from "@/server/db";
import { logAudit } from "@/server/dashboard/audit";

export async function listUsersForAdmin(filter?: { role?: "CUSTOMER" | "PARTNER" | "ADMIN"; search?: string }) {
  return prisma.user.findMany({
    where: {
      role: filter?.role,
      ...(filter?.search
        ? { OR: [{ name: { contains: filter.search, mode: "insensitive" } }, { email: { contains: filter.search, mode: "insensitive" } }] }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { partnerProfile: true },
  });
}

export async function setUserStatus(userId: string, status: "ACTIVE" | "SUSPENDED", actor: { id: string; role: "ADMIN" }) {
  const user = await prisma.user.update({ where: { id: userId }, data: { status } });
  await logAudit({ actorUserId: actor.id, actorRole: actor.role, action: "user.status_changed", entityType: "User", entityId: userId, meta: { status } });
  return user;
}

export async function listAdmins() {
  return prisma.user.findMany({ where: { role: "ADMIN" }, orderBy: { createdAt: "asc" } });
}

export async function setAdminRole(userId: string, adminRole: AdminRole, actor: { id: string; role: "ADMIN" }) {
  const user = await prisma.user.update({ where: { id: userId }, data: { adminRole } });
  await logAudit({ actorUserId: actor.id, actorRole: actor.role, action: "admin.role_changed", entityType: "User", entityId: userId, meta: { adminRole } });
  return user;
}

export async function platformOverviewCounts() {
  const [customers, partners, pendingKyc, applications, activeApplications, disbursed, pendingDocuments] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "PARTNER" } }),
    prisma.partnerProfile.count({ where: { kycStatus: "PENDING_REVIEW" } }),
    prisma.loanApplication.count(),
    prisma.loanApplication.count({ where: { status: { notIn: ["DRAFT", "DISBURSED", "REJECTED", "WITHDRAWN"] } } }),
    prisma.loanApplication.count({ where: { status: "DISBURSED" } }),
    prisma.document.count({ where: { status: "PENDING_REVIEW" } }),
  ]);
  return { customers, partners, pendingKyc, applications, activeApplications, disbursed, pendingDocuments };
}
