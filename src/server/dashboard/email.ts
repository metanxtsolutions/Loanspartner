import "server-only";
import { Resend } from "resend";

let resend: Resend | null = null;
function client() {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) return null;
    resend = new Resend(key);
  }
  return resend;
}

function toHtml(body: string) {
  const escaped = body.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px">${p.replace(/\n/g, "<br />")}</p>`)
    .join("");
  return `<div style="font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;color:#0b1b33;max-width:560px">${paragraphs}</div>`;
}

/**
 * Best-effort transactional email for the dashboard platform. Reuses the
 * same Resend account as the rest of the site, through its own client
 * rather than importing src/server/outreach/email.ts (keeps this feature
 * from touching outreach files). Never throws: a platform notification is
 * always recorded in the Notification table first, so a failed email here
 * is a degraded experience, not a lost event, and callers should not let it
 * fail the action that triggered it.
 */
export async function sendPlatformEmail(to: string, subject: string, body: string) {
  const c = client();
  if (!c) return { sent: false as const, reason: "not_configured" as const };
  const from = process.env.PLATFORM_FROM_EMAIL ?? "LoansPartner <accounts@loanspartner.in>";
  try {
    const { data, error } = await c.emails.send({ from, to, subject, text: body, html: toHtml(body) });
    if (error || !data) return { sent: false as const, reason: "send_failed" as const, detail: error?.message };
    return { sent: true as const, resendMessageId: data.id };
  } catch (err) {
    return { sent: false as const, reason: "send_failed" as const, detail: err instanceof Error ? err.message : String(err) };
  }
}
