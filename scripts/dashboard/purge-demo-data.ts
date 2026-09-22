/**
 * Removes everything scripts/dashboard/seed-demo.ts created, and nothing
 * else: the five demo customer/partner accounts, every application they are
 * on (as customer or partner, plus any LP-DEMO- coded one), their documents,
 * placeholder documents, the demo commission and payout, and the audit-log
 * lines about any of those. The seeded admin account is kept because it is
 * the console login in use; rename it from /console/settings if you like.
 *
 *   pnpm dashboard:purge-demo
 *
 * Prints what it is about to delete, then deletes it in one transaction.
 * Idempotent: a second run finds nothing and deletes nothing. Files those
 * documents pointed at in Vercel Blob are not touched (that needs
 * BLOB_READ_WRITE_TOKEN); they are unreachable once the rows are gone.
 */
import { PrismaClient } from "@prisma/client";

const DEMO_EMAILS = [
  "customer1@loanspartner.in",
  "customer2@loanspartner.in",
  "customer3@loanspartner.in",
  "partner.approved@loanspartner.in",
  "partner.pending@loanspartner.in",
];

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ where: { email: { in: DEMO_EMAILS } }, select: { id: true, email: true } });
  const userIds = users.map((u) => u.id);

  const apps = await prisma.loanApplication.findMany({
    where: { OR: [{ customerId: { in: userIds } }, { partnerId: { in: userIds } }, { code: { startsWith: "LP-DEMO-" } }] },
    select: { id: true, code: true },
  });
  const appIds = apps.map((a) => a.id);

  const docs = await prisma.document.findMany({
    where: { OR: [{ ownerUserId: { in: userIds } }, { applicationId: { in: appIds } }, { fileUrl: { startsWith: "https://placehold.co/" } }] },
    select: { id: true, fileName: true },
  });
  const docIds = docs.map((d) => d.id);

  const payouts = await prisma.payout.findMany({ where: { partnerId: { in: userIds } }, select: { id: true } });
  const payoutIds = payouts.map((p) => p.id);

  console.log("Users:", users.map((u) => u.email).join(", ") || "none");
  console.log("Applications:", apps.map((a) => a.code).join(", ") || "none");
  console.log("Documents:", docs.map((d) => d.fileName).join(", ") || "none");
  console.log("Payouts:", payoutIds.length);

  if (!userIds.length && !appIds.length && !docIds.length && !payoutIds.length) {
    console.log("\nNothing to purge.");
    return;
  }

  // Eight round-trips through Neon's pooler comfortably exceed Prisma's
  // default 5 s interactive-transaction timeout.
  const result = await prisma.$transaction(async (tx) => ({
    commissions: (await tx.commissionEntry.deleteMany({ where: { OR: [{ partnerId: { in: userIds } }, { applicationId: { in: appIds } }, { payoutId: { in: payoutIds } }] } })).count,
    payouts: (await tx.payout.deleteMany({ where: { id: { in: payoutIds } } })).count,
    documents: (await tx.document.deleteMany({ where: { id: { in: docIds } } })).count,
    notes: (await tx.applicationNote.deleteMany({ where: { OR: [{ applicationId: { in: appIds } }, { authorUserId: { in: userIds } }] } })).count,
    statusEvents: (await tx.applicationStatusEvent.deleteMany({ where: { OR: [{ applicationId: { in: appIds } }, { actorUserId: { in: userIds } }] } })).count,
    applications: (await tx.loanApplication.deleteMany({ where: { id: { in: appIds } } })).count,
    auditLogs: (await tx.auditLog.deleteMany({ where: { OR: [{ actorUserId: { in: userIds } }, { entityId: { in: [...userIds, ...appIds, ...docIds, ...payoutIds] } }] } })).count,
    // Profiles, notifications and tokens cascade from the user row.
    users: (await tx.user.deleteMany({ where: { id: { in: userIds } } })).count,
  }), { timeout: 60_000 });

  console.log("\nDeleted:", result);
  console.log("Remaining:", {
    users: await prisma.user.count(),
    applications: await prisma.loanApplication.count(),
    documents: await prisma.document.count(),
    websiteLeads: await prisma.websiteLead.count(),
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
