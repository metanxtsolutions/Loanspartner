"use server";

import { revalidatePath } from "next/cache";
import type { UserRole } from "@prisma/client";
import { assertAdmin } from "@/server/dashboard/access";
import { broadcastNotification, markAllRead } from "@/server/dashboard/notifications";
import { notificationBroadcastSchema } from "@/lib/dashboard/schemas";

export type ActionResult = { ok: boolean; message?: string };

/** notificationBroadcastSchema's `audience` is a coarser concept than the UserRole broadcastNotification() actually targets. */
const AUDIENCE_TO_ROLE: Record<string, UserRole> = {
  ALL_CUSTOMERS: "CUSTOMER",
  ALL_PARTNERS: "PARTNER",
  ALL_ADMINS: "ADMIN",
};

export async function broadcastNotificationAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  await assertAdmin("notifications.broadcast");
  const parsed = notificationBroadcastSchema.safeParse({
    audience: form.get("audience"),
    title: form.get("title"),
    body: form.get("body"),
    link: form.get("link") ?? "",
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid request." };

  const count = await broadcastNotification({
    role: AUDIENCE_TO_ROLE[parsed.data.audience],
    title: parsed.data.title,
    body: parsed.data.body,
    link: parsed.data.link || undefined,
  });

  revalidatePath("/console/notifications");
  return { ok: true, message: `Sent to ${count} recipient${count === 1 ? "" : "s"}.` };
}

export async function markNotificationsReadAction(): Promise<void> {
  const actor = await assertAdmin();
  await markAllRead(actor.id);
  revalidatePath("/console", "layout");
}
