"use server";

import { revalidatePath } from "next/cache";
import type { DocumentType } from "@prisma/client";
import { assertCustomer, canAccessApplication } from "@/server/dashboard/access";
import { createApplication } from "@/server/dashboard/applications";
import { uploadDocument, StorageNotConfiguredError } from "@/server/dashboard/documents";
import { markAllRead } from "@/server/dashboard/notifications";
import { applicationCreateSchema, documentUploadMetaSchema } from "@/lib/dashboard/schemas";
import { prisma } from "@/server/db";

export type ApplicationFormState = { ok: boolean; message?: string; applicationId?: string };

export async function createApplicationAction(_prev: ApplicationFormState, formData: FormData): Promise<ApplicationFormState> {
  const actor = await assertCustomer();

  const parsed = applicationCreateSchema.safeParse({
    product: formData.get("product"),
    requestedAmount: formData.get("requestedAmount"),
    city: formData.get("city"),
    employmentType: formData.get("employmentType"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form for errors." };

  const app = await createApplication({
    customerId: actor.id,
    productSlug: parsed.data.product,
    requestedAmount: parsed.data.requestedAmount,
    city: parsed.data.city,
    employmentType: parsed.data.employmentType || undefined,
    submit: true,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/applications");
  return { ok: true, applicationId: app.id };
}

export type UploadState = { ok: boolean; message?: string };

export async function uploadDocumentAction(_prev: UploadState, formData: FormData): Promise<UploadState> {
  const actor = await assertCustomer();

  const parsedMeta = documentUploadMetaSchema.safeParse({
    type: formData.get("type"),
    applicationId: formData.get("applicationId"),
  });
  if (!parsedMeta.success) return { ok: false, message: parsedMeta.error.issues[0]?.message ?? "Choose a document type." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose a file to upload." };

  const applicationId = parsedMeta.data.applicationId || undefined;

  // Never trust a client-submitted applicationId: re-check ownership fresh, server-side.
  if (applicationId) {
    const app = await prisma.loanApplication.findUnique({ where: { id: applicationId }, select: { customerId: true, partnerId: true } });
    if (!app || !canAccessApplication(actor, app)) return { ok: false, message: "You don't have access to that application." };
  }

  try {
    await uploadDocument({ ownerUserId: actor.id, applicationId, type: parsedMeta.data.type as DocumentType, file });
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) return { ok: false, message: error.message };
    if (error instanceof Error) return { ok: false, message: error.message };
    throw error;
  }

  revalidatePath("/dashboard/documents");
  if (applicationId) revalidatePath(`/dashboard/applications/${applicationId}`);
  return { ok: true, message: "Document uploaded." };
}

/** Zero-arg so it can be passed straight into DashboardShell's markAllReadAction prop. Re-derives the actor server-side rather than trusting any client id. */
export async function markNotificationsReadAction(): Promise<void> {
  const actor = await assertCustomer();
  await markAllRead(actor.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/notifications");
}
