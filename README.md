# LoansPartner

Production website for **loanspartner.in**: a loan advisory and distribution (DSA) brand serving borrowers and channel partners across India. Built on Next.js 16 (App Router), React 19, Tailwind CSS v4 and TypeScript, with a data-first SEO architecture.

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in contact details and lead sinks
pnpm dev                     # http://localhost:3000
```

```bash
pnpm check     # lint + typecheck + copy gate; must pass before shipping
pnpm build     # production build (prerenders ~270 URLs)
pnpm start
```

## What is in the box

| Area | Route(s) | Source of truth |
|---|---|---|
| Home | `/` | `src/app/page.tsx` |
| Loan products (12) | `/loans`, `/loans/[product]` | `src/data/products.ts` |
| Product × city (5 core × 16 cities) | `/loans/[product]/[city]` | `src/data/cities-batch-*.ts` |
| City hubs | `/cities`, `/cities/[city]` | `src/data/cities.ts` |
| Partner programme | `/partner`, `/partner/register`, `/partner/commission`, `/partner/[product]-dsa`, `/partner/for/[audience]` | `src/data/partner.ts`, `products.ts` |
| Lenders (26) | `/lenders`, `/lenders/[slug]` | `src/data/lenders.ts` |
| Tools | `/tools/*` (EMI, eligibility, balance transfer, DSA income) | `src/components/tools/*` |
| Guides (13) | `/guides`, `/guides/[slug]` | `src/data/guides-batch-*.ts` |
| Glossary (40) | `/glossary`, `/glossary/[term]` | `src/data/glossary.ts` |
| Rates, FAQs, About, Contact, legal, grievance | top-level routes | page files + `site-config.ts` |
| Lead capture | `/apply` (2-step), callback and partner forms | `src/actions/leads.ts`, `src/lib/leads/*` |
| SEO plumbing | `sitemap.xml`, `robots.txt`, `manifest`, OG images, JSON-LD | `src/app/sitemap.ts`, `src/lib/seo.ts`, `src/lib/schema.ts` |

## Before launch: things only the business can fill in

1. **Contact and NAP.** The phone number (+91 70295 58200) and email (info@loanspartner.in) are live in `site-config.ts`. The partner and grievance addresses both point at `info@` because that is the one confirmed mailbox; split them out by setting `NEXT_PUBLIC_PARTNER_EMAIL` and `NEXT_PUBLIC_GRIEVANCE_EMAIL` once those inboxes exist. The registered address is SDF Building, GP Block, Sector V, Bidhannagar, Kolkata, West Bengal 700091, which also drives the postal address in the Organization and LocalBusiness schema and the jurisdiction clause in the terms. The Facebook, Instagram and LinkedIn profiles are the real ones; they are linked from the footer and emitted as `sameAs` on the Organization schema, so only add a profile here once it actually exists.
2. **`foundedYear`** in `src/data/site-config.ts`, used on the About page. The headline proof numbers are counted from the data at build time in `ProofStrip`, so they cannot overstate what the site publishes; the only hard-coded one is the zero-fee claim.
3. **Lender list** in `src/data/lenders.ts`: keep aligned with live empanelments. The published partner count on the home page is `lenders.length`, so adding or removing a row moves the number on the page. Replace text wordmarks in `LenderMarquee` with approved logo files once agreements are on record.
4. **Lead sinks** in `.env.local`: at least one of `LEAD_WEBHOOK_URL` (Google Sheet / CRM), or `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL`. In development leads also append to `.data/leads.jsonl`.
5. **Analytics**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
6. **Named experts** for E-E-A-T: guides currently carry an organisational byline (`siteConfig.editorialTeam`). Add real reviewer names and credentials when available.
7. **Legal review** of `/privacy-policy`, `/terms`, `/disclaimer`, `/grievance-redressal` and the compliance strings in `site-config.ts`.

## Architecture notes

- **Every entity carries its own `keywords`, `faqs` and `updatedAt`.** Metadata, FAQPage schema and internal links are pure functions of the data row. Add a city or product and its pages, schema, breadcrumbs and internal links appear with no route changes.
- **The server/client boundary is guarded by `src/data/lite.ts`.** Data files hold long-form copy, so a `"use client"` component that imported one would ship every city profile and product description to the browser. Client components take small `ProductLite` / `CityLite` / `AudienceLite` props (types in `src/data/lite-types.ts`, which has no runtime imports) built server-side in `lite.ts`. Same reason `src/lib/leads/options.ts` exists: it holds the plain option arrays so a form never pulls in the zod schema, which imports the product data. Keeping this discipline is worth roughly 450KB of client JavaScript.
- **Sitemap `lastmod` is the last git commit date of the file a URL's content comes from**, not the build time, so rebuilding does not re-date unchanged pages and editing one city file moves only that city's URLs. It falls back to the declared `updatedAt` when git history is unavailable.
- **`pageMetadata()`** in `src/lib/seo.ts` sets title, description (clamped to 158 chars), canonical, hreflang, Open Graph and Twitter for every page. Bare titles use the root template; social cards get the expanded title.
- **`src/lib/schema.ts`** holds pure JSON-LD builders (Organization/FinancialService, WebSite, WebPage, BreadcrumbList, FAQPage, Service + LoanOrCredit, local FinancialService with `areaServed`, Article, HowTo, ItemList, DefinedTerm, WebApplication). One real organisation and address; city pages use `areaServed`, never fabricated branches.
- **Breadcrumbs emit their own BreadcrumbList schema** from the same array that renders, so markup and structured data cannot drift.
- **Lead flow is save-first.** Step 1 (product, amount, phone) creates the lead before step 2 qualification, so an abandoned form still yields a contactable lead. Anti-abuse: honeypot, minimum time-on-form, in-memory rate limit. Swap the limiter for Redis on multi-instance hosting.
- **Copy gate** (`pnpm check:copy`) fails on en/em dashes and warns on filler words, to keep programmatic pages from drifting into template prose.
- **No fabricated social proof.** There are no testimonials or disbursal totals in the code. Add them only with real, consented data. Regulatory statements (RBI pre-payment and gold lending directions, the Key Fact Statement, the DPDP Act, income-tax section numbering) are deliberately hedged and dated; re-check them before each content refresh rather than restating them as settled fact.
- **Accessibility choices that are easy to undo by accident:** form controls use `--color-line-strong` for a 3:1 boundary, the duplicated half of the lender marquee is `aria-hidden` and non-focusable, icon-only comparison cells carry `sr-only` text, and data tables use `scope` on row and column headers.

## Outreach platform (internal, `/admin/outreach`)

A password-gated internal tool for running lender partnership outreach: it seeds a CRM from the real `src/data/lenders.ts` roster, researches each lender's own website for a real partnership or DSA contact, drafts a personalised proposal with Claude, and queues it for a human to approve before anything sends through Resend. Replies land in the same queue after classification. Nothing sends without a person clicking approve; see `src/actions/outreach/*` for every mutation and `prisma/schema.prisma` for the data model.

**Setup**

```bash
# 1. Postgres. Any provider works locally or in prod; Neon integrates cleanly with Vercel.
#    DATABASE_URL goes in .env.local (see .env.example for the full list of outreach vars).
pnpm db:push                        # sync the schema (use db:migrate for a tracked prod migration)
pnpm outreach:seed                  # load the 26 lenders from src/data/lenders.ts
pnpm outreach:create-admin -- --email you@loanspartner.in --password "..."
pnpm outreach:discover-contacts     # visits each lender's own site for a real contact email
```

Then set `ANTHROPIC_API_KEY` (drafting and reply classification), confirm `RESEND_API_KEY` and `OUTREACH_FROM_EMAIL` (outbound send, reusing the Resend account above), and `OUTREACH_IMAP_*` on a dedicated mailbox such as `partnerships@loanspartner.in` (reply monitoring, use an app password). `CRON_SECRET` protects the two scheduled routes in `vercel.json`; `RESEND_WEBHOOK_SECRET` verifies delivery/open/bounce webhooks from Resend. The settings page at `/admin/outreach/settings` shows which of these are configured.

**How it is wired**

- **Data model:** `Lender` → `Contact` (one or more, confidence-scored) → `OutreachMessage` (proposals, follow-ups, replies; one thread per contact). `ActivityLog` records every state change; `Note` is free-text per lender.
- **Contact discovery** (`src/server/outreach/contactDiscovery.ts`) fetches a lender's own site and a handful of likely pages (`/partner`, `/dsa`, `/contact`, ...) and extracts real published emails, scored HIGH/MEDIUM/LOW by how partnership-relevant the address looks. It never invents an address; a lender with nothing published comes back empty and is flagged for manual research.
- **AI drafting** (`src/server/outreach/ai.ts`) grounds every proposal, follow-up and reply strictly in the lender facts already in `src/data/lenders.ts` and the real LoansPartner facts in `site-config.ts`. The prompts explicitly forbid inventing numbers, volumes, or claimed relationships.
- **Sending** (`src/server/outreach/email.ts`) enforces a daily cap and a minimum gap between sends (both configurable in Settings), checks the contact has not opted out, retries transient Resend errors, and never re-sends a proposal already delivered to the same contact.
- **Replies and follow-ups** run from two Vercel Cron routes (`/api/outreach/cron/poll-replies`, `/api/outreach/cron/send-followups`), both requiring `Authorization: Bearer $CRON_SECRET`. Polling classifies each reply and drafts a response; sending it always needs a human click. Follow-ups stop the moment a lender's status leaves `CONTACTED` (a reply or opt-out flips it), matching the required "stop immediately" behaviour.
- **Everything the marketing site's copy gate and bundle discipline apply here too:** this code lives under `src/server/outreach` and `src/actions/outreach`, is never imported from a `"use client"` file, and the admin route tree opts out of the public site's header, footer, analytics and JSON-LD (see the `x-pathname` branch in `src/app/layout.tsx` and `src/middleware.ts`).

**Before it can run live outreach:** the four external services above (Postgres, Anthropic, Resend, the reply mailbox) all need real credentials, and the `partnerships@loanspartner.in`-style mailbox needs to actually exist and be reachable by IMAP. Until then the CRM, contact discovery and manual-entry paths all work with just `DATABASE_URL` set; drafting and sending are the parts gated on the other keys.

## Adding content

- **New city:** append a `City` object to a `cities-batch-*.ts` file (all fields required, including a unique `productNotes` paragraph for each core product). Pages at `/cities/[slug]` and `/loans/[product]/[slug]` build automatically.
- **New product:** append to `products.ts`. Set `core: true` to generate city pages for it.
- **New guide:** append to a `guides-batch-*.ts` file. Sections become the table of contents; `faqs` become FAQPage schema.
- **New glossary term or lender:** append to the respective data file.

## Deployment

Live at **https://loanspartner.in**. The apex is the canonical host: canonical tags, the sitemap, `robots.txt` and all JSON-LD emit `https://loanspartner.in`, which is the built-in default, so no `NEXT_PUBLIC_SITE_URL` needs to be set anywhere. In Vercel's domain settings the apex must be the primary domain and `www` must redirect to it. If that is ever reversed, every canonical will point at a redirecting URL.

Deploy with `npx vercel@latest --prod --yes`. Note that two Vercel projects have served this site: the one reachable from this repo's CLI login (team `metanxt`, aliased to `loanspartnerin.vercel.app`) and a second project in another Vercel account that holds the custom domain and builds from GitHub. Pushing to `main` updates the domain; the CLI deploy updates only the `vercel.app` alias.

Every `NEXT_PUBLIC_*` value in `site-config.ts` is read as a literal `process.env.NEXT_PUBLIC_X` property access. Next.js inlines these by textual substitution at build time, so a computed lookup like `process.env[key]` resolves to undefined in the bundle and the override is silently lost. Keep the literal form when adding new ones.

Any Node 20+ host works. Set the environment variables from `.env.example`. Security headers, redirects and image settings live in `next.config.ts`. After DNS cutover: submit `https://loanspartner.in/sitemap.xml` in Search Console, validate a product, a city and a guide page in the Rich Results Test, and confirm `robots.txt` lists the sitemap.
