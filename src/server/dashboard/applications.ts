import "server-only";
import type { ApplicationStatus, UserRole } from "@prisma/client";
import { prisma } from "@/server/db";
import { productOption } from "@/data/lite";
import { ALLOWED_TRANSITIONS, APPLICATION_STATUS_META } from "@/lib/dashboard/statuses";
import { notify } from "@/server/dashboard/notifications";
import { logAudit } from "@/server/dashboard/audit";
import { AccessDeniedError, canAccessApplication } from "@/server/dashboard/access";
import { accrueCommissionForApplication } from "@/server/dashboard/commissions";

async function nextApplicationCode() {
  const year = new Date().getFullYear();
  const count = await prisma.loanApplication.count({ where: { code: { startsWith: `LP-${year}-` } } });
  return `LP-${year}-${String(count + 1).padStart(6, "0")}`;
}

export async function createApplication(params: {
  customerId: string;
  partnerId?: string | null;
  productSlug: string;
  requestedAmount: number;
  city: string;
  employmentType?: string;
  submit: boolean;
}) {
  const code = await nextApplicationCode();
  const status: ApplicationStatus = params.submit ? "SUBMITTED" : "DRAFT";
  const app = await prisma.loanApplication.create({
    data: {
      code,
      customerId: params.customerId,
      partnerId: params.partnerId ?? null,
      productSlug: params.productSlug,
      requestedAmount: params.requestedAmount,
      city: params.city,
      employmentType: params.employmentType || null,
      status,
      submittedAt: params.submit ? new Date() : null,
    },
  });
  await prisma.applicationStatusEvent.create({
    data: { applicationId: app.id, toStatus: status, actorUserId: params.partnerId ?? params.customerId, actorRole: params.partnerId ? "PARTNER" : "CUSTOMER" },
  });
  return app;
}

export async function listApplicationsForCustomer(customerId: string) {
  return prisma.loanApplication.findMany({ where: { customerId }, orderBy: { createdAt: "desc" } });
}

export async function listApplicationsForPartner(partnerId: string) {
  return prisma.loanApplication.findMany({
    where: { partnerId },
    orderBy: { createdAt: "desc" },
    include: { customer: { select: { name: true, email: true, phone: true } } },
  });
}

export async function listApplicationsForAdmin(filter?: { status?: ApplicationStatus; search?: string }) {
  return prisma.loanApplication.findMany({
    where: {
      status: filter?.status,
      ...(filter?.search
        ? {
            OR: [
              { code: { contains: filter.search, mode: "insensitive" } },
              { customer: { name: { contains: filter.search, mode: "insensitive" } } },
              { customer: { email: { contains: filter.search, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      partner: { select: { name: true, email: true } },
    },
  });
}

export async function getApplicationForActor(applicationId: string, actor: { id: string; role: UserRole }) {
  const app = await prisma.loanApplication.findUnique({
    where: { id: applicationId },
    include: {
      customer: { select: { id: true, name: true, email: true, phone: true } },
      partner: { select: { id: true, name: true, email: true, phone: true } },
      documents: { orderBy: { uploadedAt: "desc" } },
      events: { orderBy: { createdAt: "asc" }, include: { actor: { select: { name: true, role: true } } } },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, role: true } } } },
    },
  });
  if (!app) return null;
  if (!canAccessApplication(actor, app)) throw new AccessDeniedError();
  const notes = actor.role === "ADMIN" ? app.notes : app.notes.filter((n) => n.visibleToCustomer || actor.role === "PARTNER");
  return { ...app, notes, product: productOption(app.productSlug) };
}

export async function changeApplicationStatus(params: {
  applicationId: string;
  toStatus: ApplicationStatus;
  actor: { id: string; role: UserRole; name: string };
  note?: string;
  assignedLenderSlug?: string | null;
  sanctionedAmount?: number | null;
}) {
  const app = await prisma.loanApplication.findUnique({ where: { id: params.applicationId }, include: { customer: true, partner: true } });
  if (!app) throw new Error("Application not found");
  if (!ALLOWED_TRANSITIONS[app.status].includes(params.toStatus)) {
    throw new Error(`Cannot move an application from ${app.status} to ${params.toStatus}`);
  }

  const now = new Date();
  const updated = await prisma.loanApplication.update({
    where: { id: app.id },
    data: {
      status: params.toStatus,
      assignedLenderSlug: params.assignedLenderSlug ?? app.assignedLenderSlug,
      sanctionedAmount: params.sanctionedAmount ?? app.sanctionedAmount,
      rejectionReason: params.toStatus === "REJECTED" ? params.note : app.rejectionReason,
      decisionAt: params.toStatus === "APPROVED" ? now : app.decisionAt,
      disbursedAt: params.toStatus === "DISBURSED" ? now : app.disbursedAt,
    },
  });

  await prisma.applicationStatusEvent.create({
    data: { applicationId: app.id, fromStatus: app.status, toStatus: params.toStatus, actorUserId: params.actor.id, actorRole: params.actor.role, note: params.note || null },
  });

  if (params.note) {
    await prisma.applicationNote.create({ data: { applicationId: app.id, authorUserId: params.actor.id, body: params.note, visibleToCustomer: true } });
  }

  await logAudit({ actorUserId: params.actor.id, actorRole: params.actor.role, action: "application.status_changed", entityType: "LoanApplication", entityId: app.id, meta: { from: app.status, to: params.toStatus } });

  const meta = APPLICATION_STATUS_META[params.toStatus];
  await notify({
    userId: app.customerId,
    type: "APPLICATION_STATUS",
    title: `${app.code}: ${meta.label}`,
    body: meta.customerHint ?? `Your application status is now ${meta.label}.`,
    link: `/dashboard/applications/${app.id}`,
    email: app.customer.email,
  });
  if (app.partnerId && app.partner) {
    await notify({
      userId: app.partnerId,
      type: "APPLICATION_STATUS",
      title: `${app.code}: ${meta.label}`,
      body: `${app.customer.name}'s application is now ${meta.label}.`,
      link: `/partners/leads/${app.id}`,
      email: app.partner.email,
    });
  }

  if (params.toStatus === "DISBURSED" && app.partnerId) {
    await accrueCommissionForApplication(app.id);
  }

  return updated;
}

export async function addApplicationNote(params: { applicationId: string; authorUserId: string; body: string; visibleToCustomer: boolean }) {
  return prisma.applicationNote.create({ data: params });
}

export async function applicationFunnelCounts() {
  const rows = await prisma.loanApplication.groupBy({ by: ["status"], _count: { _all: true } });
  return rows.map((r) => ({ status: r.status, count: r._count._all }));
}
