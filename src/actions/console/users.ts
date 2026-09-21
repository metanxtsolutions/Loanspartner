"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertAdmin } from "@/server/dashboard/access";
import { setUserStatus, setAdminRole } from "@/server/dashboard/users";
import { adminRoleChangeSchema } from "@/lib/dashboard/schemas";

export type ActionResult = { ok: boolean; message?: string };

const userStatusSchema = z.object({
  userId: z.string().min(1),
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

export async function setUserStatusAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("users.manage");
  const parsed = userStatusSchema.safeParse({ userId: form.get("userId"), status: form.get("status") });
  if (!parsed.success) return { ok: false, message: "Invalid request." };

  await setUserStatus(parsed.data.userId, parsed.data.status, { id: actor.id, role: "ADMIN" });
  revalidatePath("/console/users");
  return { ok: true, message: parsed.data.status === "ACTIVE" ? "Account activated." : "Account suspended." };
}

/**
 * Reassigns an admin's AdminRole. Gated with "roles.manage" here, not just
 * "users.manage": only a SUPER_ADMIN may grant or change admin permissions,
 * and that must hold even if this action is invoked directly.
 */
export async function setAdminRoleAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("roles.manage");
  const parsed = adminRoleChangeSchema.safeParse({ userId: form.get("userId"), adminRole: form.get("adminRole") });
  if (!parsed.success) return { ok: false, message: "Invalid request." };

  await setAdminRole(parsed.data.userId, parsed.data.adminRole, { id: actor.id, role: "ADMIN" });
  revalidatePath("/console/roles");
  return { ok: true, message: "Admin role updated." };
}
