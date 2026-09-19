"use client";

import { useActionState } from "react";
import type { AdminRole } from "@prisma/client";
import { setAdminRoleAction, type ActionResult } from "@/actions/console/users";
import { ADMIN_ROLE_LABELS } from "@/lib/dashboard/permissions";

const initial: ActionResult = { ok: true };
const ROLES = Object.keys(ADMIN_ROLE_LABELS) as AdminRole[];

export function AdminRoleForm({ userId, adminRole }: { userId: string; adminRole: AdminRole }) {
  const [state, action, pending] = useActionState(setAdminRoleAction, initial);

  return (
    <form action={action} className="flex flex-col items-start gap-1">
      <input type="hidden" name="userId" value={userId} />
      <div className="flex items-center gap-2">
        <select name="adminRole" defaultValue={adminRole} className="field h-10 py-1.5 text-sm">
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {ADMIN_ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 h-10 px-3 text-xs font-semibold text-white transition disabled:opacity-60">
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-xs">{state.message}</p> : null}
    </form>
  );
}
