/**
 * Single source of truth for brand, contact (NAP), navigation and claims.
 * Values marked with `env` can be overridden without a code change.
 * Do not add numbers here that the business cannot substantiate.
 */
const env = (key: string, fallback: string) => process.env[key] ?? fallback;

export const siteConfig = {
  name: "LoansPartner",
  legalName: env("NEXT_PUBLIC_LEGAL_NAME", "LoansPartner Financial Services"),
  url: env("NEXT_PUBLIC_SITE_URL", "https://loanspartner.in"),
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
    phone: env("NEXT_PUBLIC_PHONE", "+919999900000"),
    phoneDisplay: env("NEXT_PUBLIC_PHONE_DISPLAY", "+91 99999 00000"),
    whatsapp: env("NEXT_PUBLIC_WHATSAPP", "919999900000"),
    email: env("NEXT_PUBLIC_EMAIL", "hello@loanspartner.in"),
    partnerEmail: env("NEXT_PUBLIC_PARTNER_EMAIL", "partners@loanspartner.in"),
    grievanceEmail: env("NEXT_PUBLIC_GRIEVANCE_EMAIL", "grievance@loanspartner.in"),
    address: {
      street: env("NEXT_PUBLIC_ADDRESS_STREET", ""),
      locality: env("NEXT_PUBLIC_ADDRESS_CITY", "Gurugram"),
      region: env("NEXT_PUBLIC_ADDRESS_STATE", "Haryana"),
      postalCode: env("NEXT_PUBLIC_ADDRESS_PIN", ""),
      country: "IN",
    },
    hours: "Monday to Saturday, 9:30 am to 6:00 pm IST",
    openingHours: [
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:30", closes: "18:00" },
    ],
  },
  social: {
    linkedin: env("NEXT_PUBLIC_LINKEDIN", "https://www.linkedin.com/company/loanspartner"),
    instagram: env("NEXT_PUBLIC_INSTAGRAM", "https://www.instagram.com/loanspartner.in"),
    youtube: env("NEXT_PUBLIC_YOUTUBE", ""),
    x: env("NEXT_PUBLIC_X", ""),
  },
  /**
   * Headline proof points. Keep these truthful; they render on the home page,
   * the About page and in the Organization schema description.
   */
  proof: [
    { value: "40+", label: "Bank and NBFC lending partners" },
    { value: "12", label: "Loan products under one roof" },
    { value: "₹0", label: "Fees charged to borrowers, ever" },
    { value: "48h", label: "Typical time to a lender decision" },
  ],
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
export const absoluteUrl = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
export const whatsappUrl = (text?: string) =>
  `https://wa.me/${siteConfig.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
