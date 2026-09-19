import "server-only";
import { createHash, randomUUID } from "node:crypto";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/server/db";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { createSession, destroySession } from "@/server/auth/session";
import { generateReferralCode } from "@/server/dashboard/partners";
import { sendPlatformEmail } from "@/server/dashboard/email";
import { logAudit } from "@/server/dashboard/audit";

export class EmailInUseError extends Error {
  constructor() {
    super("An account with this email already exists.");
    this.name = "EmailInUseError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Incorrect email or password.");
    this.name = "InvalidCredentialsError";
  }
}

export class AccountSuspendedError extends Error {
  constructor() {
    super("This account has been suspended. Contact support for help.");
    this.name = "AccountSuspendedError";
  }
}

function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

async function sendVerificationEmail(userId: string, email: string, name: string) {
  const tokenRaw = randomUUID();
  await prisma.emailVerificationToken.create({
    data: { userId, tokenHash: hashToken(tokenRaw), purpose: "verify_email", expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  });
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loanspartner.in";
  await sendPlatformEmail(
    email,
    "Verify your LoansPartner account",
    `Hi ${name},\n\nConfirm your email to finish setting up your account:\n\n${base}/verify-email?token=${tokenRaw}\n\nThis link expires in 3 days.`,
  );
}

export async function registerCustomer(params: { name: string; email: string; phone: string; city?: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: params.email } });
  if (existing) throw new EmailInUseError();

  const user = await prisma.user.create({
    data: {
      email: params.email,
      phone: params.phone,
      name: params.name,
      role: "CUSTOMER",
      passwordHash: hashPassword(params.password),
      customerProfile: { create: { city: params.city || null } },
    },
  });
  await sendVerificationEmail(user.id, user.email, user.name);
  await logAudit({ actorUserId: user.id, actorRole: "CUSTOMER", action: "user.registered", entityType: "User", entityId: user.id });
  await createSession(user.id, "CUSTOMER");
  return user;
}

export async function registerPartner(params: { name: string; email: string; phone: string; city: string; firmName?: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: params.email } });
  if (existing) throw new EmailInUseError();

  const user = await prisma.user.create({
    data: {
      email: params.email,
      phone: params.phone,
      name: params.name,
      role: "PARTNER",
      passwordHash: hashPassword(params.password),
      partnerProfile: { create: { city: params.city, firmName: params.firmName || null, referralCode: generateReferralCode(params.name) } },
    },
  });
  await sendVerificationEmail(user.id, user.email, user.name);
  await logAudit({ actorUserId: user.id, actorRole: "PARTNER", action: "user.registered", entityType: "User", entityId: user.id });
  await createSession(user.id, "PARTNER");
  return user;
}

export async function login(params: { email: string; password: string; expectedRole: UserRole }) {
  const user = await prisma.user.findUnique({ where: { email: params.email } });
  if (!user || user.role !== params.expectedRole || !verifyPassword(params.password, user.passwordHash)) throw new InvalidCredentialsError();
  if (user.status === "SUSPENDED") throw new AccountSuspendedError();
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await createSession(user.id, user.role);
  await logAudit({ actorUserId: user.id, actorRole: user.role, action: "user.logged_in", entityType: "User", entityId: user.id });
  return user;
}

export async function logout() {
  await destroySession();
}

export async function verifyEmailToken(tokenRaw: string) {
  const record = await prisma.emailVerificationToken.findUnique({ where: { tokenHash: hashToken(tokenRaw) } });
  if (!record || record.consumedAt || record.expiresAt < new Date()) return null;
  await prisma.$transaction([
    prisma.emailVerificationToken.update({ where: { id: record.id }, data: { consumedAt: new Date() } }),
    prisma.user.update({ where: { id: record.userId }, data: { emailVerifiedAt: new Date(), status: "ACTIVE" } }),
  ]);
  return prisma.user.findUnique({ where: { id: record.userId } });
}

/** Claiming an account a partner created on a customer's behalf: verifies the token and sets the customer's chosen password. */
export async function claimAccount(tokenRaw: string, newPassword: string) {
  const record = await prisma.emailVerificationToken.findFirst({ where: { tokenHash: hashToken(tokenRaw), purpose: "claim_account" } });
  if (!record || record.consumedAt || record.expiresAt < new Date()) return null;
  const [, user] = await prisma.$transaction([
    prisma.emailVerificationToken.update({ where: { id: record.id }, data: { consumedAt: new Date() } }),
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash: hashPassword(newPassword), status: "ACTIVE", emailVerifiedAt: new Date() } }),
  ]);
  await createSession(user.id, user.role);
  return user;
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always behave the same way whether or not the account exists, so this endpoint can't be used to enumerate registered emails.
  if (!user) return;
  const tokenRaw = randomUUID();
  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash: hashToken(tokenRaw), expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
  });
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loanspartner.in";
  // Shared top-level page regardless of role: the token alone determines the account, and the confirmation screen tells the user where to sign in next.
  await sendPlatformEmail(user.email, "Reset your LoansPartner password", `Reset your password here (expires in 1 hour):\n\n${base}/reset-password?token=${tokenRaw}`);
}

export async function resetPassword(tokenRaw: string, newPassword: string) {
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(tokenRaw) } });
  if (!record || record.consumedAt || record.expiresAt < new Date()) return null;
  const [, user] = await prisma.$transaction([
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { consumedAt: new Date() } }),
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash: hashPassword(newPassword) } }),
  ]);
  return user;
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (!verifyPassword(currentPassword, user.passwordHash)) throw new InvalidCredentialsError();
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: hashPassword(newPassword) } });
}
