import type { ApplicationStatus, CommissionStatus, DocumentStatus, PartnerKycStatus, PayoutStatus } from "@prisma/client";

export type StatusTone = "neutral" | "info" | "warning" | "success" | "danger";

type StatusMeta<S extends string> = Record<S, { label: string; tone: StatusTone; customerHint?: string }>;

/** Ordered pipeline; ON_HOLD/REJECTED/WITHDRAWN are terminal or side branches, not steps on the happy path. */
export const APPLICATION_PIPELINE: ApplicationStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "DOCS_REQUIRED",
  "DOCS_SUBMITTED",
  "LENDER_MATCHING",
  "SENT_TO_LENDER",
  "LENDER_REVIEW",
  "APPROVED",
  "SANCTIONED",
  "DISBURSED",
];

export const APPLICATION_STATUS_META: StatusMeta<ApplicationStatus> = {
  DRAFT: { label: "Draft", tone: "neutral", customerHint: "Not submitted yet. Finish and submit your enquiry." },
  SUBMITTED: { label: "Submitted", tone: "info", customerHint: "Received. Our desk will review it shortly." },
  UNDER_REVIEW: { label: "Under review", tone: "info", customerHint: "Our credit desk is reviewing your profile." },
  DOCS_REQUIRED: { label: "Documents needed", tone: "warning", customerHint: "Upload the requested documents to keep this moving." },
  DOCS_SUBMITTED: { label: "Documents received", tone: "info", customerHint: "Thanks, we're verifying your documents." },
  LENDER_MATCHING: { label: "Matching lenders", tone: "info", customerHint: "We're shortlisting the lenders that best fit your profile." },
  SENT_TO_LENDER: { label: "Sent to lender", tone: "info", customerHint: "Your file is with the lender for assessment." },
  LENDER_REVIEW: { label: "Lender review", tone: "info", customerHint: "The lender is assessing your application." },
  APPROVED: { label: "Approved", tone: "success", customerHint: "Approved in principle. Sanction is next." },
  SANCTIONED: { label: "Sanctioned", tone: "success", customerHint: "Sanction letter issued. Disbursal is being arranged." },
  DISBURSED: { label: "Disbursed", tone: "success", customerHint: "Funds have been disbursed." },
  REJECTED: { label: "Rejected", tone: "danger", customerHint: "This application was not approved." },
  WITHDRAWN: { label: "Withdrawn", tone: "neutral", customerHint: "You withdrew this application." },
  ON_HOLD: { label: "On hold", tone: "warning", customerHint: "This application is paused. We'll be in touch." },
};

/** Which statuses an OPS/SUPPORT admin can move an application to from its current status. Keeps the pipeline linear with clearly-scoped side exits. */
export const ALLOWED_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  DRAFT: ["SUBMITTED", "WITHDRAWN"],
  SUBMITTED: ["UNDER_REVIEW", "ON_HOLD", "REJECTED", "WITHDRAWN"],
  UNDER_REVIEW: ["DOCS_REQUIRED", "LENDER_MATCHING", "ON_HOLD", "REJECTED", "WITHDRAWN"],
  DOCS_REQUIRED: ["DOCS_SUBMITTED", "ON_HOLD", "REJECTED", "WITHDRAWN"],
  DOCS_SUBMITTED: ["LENDER_MATCHING", "DOCS_REQUIRED", "ON_HOLD", "REJECTED", "WITHDRAWN"],
  LENDER_MATCHING: ["SENT_TO_LENDER", "ON_HOLD", "REJECTED", "WITHDRAWN"],
  SENT_TO_LENDER: ["LENDER_REVIEW", "ON_HOLD", "REJECTED", "WITHDRAWN"],
  LENDER_REVIEW: ["APPROVED", "DOCS_REQUIRED", "ON_HOLD", "REJECTED", "WITHDRAWN"],
  APPROVED: ["SANCTIONED", "ON_HOLD", "REJECTED", "WITHDRAWN"],
  SANCTIONED: ["DISBURSED", "ON_HOLD", "WITHDRAWN"],
  DISBURSED: [],
  REJECTED: ["UNDER_REVIEW"],
  WITHDRAWN: [],
  ON_HOLD: ["UNDER_REVIEW", "DOCS_REQUIRED", "LENDER_MATCHING", "SENT_TO_LENDER", "LENDER_REVIEW", "REJECTED", "WITHDRAWN"],
};

export const DOCUMENT_STATUS_META: StatusMeta<DocumentStatus> = {
  PENDING_REVIEW: { label: "Pending review", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
};

export const PARTNER_KYC_STATUS_META: StatusMeta<PartnerKycStatus> = {
  NOT_SUBMITTED: { label: "Not submitted", tone: "neutral" },
  PENDING_REVIEW: { label: "Pending review", tone: "warning" },
  APPROVED: { label: "Approved", tone: "success" },
  REJECTED: { label: "Rejected", tone: "danger" },
};

export const COMMISSION_STATUS_META: StatusMeta<CommissionStatus> = {
  ACCRUED: { label: "Accrued", tone: "neutral" },
  APPROVED: { label: "Approved", tone: "info" },
  PAID: { label: "Paid", tone: "success" },
  DISPUTED: { label: "Disputed", tone: "danger" },
  VOID: { label: "Void", tone: "neutral" },
};

export const PAYOUT_STATUS_META: StatusMeta<PayoutStatus> = {
  PENDING: { label: "Pending", tone: "neutral" },
  PROCESSING: { label: "Processing", tone: "warning" },
  PAID: { label: "Paid", tone: "success" },
  FAILED: { label: "Failed", tone: "danger" },
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  PAN: "PAN card",
  AADHAAR: "Aadhaar",
  PHOTO: "Photograph",
  INCOME_PROOF: "Income proof",
  BANK_STATEMENT: "Bank statement",
  ITR: "ITR",
  GST_CERTIFICATE: "GST certificate",
  PROPERTY_PAPER: "Property paper",
  BUSINESS_PROOF: "Business proof",
  OTHER: "Other document",
};
