import "server-only";
import { put } from "@vercel/blob";
import type { DocumentType, UserRole } from "@prisma/client";
import { prisma } from "@/server/db";
import { AccessDeniedError, canAccessDocument } from "@/server/dashboard/access";
import { notify } from "@/server/dashboard/notifications";
import { logAudit } from "@/server/dashboard/audit";
import { DOCUMENT_TYPE_LABELS } from "@/lib/dashboard/statuses";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("Document storage is not configured yet. Ask an admin to connect Vercel Blob storage to this project.");
    this.name = "StorageNotConfiguredError";
  }
}

export async function uploadDocument(params: {
  ownerUserId: string;
  applicationId?: string | null;
  type: DocumentType;
  file: File;
}) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new StorageNotConfiguredError();
  if (params.file.size > MAX_UPLOAD_BYTES) throw new Error("File is too large. Maximum size is 8 MB.");
  if (!ALLOWED_MIME_TYPES.includes(params.file.type)) throw new Error("Unsupported file type. Upload a PDF, JPG, PNG or WEBP.");

  const key = `documents/${params.ownerUserId}/${crypto.randomUUID()}-${params.file.name}`;
  const blob = await put(key, params.file, { access: "public", addRandomSuffix: true });

  const doc = await prisma.document.create({
    data: {
      ownerUserId: params.ownerUserId,
      applicationId: params.applicationId || null,
      type: params.type,
      fileUrl: blob.url,
      fileName: params.file.name,
      mimeType: params.file.type,
      sizeBytes: params.file.size,
    },
  });

  if (params.applicationId) {
    const app = await prisma.loanApplication.findUnique({ where: { id: params.applicationId } });
    if (app?.assignedAdminId) {
      const admin = await prisma.user.findUnique({ where: { id: app.assignedAdminId } });
      if (admin) {
        await notify({
          userId: admin.id,
          type: "DOCUMENT_REVIEW",
          title: `New document on ${app.code}`,
          body: `${DOCUMENT_TYPE_LABELS[params.type]} uploaded, pending review.`,
          link: `/console/applications/${app.id}`,
        });
      }
    }
  }

  return doc;
}

export async function listDocumentsForOwner(ownerUserId: string) {
  return prisma.document.findMany({ where: { ownerUserId }, orderBy: { uploadedAt: "desc" } });
}

export async function listDocumentsForApplication(applicationId: string) {
  return prisma.document.findMany({ where: { applicationId }, orderBy: { uploadedAt: "desc" } });
}

export async function listDocumentsForAdmin(status?: "PENDING_REVIEW" | "APPROVED" | "REJECTED") {
  return prisma.document.findMany({
    where: { status },
    orderBy: { uploadedAt: "desc" },
    include: { owner: { select: { name: true, email: true, role: true } }, application: { select: { code: true } } },
  });
}

export async function getDocumentForActor(documentId: string, actor: { id: string; role: UserRole }) {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    include: { application: { select: { partnerId: true } } },
  });
  if (!doc) return null;
  if (!canAccessDocument(actor, doc)) throw new AccessDeniedError();
  return doc;
}

export async function reviewDocument(params: { documentId: string; decision: "APPROVED" | "REJECTED"; note?: string; actor: { id: string; role: "ADMIN" } }) {
  const doc = await prisma.document.update({
    where: { id: params.documentId },
    data: { status: params.decision, reviewNote: params.note || null, reviewedByAdminId: params.actor.id, reviewedAt: new Date() },
    include: { owner: true },
  });
  await logAudit({ actorUserId: params.actor.id, actorRole: params.actor.role, action: "document.reviewed", entityType: "Document", entityId: doc.id, meta: { decision: params.decision } });
  await notify({
    userId: doc.ownerUserId,
    type: "DOCUMENT_REVIEW",
    title: `${DOCUMENT_TYPE_LABELS[doc.type]} ${params.decision === "APPROVED" ? "approved" : "needs attention"}`,
    body: params.decision === "APPROVED" ? "Your document has been approved." : `We couldn't accept this document${params.note ? `: ${params.note}` : "."}`,
    link: doc.applicationId ? `/dashboard/applications/${doc.applicationId}` : "/dashboard/documents",
    email: doc.owner.email,
  });
  return doc;
}
