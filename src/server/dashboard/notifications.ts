import "server-only";
import type { NotificationType, UserRole } from "@prisma/client";
import { prisma } from "@/server/db";
import { sendPlatformEmail } from "@/server/dashboard/email";

/**
 * Writes the in-app notification first (source of truth, always succeeds if
 * the DB write succeeds) and then makes a best-effort attempt to also email
 * it. Never throws: a notification failure should never roll back or fail
 * the business action (a status change, a document review) that caused it.
 */
export async function notify(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  email?: string;
}) {
  const { userId, type, title, body, link, email } = params;
  await prisma.notification.create({ data: { userId, type, title, body, link } });
  if (email) await sendPlatformEmail(email, title, link ? `${body}\n\n${absoluteUrl(link)}` : body);
}

function absoluteUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loanspartner.in";
  return path.startsWith("http") ? path : `${base}${path}`;
}

export async function broadcastNotification(params: { role: UserRole; title: string; body: string; link?: string }) {
  const { role, title, body, link } = params;
  const users = await prisma.user.findMany({ where: { role, status: "ACTIVE" }, select: { id: true, email: true } });
  await prisma.notification.createMany({
    data: users.map((u) => ({ userId: u.id, type: "BROADCAST" as const, title, body, link })),
  });
  // Best-effort emails, fired without blocking the response on every send.
  await Promise.allSettled(users.map((u) => sendPlatformEmail(u.email, title, link ? `${body}\n\n${absoluteUrl(link)}` : body)));
  return users.length;
}

export async function unreadCount(userId: string) {
  return prisma.notification.count({ where: { userId, readAt: null } });
}

export async function listNotifications(userId: string, limit = 30) {
  return prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: limit });
}

export async function markAllRead(userId: string) {
  await prisma.notification.updateMany({ where: { userId, readAt: null }, data: { readAt: new Date() } });
}

export async function markRead(userId: string, notificationId: string) {
  await prisma.notification.updateMany({ where: { id: notificationId, userId }, data: { readAt: new Date() } });
}
