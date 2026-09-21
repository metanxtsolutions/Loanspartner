"use client";

import { useActionState, useRef } from "react";
import { broadcastNotificationAction, type ActionResult } from "@/actions/console/notifications";

const initial: ActionResult = { ok: true };

const AUDIENCES = [
  { value: "ALL_CUSTOMERS", label: "All customers" },
  { value: "ALL_PARTNERS", label: "All partners" },
  { value: "ALL_ADMINS", label: "All admins" },
];

export function BroadcastForm() {
  const [state, formAction, pending] = useActionState(broadcastNotificationAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="border-line bg-cream flex flex-col gap-3 border p-4"
    >
      <div>
        <label htmlFor="audience" className="label">
          Audience
        </label>
        <select id="audience" name="audience" required className="field" defaultValue="ALL_CUSTOMERS">
          {AUDIENCES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="label">
          Title
        </label>
        <input id="title" name="title" required maxLength={120} className="field" />
      </div>
      <div>
        <label htmlFor="body" className="label">
          Message
        </label>
        <textarea id="body" name="body" required rows={3} maxLength={1000} className="field" />
      </div>
      <div>
        <label htmlFor="link" className="label">
          Link (optional)
        </label>
        <input id="link" name="link" placeholder="/dashboard" className="field" />
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-sm">{state.message}</p> : null}
      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 self-start px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Sending..." : "Send broadcast"}
      </button>
    </form>
  );
}
