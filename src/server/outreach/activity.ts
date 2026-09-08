import "server-only";
import { prisma } from "@/server/outreach/db";
import type { Prisma } from "@prisma/client";

/** Every state-changing action in the outreach system writes one row here. */
export async function logActivity(input: { lenderId?: string | null; actor: string; action: string; meta?: Prisma.InputJsonValue }) {
  await prisma.activityLog.create({
    data: {
      lenderId: input.lenderId ?? null,
      actor: input.actor,
      action: input.action,
      meta: input.meta,
    },
  });
}
