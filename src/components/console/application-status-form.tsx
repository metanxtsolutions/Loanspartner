"use client";

import { useActionState, useState } from "react";
import type { ApplicationStatus } from "@prisma/client";
import { changeApplicationStatusAction, type ActionResult } from "@/actions/console/applications";
import { ALLOWED_TRANSITIONS, APPLICATION_STATUS_META } from "@/lib/dashboard/statuses";

const initial: ActionResult = { ok: true };

export function ApplicationStatusForm({
  applicationId,
  currentStatus,
  lenders,
  assignedLenderSlug,
  sanctionedAmount,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
  lenders: { slug: string; name: string }[];
  assignedLenderSlug?: string | null;
  sanctionedAmount?: number | null;
}) {
  const [state, action, pending] = useActionState(changeApplicationStatusAction, initial);
  const options = ALLOWED_TRANSITIONS[currentStatus];
  const [toStatus, setToStatus] = useState<ApplicationStatus | "">("");

  if (options.length === 0) {
    return <p className="text-mute text-sm">This is a final status: no further transitions are available.</p>;
  }

  const showLenderAndAmount = toStatus === "APPROVED" || toStatus === "SANCTIONED" || toStatus === "SENT_TO_LENDER" || toStatus === "LENDER_REVIEW";

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="applicationId" value={applicationId} />
      <div>
        <label htmlFor="toStatus" className="label">
          Move to
        </label>
        <select
          id="toStatus"
          name="toStatus"
          required
          className="field"
          value={toStatus}
          onChange={(e) => setToStatus(e.target.value as ApplicationStatus)}
        >
          <option value="" disabled>
            Select a status
          </option>
          {options.map((s) => (
            <option key={s} value={s}>
              {APPLICATION_STATUS_META[s].label}
            </option>
          ))}
        </select>
      </div>

      {showLenderAndAmount ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="assignedLenderSlug" className="label">
              Assigned lender
            </label>
            <select id="assignedLenderSlug" name="assignedLenderSlug" className="field" defaultValue={assignedLenderSlug ?? ""}>
              <option value="">Not assigned</option>
              {lenders.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sanctionedAmount" className="label">
              Sanctioned amount (₹)
            </label>
            <input
              id="sanctionedAmount"
              name="sanctionedAmount"
              type="number"
              min={0}
              step={1}
              className="field"
              defaultValue={sanctionedAmount ?? undefined}
            />
          </div>
        </div>
      ) : null}

      <div>
        <label htmlFor="note" className="label">
          Note {toStatus === "REJECTED" ? "(shown to the customer as the reason)" : "(optional, visible to the customer)"}
        </label>
        <textarea id="note" name="note" rows={2} className="field" />
      </div>

      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-sm">{state.message}</p> : null}

      <button
        type="submit"
        disabled={pending || !toStatus}
        className="bg-ink-900 hover:bg-ink-800 self-start px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
      >
        {pending ? "Updating..." : "Update status"}
      </button>
    </form>
  );
}
