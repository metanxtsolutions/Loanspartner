"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { callbackSchema, contactSchema, leadStep1Schema, leadStep2Schema, partnerSchema } from "@/lib/leads/schema";
import { newLeadId, recordEvent } from "@/lib/leads/store";
import { botCheck, rateLimited, requestMeta } from "@/lib/leads/guard";
import { siteConfig } from "@/data/site-config";

export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  leadId?: string;
};

const idle: ActionState = { ok: false };

/**
 * Shown when every sink refused the lead. The submission is still in the error
 * log, but we must not tell someone we have their details when no one will see
 * them, so we hand them a phone number instead of a false confirmation.
 */
const undelivered: ActionState = {
  ok: false,
  message: `We could not record your request just now. Please call us on ${siteConfig.contact.phoneDisplay} and we will take the details directly.`,
};

function fieldErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

function toObject(form: FormData) {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of form.entries()) {
    if (k.startsWith("_") || k === "website") continue;
    if (k.endsWith("[]")) {
      const key = k.slice(0, -2);
      const existing = obj[key] as unknown[] | undefined;
      if (existing) existing.push(v);
      else obj[key] = [v];
    } else obj[k] = v;
  }
  return obj;
}

async function precheck(form: FormData): Promise<ActionState | null> {
  const bot = botCheck(form);
  if (bot === "honeypot") return { ok: true, message: "Thanks, we will be in touch." }; // silently drop
  if (bot === "too-fast") return { ok: false, message: "Please take a moment to review the form and submit again." };
  const meta = await requestMeta();
  if (await rateLimited(meta.ip)) return { ok: false, message: "Too many requests from this network. Please call us instead." };
  return null;
}

/** Hero and apply step 1: capture the lead, then continue to step 2. */
export async function submitLeadStep1(_prev: ActionState = idle, form: FormData): Promise<ActionState> {
  const blocked = await precheck(form);
  if (blocked) return blocked;
  const parsed = leadStep1Schema.safeParse(toObject(form));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const meta = await requestMeta();
  const leadId = newLeadId();
  const { delivered } = await recordEvent({ leadId, type: "lead.created", ip: meta.ip, userAgent: meta.userAgent, page: meta.referer, data: parsed.data });
  if (delivered === 0) return undelivered;
  const q = new URLSearchParams({ lead: leadId, step: "2", product: parsed.data.product, amount: String(parsed.data.amount) });
  if (parsed.data.city) q.set("city", parsed.data.city);
  if (parsed.data.name) q.set("name", parsed.data.name);
  redirect(`/apply?${q.toString()}`);
}

export async function submitLeadStep2(_prev: ActionState = idle, form: FormData): Promise<ActionState> {
  const blocked = await precheck(form);
  if (blocked) return blocked;
  const parsed = leadStep2Schema.safeParse(toObject(form));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const meta = await requestMeta();
  const { leadId, ...data } = parsed.data;
  const { delivered } = await recordEvent({ leadId, type: "lead.qualified", ip: meta.ip, userAgent: meta.userAgent, page: meta.referer, data });
  if (delivered === 0) return undelivered;
  redirect(`/apply/thank-you?lead=${leadId}`);
}

export async function submitCallback(_prev: ActionState = idle, form: FormData): Promise<ActionState> {
  const blocked = await precheck(form);
  if (blocked) return blocked;
  const parsed = callbackSchema.safeParse(toObject(form));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const meta = await requestMeta();
  const leadId = newLeadId();
  const { delivered } = await recordEvent({ leadId, type: "callback.requested", ip: meta.ip, userAgent: meta.userAgent, page: meta.referer, data: parsed.data });
  if (delivered === 0) return undelivered;
  return { ok: true, leadId, message: "Thank you. Our credit desk will call you within one working day." };
}

export async function submitPartner(_prev: ActionState = idle, form: FormData): Promise<ActionState> {
  const blocked = await precheck(form);
  if (blocked) return blocked;
  const parsed = partnerSchema.safeParse(toObject(form));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const meta = await requestMeta();
  const leadId = newLeadId();
  const { consent: _c, ...data } = parsed.data;
  const { delivered } = await recordEvent({ leadId, type: "partner.applied", ip: meta.ip, userAgent: meta.userAgent, page: meta.referer, data });
  if (delivered === 0) return undelivered;
  return { ok: true, leadId, message: "Application received. A partner manager will call you within one working day." };
}

export async function submitContact(_prev: ActionState = idle, form: FormData): Promise<ActionState> {
  const blocked = await precheck(form);
  if (blocked) return blocked;
  const parsed = contactSchema.safeParse(toObject(form));
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const meta = await requestMeta();
  const leadId = newLeadId();
  const { delivered } = await recordEvent({ leadId, type: "contact.sent", ip: meta.ip, userAgent: meta.userAgent, page: meta.referer, data: parsed.data });
  if (delivered === 0) return undelivered;
  return { ok: true, leadId, message: "Message sent. We reply within one working day." };
}
