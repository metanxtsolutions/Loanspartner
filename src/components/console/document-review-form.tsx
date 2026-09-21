"use client";

import { useActionState } from "react";
import { reviewDocumentAction, type ActionResult } from "@/actions/console/documents";

const initial: ActionResult = { ok: true };

export function DocumentReviewForm({ documentId, applicationId }: { documentId: string; applicationId?: string | null }) {
  const [state, action, pending] = useActionState(reviewDocumentAction, initial);

  return (
    <form action={action} className="flex flex-col items-end gap-1.5">
      <input type="hidden" name="documentId" value={documentId} />
      {applicationId ? <input type="hidden" name="applicationId" value={applicationId} /> : null}
      <input name="note" placeholder="Note (optional)" className="field h-9 w-44 py-1 text-xs" />
      <div className="flex gap-1.5">
        <button
          type="submit"
          name="decision"
          value="APPROVED"
          disabled={pending}
          className="border-verdant-400 text-verdant-700 hover:bg-verdant-50 border px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
        >
          Approve
        </button>
        <button
          type="submit"
          name="decision"
          value="REJECTED"
          disabled={pending}
          className="border-danger-50 text-danger hover:bg-danger-50 border px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
        >
          Reject
        </button>
      </div>
      {!state.ok && state.message ? <p className="error text-right">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-right text-xs">{state.message}</p> : null}
    </form>
  );
}
