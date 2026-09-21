import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { prisma } from "@/server/db";
import { notify } from "@/server/dashboard/notifications";
import { logAudit } from "@/server/dashboard/audit";
import { hashPassword } from "@/server/auth/password";

export function generateReferralCode(name: string) {
  const base = name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 5)
    .padEnd(3, "X");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${base}${suffix}`;
}

export async function submitPartnerKyc(userId: string, params: {
  firmName?: string;
  panNumber?: string;
  gstNumber?: string;
  city: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
}) {
  const profile = await prisma.partnerProfile.update({
    where: { userId },
    data: {
      firmName: params.firmName || null,
      panNumber: params.panNumber || null,
      gstNumber: params.gstNumber || null,
      city: params.city,
      bankAccountName: params.bankAccountName || null,
      bankAccountNumber: params.bankAccountNumber || null,
      bankIfsc: params.bankIfsc || null,
      kycStatus: "PENDING_REVIEW",
    },
  });
  await logAudit({ actorUserId: userId, actorRole: "PARTNER", action: "partner.kyc_submitted", entityType: "PartnerProfile", entityId: profile.id });
  return profile;
}

export async function listPartnersForAdmin() {
  return prisma.user.findMany({
    where: { role: "PARTNER" },
    orderBy: { createdAt: "desc" },
    include: { partnerProfile: true, _count: { select: { applicationsAsPartner: true } } },
  });
}

export async function reviewPartnerKyc(params: { partnerId: string; decision: "APPROVED" | "REJECTED"; note?: string; actor: { id: string; role: "ADMIN" } }) {
  const user = await prisma.user.findUnique({ where: { id: params.partnerId } });
  if (!user) throw new Error("Partner not found");
  const profile = await prisma.partnerProfile.update({
    where: { userId: params.partnerId },
    data: {
      kycStatus: params.decision,
      kycNote: params.note || null,
      approvedByAdminId: params.decision === "APPROVED" ? params.actor.id : null,
      approvedAt: params.decision === "APPROVED" ? new Date() : null,
    },
  });
  if (params.decision === "APPROVED") {
    await prisma.user.update({ where: { id: params.partnerId }, data: { status: "ACTIVE" } });
  }
  await logAudit({ actorUserId: params.actor.id, actorRole: params.actor.role, action: "partner.kyc_reviewed", entityType: "PartnerProfile", entityId: profile.id, meta: { decision: params.decision } });
  await notify({
    userId: params.partnerId,
    type: "KYC_REVIEW",
    title: params.decision === "APPROVED" ? "Your partner KYC is approved" : "Your partner KYC needs attention",
    body: params.decision === "APPROVED" ? "You can now submit customer leads." : `We couldn't approve your KYC${params.note ? `: ${params.note}` : "."}`,
    link: "/partners/onboarding",
    email: user.email,
  });
  return profile;
}

/** Finds an existing customer by email, or creates a pending-verification account for a partner-sourced lead and emails them a claim link. */
export async function findOrInviteCustomer(params: { name: string; email: string; phone: string; partnerName: string }) {
  const existing = await prisma.user.findUnique({ where: { email: params.email } });
  if (existing) return { user: existing, invited: false };

  const tempPassword = randomUUID();
  const user = await prisma.user.create({
    data: {
      email: params.email,
      phone: params.phone,
      name: params.name,
      role: "CUSTOMER",
      status: "PENDING_VERIFICATION",
      passwordHash: hashPassword(tempPassword),
      customerProfile: { create: {} },
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
    title: "An application was started for you on LoansPartner",
    body: `${params.partnerName} submitted a loan enquiry on your behalf. Set a password to view and manage it: /claim-account?token=${tokenRaw}`,
    link: `/claim-account?token=${tokenRaw}`,
    email: user.email,
  });

  return { user, invited: true };
}
