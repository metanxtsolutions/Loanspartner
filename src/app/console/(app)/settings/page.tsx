import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, assertAdmin } from "@/server/dashboard/access";
import { prisma } from "@/server/db";
import { PageHeader } from "@/components/dashboard/page-header";

export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };

const SETTING_KEY = "default_commission_rate_note";
const noteSchema = z.object({ note: z.string().trim().max(500) });

/**
 * Inline server action rather than a separate file under src/actions/console:
 * the settings page is intentionally the lightest section here (a single
 * key/value note backed by PlatformSetting), so it carries its own action
 * instead of a dedicated actions module.
 */
async function saveSettingsNoteAction(formData: FormData) {
  "use server";
  await assertAdmin("settings.manage");
  const parsed = noteSchema.safeParse({ note: formData.get("note") });
  if (!parsed.success) return;
  await prisma.platformSetting.upsert({
    where: { key: SETTING_KEY },
    create: { key: SETTING_KEY, value: { note: parsed.data.note } },
    update: { value: { note: parsed.data.note } },
  });
  revalidatePath("/console/settings");
}

export default async function ConsoleSettingsPage() {
  await requireAdmin("settings.manage");
  const setting = await prisma.platformSetting.findUnique({ where: { key: SETTING_KEY } });
  const currentNote = setting?.value && typeof setting.value === "object" && "note" in setting.value ? String((setting.value as { note: unknown }).note ?? "") : "";

  return (
    <div>
      <PageHeader title="Settings" subtitle="Light-touch platform settings. More will move here as the console grows." />

      <section className="border-line max-w-xl border p-5">
        <h2 className="text-ink-950 mb-1 text-sm font-bold tracking-wide uppercase">Default commission rate note</h2>
        <p className="text-mute mb-4 text-sm">
          An internal reminder shown to Finance about the default DSA commission approach. This does not change any published rate: those live in the
          product catalog.
        </p>
        <form action={saveSettingsNoteAction} className="flex flex-col gap-3">
          <textarea name="note" rows={4} defaultValue={currentNote} className="field" placeholder="e.g. Default to the product's payoutFrom rate unless a partner has a negotiated override." />
          <button type="submit" className="bg-ink-900 hover:bg-ink-800 self-start px-4 py-2 text-sm font-semibold text-white transition">
            Save
          </button>
        </form>
      </section>
    </div>
  );
}
