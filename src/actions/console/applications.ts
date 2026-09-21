"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ApplicationStatus } from "@prisma/client";
import { assertAdmin } from "@/server/dashboard/access";
import { changeApplicationStatus, addApplicationNote } from "@/server/dashboard/applications";
import { applicationStatusChangeSchema } from "@/lib/dashboard/schemas";

export type ActionResult = { ok: boolean; message?: string };

export async function changeApplicationStatusAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("applications.change_status");
  const parsed = applicationStatusChangeSchema.safeParse({
    applicationId: form.get("applicationId"),
    toStatus: form.get("toStatus"),
    note: form.get("note") ?? "",
    assignedLenderSlug: form.get("assignedLenderSlug") ?? "",
    sanctionedAmount: form.get("sanctionedAmount") || undefined,
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid request." };

  try {
    await changeApplicationStatus({
      applicationId: parsed.data.applicationId,
      toStatus: parsed.data.toStatus as ApplicationStatus,
      actor: { id: actor.id, role: actor.role, name: actor.name },
      note: parsed.data.note || undefined,
      assignedLenderSlug: parsed.data.assignedLenderSlug || undefined,
      sanctionedAmount: parsed.data.sanctionedAmount ?? undefined,
    });
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Could not change the application status." };
  }

  revalidatePath(`/console/applications/${parsed.data.applicationId}`);
  revalidatePath("/console/applications");
  return { ok: true, message: "Status updated." };
}

const noteSchema = z.object({
  applicationId: z.string().min(1),
  body: z.string().trim().min(1, "Enter a note").max(2000),
  visibleToCustomer: z.string().optional(),
});

export async function addApplicationNoteAction(_prev: ActionResult, form: FormData): Promise<ActionResult> {
  const actor = await assertAdmin("applications.manage");
  const parsed = noteSchema.safeParse({
    applicationId: form.get("applicationId"),
    body: form.get("body"),
    visibleToCustomer: form.get("visibleToCustomer") ?? undefined,
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid request." };

  await addApplicationNote({
    applicationId: parsed.data.applicationId,
    authorUserId: actor.id,
    body: parsed.data.body,
    visibleToCustomer: parsed.data.visibleToCustomer === "on",
  });

  revalidatePath(`/console/applications/${parsed.data.applicationId}`);
  return { ok: true, message: "Note added." };
}
