"use server";

import { revalidatePath } from "next/cache";
import { assertCustomer } from "@/server/dashboard/access";
import { changePassword, InvalidCredentialsError } from "@/server/dashboard/auth";
import { profileUpdateSchema, passwordChangeSchema } from "@/lib/dashboard/schemas";
import { prisma } from "@/server/db";

export type ProfileFormState = { ok: boolean; message?: string };

export async function updateProfileAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const actor = await assertCustomer();

  const parsed = profileUpdateSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    city: formData.get("city"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form for errors." };

  // No dedicated service helper exists for a customer profile edit, so this updates the actor's own row directly: always scoped by the server-derived actor.id, never a client-submitted id.
  await prisma.user.update({ where: { id: actor.id }, data: { name: parsed.data.name, phone: parsed.data.phone } });
  await prisma.customerProfile.upsert({
    where: { userId: actor.id },
    update: { city: parsed.data.city || null },
    create: { userId: actor.id, city: parsed.data.city || null },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true, message: "Profile updated." };
}

export async function changePasswordAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const actor = await assertCustomer();

  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form for errors." };

  try {
    await changePassword(actor.id, parsed.data.currentPassword, parsed.data.newPassword);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) return { ok: false, message: "Current password is incorrect." };
    throw error;
  }

  return { ok: true, message: "Password changed." };
}
