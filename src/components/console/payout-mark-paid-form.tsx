"use client";

import { useActionState, useState } from "react";
import { markPayoutPaidAction, type ActionResult } from "@/actions/console/commissions";

const initial: ActionResult = { ok: true };

export function PayoutMarkPaidForm({ payoutId }: { payoutId: string }) {
  const [state, action, pending] = useActionState(markPayoutPaidAction, initial);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="border-ink-800 text-ink-900 hover:bg-ink-100 border px-3 py-1.5 text-xs font-semibold">
        Mark paid
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-col items-end gap-1.5">
      <input type="hidden" name="payoutId" value={payoutId} />
      <p className="text-mute-2 max-w-56 text-right text-[11px]">
        This only records that you already paid the partner via your own banking: it does not move any money.
      </p>
      <input name="reference" required placeholder="Payment reference / UTR" className="field h-9 w-56 py-1 text-xs" />
      <div className="flex gap-1.5">
        <button type="button" onClick={() => setOpen(false)} className="text-mute hover:text-ink-900 px-2 py-1.5 text-xs font-semibold">
          Cancel
        </button>
        <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-60">
          {pending ? "Saving..." : "Confirm paid"}
        </button>
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
    </form>
  );
}
