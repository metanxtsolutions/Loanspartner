import "server-only";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/server/db";

export async function logAudit(params: {
  actorUserId?: string | null;
  actorRole?: UserRole | null;
  action: string;
  entityType?: string;
  entityId?: string;
  meta?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      actorUserId: params.actorUserId ?? null,
      actorRole: params.actorRole ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      meta: params.meta as never,
    },
  });
}
