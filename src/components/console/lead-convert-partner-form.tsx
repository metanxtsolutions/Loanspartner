"use client";

import { useActionState } from "react";
import Link from "next/link";
import { convertLeadToPartnerAction, type ActionResult } from "@/actions/console/leads";

const initial: ActionResult = { ok: true };

export function LeadConvertPartnerForm({ leadId, email }: { leadId: string; email: string | null }) {
  const [state, action, pending] = useActionState(convertLeadToPartnerAction, initial);

  if (state.ok && state.userId) {
    return (
      <div className="border-verdant-100 bg-verdant-50 border p-4">
        <p className="text-verdant-700 text-sm font-semibold">{state.message}</p>
        <Link href="/console/partners" className="text-ink-900 mt-2 inline-block text-sm font-semibold underline underline-offset-2">
          Open partners
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="leadId" value={leadId} />
      <p className="text-mute text-sm">
        Creates a partner account for <span className="text-ink-900 font-semibold">{email ?? "this lead"}</span> and emails them a link to set a password and
        complete KYC. If that email already has an account, the lead is linked to it instead.
      </p>
      <div className="flex justify-end">
        <button type="submit" disabled={pending || !email} className="bg-brass-500 text-ink-950 hover:bg-brass-400 px-4 py-2 text-sm font-bold transition disabled:opacity-60">
          {pending ? "Inviting..." : "Invite as partner"}
        </button>
      </div>
      {!email ? <p className="hint">No email on this lead, so an account can't be created for it.</p> : null}
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
    </form>
  );
}
