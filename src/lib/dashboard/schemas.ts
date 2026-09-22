import { z } from "zod";
import { products } from "@/data/products";
import { INDIAN_MOBILE, normalisePhone } from "@/lib/leads/schema";

const phone = z.string().trim().regex(INDIAN_MOBILE, "Enter a valid 10-digit Indian mobile number").transform(normalisePhone);
const productSlug = z.enum(products.map((p) => p.slug) as [string, ...string[]]);
const password = z.string().min(8, "Use at least 8 characters").max(100);

export const customerRegisterSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(120),
  phone,
  city: z.string().trim().max(60).optional().or(z.literal("")),
  password,
  consent: z.literal("on", { error: "Please accept the terms to continue" }),
});

export const partnerRegisterSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(120),
  phone,
  city: z.string().trim().min(2, "Enter your city").max(60),
  firmName: z.string().trim().max(120).optional().or(z.literal("")),
  password,
  consent: z.literal("on", { error: "Please accept the terms to continue" }),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export const applicationCreateSchema = z.object({
  product: productSlug,
  requestedAmount: z.coerce.number().int().min(10_000, "Minimum ₹10,000").max(500_000_000, "Please call us for amounts above ₹50 crore"),
  city: z.string().trim().min(2, "Enter the applicant's city").max(60),
  employmentType: z.string().trim().max(60).optional().or(z.literal("")),
});

export const partnerLeadSchema = z.object({
  customerName: z.string().trim().min(2, "Enter the customer's name").max(80),
  customerEmail: z.string().trim().toLowerCase().email("Enter a valid email").max(120),
  customerPhone: phone,
  product: productSlug,
  requestedAmount: z.coerce.number().int().min(10_000, "Minimum ₹10,000").max(500_000_000, "Please call us for amounts above ₹50 crore"),
  city: z.string().trim().min(2, "Enter the customer's city").max(60),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export const documentUploadMetaSchema = z.object({
  type: z.enum(["PAN", "AADHAAR", "PHOTO", "INCOME_PROOF", "BANK_STATEMENT", "ITR", "GST_CERTIFICATE", "PROPERTY_PAPER", "BUSINESS_PROOF", "OTHER"]),
  applicationId: z.string().trim().optional().or(z.literal("")),
});

export const applicationStatusChangeSchema = z.object({
  applicationId: z.string().min(1),
  toStatus: z.string().min(1),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
  assignedLenderSlug: z.string().trim().optional().or(z.literal("")),
  sanctionedAmount: z.coerce.number().int().min(0).optional(),
});

export const partnerKycSchema = z.object({
  firmName: z.string().trim().max(120).optional().or(z.literal("")),
  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}\d{4}[A-Z]$/, "Enter a valid PAN (e.g. ABCDE1234F)")
    .optional()
    .or(z.literal("")),
  gstNumber: z.string().trim().toUpperCase().max(15).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Enter your city").max(60),
  bankAccountName: z.string().trim().max(120).optional().or(z.literal("")),
  bankAccountNumber: z.string().trim().max(30).optional().or(z.literal("")),
  bankIfsc: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Enter a valid IFSC code")
    .optional()
    .or(z.literal("")),
});

export const kycReviewSchema = z.object({
  partnerId: z.string().min(1),
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export const documentReviewSchema = z.object({
  documentId: z.string().min(1),
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export const notificationBroadcastSchema = z.object({
  audience: z.enum(["ALL_CUSTOMERS", "ALL_PARTNERS", "ALL_ADMINS"]),
  title: z.string().trim().min(2).max(120),
  body: z.string().trim().min(2).max(1000),
  link: z.string().trim().max(300).optional().or(z.literal("")),
});

export const payoutCreateSchema = z.object({
  partnerId: z.string().min(1),
  commissionEntryIds: z.array(z.string().min(1)).min(1, "Select at least one commission entry"),
});

export const payoutMarkPaidSchema = z.object({
  payoutId: z.string().min(1),
  reference: z.string().trim().min(1, "Enter a payment reference").max(120),
});

export const lenderOpsToggleSchema = z.object({
  lenderSlug: z.string().min(1),
  isAcceptingApplications: z.coerce.boolean(),
  internalNote: z.string().trim().max(500).optional().or(z.literal("")),
});

export const adminRoleChangeSchema = z.object({
  userId: z.string().min(1),
  adminRole: z.enum(["SUPER_ADMIN", "OPS", "FINANCE", "SUPPORT"]),
});

export const leadStatusChangeSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "CLOSED"]),
});

export const leadNoteSchema = z.object({
  leadId: z.string().min(1),
  internalNote: z.string().trim().max(2000),
});

export const leadConvertCustomerSchema = z.object({
  leadId: z.string().min(1),
  email: z.string().trim().toLowerCase().email("Enter a valid email for the customer").max(120),
  product: productSlug,
  requestedAmount: z.coerce.number().int().min(10_000, "Minimum ₹10,000").max(500_000_000, "Please call us for amounts above ₹50 crore"),
  city: z.string().trim().min(2, "Enter the customer's city").max(60),
});

export const leadConvertPartnerSchema = z.object({
  leadId: z.string().min(1),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone,
  city: z.string().trim().max(60).optional().or(z.literal("")),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: password,
    confirmPassword: z.string().min(1),
  })
  .refine((v) => v.newPassword === v.confirmPassword, { error: "Passwords do not match", path: ["confirmPassword"] });

export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;
export type PartnerRegisterInput = z.infer<typeof partnerRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;
export type PartnerLeadInput = z.infer<typeof partnerLeadSchema>;
export type ApplicationStatusChangeInput = z.infer<typeof applicationStatusChangeSchema>;
export type PartnerKycInput = z.infer<typeof partnerKycSchema>;
