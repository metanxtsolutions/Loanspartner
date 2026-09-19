"use client";

import { useActionState, useRef } from "react";
import { addApplicationNoteAction, type ActionResult } from "@/actions/console/applications";

const initial: ActionResult = { ok: true };

export function ApplicationNoteForm({ applicationId }: { applicationId: string }) {
  const [state, formAction, pending] = useActionState(addApplicationNoteAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="flex flex-col gap-2"
    >
      <input type="hidden" name="applicationId" value={applicationId} />
      <textarea name="body" required rows={2} placeholder="Add an internal note..." className="field" />
      <div className="flex items-center justify-between gap-3">
        <label className="text-mute flex items-center gap-2 text-xs">
          <input type="checkbox" name="visibleToCustomer" className="size-4" />
          Visible to customer
        </label>
        <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-60">
          {pending ? "Adding..." : "Add note"}
        </button>
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
    </form>
  );
}
