import "server-only";
import { prisma } from "@/server/db";
import { productOption } from "@/data/lite";
import { notify } from "@/server/dashboard/notifications";
import { logAudit } from "@/server/dashboard/audit";

/**
 * Called when an application moves to DISBURSED. Uses the product's DSA
 * payout-from rate as the default (the conservative end of the published
 * band), unless the partner's profile carries a negotiated override. Admin
 * can adjust the entry afterwards from /console/commissions.
 */
export async function accrueCommissionForApplication(applicationId: string) {
  const app = await prisma.loanApplication.findUnique({ where: { id: applicationId }, include: { partner: { include: { partnerProfile: true } } } });
  if (!app || !app.partnerId || !app.sanctionedAmount) return null;

  const existing = await prisma.commissionEntry.findUnique({ where: { applicationId } });
  if (existing) return existing;

  const product = productOption(app.productSlug);
  const rate = app.partner?.partnerProfile?.commissionRateOverride ?? product?.payoutFrom ?? 0;
  const amount = Math.round((app.sanctionedAmount * rate) / 100);

  const entry = await prisma.commissionEntry.create({
    data: { partnerId: app.partnerId, applicationId: app.id, baseAmount: app.sanctionedAmount, rate, amount, status: "ACCRUED" },
  });

  await notify({
    userId: app.partnerId,
    type: "COMMISSION",
    title: `Commission accrued for ${app.code}`,
    body: `₹${amount.toLocaleString("en-IN")} has accrued on ${app.code}, pending approval.`,
    link: "/partners/earnings",
    email: app.partner?.email,
  });

  return entry;
}

export async function listCommissionsForPartner(partnerId: string) {
  return prisma.commissionEntry.findMany({
    where: { partnerId },
    orderBy: { createdAt: "desc" },
    include: { application: { select: { code: true, productSlug: true } } },
  });
}

export async function listCommissionsForAdmin() {
  return prisma.commissionEntry.findMany({
    orderBy: { createdAt: "desc" },
    include: { application: { select: { code: true, productSlug: true } }, partner: { select: { name: true, email: true } } },
  });
}

export async function setCommissionStatus(id: string, status: "APPROVED" | "DISPUTED" | "VOID", actor: { id: string; role: "ADMIN" }) {
  const entry = await prisma.commissionEntry.update({ where: { id }, data: { status } });
  await logAudit({ actorUserId: actor.id, actorRole: actor.role, action: "commission.status_changed", entityType: "CommissionEntry", entityId: id, meta: { status } });
  return entry;
}

export async function createPayout(partnerId: string, commissionEntryIds: string[]) {
  const entries = await prisma.commissionEntry.findMany({ where: { id: { in: commissionEntryIds }, partnerId, status: { in: ["ACCRUED", "APPROVED"] } } });
  if (entries.length === 0) throw new Error("No eligible commission entries selected");
  const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0);
  const payout = await prisma.payout.create({
    data: {
      partnerId,
      periodLabel: new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date()),
      totalAmount,
      status: "PENDING",
      entries: { connect: entries.map((e) => ({ id: e.id })) },
    },
  });
  await prisma.commissionEntry.updateMany({ where: { id: { in: entries.map((e) => e.id) } }, data: { status: "APPROVED" } });
  return payout;
}

export async function markPayoutPaid(payoutId: string, reference: string, actor: { id: string }) {
  const payout = await prisma.payout.update({
    where: { id: payoutId },
    data: { status: "PAID", reference, processedByAdminId: actor.id, processedAt: new Date() },
    include: { entries: true, partner: true },
  });
  await prisma.commissionEntry.updateMany({ where: { payoutId }, data: { status: "PAID" } });
  await notify({
    userId: payout.partnerId,
    type: "PAYOUT",
    title: `Payout of ₹${payout.totalAmount.toLocaleString("en-IN")} processed`,
    body: `Your ${payout.periodLabel} payout has been paid. Reference: ${reference}.`,
    link: "/partners/earnings",
    email: payout.partner.email,
  });
  return payout;
}

export async function listPayoutsForPartner(partnerId: string) {
  return prisma.payout.findMany({ where: { partnerId }, orderBy: { createdAt: "desc" }, include: { entries: true } });
}

export async function listPayoutsForAdmin() {
  return prisma.payout.findMany({ orderBy: { createdAt: "desc" }, include: { entries: true, partner: { select: { name: true, email: true } } } });
}
