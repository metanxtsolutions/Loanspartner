"use client";

import { useActionState, useState } from "react";
import { setLenderOpsAction, type ActionResult } from "@/actions/console/lenders";

const initial: ActionResult = { ok: true };

export function LenderToggleForm({
  lenderSlug,
  isAcceptingApplications,
  internalNote,
}: {
  lenderSlug: string;
  isAcceptingApplications: boolean;
  internalNote: string | null;
}) {
  const [state, action, pending] = useActionState(setLenderOpsAction, initial);
  const [editingNote, setEditingNote] = useState(false);

  return (
    <form action={action} className="flex flex-col items-end gap-1.5">
      <input type="hidden" name="lenderSlug" value={lenderSlug} />
      {editingNote ? (
        <input name="internalNote" defaultValue={internalNote ?? ""} placeholder="Internal note (optional)" className="field h-9 w-56 py-1 text-xs" />
      ) : (
        <input type="hidden" name="internalNote" value={internalNote ?? ""} />
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditingNote((v) => !v)}
          className="text-mute hover:text-ink-900 text-xs underline underline-offset-2"
        >
          {editingNote ? "Hide note" : "Edit note"}
        </button>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-semibold">
          <input type="checkbox" name="isAcceptingApplications" defaultChecked={isAcceptingApplications} className="size-4" />
          Accepting applications
        </label>
        <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-60">
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
    </form>
  );
}
