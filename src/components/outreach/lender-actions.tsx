"use client";

import { useActionState, useState, useTransition } from "react";
import type { LenderStatus } from "@prisma/client";
import {
  runContactDiscoveryAction,
  addManualContactAction,
  addNoteAction,
  updateLenderStatusAction,
  generateProposalAction,
  type ActionResult,
} from "@/actions/outreach/lenders";

const idle: ActionResult = { ok: true };

export function DiscoverContactButton({ lenderId }: { lenderId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => setMessage((await runContactDiscoveryAction(lenderId)).message ?? null))
        }
        className="border-line-strong/40 text-ink-800 hover:bg-ink-100 border px-3 py-2 text-sm font-medium transition disabled:opacity-60"
      >
        {pending ? "Checking the lender's website..." : "Find contact on lender site"}
      </button>
      {message ? <p className="text-mute text-xs">{message}</p> : null}
    </div>
  );
}

export function GenerateProposalButton({ lenderId, contactId }: { lenderId: string; contactId: string }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(async () => setResult(await generateProposalAction(lenderId, contactId)))}
        className="bg-brass-500 hover:bg-brass-400 text-ink-950 px-3 py-2 text-sm font-medium transition disabled:opacity-60"
      >
        {pending ? "Drafting..." : "Draft partnership proposal"}
      </button>
      {result && !result.ok ? <p className="text-danger text-xs">{result.message}</p> : null}
      {result?.ok && result.message ? <p className="text-brass-600 text-xs">{result.message}</p> : null}
    </div>
  );
}

const STATUS_OPTIONS: LenderStatus[] = [
  "NEW",
  "CONTACT_NEEDED",
  "READY",
  "CONTACTED",
  "REPLIED",
  "INTERESTED",
  "CALL_SCHEDULED",
  "ONBOARDING",
  "PARTNERSHIP_LIVE",
  "NOT_INTERESTED",
  "WRONG_CONTACT",
  "ON_HOLD",
  "OPTED_OUT",
];

export function StatusSelect({ lenderId, status }: { lenderId: string; status: LenderStatus }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(async () => {
          await updateLenderStatusAction(lenderId, e.target.value as LenderStatus);
        })
      }
      className="border-line-strong/40 bg-cream text-ink-800 focus:border-ink-500 border px-2.5 py-1.5 text-sm outline-none"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s.replaceAll("_", " ").toLowerCase()}
        </option>
      ))}
    </select>
  );
}

export function AddContactForm({ lenderId }: { lenderId: string }) {
  const boundAction = addManualContactAction.bind(null, lenderId);
  const [state, action, pending] = useActionState(boundAction, idle);
  return (
    <form action={action} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <input
        name="email"
        type="email"
        required
        placeholder="partnerships@lender.com"
        className="border-line-strong/40 bg-cream focus:border-ink-500 border px-3 py-2 text-sm outline-none"
      />
      <input
        name="name"
        type="text"
        placeholder="Contact name (optional)"
        className="border-line-strong/40 bg-cream focus:border-ink-500 border px-3 py-2 text-sm outline-none"
      />
      <input
        name="title"
        type="text"
        placeholder="Title (optional)"
        className="border-line-strong/40 bg-cream focus:border-ink-500 border px-3 py-2 text-sm outline-none"
      />
      <input
        name="sourceNote"
        type="text"
        placeholder="Where this came from (optional)"
        className="border-line-strong/40 bg-cream focus:border-ink-500 border px-3 py-2 text-sm outline-none"
      />
      <label className="text-mute col-span-full flex items-center gap-2 text-sm">
        <input type="checkbox" name="makePrimary" defaultChecked className="rounded" /> Use as primary contact
      </label>
      <button
        type="submit"
        disabled={pending}
        className="border-line-strong/40 text-ink-800 hover:bg-ink-100 col-span-full border px-3 py-2 text-sm font-medium transition disabled:opacity-60"
      >
        {pending ? "Saving..." : "Add contact"}
      </button>
      {state.message ? (
        <p className={`col-span-full text-xs ${state.ok ? "text-brass-600" : "text-danger"}`}>{state.message}</p>
      ) : null}
    </form>
  );
}

export function AddNoteForm({ lenderId }: { lenderId: string }) {
  const boundAction = addNoteAction.bind(null, lenderId);
  const [state, action, pending] = useActionState(boundAction, idle);
  return (
    <form action={action} className="flex flex-col gap-2">
      <textarea
        name="body"
        rows={3}
        required
        placeholder="Add a note for the team..."
        className="border-line-strong/40 bg-cream focus:border-ink-500 border px-3 py-2 text-sm outline-none"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="border-line-strong/40 text-ink-800 hover:bg-ink-100 border px-3 py-2 text-sm font-medium transition disabled:opacity-60"
        >
          {pending ? "Saving..." : "Add note"}
        </button>
        {state.message ? (
          <p className={`text-xs ${state.ok ? "text-brass-600" : "text-danger"}`}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
