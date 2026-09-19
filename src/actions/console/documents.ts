"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/server/dashboard/access";
import { reviewDocument } from "@/server/dashboard/documents";
import { documentReviewSchema } from "@/lib/dashboard/schemas";

export type ActionResult = { ok: boolean; message?: string };

export async function reviewDocumentAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("documents.review");
  const parsed = documentReviewSchema.safeParse({
    documentId: form.get("documentId"),
    decision: form.get("decision"),
    note: form.get("note") ?? "",
  });
  if (!parsed.success) return { ok: false, message: "Invalid request." };

  await reviewDocument({
    documentId: parsed.data.documentId,
    decision: parsed.data.decision,
    note: parsed.data.note || undefined,
    actor: { id: actor.id, role: "ADMIN" },
  });

  revalidatePath("/console/documents");
  revalidatePath("/console/applications");
  // Reviewing from within an application's detail page carries its id along so that page revalidates too.
  const applicationId = form.get("applicationId");
  if (typeof applicationId === "string" && applicationId) revalidatePath(`/console/applications/${applicationId}`);
  return { ok: true, message: parsed.data.decision === "APPROVED" ? "Document approved." : "Document rejected." };
}
