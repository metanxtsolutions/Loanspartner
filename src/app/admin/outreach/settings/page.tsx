import type { Metadata } from "next";
import { getSettings } from "@/server/outreach/settings";
import { SettingsForm } from "@/components/outreach/settings-form";

export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const envStatus = (name: string) => (process.env[name] ? "configured" : "not set");

export default async function SettingsPage() {
  const settings = await getSettings();
  const checks = [
    { name: "DATABASE_URL", note: "CRM database" },
    { name: "RESEND_API_KEY", note: "outbound sending" },
    { name: "ANTHROPIC_API_KEY", note: "AI drafting and reply classification" },
    { name: "OUTREACH_FROM_EMAIL", note: "send-from address" },
    { name: "OUTREACH_IMAP_HOST", note: "reply monitoring" },
    { name: "OUTREACH_IMAP_USER", note: "reply monitoring" },
    { name: "OUTREACH_IMAP_PASSWORD", note: "reply monitoring" },
    { name: "CRON_SECRET", note: "protects the cron endpoints" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-ink-950 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">Settings</h1>
        <p className="text-mute mt-1 text-sm">Sending limits, follow-up sequencing, and the kill switch.</p>
      </div>

      <SettingsForm settings={settings} />

      <section>
        <h2 className="text-ink-900 text-sm font-semibold">Environment</h2>
        <p className="text-mute mt-1 text-xs">
          Set these in .env.local for development, and in the hosting platform's environment settings for production.
        </p>
        <div className="border-line bg-cream mt-3 overflow-x-auto border">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="border-line bg-ink-50 text-mute-2 border-b text-xs tracking-wide uppercase">
              <tr>
                <th className="px-4 py-2 font-medium">Variable</th>
                <th className="px-4 py-2 font-medium">Used for</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {checks.map((c) => (
                <tr key={c.name}>
                  <td className="text-ink-900 px-4 py-2 font-mono text-xs">{c.name}</td>
                  <td className="text-mute px-4 py-2">{c.note}</td>
                  <td className="px-4 py-2">
                    <span className={envStatus(c.name) === "configured" ? "text-brass-600" : "text-danger"}>
                      {envStatus(c.name)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="border-line bg-cream text-ink-800 border p-5 text-sm">
        <h2 className="text-ink-900 text-sm font-semibold">Scheduled jobs</h2>
        <p className="mt-2">
          Two cron routes drive the automation. Vercel Cron (vercel.json) calls both on a schedule with a Bearer token
          equal to CRON_SECRET.
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <code className="bg-ink-100 rounded px-1.5 py-0.5">/api/outreach/cron/poll-replies</code>: checks the
            connected mailbox for new replies, classifies them, and drafts a response for review.
          </li>
          <li>
            <code className="bg-ink-100 rounded px-1.5 py-0.5">/api/outreach/cron/send-followups</code>: drafts (and,
            only if auto-send is on above, sends) the next follow-up for lenders who have not replied.
          </li>
        </ul>
        <p className="mt-2">
          Resend delivery, open and bounce events post to{" "}
          <code className="bg-ink-100 rounded px-1.5 py-0.5">/api/outreach/webhooks/resend</code>. Add that URL as a
          webhook endpoint in the Resend dashboard.
        </p>
      </section>
    </div>
  );
}
