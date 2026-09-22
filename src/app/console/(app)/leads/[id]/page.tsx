import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/server/dashboard/access";
import { getWebsiteLead } from "@/server/dashboard/leads";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusPill } from "@/components/dashboard/status-pill";
import { LeadStatusForm } from "@/components/console/lead-status-form";
import { LeadNoteForm } from "@/components/console/lead-note-form";
import { LeadConvertCustomerForm } from "@/components/console/lead-convert-customer-form";
import { LeadConvertPartnerForm } from "@/components/console/lead-convert-partner-form";
import { WEBSITE_LEAD_KIND_META, WEBSITE_LEAD_STATUS_META } from "@/lib/dashboard/statuses";
import { productOption, productOptions } from "@/data/lite";
import { formatINR, readableDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Website lead", robots: { index: false, follow: false } };

// Shown as their own fields above the table, so not repeated in "Everything they told us".
const HEADLINE_KEYS = new Set(["name", "phone", "email", "city", "product", "amount", "source", "consent", "leadId"]);

const LABELS: Record<string, string> = {
  employment: "Employment",
  monthlyIncome: "Monthly income",
  cibil: "CIBIL band",
  existingEmi: "Existing EMIs",
  profession: "Profession",
  entityType: "Entity type",
  experience: "Experience",
  products: "Products they want to sell",
  network: "Their network",
  subject: "Subject",
  message: "Message",
  note: "Note",
  ip: "IP address",
  userAgent: "Browser",
};

function label(key: string) {
  return LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function value(key: string, v: unknown) {
  if (Array.isArray(v)) return v.map((x) => (key === "products" ? (productOption(String(x))?.name ?? String(x)) : String(x))).join(", ");
  if (typeof v === "number") return key === "monthlyIncome" || key === "existingEmi" ? `₹${formatINR(v)}` : String(v);
  if (v === null || v === undefined || v === "") return "-";
  return String(v);
}

export default async function ConsoleLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("leads.manage");
  const { id } = await params;
  const lead = await getWebsiteLead(id);
  if (!lead) notFound();

  const kindMeta = WEBSITE_LEAD_KIND_META[lead.kind];
  const statusMeta = WEBSITE_LEAD_STATUS_META[lead.status];
  const data = lead.data as Record<string, unknown>;
  const details = Object.entries(data).filter(([k, v]) => !HEADLINE_KEYS.has(k) && v !== "" && v !== null && v !== undefined);
  const product = lead.productSlug ? productOption(lead.productSlug) : null;
  const canConvertToCustomer = lead.kind === "LOAN_ENQUIRY" || lead.kind === "CALLBACK";
  const canConvertToPartner = lead.kind === "PARTNER_INTEREST";

  return (
    <div>
      <Link href="/console/leads" className="text-mute hover:text-ink-900 mb-4 inline-block text-sm">
        &larr; All leads
      </Link>
      <PageHeader
        title={lead.name ?? "Unnamed lead"}
        subtitle={`${kindMeta.label} · received ${readableDate(lead.createdAt)}${lead.source ? ` · from ${lead.source}` : ""}`}
        action={
          <div className="flex gap-2">
            <StatusPill label={kindMeta.label} tone={kindMeta.tone} />
            <StatusPill label={statusMeta.label} tone={statusMeta.tone} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="border-line border p-5">
            <h2 className="text-ink-950 mb-4 text-sm font-bold tracking-wide uppercase">Contact</h2>
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-mute text-xs font-semibold uppercase">Phone</dt>
                <dd className="text-ink-900 mt-0.5 font-semibold">
                  {lead.phone ? (
                    <a href={`tel:+91${lead.phone}`} className="hover:text-brass-600 underline underline-offset-2">
                      +91 {lead.phone}
                    </a>
                  ) : (
                    "-"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-mute text-xs font-semibold uppercase">Email</dt>
                <dd className="text-ink-900 mt-0.5 font-semibold break-all">
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`} className="hover:text-brass-600 underline underline-offset-2">
                      {lead.email}
                    </a>
                  ) : (
                    "-"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-mute text-xs font-semibold uppercase">City</dt>
                <dd className="text-ink-900 mt-0.5 font-semibold">{lead.city ?? "-"}</dd>
              </div>
              {lead.kind !== "CONTACT" && lead.kind !== "PARTNER_INTEREST" ? (
                <div>
                  <dt className="text-mute text-xs font-semibold uppercase">Enquiry</dt>
                  <dd className="text-ink-900 mt-0.5 font-semibold">
                    {product?.name ?? lead.productSlug ?? "-"}
                    {lead.amount ? ` · ₹${formatINR(lead.amount)}` : ""}
                  </dd>
                </div>
              ) : null}
              {lead.qualifiedAt ? (
                <div>
                  <dt className="text-mute text-xs font-semibold uppercase">Completed step 2</dt>
                  <dd className="text-ink-900 mt-0.5 font-semibold">{readableDate(lead.qualifiedAt)}</dd>
                </div>
              ) : lead.kind === "LOAN_ENQUIRY" ? (
                <div>
                  <dt className="text-mute text-xs font-semibold uppercase">Completed step 2</dt>
                  <dd className="text-mute mt-0.5">No, stopped after the first step</dd>
                </div>
              ) : null}
              {lead.page ? (
                <div className="sm:col-span-2">
                  <dt className="text-mute text-xs font-semibold uppercase">Submitted from</dt>
                  <dd className="text-ink-900 mt-0.5 break-all">{lead.page}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="border-line border p-5">
            <h2 className="text-ink-950 mb-4 text-sm font-bold tracking-wide uppercase">Everything they told us</h2>
            {details.length === 0 ? (
              <p className="text-mute text-sm">Nothing beyond the contact details above.</p>
            ) : (
              <dl className="grid grid-cols-1 gap-3 text-sm">
                {details.map(([k, v]) => (
                  <div key={k} className="border-line grid grid-cols-1 gap-1 border-b pb-3 last:border-b-0 last:pb-0 sm:grid-cols-3">
                    <dt className="text-mute text-xs font-semibold uppercase">{label(k)}</dt>
                    <dd className="text-ink-900 whitespace-pre-wrap sm:col-span-2">{value(k, v)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          {lead.status === "CONVERTED" ? (
            <section className="border-verdant-100 bg-verdant-50 border p-5">
              <h2 className="text-verdant-700 mb-2 text-sm font-bold tracking-wide uppercase">Converted</h2>
              <div className="flex flex-wrap gap-3 text-sm">
                {lead.convertedUserId ? (
                  <Link href={canConvertToPartner ? "/console/partners" : "/console/users"} className="text-ink-900 font-semibold underline underline-offset-2">
                    View account
                  </Link>
                ) : null}
                {lead.convertedApplicationId ? (
                  <Link href={`/console/applications/${lead.convertedApplicationId}`} className="text-ink-900 font-semibold underline underline-offset-2">
                    View application
                  </Link>
                ) : null}
              </div>
            </section>
          ) : canConvertToCustomer ? (
            <section className="border-brass-300 bg-brass-50 border p-5">
              <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Convert to a customer</h2>
              <LeadConvertCustomerForm
                leadId={lead.id}
                products={productOptions}
                defaults={{ email: lead.email ?? "", product: lead.productSlug ?? "", amount: lead.amount, city: lead.city ?? "" }}
              />
            </section>
          ) : canConvertToPartner ? (
            <section className="border-brass-300 bg-brass-50 border p-5">
              <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Convert to a partner</h2>
              <LeadConvertPartnerForm leadId={lead.id} email={lead.email} />
            </section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-6">
          <section className="border-line border p-5">
            <LeadStatusForm leadId={lead.id} current={lead.status} />
          </section>
          <section className="border-line border p-5">
            <LeadNoteForm leadId={lead.id} initialNote={lead.internalNote} />
          </section>
        </aside>
      </div>
    </div>
  );
}
