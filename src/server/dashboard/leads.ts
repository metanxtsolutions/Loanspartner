import "server-only";
import { createHash, randomUUID } from "node:crypto";
import type { WebsiteLeadKind, WebsiteLeadStatus } from "@prisma/client";
import { prisma } from "@/server/db";
import { hashPassword } from "@/server/auth/password";
import { logAudit } from "@/server/dashboard/audit";
import { notify } from "@/server/dashboard/notifications";
import { findOrInviteCustomer, generateReferralCode } from "@/server/dashboard/partners";
import { createApplication } from "@/server/dashboard/applications";

type Actor = { id: string; role: "ADMIN" };

export class LeadAlreadyConvertedError extends Error {
  constructor() {
    super("This lead has already been converted.");
    this.name = "LeadAlreadyConvertedError";
  }
}

export async function listWebsiteLeads(filter?: { kind?: WebsiteLeadKind; status?: WebsiteLeadStatus; search?: string }) {
  return prisma.websiteLead.findMany({
    where: {
      kind: filter?.kind,
      status: filter?.status,
      ...(filter?.search
        ? {
            OR: [
              { name: { contains: filter.search, mode: "insensitive" } },
              { email: { contains: filter.search, mode: "insensitive" } },
              { phone: { contains: filter.search } },
              { city: { contains: filter.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWebsiteLead(id: string) {
  return prisma.websiteLead.findUnique({ where: { id } });
}

export async function newWebsiteLeadCount() {
  return prisma.websiteLead.count({ where: { status: "NEW" } });
}

export async function updateWebsiteLead(id: string, data: { status?: WebsiteLeadStatus; internalNote?: string }, actor: Actor) {
  const lead = await prisma.websiteLead.update({ where: { id }, data });
  await logAudit({ actorUserId: actor.id, actorRole: actor.role, action: "website_lead.updated", entityType: "WebsiteLead", entityId: id, meta: data });
  return lead;
}

/**
 * Turns an enquiry or callback into a real customer account plus a submitted
 * application. Reuses the same invite flow a partner-sourced lead gets
 * (claim-account email, or attach to the existing account for that email).
 * Enquiries often arrive with only a phone number, so the admin confirms the
 * email in the convert form rather than it being read off the lead.
 */
export async function convertLeadToCustomer(
  params: { leadId: string; email: string; productSlug: string; requestedAmount: number; city: string },
  actor: Actor,
) {
  const lead = await prisma.websiteLead.findUniqueOrThrow({ where: { id: params.leadId } });
  if (lead.status === "CONVERTED") throw new LeadAlreadyConvertedError();

  const { user, invited } = await findOrInviteCustomer({
    name: lead.name ?? "Customer",
    email: params.email,
    phone: lead.phone ?? "",
    partnerName: "The LoansPartner team",
  });
  const application = await createApplication({
    customerId: user.id,
    productSlug: params.productSlug,
    requestedAmount: params.requestedAmount,
    city: params.city,
    submit: true,
  });

  await prisma.websiteLead.update({
    where: { id: lead.id },
    data: { status: "CONVERTED", email: params.email, convertedUserId: user.id, convertedApplicationId: application.id },
  });
  await logAudit({
    actorUserId: actor.id,
    actorRole: actor.role,
    action: "website_lead.converted_to_customer",
    entityType: "WebsiteLead",
    entityId: lead.id,
    meta: { userId: user.id, applicationId: application.id, invited },
  });
  return { user, application, invited };
}

/**
 * Turns a partner-interest submission into a pending partner account with a
 * claim-account invite, mirroring findOrInviteCustomer. Not registerPartner():
 * that one also creates a session, which would sign the admin in as the new
 * partner.
 */
export async function convertLeadToPartner(leadId: string, actor: Actor) {
  const lead = await prisma.websiteLead.findUniqueOrThrow({ where: { id: leadId } });
  if (lead.status === "CONVERTED") throw new LeadAlreadyConvertedError();
  if (!lead.email) throw new Error("This lead has no email address, so an account can't be created for it.");

  const existing = await prisma.user.findUnique({ where: { email: lead.email } });
  if (existing) {
    await prisma.websiteLead.update({ where: { id: lead.id }, data: { status: "CONVERTED", convertedUserId: existing.id } });
    await logAudit({ actorUserId: actor.id, actorRole: actor.role, action: "website_lead.linked_existing_user", entityType: "WebsiteLead", entityId: lead.id, meta: { userId: existing.id } });
    return { user: existing, invited: false };
  }

  const name = lead.name ?? "Partner";
  const user = await prisma.user.create({
    data: {
      email: lead.email,
      phone: lead.phone,
      name,
      role: "PARTNER",
      status: "PENDING_VERIFICATION",
      passwordHash: hashPassword(randomUUID()),
      partnerProfile: { create: { city: lead.city, referralCode: generateReferralCode(name) } },
    },
  });

  const tokenRaw = randomUUID();
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash: createHash("sha256").update(tokenRaw).digest("hex"),
      purpose: "claim_account",
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });
  await notify({
    userId: user.id,
    type: "ACCOUNT",
    title: "Your LoansPartner partner account is ready",
    body: `Thanks for your interest in partnering with LoansPartner. Set a password to activate your partner account and complete KYC: /claim-account?token=${tokenRaw}`,
    link: `/claim-account?token=${tokenRaw}`,
    email: user.email,
  });

  await prisma.websiteLead.update({ where: { id: lead.id }, data: { status: "CONVERTED", convertedUserId: user.id } });
  await logAudit({ actorUserId: actor.id, actorRole: actor.role, action: "website_lead.converted_to_partner", entityType: "WebsiteLead", entityId: lead.id, meta: { userId: user.id } });
  return { user, invited: true };
}
