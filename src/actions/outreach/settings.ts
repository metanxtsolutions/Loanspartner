"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/server/outreach/auth";
import { updateSetting } from "@/server/outreach/settings";
import { logActivity } from "@/server/outreach/activity";

export type ActionResult = { ok: boolean; message?: string };

const settingsSchema = z.object({
  dailySendLimit: z.coerce.number().int().min(1).max(500),
  sendDelaySeconds: z.coerce.number().int().min(0).max(3600),
  followUpDays: z.string().trim().min(1),
  autoSendFollowUps: z.literal("on").optional(),
  paused: z.literal("on").optional(),
});

export async function saveSettingsAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { ok: false, message: "Check the values and try again." };
  const followUpDays = parsed.data.followUpDays
    .split(",")
    .map((d) => Number(d.trim()))
    .filter((d) => Number.isFinite(d) && d > 0);
  if (!followUpDays.length) return { ok: false, message: "Follow-up days must be a comma-separated list of positive numbers, e.g. 4, 9, 16." };

  await updateSetting("dailySendLimit", parsed.data.dailySendLimit);
  await updateSetting("sendDelaySeconds", parsed.data.sendDelaySeconds);
  await updateSetting("followUpDays", followUpDays);
  await updateSetting("autoSendFollowUps", parsed.data.autoSendFollowUps === "on");
  await updateSetting("paused", parsed.data.paused === "on");
  await logActivity({ actor, action: "settings.updated", meta: { ...parsed.data, followUpDays } });
  revalidatePath("/admin/outreach/settings");
  return { ok: true, message: "Settings saved." };
}
