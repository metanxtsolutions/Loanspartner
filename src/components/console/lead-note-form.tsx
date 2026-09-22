"use client";

import { useActionState } from "react";
import { saveLeadNoteAction, type ActionResult } from "@/actions/console/leads";

const initial: ActionResult = { ok: true };

export function LeadNoteForm({ leadId, initialNote }: { leadId: string; initialNote: string | null }) {
  const [state, action, pending] = useActionState(saveLeadNoteAction, initial);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="leadId" value={leadId} />
      <label htmlFor="lead-note" className="label">
        Internal note
      </label>
      <textarea id="lead-note" name="internalNote" rows={4} maxLength={2000} defaultValue={initialNote ?? ""} placeholder="Call outcome, next step, anything the team should know" className="field" />
      <div className="flex items-center justify-between gap-3">
        <p className="hint">Never shown to the person who enquired.</p>
        <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 px-4 py-2 text-xs font-semibold text-white transition disabled:opacity-60">
          {pending ? "Saving..." : "Save note"}
        </button>
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-xs">{state.message}</p> : null}
    </form>
  );
}
