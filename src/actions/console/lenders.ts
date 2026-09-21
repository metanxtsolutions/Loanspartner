"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/server/dashboard/access";
import { setLenderAcceptingApplications } from "@/server/dashboard/lenders";
import { lenderOpsToggleSchema } from "@/lib/dashboard/schemas";

export type ActionResult = { ok: boolean; message?: string };

export async function setLenderOpsAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("lenders.manage");
  const parsed = lenderOpsToggleSchema.safeParse({
    lenderSlug: form.get("lenderSlug"),
    isAcceptingApplications: form.get("isAcceptingApplications"),
    internalNote: form.get("internalNote") ?? "",
  });
  if (!parsed.success) return { ok: false, message: "Invalid request." };

  await setLenderAcceptingApplications({
    lenderSlug: parsed.data.lenderSlug,
    isAcceptingApplications: parsed.data.isAcceptingApplications,
    internalNote: parsed.data.internalNote || undefined,
    actor: { id: actor.id, role: "ADMIN" },
  });

  revalidatePath("/console/lenders");
  return { ok: true, message: "Lender status updated." };
}
