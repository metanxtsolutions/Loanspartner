"use client";

import { useActionState } from "react";
import type { WebsiteLeadStatus } from "@prisma/client";
import { setLeadStatusAction, type ActionResult } from "@/actions/console/leads";
import { WEBSITE_LEAD_STATUS_META } from "@/lib/dashboard/statuses";

const initial: ActionResult = { ok: true };
const STATUSES = Object.keys(WEBSITE_LEAD_STATUS_META) as WebsiteLeadStatus[];

export function LeadStatusForm({ leadId, current }: { leadId: string; current: WebsiteLeadStatus }) {
  const [state, action, pending] = useActionState(setLeadStatusAction, initial);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="leadId" value={leadId} />
      <label htmlFor="lead-status" className="label">
        Status
      </label>
      <div className="flex gap-2">
        <select id="lead-status" name="status" defaultValue={current} className="field h-10 flex-1 py-1.5 text-sm">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {WEBSITE_LEAD_STATUS_META[s].label}
            </option>
          ))}
        </select>
        <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 h-10 px-4 text-xs font-semibold text-white transition disabled:opacity-60">
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-xs">{state.message}</p> : null}
    </form>
  );
}
