"use client";

import { useActionState, useMemo, useState } from "react";
import { createPayoutAction, type ActionResult } from "@/actions/console/commissions";
import { formatINR } from "@/lib/utils";

const initial: ActionResult = { ok: true };

export type PayoutEligiblePartner = {
  id: string;
  name: string;
  entries: { id: string; amount: number; applicationCode: string }[];
};

export function PayoutCreateForm({ partners }: { partners: PayoutEligiblePartner[] }) {
  const [state, action, pending] = useActionState(createPayoutAction, initial);
  const [partnerId, setPartnerId] = useState(partners[0]?.id ?? "");
  const selected = useMemo(() => partners.find((p) => p.id === partnerId), [partners, partnerId]);

  if (partners.length === 0) {
    return <p className="text-mute text-sm">No partner has commission entries eligible for a payout right now.</p>;
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <div>
        <label htmlFor="partnerId" className="label">
          Partner
        </label>
        <select id="partnerId" name="partnerId" className="field" value={partnerId} onChange={(e) => setPartnerId(e.target.value)}>
          {partners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.entries.length} eligible)
            </option>
          ))}
        </select>
      </div>

      {selected ? (
        <fieldset className="border-line flex flex-col gap-2 border p-3">
          <legend className="text-mute px-1 text-xs font-semibold tracking-wide uppercase">Eligible commission entries</legend>
          {selected.entries.map((entry) => (
            <label key={entry.id} className="text-ink-900 flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <input type="checkbox" name="commissionEntryIds" value={entry.id} defaultChecked className="size-4" />
                {entry.applicationCode}
              </span>
              <span className="font-semibold">₹{formatINR(entry.amount)}</span>
            </label>
          ))}
        </fieldset>
      ) : null}

      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-sm">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 self-start px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Creating payout..." : "Create payout"}
      </button>
    </form>
  );
}
