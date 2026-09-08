import { z } from "zod";
import { products } from "@/data/products";

export const INDIAN_MOBILE = /^(\+?91[-\s]?)?[6-9]\d{9}$/;

export const normalisePhone = (v: string) => v.replace(/[\s-]/g, "").replace(/^\+?91/, "");

const phone = z
  .string()
  .trim()
  .regex(INDIAN_MOBILE, "Enter a valid 10-digit Indian mobile number")
  .transform(normalisePhone);

const productSlug = z.enum(products.map((p) => p.slug) as [string, ...string[]]);

export const employmentTypes = ["salaried", "self-employed-professional", "self-employed-business", "other"] as const;
export const cibilBands = ["750+", "700-749", "650-699", "below-650", "unknown"] as const;

/** Step 1: the minimum we need to help. */
export const leadStep1Schema = z.object({
  product: productSlug,
  amount: z.coerce.number().int().min(10_000, "Minimum ₹10,000").max(500_000_000, "Please call us for amounts above ₹50 crore"),
  phone,
  name: z.string().trim().min(2, "Enter your name").max(80).optional().or(z.literal("")),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  source: z.string().trim().max(120).optional(),
});

/** Step 2: qualification. */
export const leadStep2Schema = z.object({
  leadId: z.string().uuid(),
  name: z.string().trim().min(2, "Enter your full name").max(80),
  employment: z.enum(employmentTypes),
  monthlyIncome: z.coerce.number().int().min(0).max(100_000_000).optional(),
  cibil: z.enum(cibilBands).optional(),
  city: z.string().trim().min(2, "Enter your city").max(60),
  email: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  existingEmi: z.coerce.number().int().min(0).max(10_000_000).optional(),
  consent: z.literal("on", { error: "Please accept the consent to proceed" }),
});

export const callbackSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone,
  product: productSlug.optional(),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  source: z.string().trim().max(120).optional(),
});

export const partnerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone,
  email: z.string().trim().email("Enter a valid email").max(120),
  city: z.string().trim().min(2, "Enter your city").max(60),
  profession: z.string().trim().min(2, "Select your profession").max(80),
  entityType: z.enum(["individual", "proprietorship", "partnership-llp", "company"]),
  experience: z.enum(["new", "1-3", "3-5", "5+"]),
  products: z.array(productSlug).min(1, "Pick at least one product"),
  network: z.string().trim().max(600).optional().or(z.literal("")),
  consent: z.literal("on", { error: "Please accept the consent to proceed" }),
  source: z.string().trim().max(120).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  phone: phone.optional().or(z.literal("")),
  subject: z.enum(["loan", "partner", "grievance", "media", "other"]),
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
});

export type LeadStep1 = z.infer<typeof leadStep1Schema>;
export type LeadStep2 = z.infer<typeof leadStep2Schema>;
export type CallbackInput = z.infer<typeof callbackSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
