/**
 * Backfills WebsiteLead rows from the lead-notification emails that were the
 * only record of website form submissions before the Postgres sink existed.
 *
 * Input: one or more JSON files, each an array of
 *   { subject: string, rows: Record<string, string> }
 * where `rows` are the key/value pairs of the notification email's table
 * (as rendered by sendEmail in src/lib/leads/store.ts): the form fields plus
 * `lead id`, `page` and `time`. Collect them from Resend's email log (or the
 * inbox) however is convenient; the shape is deliberately trivial.
 *
 *   pnpm dashboard:import-leads <file.json> [more.json]
 *
 * Idempotent: rows are keyed on the pipeline's leadId exactly like the live
 * sink, so re-running only fills gaps. Events are replayed oldest first so an
 * /apply step 1 lands before its step 2 and the two merge onto one row.
 * Anything sent by the test harness (ZZ Test, Test Pipeline Lead, 98000000xx
 * phones) is skipped.
 */
import { readFile } from "node:fs/promises";
import { PrismaClient } from "@prisma/client";
import type { LeadEvent } from "@/lib/leads/store";
import { upsertWebsiteLeadFromEvent } from "@/lib/leads/website-lead";

type EmailRecord = { subject: string; rows: Record<string, string> };

const TYPE_FOR_PREFIX: Array<[string, LeadEvent["type"]]> = [
  ["New lead:", "lead.created"],
  ["Lead qualified:", "lead.qualified"],
  ["Callback:", "callback.requested"],
  ["Partner application:", "partner.applied"],
  ["Contact:", "contact.sent"],
];

const TEST_PATTERNS = [/ZZ Test/i, /Test Pipeline Lead/i, /\b98000000\d\d\b/, /zz\.contact\.test/i];
const NUMERIC_FIELDS = new Set(["amount", "monthlyIncome", "existingEmi"]);
const LIST_FIELDS = new Set(["products"]);

function toEvent(rec: EmailRecord): LeadEvent | null {
  const match = TYPE_FOR_PREFIX.find(([prefix]) => rec.subject.startsWith(prefix));
  if (!match) return null;
  const { "lead id": leadId, page, time, ...fields } = rec.rows;
  if (!leadId || !time) return null;

  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (NUMERIC_FIELDS.has(k)) data[k] = v.trim() && Number.isFinite(Number(v)) ? Number(v) : v;
    else if (LIST_FIELDS.has(k)) data[k] = v.split(",").map((s) => s.trim()).filter(Boolean);
    else data[k] = v;
  }
  return { id: `import-${leadId}-${match[1]}`, leadId, type: match[1], at: new Date(time).toISOString(), page: page || undefined, data };
}

async function main() {
  const files = process.argv.slice(2);
  if (!files.length) throw new Error("Pass at least one JSON file of email records.");

  const records: EmailRecord[] = [];
  for (const file of files) records.push(...(JSON.parse(await readFile(file, "utf8")) as EmailRecord[]));

  const events: LeadEvent[] = [];
  let skippedTest = 0;
  let skippedUnknown = 0;
  for (const rec of records) {
    if (TEST_PATTERNS.some((p) => p.test(rec.subject))) { skippedTest++; continue; }
    const event = toEvent(rec);
    if (!event) { skippedUnknown++; continue; }
    events.push(event);
  }
  events.sort((a, b) => a.at.localeCompare(b.at));

  const prisma = new PrismaClient();
  const before = await prisma.websiteLead.count();
  try {
    for (const event of events) await upsertWebsiteLeadFromEvent(prisma, event);
    const after = await prisma.websiteLead.count();
    const byKind = await prisma.websiteLead.groupBy({ by: ["kind"], _count: { _all: true } });
    console.log(`Read ${records.length} email records from ${files.length} file(s).`);
    console.log(`Replayed ${events.length} events (skipped ${skippedTest} test, ${skippedUnknown} unrecognised).`);
    console.log(`WebsiteLead rows: ${before} -> ${after}`);
    for (const k of byKind) console.log(`  ${k.kind}: ${k._count._all}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
