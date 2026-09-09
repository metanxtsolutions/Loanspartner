"use client";

import { useActionState, useState, useTransition } from "react";
import {
  approveAndSendAction,
  editMessageAction,
  regenerateMessageAction,
  skipMessageAction,
  type ActionResult,
} from "@/actions/outreach/messages";
import { MessageStatusBadge, ReplyClassificationBadge } from "@/components/outreach/status-badge";
import type { MessageStatus, ReplyClassification } from "@prisma/client";

const idle: ActionResult = { ok: true };

export type MessageCardData = {
  id: string;
  direction: "OUTBOUND" | "INBOUND";
  kind: "PROPOSAL" | "FOLLOW_UP" | "REPLY";
  status: MessageStatus;
  subject: string;
  body: string;
  createdAt: string;
  sentAt: string | null;
  editedByHuman: boolean;
  aiModel: string | null;
  replyClassification: ReplyClassification | null;
  classificationNote: string | null;
  toEmail: string | null;
  bounceReason: string | null;
  failedReason: string | null;
  skippedReason: string | null;
};

const KIND_LABEL: Record<MessageCardData["kind"], string> = {
  PROPOSAL: "Partnership proposal",
  FOLLOW_UP: "Follow-up",
  REPLY: "Reply",
};

export function MessageCard({ message, lenderName }: { message: MessageCardData; lenderName: string }) {
  const [editing, setEditing] = useState(false);
  const isActionable =
    message.direction === "OUTBOUND" && (message.status === "DRAFT" || message.status === "PENDING_APPROVAL");

  return (
    <div className="border-line bg-cream border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-mute-2 text-xs font-semibold tracking-wide uppercase">
            {message.direction === "OUTBOUND" ? `LoansPartner → ${lenderName}` : `${lenderName} → LoansPartner`}
          </span>
          <span className="text-mute text-xs">{KIND_LABEL[message.kind]}</span>
        </div>
        <div className="flex items-center gap-2">
          {message.replyClassification ? (
            <ReplyClassificationBadge classification={message.replyClassification} />
          ) : null}
          <MessageStatusBadge status={message.status} />
        </div>
      </div>

      {editing ? (
        <EditForm
          messageId={message.id}
          subject={message.subject}
          body={message.body}
          onDone={() => setEditing(false)}
        />
      ) : (
        <div className="mt-3">
          <p className="text-ink-950 font-medium">{message.subject}</p>
          <p className="text-ink-800 mt-1.5 text-sm whitespace-pre-wrap">{message.body}</p>
        </div>
      )}

      <div className="text-mute mt-3 flex flex-wrap items-center gap-3 text-xs">
        <span>{new Date(message.createdAt).toLocaleString("en-IN")}</span>
        {message.editedByHuman ? (
          <span>Edited by reviewer</span>
        ) : message.aiModel ? (
          <span>AI draft ({message.aiModel})</span>
        ) : null}
        {message.classificationNote ? <span className="italic">{message.classificationNote}</span> : null}
        {message.bounceReason ? <span className="text-danger">Bounced: {message.bounceReason}</span> : null}
        {message.failedReason ? <span className="text-danger">Failed: {message.failedReason}</span> : null}
        {message.skippedReason ? <span>Skipped: {message.skippedReason}</span> : null}
      </div>

      {isActionable && !editing ? <MessageActions messageId={message.id} onEdit={() => setEditing(true)} /> : null}
    </div>
  );
}

function MessageActions({ messageId, onEdit }: { messageId: string; onEdit: () => void }) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const [skipReason, setSkipReason] = useState("");
  const [showSkip, setShowSkip] = useState(false);

  return (
    <div className="border-line mt-3 flex flex-col gap-2 border-t pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(async () => setResult(await approveAndSendAction(messageId)))}
          className="bg-brass-500 hover:bg-brass-400 text-ink-950 px-3 py-1.5 text-sm font-medium transition disabled:opacity-60"
        >
          {pending ? "Working..." : "Approve and send"}
        </button>
        <button
          type="button"
          onClick={onEdit}
          disabled={pending}
          className="border-line-strong/40 text-ink-800 hover:bg-ink-100 border px-3 py-1.5 text-sm font-medium transition disabled:opacity-60"
        >
          Edit
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(async () => setResult(await regenerateMessageAction(messageId)))}
          className="border-line-strong/40 text-ink-800 hover:bg-ink-100 border px-3 py-1.5 text-sm font-medium transition disabled:opacity-60"
        >
          Regenerate
        </button>
        <button
          type="button"
          onClick={() => setShowSkip((v) => !v)}
          disabled={pending}
          className="border-line-strong/40 text-danger hover:bg-danger-50 border px-3 py-1.5 text-sm font-medium transition disabled:opacity-60"
        >
          Skip
        </button>
      </div>
      {showSkip ? (
        <div className="flex items-center gap-2">
          <input
            value={skipReason}
            onChange={(e) => setSkipReason(e.target.value)}
            placeholder="Reason (optional)"
            className="border-line-strong/40 bg-cream focus:border-ink-500 flex-1 border px-3 py-1.5 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                setResult(await skipMessageAction(messageId, skipReason));
                setShowSkip(false);
              })
            }
            className="bg-danger px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            Confirm skip
          </button>
        </div>
      ) : null}
      {result && !result.ok && result.message ? <p className="text-danger text-xs">{result.message}</p> : null}
      {result?.ok && result.message ? <p className="text-brass-600 text-xs">{result.message}</p> : null}
    </div>
  );
}

function EditForm({
  messageId,
  subject,
  body,
  onDone,
}: {
  messageId: string;
  subject: string;
  body: string;
  onDone: () => void;
}) {
  const boundAction = editMessageAction.bind(null, messageId);
  const [state, action, pending] = useActionState(boundAction, idle);
  return (
    <form
      action={async (formData) => {
        await action(formData);
        onDone();
      }}
      className="mt-3 flex flex-col gap-2"
    >
      <input
        name="subject"
        defaultValue={subject}
        required
        className="border-line-strong/40 bg-cream focus:border-ink-500 border px-3 py-2 text-sm font-medium outline-none"
      />
      <textarea
        name="body"
        defaultValue={body}
        required
        rows={8}
        className="border-line-strong/40 bg-cream focus:border-ink-500 border px-3 py-2 text-sm outline-none"
      />
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-ink-900 hover:bg-ink-800 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="border-line-strong/40 text-ink-800 hover:bg-ink-100 border px-3 py-1.5 text-sm font-medium"
        >
          Cancel
        </button>
        {!state.ok && state.message ? <p className="text-danger text-xs">{state.message}</p> : null}
      </div>
    </form>
  );
}
