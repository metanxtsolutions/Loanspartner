"use client";

import { useActionState } from "react";
import { saveSettingsAction, type ActionResult } from "@/actions/outreach/settings";
import type { OutreachSettings } from "@/server/outreach/settings";

const idle: ActionResult = { ok: true };

export function SettingsForm({ settings }: { settings: OutreachSettings }) {
  const [state, action, pending] = useActionState(saveSettingsAction, idle);
  return (
    <form action={action} className="border-line bg-cream flex flex-col gap-5 border p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dailySendLimit" className="text-ink-800 text-sm font-medium">
            Daily send limit
          </label>
          <input
            id="dailySendLimit"
            name="dailySendLimit"
            type="number"
            min={1}
            max={500}
            defaultValue={settings.dailySendLimit}
            className="border-line-strong/40 focus:border-ink-500 border bg-white px-3 py-2 text-sm outline-none"
          />
          <p className="text-mute text-xs">
            Maximum outbound emails per calendar day, across proposals, follow-ups and replies.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sendDelaySeconds" className="text-ink-800 text-sm font-medium">
            Minimum gap between sends (seconds)
          </label>
          <input
            id="sendDelaySeconds"
            name="sendDelaySeconds"
            type="number"
            min={0}
            max={3600}
            defaultValue={settings.sendDelaySeconds}
            className="border-line-strong/40 focus:border-ink-500 border bg-white px-3 py-2 text-sm outline-none"
          />
          <p className="text-mute text-xs">Spreads sends out so the mailbox does not look automated.</p>
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="followUpDays" className="text-ink-800 text-sm font-medium">
            Follow-up schedule (days after the proposal, comma-separated)
          </label>
          <input
            id="followUpDays"
            name="followUpDays"
            type="text"
            defaultValue={settings.followUpDays.join(", ")}
            className="border-line-strong/40 focus:border-ink-500 border bg-white px-3 py-2 text-sm outline-none"
          />
          <p className="text-mute text-xs">
            Example: 4, 9, 16 sends up to three follow-ups if there is still no reply.
          </p>
        </div>
      </div>

      <label className="text-ink-800 flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          name="autoSendFollowUps"
          defaultChecked={settings.autoSendFollowUps}
          className="mt-0.5 rounded"
        />
        <span>
          Auto-send follow-ups without review.
          <span className="text-mute block text-xs">
            Off by default. Turn this on only once you trust the follow-up copy; the first proposal and every reply
            always need approval regardless of this setting.
          </span>
        </span>
      </label>

      <label className="text-danger flex items-start gap-2 text-sm">
        <input type="checkbox" name="paused" defaultChecked={settings.paused} className="mt-0.5 rounded" />
        <span>
          Pause all sending.
          <span className="text-mute block text-xs">
            Kill switch: stops every send immediately, including approved and queued messages, until unchecked.
          </span>
        </span>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="bg-ink-900 hover:bg-ink-800 px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save settings"}
        </button>
        {state.message ? (
          <p className={`text-sm ${state.ok ? "text-brass-600" : "text-danger"}`}>{state.message}</p>
        ) : null}
      </div>
    </form>
  );
}
