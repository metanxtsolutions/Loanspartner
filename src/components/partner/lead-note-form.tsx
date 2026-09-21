"use client";

import { useActionState, useRef } from "react";
import { addLeadNoteAction, type NoteActionState } from "@/actions/partner/leads";

const initial: NoteActionState = { ok: true };

export function LeadNoteForm({ applicationId }: { applicationId: string }) {
  const [state, formAction, pending] = useActionState(addLeadNoteAction, initial);
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
      <label htmlFor="note-body" className="label">
        Add a follow-up note
      </label>
      <textarea id="note-body" name="body" rows={3} required maxLength={1000} className="field" placeholder="Internal note, not visible to the customer" />
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-xs">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-ink-900 hover:bg-ink-800 h-11 self-start px-4 text-sm font-semibold text-white transition disabled:opacity-60"
      >
        {pending ? "Saving..." : "Add note"}
      </button>
    </form>
  );
}
