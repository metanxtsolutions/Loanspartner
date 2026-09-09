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

export type RecordResult = { event: LeadEvent; delivered: number; failures: string[] };

/**
 * Runs every configured sink and reports how many actually accepted the lead.
 * A sink that is not configured returns false rather than throwing, so
 * `delivered === 0` means the lead reached nothing and is at risk of being
 * lost. In that case the whole event goes to the error log, which on a hosted
 * runtime is the last durable copy we control, so a lead can always be
 * recovered by hand.
 */
export async function recordEvent(input: Omit<LeadEvent, "id" | "at">): Promise<RecordResult> {
  const event: LeadEvent = { id: randomUUID(), at: new Date().toISOString(), ...input };
  const results = await Promise.allSettled([persistLocal(event), sendWebhook(event), sendEmail(event)]);

  const delivered = results.filter((r) => r.status === "fulfilled" && r.value).length;
  const failures = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)));

  if (failures.length) console.error(`[leads] sink failures for ${event.id}`, failures);
  if (delivered === 0) {
    // Deliberately the full payload: this line is the recovery path.
    console.error("[leads] UNDELIVERED", JSON.stringify(event));
  }
  if (!isProd) console.info(`[leads] ${event.type} delivered=${delivered}`, JSON.stringify(event.data));
  return { event, delivered, failures };
}

export const newLeadId = () => randomUUID();

/** Local JSONL file in development or when LEADS_FILE is set. Read-only filesystems are skipped. */
async function persistLocal(event: LeadEvent): Promise<boolean> {
  const file = process.env.LEADS_FILE ?? (isProd ? "" : ".data/leads.jsonl");
  if (!file) return false;
  try {
    await mkdir(path.dirname(file), { recursive: true });
    await appendFile(file, `${JSON.stringify(event)}\n`, "utf8");
    return true;
  } catch (err) {
    if (isProd) return false;
    throw err;
  }
}

/** Generic JSON webhook: Google Apps Script, Zapier, Make, n8n, or your CRM. */
async function sendWebhook(event: LeadEvent): Promise<boolean> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  return withRetry("webhook", async () => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...(process.env.LEAD_WEBHOOK_SECRET ? { "x-webhook-secret": process.env.LEAD_WEBHOOK_SECRET } : {}) },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
    return true;
  });
}

/** Resend email to the inbox configured in LEAD_NOTIFY_EMAIL. */
async function sendEmail(event: LeadEvent): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!key || !to) return false;
  const { Resend } = await import("resend");
  const resend = new Resend(key);
  const subject = subjectFor(event);
  const rows = Object.entries(event.data)
    .map(([k, v]) => `<tr><td style="padding:6px 10px;color:#5b6473">${escape(k)}</td><td style="padding:6px 10px"><strong>${escape(Array.isArray(v) ? v.join(", ") : String(v ?? ""))}</strong></td></tr>`)
    .join("");
  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px;color:#0b1b33"><h2 style="margin:0 0 12px">${escape(subject)}</h2><table style="border-collapse:collapse">${rows}<tr><td style="padding:6px 10px;color:#5b6473">lead id</td><td style="padding:6px 10px">${event.leadId}</td></tr><tr><td style="padding:6px 10px;color:#5b6473">page</td><td style="padding:6px 10px">${escape(event.page ?? "")}</td></tr><tr><td style="padding:6px 10px;color:#5b6473">time</td><td style="padding:6px 10px">${event.at}</td></tr></table></div>`;
  return withRetry("email", async () => {
    const { error } = await resend.emails.send({
      from: process.env.LEAD_FROM_EMAIL ?? "LoansPartner Leads <leads@loanspartner.in>",
      to: to.split(",").map((s) => s.trim()),
      subject,
      html,
    });
    if (error) throw new Error(error.message);
    return true;
  });
}

/**
 * One retry with a short backoff. Lead volume is low and a server action can
 * afford the extra second, so a transient network blip should not cost a lead.
 */
async function withRetry(label: string, fn: () => Promise<boolean>): Promise<boolean> {
  try {
    return await fn();
  } catch (err) {
    console.warn(`[leads] ${label} attempt 1 failed, retrying`, err instanceof Error ? err.message : err);
    await new Promise((r) => setTimeout(r, 600));
    return fn();
  }
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
