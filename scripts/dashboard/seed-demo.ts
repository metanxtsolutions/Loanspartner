/**
 * Populates the dashboard platform (customer/partner/admin) with realistic
 * demo data so the three apps are worth looking at the moment you log in:
 * one admin, two partners (one KYC-approved, one pending), three customers,
 * and applications spread across the pipeline including a fully disbursed
 * one with an accrued, approved and paid-out commission.
 *
 * Talks to Prisma directly rather than through src/server/dashboard/* (those
 * modules are guarded with `import "server-only"`, which throws outside a
 * Next.js server-component build — the same reason scripts/outreach/*.ts
 * import a plain, unguarded prisma client instead). Side effects that the
 * real service layer would trigger (emails, in-app notifications) are
 * intentionally skipped here: this is data, not a live workflow run.
 *
 *   pnpm dashboard:seed
 *
 * Safe to run repeatedly: upserts every user by email, and only creates the
 * demo applications once (skipped if any already exist with the sentinel
 * `LP-DEMO-` code prefix).
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/server/auth/password";
import { products } from "@/data/products";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Passw0rd!2026";

async function upsertUser(params: {
  email: string;
  name: string;
  phone: string;
  role: "CUSTOMER" | "PARTNER" | "ADMIN";
  adminRole?: "SUPER_ADMIN" | "OPS" | "FINANCE" | "SUPPORT";
  status?: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
}) {
  return prisma.user.upsert({
    where: { email: params.email },
    create: {
      email: params.email,
      name: params.name,
      phone: params.phone,
      role: params.role,
      adminRole: params.adminRole,
      status: params.status ?? "ACTIVE",
      passwordHash: hashPassword(DEMO_PASSWORD),
      emailVerifiedAt: new Date(),
    },
    update: {},
  });
}

async function main() {
  console.log("Seeding dashboard platform demo data...\n");

  const admin = await upsertUser({ email: "admin@loanspartner.in", name: "Asha Rao", phone: "9800000001", role: "ADMIN", adminRole: "SUPER_ADMIN" });

  const partnerApproved = await upsertUser({ email: "partner.approved@loanspartner.in", name: "Vikram Shah", phone: "9800000002", role: "PARTNER" });
  await prisma.partnerProfile.upsert({
    where: { userId: partnerApproved.id },
    create: { userId: partnerApproved.id, firmName: "Shah Financial Services", city: "Ahmedabad", referralCode: "VIKRA1234", kycStatus: "APPROVED", approvedByAdminId: admin.id, approvedAt: new Date(), panNumber: "ABCPS1234F", bankAccountName: "Vikram Shah", bankAccountNumber: "000123456789", bankIfsc: "HDFC0000123" },
    update: {},
  });

  const partnerPending = await upsertUser({ email: "partner.pending@loanspartner.in", name: "Neha Kulkarni", phone: "9800000003", role: "PARTNER" });
  await prisma.partnerProfile.upsert({
    where: { userId: partnerPending.id },
    create: { userId: partnerPending.id, firmName: "Kulkarni Loan Consultancy", city: "Pune", referralCode: "NEHAK5678", kycStatus: "PENDING_REVIEW", panNumber: "XYZPK5678G" },
    update: {},
  });

  const customer1 = await upsertUser({ email: "customer1@loanspartner.in", name: "Rohit Mehta", phone: "9800000011", role: "CUSTOMER" });
  await prisma.customerProfile.upsert({ where: { userId: customer1.id }, create: { userId: customer1.id, city: "Mumbai", employmentType: "salaried" }, update: {} });

  const customer2 = await upsertUser({ email: "customer2@loanspartner.in", name: "Priya Nair", phone: "9800000012", role: "CUSTOMER" });
  await prisma.customerProfile.upsert({ where: { userId: customer2.id }, create: { userId: customer2.id, city: "Bengaluru", employmentType: "self-employed" }, update: {} });

  const customer3 = await upsertUser({ email: "customer3@loanspartner.in", name: "Arjun Verma", phone: "9800000013", role: "CUSTOMER" });
  await prisma.customerProfile.upsert({ where: { userId: customer3.id }, create: { userId: customer3.id, city: "Delhi", employmentType: "salaried" }, update: {} });

  const alreadySeeded = await prisma.loanApplication.findFirst({ where: { code: { startsWith: "LP-DEMO-" } } });
  if (alreadySeeded) {
    console.log("Demo applications already exist (LP-DEMO- prefix found), skipping application/commission seeding.\n");
    await printCredentials();
    return;
  }

  const personalLoan = products.find((p) => p.slug === "personal-loan")!;
  const homeLoan = products.find((p) => p.slug === "home-loan")!;
  const businessLoan = products.find((p) => p.slug === "business-loan")!;

  // App 1: self-serve draft, never submitted.
  await prisma.loanApplication.create({
    data: { code: "LP-DEMO-000001", customerId: customer1.id, productSlug: personalLoan.slug, requestedAmount: 300_000, city: "Mumbai", status: "DRAFT" },
  });

  // App 2: partner-sourced, stalled on documents.
  const app2 = await createWithTimeline({
    code: "LP-DEMO-000002",
    customerId: customer2.id,
    partnerId: partnerApproved.id,
    productSlug: homeLoan.slug,
    requestedAmount: 4_500_000,
    city: "Bengaluru",
    steps: ["SUBMITTED", "UNDER_REVIEW", "DOCS_REQUIRED"],
  });
  await prisma.applicationNote.create({ data: { applicationId: app2.id, authorUserId: admin.id, body: "Please upload the last 6 months' bank statement and Form 16.", visibleToCustomer: true } });

  // App 3: partner-sourced, with the lender.
  await createWithTimeline({
    code: "LP-DEMO-000003",
    customerId: customer3.id,
    partnerId: partnerApproved.id,
    productSlug: businessLoan.slug,
    requestedAmount: 1_500_000,
    city: "Delhi",
    steps: ["SUBMITTED", "UNDER_REVIEW", "LENDER_MATCHING", "SENT_TO_LENDER", "LENDER_REVIEW"],
    assignedLenderSlug: "hdfc-bank",
  });

  // App 4: partner-sourced, fully disbursed — generates a commission.
  const app4 = await createWithTimeline({
    code: "LP-DEMO-000004",
    customerId: customer1.id,
    partnerId: partnerApproved.id,
    productSlug: personalLoan.slug,
    requestedAmount: 800_000,
    city: "Mumbai",
    steps: ["SUBMITTED", "UNDER_REVIEW", "LENDER_MATCHING", "SENT_TO_LENDER", "LENDER_REVIEW", "APPROVED", "SANCTIONED", "DISBURSED"],
    assignedLenderSlug: "icici-bank",
    sanctionedAmount: 750_000,
  });

  const commissionAmount = Math.round((750_000 * personalLoan.dsa.payoutFrom) / 100);
  const commission = await prisma.commissionEntry.create({
    data: { partnerId: partnerApproved.id, applicationId: app4.id, baseAmount: 750_000, rate: personalLoan.dsa.payoutFrom, amount: commissionAmount, status: "APPROVED" },
  });
  const payout = await prisma.payout.create({
    data: { partnerId: partnerApproved.id, periodLabel: "August 2026", totalAmount: commissionAmount, status: "PAID", reference: "UTR2026080123456", processedByAdminId: admin.id, processedAt: new Date(), entries: { connect: { id: commission.id } } },
  });
  await prisma.commissionEntry.update({ where: { id: commission.id }, data: { status: "PAID", payoutId: payout.id } });

  // App 5: self-serve, rejected.
  const app5 = await createWithTimeline({
    code: "LP-DEMO-000005",
    customerId: customer2.id,
    productSlug: personalLoan.slug,
    requestedAmount: 2_000_000,
    city: "Bengaluru",
    steps: ["SUBMITTED", "UNDER_REVIEW", "REJECTED"],
  });
  await prisma.loanApplication.update({ where: { id: app5.id }, data: { rejectionReason: "Requested amount exceeds eligibility for the declared income." } });

  // A couple of demo documents (placeholder files — no real upload happened).
  await prisma.document.create({
    data: { ownerUserId: customer2.id, applicationId: app2.id, type: "BANK_STATEMENT", status: "PENDING_REVIEW", fileUrl: "https://placehold.co/600x800?text=Bank+Statement", fileName: "bank-statement.pdf", mimeType: "application/pdf", sizeBytes: 245_000 },
  });
  await prisma.document.create({
    data: { ownerUserId: customer1.id, applicationId: app4.id, type: "PAN", status: "APPROVED", fileUrl: "https://placehold.co/600x400?text=PAN+Card", fileName: "pan-card.jpg", mimeType: "image/jpeg", sizeBytes: 120_000, reviewedByAdminId: admin.id, reviewedAt: new Date() },
  });

  await printCredentials();
}

async function createWithTimeline(params: {
  code: string;
  customerId: string;
  partnerId?: string;
  productSlug: string;
  requestedAmount: number;
  city: string;
  steps: string[];
  assignedLenderSlug?: string;
  sanctionedAmount?: number;
}) {
  const app = await prisma.loanApplication.create({
    data: {
      code: params.code,
      customerId: params.customerId,
      partnerId: params.partnerId,
      productSlug: params.productSlug,
      requestedAmount: params.requestedAmount,
      city: params.city,
      status: params.steps[0] as never,
      submittedAt: new Date(),
      assignedLenderSlug: params.assignedLenderSlug,
      sanctionedAmount: params.sanctionedAmount,
    },
  });
  let previous: string | null = null;
  for (const step of params.steps) {
    await prisma.applicationStatusEvent.create({
      data: { applicationId: app.id, fromStatus: previous as never, toStatus: step as never, actorRole: "ADMIN", actorUserId: null, note: null },
    });
    previous = step;
  }
  const finalStatus = params.steps[params.steps.length - 1];
  await prisma.loanApplication.update({ where: { id: app.id }, data: { status: finalStatus as never } });
  return app;
}

async function printCredentials() {
  console.log("Demo accounts ready (all use the same password):\n");
  console.log(`  Password: ${DEMO_PASSWORD}\n`);
  console.log("  Admin (Super Admin)  admin@loanspartner.in        -> /console/login");
  console.log("  Partner (approved)   partner.approved@loanspartner.in -> /partners/login");
  console.log("  Partner (pending)    partner.pending@loanspartner.in  -> /partners/login");
  console.log("  Customer             customer1@loanspartner.in    -> /login");
  console.log("  Customer             customer2@loanspartner.in    -> /login");
  console.log("  Customer             customer3@loanspartner.in    -> /login\n");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
