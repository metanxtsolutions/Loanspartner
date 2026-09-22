import type { Prisma, PrismaClient, WebsiteLeadKind } from "@prisma/client";
import type { LeadEvent } from "@/lib/leads/store";

/**
 * Maps a lead-pipeline event onto the WebsiteLead table. Kept free of
 * "server-only" so both the live sink (src/lib/leads/store.ts) and one-off
 * scripts (e.g. backfilling from notification emails) share one definition
 * of how an event becomes a row.
 */
export const KIND_FOR_TYPE: Record<LeadEvent["type"], WebsiteLeadKind> = {
  "lead.created": "LOAN_ENQUIRY",
  "lead.qualified": "LOAN_ENQUIRY",
  "callback.requested": "CALLBACK",
  "partner.applied": "PARTNER_INTEREST",
  "contact.sent": "CONTACT",
};

const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
const num = (v: unknown) => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() && Number.isFinite(Number(v))) return Number(v);
  return undefined;
};

/**
 * Upserts on the pipeline's leadId so the two /apply events (step 1, then
 * qualification) land on one row: step 2 fills in fields step 1 didn't have
 * and merges its answers into `data`. Any other event type is a fresh row;
 * re-running for an event that already exists is a no-op.
 */
export async function upsertWebsiteLeadFromEvent(prisma: PrismaClient, event: LeadEvent) {
  const d = event.data;
  const fields = {
    name: str(d.name),
    phone: str(d.phone),
    email: str(d.email),
    city: str(d.city),
    productSlug: str(d.product),
    amount: num(d.amount),
    source: str(d.source),
    page: event.page,
  };
  const meta = { ip: event.ip, userAgent: event.userAgent };

  if (event.type === "lead.qualified") {
    const existing = await prisma.websiteLead.findUnique({ where: { leadId: event.leadId } });
    const merged = { ...((existing?.data as Record<string, unknown> | null) ?? {}), ...d, ...meta } as Prisma.InputJsonValue;
    const known = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined));
    return prisma.websiteLead.upsert({
      where: { leadId: event.leadId },
      update: { ...known, data: merged, qualifiedAt: new Date(event.at) },
      create: { leadId: event.leadId, kind: "LOAN_ENQUIRY", ...fields, data: merged, qualifiedAt: new Date(event.at), createdAt: new Date(event.at) },
    });
  }

  return prisma.websiteLead.upsert({
    where: { leadId: event.leadId },
    update: {},
    create: { leadId: event.leadId, kind: KIND_FOR_TYPE[event.type], ...fields, data: { ...d, ...meta } as Prisma.InputJsonValue, createdAt: new Date(event.at) },
  });
}
