"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdmin } from "@/server/dashboard/access";
import { setCommissionStatus, createPayout, markPayoutPaid } from "@/server/dashboard/commissions";
import { payoutCreateSchema, payoutMarkPaidSchema } from "@/lib/dashboard/schemas";

export type ActionResult = { ok: boolean; message?: string };

const commissionStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["APPROVED", "DISPUTED", "VOID"]),
});

export async function setCommissionStatusAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("commissions.manage");
  const parsed = commissionStatusSchema.safeParse({ id: form.get("id"), status: form.get("status") });
  if (!parsed.success) return { ok: false, message: "Invalid request." };

  await setCommissionStatus(parsed.data.id, parsed.data.status, { id: actor.id, role: "ADMIN" });
  revalidatePath("/console/commissions");
  return { ok: true, message: "Commission entry updated." };
}

export async function createPayoutAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  await assertAdmin("payouts.manage");
  const commissionEntryIds = form.getAll("commissionEntryIds").map(String);
  const parsed = payoutCreateSchema.safeParse({ partnerId: form.get("partnerId"), commissionEntryIds });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid request." };

  try {
    await createPayout(parsed.data.partnerId, parsed.data.commissionEntryIds);
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Could not create the payout." };
  }

  revalidatePath("/console/payouts");
  revalidatePath("/console/commissions");
  return { ok: true, message: "Payout created." };
}

/**
 * Records that the admin has already paid the partner outside this system
 * (via their own banking): this does not move any money itself.
 */
export async function markPayoutPaidAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("payouts.manage");
  const parsed = payoutMarkPaidSchema.safeParse({ payoutId: form.get("payoutId"), reference: form.get("reference") });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid request." };

  await markPayoutPaid(parsed.data.payoutId, parsed.data.reference, { id: actor.id });
  revalidatePath("/console/payouts");
  return { ok: true, message: "Payout marked as paid." };
}
