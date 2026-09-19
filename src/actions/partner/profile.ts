"use server";

import { revalidatePath } from "next/cache";
import { partnerKycSchema, profileUpdateSchema, passwordChangeSchema } from "@/lib/dashboard/schemas";
import { assertPartner } from "@/server/dashboard/access";
import { submitPartnerKyc } from "@/server/dashboard/partners";
import { changePassword, InvalidCredentialsError } from "@/server/dashboard/auth";
import { prisma } from "@/server/db";

const GENERIC_FORM_ERROR = "Please check the form and try again.";

export type ProfileActionState = { ok: boolean; message?: string };

export async function submitKycAction(_prev: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const partner = await assertPartner();

  const parsed = partnerKycSchema.safeParse({
    firmName: formData.get("firmName"),
    panNumber: formData.get("panNumber"),
    gstNumber: formData.get("gstNumber"),
    city: formData.get("city"),
    bankAccountName: formData.get("bankAccountName"),
    bankAccountNumber: formData.get("bankAccountNumber"),
    bankIfsc: formData.get("bankIfsc"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? GENERIC_FORM_ERROR };

  await submitPartnerKyc(partner.id, {
    firmName: parsed.data.firmName || undefined,
    panNumber: parsed.data.panNumber || undefined,
    gstNumber: parsed.data.gstNumber || undefined,
    city: parsed.data.city,
    bankAccountName: parsed.data.bankAccountName || undefined,
    bankAccountNumber: parsed.data.bankAccountNumber || undefined,
    bankIfsc: parsed.data.bankIfsc || undefined,
  });

  revalidatePath("/partners/onboarding");
  revalidatePath("/partners/settings");
  revalidatePath("/partners");

  return { ok: true, message: "KYC details submitted for review." };
}

export async function updateProfileAction(_prev: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const partner = await assertPartner();

  const parsed = profileUpdateSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    city: formData.get("city"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? GENERIC_FORM_ERROR };

  await prisma.user.update({ where: { id: partner.id }, data: { name: parsed.data.name, phone: parsed.data.phone } });
  if (parsed.data.city) {
    await prisma.partnerProfile.update({ where: { userId: partner.id }, data: { city: parsed.data.city } });
  }

  revalidatePath("/partners/settings");
  revalidatePath("/partners");

  return { ok: true, message: "Profile updated." };
}

export async function changePasswordAction(_prev: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const partner = await assertPartner();

  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? GENERIC_FORM_ERROR };

  try {
    await changePassword(partner.id, parsed.data.currentPassword, parsed.data.newPassword);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) return { ok: false, message: "Your current password is incorrect." };
    throw error;
  }

  return { ok: true, message: "Password changed." };
}
