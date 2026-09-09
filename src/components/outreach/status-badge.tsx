import type { LenderStatus, MessageStatus, ReplyClassification } from "@prisma/client";

const LENDER_STATUS: Record<LenderStatus, { label: string; className: string }> = {
  NEW: { label: "New", className: "bg-ink-100 text-ink-700" },
  CONTACT_NEEDED: { label: "Needs contact", className: "bg-brass-100 text-brass-600" },
  READY: { label: "Ready to send", className: "bg-brass-100 text-brass-600" },
  CONTACTED: { label: "Contacted", className: "bg-ink-100 text-ink-700" },
  REPLIED: { label: "Replied", className: "bg-brass-100 text-brass-600" },
  INTERESTED: { label: "Interested", className: "bg-brass-100 text-brass-600" },
  CALL_SCHEDULED: { label: "Call scheduled", className: "bg-brass-100 text-brass-600" },
  ONBOARDING: { label: "Onboarding", className: "bg-brass-100 text-brass-600" },
  PARTNERSHIP_LIVE: { label: "Partnership live", className: "bg-brass-500 text-ink-950" },
  NOT_INTERESTED: { label: "Not interested", className: "bg-ink-100 text-mute" },
  WRONG_CONTACT: { label: "Wrong contact", className: "bg-brass-100 text-brass-600" },
  ON_HOLD: { label: "On hold", className: "bg-ink-100 text-mute" },
  OPTED_OUT: { label: "Opted out", className: "bg-danger-50 text-danger" },
};

export function LenderStatusBadge({ status }: { status: LenderStatus }) {
  const s = LENDER_STATUS[status];
  return <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${s.className}`}>{s.label}</span>;
}

const MESSAGE_STATUS: Record<MessageStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-ink-100 text-ink-700" },
  PENDING_APPROVAL: { label: "Needs review", className: "bg-brass-100 text-brass-600" },
  APPROVED: { label: "Approved", className: "bg-brass-100 text-brass-600" },
  QUEUED: { label: "Queued", className: "bg-brass-100 text-brass-600" },
  SENT: { label: "Sent", className: "bg-ink-100 text-ink-700" },
  DELIVERED: { label: "Delivered", className: "bg-brass-100 text-brass-600" },
  OPENED: { label: "Opened", className: "bg-brass-100 text-brass-600" },
  BOUNCED: { label: "Bounced", className: "bg-danger-50 text-danger" },
  FAILED: { label: "Failed", className: "bg-danger-50 text-danger" },
  SKIPPED: { label: "Skipped", className: "bg-ink-100 text-mute" },
};

export function MessageStatusBadge({ status }: { status: MessageStatus }) {
  const s = MESSAGE_STATUS[status];
  return <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${s.className}`}>{s.label}</span>;
}

const REPLY_LABEL: Record<ReplyClassification, string> = {
  INTERESTED: "Interested",
  NEEDS_INFO: "Needs info",
  REQUEST_CALL: "Wants a call",
  NOT_INTERESTED: "Not interested",
  WRONG_CONTACT: "Wrong contact",
  NEEDS_DOCUMENTS: "Needs documents",
  FOLLOW_UP_LATER: "Follow up later",
  OUT_OF_OFFICE: "Out of office",
  UNSUBSCRIBE: "Unsubscribe",
  UNCLEAR: "Unclear, needs review",
};

export function ReplyClassificationBadge({ classification }: { classification: ReplyClassification }) {
  return (
    <span className="bg-ink-900 inline-flex items-center px-2.5 py-1 text-xs font-medium text-white">
      {REPLY_LABEL[classification]}
    </span>
  );
}
