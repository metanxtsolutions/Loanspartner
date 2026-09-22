"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/server/dashboard/access";
import { convertLeadToCustomer, convertLeadToPartner, updateWebsiteLead } from "@/server/dashboard/leads";
import { leadConvertCustomerSchema, leadConvertPartnerSchema, leadNoteSchema, leadStatusChangeSchema } from "@/lib/dashboard/schemas";

export type ActionResult = { ok: boolean; message?: string; applicationId?: string; userId?: string };

function revalidateLead(leadId: string) {
  revalidatePath("/console");
  revalidatePath("/console/leads");
  revalidatePath(`/console/leads/${leadId}`);
}

export async function setLeadStatusAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("leads.manage");
  const parsed = leadStatusChangeSchema.safeParse({ leadId: form.get("leadId"), status: form.get("status") });
  if (!parsed.success) return { ok: false, message: "Invalid request." };
  await updateWebsiteLead(parsed.data.leadId, { status: parsed.data.status }, { id: actor.id, role: "ADMIN" });
  revalidateLead(parsed.data.leadId);
  return { ok: true, message: "Status updated." };
}

export async function saveLeadNoteAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("leads.manage");
  const parsed = leadNoteSchema.safeParse({ leadId: form.get("leadId"), internalNote: form.get("internalNote") ?? "" });
  if (!parsed.success) return { ok: false, message: "Note is too long (2000 characters max)." };
  await updateWebsiteLead(parsed.data.leadId, { internalNote: parsed.data.internalNote }, { id: actor.id, role: "ADMIN" });
  revalidateLead(parsed.data.leadId);
  return { ok: true, message: "Note saved." };
}

export async function convertLeadToCustomerAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("leads.manage");
  const parsed = leadConvertCustomerSchema.safeParse({
    leadId: form.get("leadId"),
    email: form.get("email"),
    product: form.get("product"),
    requestedAmount: form.get("requestedAmount"),
    city: form.get("city"),
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, message: first?.message ?? "Check the form and try again." };
  }
  try {
    const { application, invited } = await convertLeadToCustomer(
      {
        leadId: parsed.data.leadId,
        email: parsed.data.email,
        productSlug: parsed.data.product,
        requestedAmount: parsed.data.requestedAmount,
        city: parsed.data.city,
      },
      { id: actor.id, role: "ADMIN" },
    );
    revalidateLead(parsed.data.leadId);
    revalidatePath("/console/applications");
    revalidatePath("/console/users");
    return {
      ok: true,
      applicationId: application.id,
      message: invited
        ? `Application ${application.code} created. We've emailed the customer an invite to claim their account.`
        : `Application ${application.code} added to the customer's existing account.`,
    };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Could not convert this lead." };
  }
}

export async function convertLeadToPartnerAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("leads.manage");
  const parsed = leadConvertPartnerSchema.safeParse({ leadId: form.get("leadId") });
  if (!parsed.success) return { ok: false, message: "Invalid request." };
  try {
    const { user, invited } = await convertLeadToPartner(parsed.data.leadId, { id: actor.id, role: "ADMIN" });
    revalidateLead(parsed.data.leadId);
    revalidatePath("/console/partners");
    revalidatePath("/console/users");
    return {
      ok: true,
      userId: user.id,
      message: invited
        ? "Partner account created. We've emailed them an invite to set a password and complete KYC."
        : "This email already has an account; the lead has been linked to it.",
    };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Could not convert this lead." };
  }
}
