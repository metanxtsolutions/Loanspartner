"use client";

import { useActionState } from "react";
import { setUserStatusAction, type ActionResult } from "@/actions/console/users";

const initial: ActionResult = { ok: true };

export function UserStatusForm({ userId, status }: { userId: string; status: "ACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION" }) {
  const [state, action, pending] = useActionState(setUserStatusAction, initial);
  const next = status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

  return (
    <form action={action} className="inline-flex flex-col items-end gap-1">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="status" value={next} />
      <button
        type="submit"
        disabled={pending}
        className={
          next === "ACTIVE"
            ? "border-verdant-400 text-verdant-700 hover:bg-verdant-50 border px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
            : "border-danger-50 text-danger hover:bg-danger-50 border px-3 py-1.5 text-xs font-semibold disabled:opacity-60"
        }
      >
        {pending ? "Saving..." : next === "ACTIVE" ? "Reactivate" : "Suspend"}
      </button>
      {!state.ok && state.message ? <p className="error text-right">{state.message}</p> : null}
    </form>
  );
}
