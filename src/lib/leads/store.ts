import "server-only";
import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Event-sourced lead store with pluggable sinks. Every submission appends an
 * event; downstream systems (CRM, sheet, inbox) receive the same payload.
 * Order of operations: persist first, then notify, so a notification failure
 * never loses a lead.
 */
export type LeadEvent = {
  id: string;
  leadId: string;
  type: "lead.created" | "lead.qualified" | "callback.requested" | "partner.applied" | "contact.sent";
  at: string;
  ip?: string;
  userAgent?: string;
  page?: string;
  data: Record<string, unknown>;
};

const isProd = process.env.NODE_ENV === "production";

export async function recordEvent(input: Omit<LeadEvent, "id" | "at">): Promise<LeadEvent> {
  const event: LeadEvent = { id: randomUUID(), at: new Date().toISOString(), ...input };
  const results = await Promise.allSettled([persistLocal(event), sendWebhook(event), sendEmail(event)]);
  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length) {
    console.error("[leads] sink failures", failures.map((f) => (f as PromiseRejectedResult).reason));
  }
  if (!isProd) console.info(`[leads] ${event.type}`, JSON.stringify(event.data));
  return event;
}

export const newLeadId = () => randomUUID();

/** Local JSONL file in development or when LEADS_FILE is set. Read-only filesystems are skipped. */
async function persistLocal(event: LeadEvent) {
  const file = process.env.LEADS_FILE ?? (isProd ? "" : ".data/leads.jsonl");
  if (!file) return;
  try {
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, `${JSON.stringify(event)}\n`, "utf8");
  } catch (err) {
    if (isProd) return;
    throw err;
  }
}

/** Generic JSON webhook: Google Apps Script, Zapier, Make, n8n, or your CRM. */
async function sendWebhook(event: LeadEvent) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...(process.env.LEAD_WEBHOOK_SECRET ? { "x-webhook-secret": process.env.LEAD_WEBHOOK_SECRET } : {}) },
    body: JSON.stringify(event),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
}

/** Resend email to the inbox configured in LEAD_NOTIFY_EMAIL. */
async function sendEmail(event: LeadEvent) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return;
  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const subject = subjectFor(event);
  const rows = Object.entries(event.data)
    .map(([k, v]) => `<tr><td style="padding:6px 10px;color:#5b6473">${escape(k)}</td><td style="padding:6px 10px"><strong>${escape(Array.isArray(v) ? v.join(", ") : String(v ?? ""))}</strong></td></tr>`)
    .join("");
  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#0b1b33"><h2 style="margin:0 0 12px">${escape(subject)}</h2><table style="border-collapse:collapse">${rows}<tr><td style="padding:6px 10px;color:#5b6473">lead id</td><td style="padding:6px 10px">${event.leadId}</td></tr><tr><td style="padding:6px 10px;color:#5b6473">page</td><td style="padding:6px 10px">${escape(event.page ?? "")}</td></tr><tr><td style="padding:6px 10px;color:#5b6473">time</td><td style="padding:6px 10px">${event.at}</td></tr></table></div>`;
  const { error } = await resend.emails.send({
    from: process.env.LEAD_FROM_EMAIL ?? "LoansPartner Leads <leads@loanspartner.in>",
    to: to.split(",").map((s) => s.trim()),
    subject,
    html,
  });
  if (error) throw new Error(error.message);
}

function subjectFor(e: LeadEvent) {
  const d = e.data as Record<string, string>;
  switch (e.type) {
    case "lead.created": return `New lead: ${d.product ?? "loan"} ₹${d.amount ?? ""} (${d.phone ?? ""})`;
    case "lead.qualified": return `Lead qualified: ${d.name ?? ""} in ${d.city ?? ""}`;
    case "callback.requested": return `Callback: ${d.name ?? ""} (${d.phone ?? ""})`;
    case "partner.applied": return `Partner application: ${d.name ?? ""}, ${d.profession ?? ""}`;
    case "contact.sent": return `Contact: ${d.subject ?? ""} from ${d.name ?? ""}`;
  }
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}
