import "server-only";
import { prisma } from "@/server/outreach/db";

export type OutreachSettings = {
  dailySendLimit: number;
  sendDelaySeconds: number;
  followUpDays: number[];
  autoSendFollowUps: boolean;
  paused: boolean;
};

const parseFollowUpDays = (raw: string | undefined, fallback: number[]) => {
  if (!raw) return fallback;
  const days = raw
    .split(",")
    .map((d) => Number(d.trim()))
    .filter((d) => Number.isFinite(d) && d > 0);
  return days.length ? days : fallback;
};

function envDefaults(): OutreachSettings {
  return {
    dailySendLimit: Number(process.env.OUTREACH_DAILY_SEND_LIMIT ?? 40),
    sendDelaySeconds: Number(process.env.OUTREACH_SEND_DELAY_SECONDS ?? 45),
    followUpDays: parseFollowUpDays(process.env.OUTREACH_FOLLOWUP_DAYS, [4, 9, 16]),
    autoSendFollowUps: false,
    paused: false,
  };
}

/**
 * Settings start from env defaults and can be overridden at runtime from the
 * settings page, stored one row per key in the Setting table. This lets an
 * admin flip the global "paused" kill switch without a redeploy.
 */
export async function getSettings(): Promise<OutreachSettings> {
  const defaults = envDefaults();
  const rows = await prisma.setting.findMany({ where: { key: { in: ["dailySendLimit", "sendDelaySeconds", "followUpDays", "autoSendFollowUps", "paused"] } } });
  const overrides = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    dailySendLimit: typeof overrides.dailySendLimit === "number" ? overrides.dailySendLimit : defaults.dailySendLimit,
    sendDelaySeconds: typeof overrides.sendDelaySeconds === "number" ? overrides.sendDelaySeconds : defaults.sendDelaySeconds,
    followUpDays: Array.isArray(overrides.followUpDays) ? (overrides.followUpDays as number[]) : defaults.followUpDays,
    autoSendFollowUps: typeof overrides.autoSendFollowUps === "boolean" ? overrides.autoSendFollowUps : defaults.autoSendFollowUps,
    paused: typeof overrides.paused === "boolean" ? overrides.paused : defaults.paused,
  };
}

export async function updateSetting(key: keyof OutreachSettings, value: OutreachSettings[keyof OutreachSettings]) {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: value as never },
    update: { value: value as never },
  });
}
