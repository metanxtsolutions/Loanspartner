import Link from "next/link";
import type { Metadata } from "next";
import type { LenderStatus } from "@prisma/client";
import { prisma } from "@/server/outreach/db";
import { LenderStatusBadge } from "@/components/outreach/status-badge";

export const metadata: Metadata = { title: "Pipeline", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STATUS_FILTERS: { value: LenderStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACT_NEEDED", label: "Needs contact" },
  { value: "READY", label: "Ready" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "REPLIED", label: "Replied" },
  { value: "INTERESTED", label: "Interested" },
  { value: "CALL_SCHEDULED", label: "Call scheduled" },
  { value: "ONBOARDING", label: "Onboarding" },
  { value: "PARTNERSHIP_LIVE", label: "Partnership live" },
  { value: "NOT_INTERESTED", label: "Not interested" },
  { value: "OPTED_OUT", label: "Opted out" },
];

export default async function OutreachPipelinePage({ searchParams }: PageProps<"/admin/outreach">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const statusParam = typeof sp.status === "string" ? sp.status : "ALL";
  const status = STATUS_FILTERS.find((s) => s.value === statusParam)?.value ?? "ALL";

  const [lenders, counts] = await Promise.all([
    prisma.lender.findMany({
      where: {
        ...(status !== "ALL" ? { status } : {}),
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      },
      include: {
        contacts: { where: { isPrimary: true }, take: 1 },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.lender.groupBy({ by: ["status"], _count: true }),
  ]);

  const countByStatus = Object.fromEntries(counts.map((c) => [c.status, c._count])) as Record<string, number>;
  const total = lenders.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-ink-950 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">
            Lender pipeline
          </h1>
          <p className="text-mute mt-1 text-sm">
            {total} lender{total === 1 ? "" : "s"} matching this view.
          </p>
        </div>
        <form className="flex items-center gap-2" action="/admin/outreach">
          {status !== "ALL" ? <input type="hidden" name="status" value={status} /> : null}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search lender name"
            className="border-line-strong/40 bg-cream focus:border-ink-500 focus:ring-ink-500/20 w-56 border px-3 py-2 text-sm outline-none focus:ring-2"
          />
          <button
            type="submit"
            className="border-line-strong/40 text-ink-800 hover:bg-ink-100 border px-3 py-2 text-sm font-medium"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <Link
            key={f.value}
            href={{
              pathname: "/admin/outreach",
              query: { ...(f.value !== "ALL" ? { status: f.value } : {}), ...(q ? { q } : {}) },
            }}
            className={`border px-3 py-1.5 text-xs font-medium transition ${status === f.value ? "border-ink-900 bg-ink-900 text-white" : "border-line-strong/40 text-ink-700 hover:bg-ink-100"}`}
          >
            {f.label} {f.value !== "ALL" ? `(${countByStatus[f.value] ?? 0})` : ""}
          </Link>
        ))}
      </div>

      <div className="border-line bg-cream overflow-x-auto border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-line bg-ink-50 text-mute-2 border-b text-xs tracking-wide uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Lender</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Primary contact</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Messages</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-line divide-y">
            {lenders.map((lender) => (
              <tr key={lender.id} className="hover:bg-ink-50/60 transition">
                <td className="px-4 py-3">
                  <Link href={`/admin/outreach/${lender.id}`} className="text-ink-900 font-medium hover:underline">
                    {lender.name}
                  </Link>
                </td>
                <td className="text-mute px-4 py-3">{lender.type}</td>
                <td className="text-mute px-4 py-3">{lender.contacts[0]?.email ?? "None yet"}</td>
                <td className="px-4 py-3">
                  <LenderStatusBadge status={lender.status} />
                </td>
                <td className="text-mute px-4 py-3">{lender._count.messages}</td>
                <td className="text-mute px-4 py-3">{lender.updatedAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
            {lenders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-mute px-4 py-10 text-center">
                  No lenders match this view. Run{" "}
                  <code className="bg-ink-100 rounded px-1.5 py-0.5">pnpm outreach:seed</code> if the pipeline is empty.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
