/**
 * One-off check that the Resend API key works and mail is actually delivered.
 *
 *   pnpm test:resend
 *
 * Reads RESEND_API_KEY from .env.local. The real lead emails are sent by
 * src/lib/leads/store.ts; this script only proves the credentials are live.
 */
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
// onboarding@resend.dev works without domain verification, but Resend only
// delivers from it to your own account email. Switch to LEAD_FROM_EMAIL once
// loanspartner.in is verified in the Resend dashboard.
const from = process.env.TEST_FROM_EMAIL ?? "onboarding@resend.dev";
const to = process.env.LEAD_NOTIFY_EMAIL ?? "loanspartnerteam@gmail.com";

if (!apiKey || apiKey.startsWith("re_xxx")) {
  console.error("RESEND_API_KEY is missing or still the placeholder. Put your real key in .env.local.");
  process.exit(1);
}

const resend = new Resend(apiKey);

const { data, error } = await resend.emails.send({
  from,
  to,
  subject: "Hello World",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});

if (error) {
  console.error("Send failed:", error.name, "-", error.message);
  process.exit(1);
}

console.log(`Sent to ${to} from ${from}. Message id: ${data?.id}`);
