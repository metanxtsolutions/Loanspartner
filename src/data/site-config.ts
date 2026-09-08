/**
 * Single source of truth for brand, contact (NAP), navigation and claims.
 * Do not add numbers here that the business cannot substantiate.
 *
 * Every NEXT_PUBLIC_* variable below is read as a literal property access.
 * Next.js inlines these at build time by textual substitution, so a computed
 * lookup such as process.env[key] silently resolves to undefined in the
 * bundle and the override is lost. Keep the literal form.
 */
const or = (value: string | undefined, fallback: string) => (value && value.length > 0 ? value : fallback);

export const siteConfig = {
  name: "LoansPartner",
  legalName: or(process.env.NEXT_PUBLIC_LEGAL_NAME, "LoansPartner Financial Services"),
  url: or(process.env.NEXT_PUBLIC_SITE_URL, "https://loanspartner.in"),
  tagline: "Better loans begin with the right partner.",
  /** Long description for structured data (length is not penalised). */
  description:
    "LoansPartner is an independent loan advisory and distribution partner in India. We help salaried professionals, self-employed individuals and businesses compare personal loans, home loans, business loans, loans against property and vehicle loans from leading banks and NBFCs, with documentation support and a dedicated relationship manager, at zero cost to the borrower. We also run a channel partner (DSA) programme for professionals who want to distribute loans.",
  /** Short description for SERP snippets (under 160 characters). */
  metaDescription:
    "Compare personal, home, business and property loans from leading banks and NBFCs with expert guidance at zero borrower cost. Partner programme for loan DSAs.",
  foundedYear: 2019,
  locale: "en_IN",
  contact: {
    phone: or(process.env.NEXT_PUBLIC_PHONE, "+917029558200"),
    phoneDisplay: or(process.env.NEXT_PUBLIC_PHONE_DISPLAY, "+91 70295 58200"),
    whatsapp: or(process.env.NEXT_PUBLIC_WHATSAPP, "917029558200"),
    email: or(process.env.NEXT_PUBLIC_EMAIL, "info@loanspartner.in"),
    partnerEmail: or(process.env.NEXT_PUBLIC_PARTNER_EMAIL, "info@loanspartner.in"),
    grievanceEmail: or(process.env.NEXT_PUBLIC_GRIEVANCE_EMAIL, "info@loanspartner.in"),
    address: {
      street: or(process.env.NEXT_PUBLIC_ADDRESS_STREET, "SDF Building, GP Block, Sector V, Bidhannagar"),
      locality: or(process.env.NEXT_PUBLIC_ADDRESS_CITY, "Kolkata"),
      region: or(process.env.NEXT_PUBLIC_ADDRESS_STATE, "West Bengal"),
      postalCode: or(process.env.NEXT_PUBLIC_ADDRESS_PIN, "700091"),
      country: "IN",
    },
    hours: "Monday to Saturday, 9:30 am to 6:00 pm IST",
    openingHours: [
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:30", closes: "18:00" },
    ],
  },
  /**
   * Real, published profiles only. Every non-empty value is emitted as a
   * `sameAs` entry on the Organization schema, where a wrong or non-existent
   * URL is worse than no entry at all, and each one is also linked from the
   * footer so the claim is verifiable on the page itself.
   */
  social: {
    facebook: or(process.env.NEXT_PUBLIC_FACEBOOK, "https://www.facebook.com/loanspartner/"),
    instagram: or(process.env.NEXT_PUBLIC_INSTAGRAM, "https://www.instagram.com/loanspartner/"),
    linkedin: or(process.env.NEXT_PUBLIC_LINKEDIN, "https://www.linkedin.com/company/loanspartner/"),
    youtube: process.env.NEXT_PUBLIC_YOUTUBE ?? "",
    x: process.env.NEXT_PUBLIC_X ?? "",
  },
  /**
   * The only hard-coded proof point is the one we control absolutely. The
   * rest are counted from the data files at build time in <ProofStrip />,
   * so a claim can never drift from what the site actually publishes.
   */
  feeProof: { value: "₹0", label: "Fees charged to borrowers, ever" },
  editorialTeam: {
    name: "LoansPartner Credit Desk",
    description:
      "Our credit desk is a team of former bank and NBFC credit professionals who review every guide on this site for accuracy against current lender policies and RBI directions.",
    reviewer: "LoansPartner Credit Desk",
  },
  compliance: {
    dsaDisclosure:
      "LoansPartner is a loan distribution and advisory partner (Direct Selling Agent / Lending Service Provider) for regulated banks, housing finance companies and NBFCs. We do not lend money ourselves. Loan approval, interest rate, tenure and all terms are decided solely by the lender under its credit policy and the applicable RBI directions.",
    feeDisclosure:
      "We do not charge borrowers any fee, at any stage. Our remuneration is paid by the lender after disbursal. Never pay anyone claiming to represent us for loan approval, processing or insurance.",
    rateDisclaimer:
      "Interest rates, fees and eligibility shown on this site are indicative, vary by lender and borrower profile, and are subject to change without notice. Always read the lender's Key Fact Statement (KFS) before signing.",
  },
} as const;

export type NavItem = { label: string; href: string; description?: string };

export const mainNav: { label: string; href: string; children?: NavItem[] }[] = [
  { label: "Loans", href: "/loans" },
  { label: "Partner with us", href: "/partner" },
  { label: "Tools", href: "/tools" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
];

export const SITE_URL = siteConfig.url;
/** The root is written without a trailing slash so canonicals, breadcrumbs and the sitemap agree. */
export const absoluteUrl = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);
export const whatsappUrl = (text?: string) =>
  `https://wa.me/${siteConfig.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/**
 * One postal string for the footer and contact page. The postcode follows the
 * state with a space rather than a comma, which is how Indian addresses are
 * written, and empty parts are dropped so a partial address still reads well.
 */
export const formattedAddress = () => {
  const a = siteConfig.contact.address;
  const regionAndPin = [a.region, a.postalCode].filter(Boolean).join(" ");
  return [a.street, a.locality, regionAndPin, "India"].filter(Boolean).join(", ");
};
