import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/server/outreach/db";
import { LenderStatusBadge } from "@/components/outreach/status-badge";
import {
  DiscoverContactButton,
  GenerateProposalButton,
  StatusSelect,
  AddContactForm,
  AddNoteForm,
} from "@/components/outreach/lender-actions";
import { MessageCard } from "@/components/outreach/message-card";

export const metadata: Metadata = { title: "Lender", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LenderDetailPage({ params }: PageProps<"/admin/outreach/[lenderId]">) {
  const { lenderId } = await params;
  const lender = await prisma.lender.findUnique({
    where: { id: lenderId },
    include: {
      contacts: { orderBy: [{ isPrimary: "desc" }, { confidence: "asc" }] },
      messages: { orderBy: { createdAt: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!lender) notFound();

  const primaryContact = lender.contacts.find((c) => c.isPrimary) ?? lender.contacts[0];
  const hasProposal = lender.messages.some((m) => m.kind === "PROPOSAL");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/admin/outreach" className="text-mute text-sm hover:underline">
          ← Back to pipeline
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-ink-950 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
              {lender.name}
            </h1>
            <p className="text-mute mt-1 text-sm">
              {lender.type} ·{" "}
              <a href={lender.website} target="_blank" rel="noopener noreferrer" className="underline">
                {lender.website}
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LenderStatusBadge status={lender.status} />
            <StatusSelect lenderId={lender.id} status={lender.status} />
          </div>
        </div>
      </div>

      <section className="border-line bg-cream border p-4">
        <h2 className="text-ink-900 text-sm font-semibold">Public facts on file</h2>
        <dl className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-mute-2 text-xs tracking-wide uppercase">Products</dt>
            <dd className="text-ink-800">{lender.products.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-mute-2 text-xs tracking-wide uppercase">Best fit</dt>
            <dd className="text-ink-800">{lender.bestFor}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-mute-2 text-xs tracking-wide uppercase">Summary</dt>
            <dd className="text-ink-800">{lender.summary}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-mute-2 text-xs tracking-wide uppercase">Strengths</dt>
            <dd className="text-ink-800">{lender.strengths.join("; ")}</dd>
          </div>
        </dl>
        <p className="text-mute mt-3 text-xs">
          Sourced from the public /lenders pages on loanspartner.in. Edit that data file to correct anything here.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-ink-900 text-sm font-semibold">Contacts</h2>
          <DiscoverContactButton lenderId={lender.id} />
        </div>
        {lender.contacts.length ? (
          <div className="border-line bg-cream overflow-x-auto border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-line bg-ink-50 text-mute-2 border-b text-xs tracking-wide uppercase">
                <tr>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Name / title</th>
                  <th className="px-4 py-2 font-medium">Confidence</th>
                  <th className="px-4 py-2 font-medium">Source</th>
                  <th className="px-4 py-2 font-medium">Primary</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {lender.contacts.map((c) => (
                  <tr key={c.id}>
                    <td className="text-ink-900 px-4 py-2">
                      {c.email}
                      {c.optedOut ? (
                        <span className="bg-danger-50 text-danger ml-2 px-2 py-0.5 text-xs">Opted out</span>
                      ) : null}
                    </td>
                    <td className="text-mute px-4 py-2">
                      {[c.name, c.title].filter(Boolean).join(", ") || "Not on file"}
                    </td>
                    <td className="text-mute px-4 py-2">{c.confidence.toLowerCase()}</td>
                    <td className="text-mute px-4 py-2">
                      {c.sourceUrl ? (
                        <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                          {c.sourceNote ?? "source"}
                        </a>
                      ) : (
                        (c.sourceNote ?? "manual")
                      )}
                    </td>
                    <td className="px-4 py-2">{c.isPrimary ? "Yes" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-mute text-sm">No contact on file yet. Run discovery above, or add one manually.</p>
        )}
        <div className="border-line bg-cream border p-4">
          <h3 className="text-ink-900 text-sm font-semibold">Add a contact manually</h3>
          <p className="text-mute mt-1 text-xs">
            Use this when discovery finds nothing, or when you have a better contact from LinkedIn, a call, or a
            referral.
          </p>
          <div className="mt-3">
            <AddContactForm lenderId={lender.id} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-ink-900 text-sm font-semibold">Outreach thread</h2>
          {primaryContact && !hasProposal ? (
            <GenerateProposalButton lenderId={lender.id} contactId={primaryContact.id} />
          ) : null}
        </div>
        {!primaryContact ? <p className="text-mute text-sm">Add a contact before drafting a proposal.</p> : null}
        {lender.messages.length ? (
          <div className="flex flex-col gap-3">
            {lender.messages.map((m) => (
              <MessageCard
                key={m.id}
                lenderName={lender.name}
                message={{
                  id: m.id,
                  direction: m.direction,
                  kind: m.kind,
                  status: m.status,
                  subject: m.subject,
                  body: m.body,
                  createdAt: m.createdAt.toISOString(),
                  sentAt: m.sentAt?.toISOString() ?? null,
                  editedByHuman: m.editedByHuman,
                  aiModel: m.aiModel,
                  replyClassification: m.replyClassification,
                  classificationNote: m.classificationNote,
                  toEmail: m.toEmail,
                  bounceReason: m.bounceReason,
                  failedReason: m.failedReason,
                  skippedReason: m.skippedReason,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-mute text-sm">No outreach sent yet.</p>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-ink-900 text-sm font-semibold">Notes</h2>
        <AddNoteForm lenderId={lender.id} />
        <div className="flex flex-col gap-2">
          {lender.notes.map((n) => (
            <div key={n.id} className="border-line bg-cream border px-3 py-2 text-sm">
              <p className="text-ink-800">{n.body}</p>
              <p className="text-mute mt-1 text-xs">
                {n.author} · {n.createdAt.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
