"use server";

import { revalidatePath } from "next/cache";
import { partnerLeadSchema, documentUploadMetaSchema } from "@/lib/dashboard/schemas";
import { assertPartner, canAccessApplication } from "@/server/dashboard/access";
import { findOrInviteCustomer } from "@/server/dashboard/partners";
import { createApplication, addApplicationNote } from "@/server/dashboard/applications";
import { uploadDocument, StorageNotConfiguredError } from "@/server/dashboard/documents";
import { markAllRead } from "@/server/dashboard/notifications";
import { prisma } from "@/server/db";

const GENERIC_FORM_ERROR = "Please check the form and try again.";

export type LeadActionState = { ok: boolean; message?: string; invited?: boolean; applicationId?: string };

export async function submitLeadAction(_prev: LeadActionState, formData: FormData): Promise<LeadActionState> {
  const partner = await assertPartner();

  const parsed = partnerLeadSchema.safeParse({
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    product: formData.get("product"),
    requestedAmount: formData.get("requestedAmount"),
    city: formData.get("city"),
    note: formData.get("note"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? GENERIC_FORM_ERROR };

  const { user: customer, invited } = await findOrInviteCustomer({
    name: parsed.data.customerName,
    email: parsed.data.customerEmail,
    phone: parsed.data.customerPhone,
    partnerName: partner.name,
  });

  const application = await createApplication({
    customerId: customer.id,
    partnerId: partner.id,
    productSlug: parsed.data.product,
    requestedAmount: parsed.data.requestedAmount,
    city: parsed.data.city,
    submit: true,
  });

  if (parsed.data.note) {
    // Partner-authored notes are internal by default: never exposed to the customer.
    await addApplicationNote({ applicationId: application.id, authorUserId: partner.id, body: parsed.data.note, visibleToCustomer: false });
  }

  revalidatePath("/partners/leads");
  revalidatePath("/partners");

  return {
    ok: true,
    invited,
    applicationId: application.id,
    message: invited
      ? `${customer.name} is new to LoansPartner, so we've emailed them an invite to claim their account and track this application.`
      : `${customer.name} already has a LoansPartner account, so this application has been added to it.`,
  };
}

export type UploadState = { ok: boolean; message?: string };

/**
 * Shared by both /partners/documents (a partner's own KYC docs, no
 * applicationId) and /partners/leads/[id] (documents against a specific
 * lead). When an applicationId is supplied it's re-verified against this
 * partner: never trusted from the client alone.
 */
export async function uploadPartnerDocumentAction(_prev: UploadState, formData: FormData): Promise<UploadState> {
  const partner = await assertPartner();

  const parsed = documentUploadMetaSchema.safeParse({
    type: formData.get("type"),
    applicationId: formData.get("applicationId"),
  });
  if (!parsed.success) return { ok: false, message: "Select a document type." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Choose a file to upload." };

  if (parsed.data.applicationId) {
    const app = await prisma.loanApplication.findUnique({
      where: { id: parsed.data.applicationId },
      select: { customerId: true, partnerId: true },
    });
    if (!app || !canAccessApplication(partner, app)) return { ok: false, message: "You don't have access to that lead." };
  }

  try {
    await uploadDocument({
      ownerUserId: partner.id,
      applicationId: parsed.data.applicationId || null,
      type: parsed.data.type,
      file,
    });
  } catch (error) {
    if (error instanceof StorageNotConfiguredError) return { ok: false, message: error.message };
    if (error instanceof Error) return { ok: false, message: error.message };
    throw error;
  }

  revalidatePath("/partners/documents");
  if (parsed.data.applicationId) revalidatePath(`/partners/leads/${parsed.data.applicationId}`);

  return { ok: true, message: "Document uploaded." };
}

export type NoteActionState = { ok: boolean; message?: string };

export async function addLeadNoteAction(_prev: NoteActionState, formData: FormData): Promise<NoteActionState> {
  const partner = await assertPartner();

  const applicationId = String(formData.get("applicationId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!applicationId) return { ok: false, message: "Missing lead." };
  if (!body) return { ok: false, message: "Enter a note." };
  if (body.length > 1000) return { ok: false, message: "Notes are limited to 1000 characters." };

  const app = await prisma.loanApplication.findUnique({
    where: { id: applicationId },
    select: { customerId: true, partnerId: true },
  });
  if (!app || !canAccessApplication(partner, app)) return { ok: false, message: "You don't have access to that lead." };

  // Partners can't mark their own notes visible to the customer: that stays internal-only here.
  await addApplicationNote({ applicationId, authorUserId: partner.id, body, visibleToCustomer: false });

  revalidatePath(`/partners/leads/${applicationId}`);
  return { ok: true, message: "Note added." };
}

export async function markNotificationsReadAction() {
  const partner = await assertPartner();
  await markAllRead(partner.id);
  revalidatePath("/partners/notifications");
  revalidatePath("/partners");
}
