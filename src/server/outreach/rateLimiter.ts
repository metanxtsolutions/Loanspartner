import { prisma } from "@/server/outreach/db";

/**
 * Daily send limit, counted from what actually went out (SENT/DELIVERED/
 * OPENED/BOUNCED all mean Resend accepted and attempted delivery), not from
 * a separate in-memory counter. A DB-backed count survives serverless cold
 * starts and multiple concurrent function instances, where an in-memory
 * counter would silently reset or diverge per instance.
 */
export async function sentToday(): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return prisma.outreachMessage.count({
    where: {
      direction: "OUTBOUND",
      status: { in: ["SENT", "DELIVERED", "OPENED", "BOUNCED"] },
      sentAt: { gte: startOfDay },
    },
  });
}

export async function canSendMore(dailyLimit: number): Promise<{ allowed: boolean; sentToday: number }> {
  const count = await sentToday();
  return { allowed: count < dailyLimit, sentToday: count };
}

/** Minimum gap since the last outbound send, to spread sends out rather than bursting them. */
export async function secondsSinceLastSend(): Promise<number | null> {
  const last = await prisma.outreachMessage.findFirst({
    where: { direction: "OUTBOUND", sentAt: { not: null } },
    orderBy: { sentAt: "desc" },
    select: { sentAt: true },
  });
  if (!last?.sentAt) return null;
  return (Date.now() - last.sentAt.getTime()) / 1000;
}
