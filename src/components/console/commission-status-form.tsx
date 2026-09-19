"use client";

import { useActionState } from "react";
import type { CommissionStatus } from "@prisma/client";
import { setCommissionStatusAction, type ActionResult } from "@/actions/console/commissions";

const initial: ActionResult = { ok: true };

export function CommissionStatusForm({ id, status }: { id: string; status: CommissionStatus }) {
  const [state, action, pending] = useActionState(setCommissionStatusAction, initial);
  if (status === "PAID") return <span className="text-mute-2 text-xs">Paid, locked</span>;

  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={id} />
      <div className="flex gap-1.5">
        {status !== "APPROVED" ? (
          <button type="submit" name="status" value="APPROVED" disabled={pending} className="border-verdant-400 text-verdant-700 hover:bg-verdant-50 border px-2.5 py-1 text-xs font-semibold disabled:opacity-60">
            Approve
          </button>
        ) : null}
        {status !== "DISPUTED" ? (
          <button type="submit" name="status" value="DISPUTED" disabled={pending} className="border-brass-300 text-brass-600 hover:bg-brass-50 border px-2.5 py-1 text-xs font-semibold disabled:opacity-60">
            Dispute
          </button>
        ) : null}
        {status !== "VOID" ? (
          <button type="submit" name="status" value="VOID" disabled={pending} className="border-danger-50 text-danger hover:bg-danger-50 border px-2.5 py-1 text-xs font-semibold disabled:opacity-60">
            Void
          </button>
        ) : null}
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
    </form>
  );
}
