"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/server/dashboard/access";
import { reviewPartnerKyc } from "@/server/dashboard/partners";
import { kycReviewSchema } from "@/lib/dashboard/schemas";

export type ActionResult = { ok: boolean; message?: string };

export async function reviewPartnerKycAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("partners.review_kyc");
  const parsed = kycReviewSchema.safeParse({
    partnerId: form.get("partnerId"),
    decision: form.get("decision"),
    note: form.get("note") ?? "",
  });
  if (!parsed.success) return { ok: false, message: "Invalid request." };

  try {
    await reviewPartnerKyc({
      partnerId: parsed.data.partnerId,
      decision: parsed.data.decision,
      note: parsed.data.note || undefined,
      actor: { id: actor.id, role: "ADMIN" },
    });
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Could not review this partner." };
  }

  revalidatePath("/console/partners");
  return { ok: true, message: parsed.data.decision === "APPROVED" ? "Partner KYC approved." : "Partner KYC rejected." };
}
