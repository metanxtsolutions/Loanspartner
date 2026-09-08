/**
 * Pure JSON-LD builders. Each returns a plain object; pages stack several
 * <JsonLd /> siblings. One real organisation and address is reused with
 * `areaServed` for local pages. No fabricated branches or ratings.
 */
import { siteConfig, absoluteUrl } from "@/data/site-config";

const org = () => ({
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
});

const postalAddress = () => ({
  "@type": "PostalAddress",
  ...(siteConfig.contact.address.street ? { streetAddress: siteConfig.contact.address.street } : {}),
  addressLocality: siteConfig.contact.address.locality,
  addressRegion: siteConfig.contact.address.region,
  ...(siteConfig.contact.address.postalCode ? { postalCode: siteConfig.contact.address.postalCode } : {}),
  addressCountry: siteConfig.contact.address.country,
});

export function organizationSchema(opts: { cities?: readonly string[] } = {}) {
  const sameAs = Object.values(siteConfig.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "FinancialService"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png"), width: 512, height: 512 },
    image: absoluteUrl("/opengraph-image"),
    description: siteConfig.description,
    foundingDate: String(siteConfig.foundedYear),
    slogan: siteConfig.tagline,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: postalAddress(),
    areaServed: [
      { "@type": "Country", name: "India" },
      ...(opts.cities ?? []).map((name) => ({ "@type": "City", name })),
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
        hoursAvailable: siteConfig.contact.openingHours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
      },
      {
        "@type": "ContactPoint",
        email: siteConfig.contact.grievanceEmail,
        contactType: "customer support",
        areaServed: "IN",
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.metaDescription,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en-IN",
  };
}

export function webPageSchema(input: { name: string; description: string; path: string; type?: string; dateModified?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    "@id": `${absoluteUrl(input.path)}#webpage`,
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: "en-IN",
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageSchema(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * A loan product page: Service (what we do) plus LoanOrCredit (what the
 * borrower receives), with indicative APR range and amount range.
 */
export function loanProductSchema(input: {
  name: string;
  description: string;
  path: string;
  rateFrom: number;
  rateTo: number;
  amountMin: number;
  amountMax: number;
  tenureMaxMonths: number;
  areaServedName?: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `${input.name} advisory and distribution`,
        serviceType: input.name,
        description: input.description,
        url,
        provider: org(),
        areaServed: input.areaServedName
          ? { "@type": "City", name: input.areaServedName }
          : { "@type": "Country", name: "India" },
        offers: { "@type": "Offer", price: "0", priceCurrency: "INR", description: "No fee charged to the borrower." },
      },
      {
        "@type": "LoanOrCredit",
        "@id": `${url}#loan`,
        name: input.name,
        description: input.description,
        url,
        currency: "INR",
        amount: {
          "@type": "MonetaryAmount",
          currency: "INR",
          minValue: input.amountMin,
          maxValue: input.amountMax,
        },
        annualPercentageRate: {
          "@type": "QuantitativeValue",
          minValue: input.rateFrom,
          maxValue: input.rateTo,
          unitText: "percent per annum",
        },
        loanTerm: { "@type": "QuantitativeValue", maxValue: input.tenureMaxMonths, unitCode: "MON" },
        provider: org(),
      },
    ],
  };
}

/** One real business, scoped to an area. Never a fabricated branch. */
export function localServiceSchema(input: { name: string; description: string; path: string; areaServedName: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${absoluteUrl(input.path)}#localservice`,
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: postalAddress(),
    areaServed: { "@type": "City", name: input.areaServedName },
    parentOrganization: org(),
    priceRange: "Free for borrowers",
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  publishedDate: string;
  updatedDate: string;
  keywords: readonly string[];
  section?: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: [`${url}/opengraph-image`],
    datePublished: input.publishedDate,
    dateModified: input.updatedDate,
    author: {
      "@type": "Organization",
      name: siteConfig.editorialTeam.name,
      url: absoluteUrl("/about"),
      description: siteConfig.editorialTeam.description,
    },
    publisher: {
      ...org(),
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
    keywords: input.keywords.join(", "),
    ...(input.section ? { articleSection: input.section } : {}),
    inLanguage: "en-IN",
    isAccessibleForFree: true,
  };
}

export function howToSchema(input: { name: string; description: string; path: string; steps: { name: string; text: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    step: input.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
  };
}

export function itemListSchema(input: { name: string; path: string; items: { name: string; path: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    url: absoluteUrl(input.path),
    numberOfItems: input.items.length,
    itemListElement: input.items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}

export function definedTermSchema(input: { term: string; definition: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: input.term,
    description: input.definition,
    url: absoluteUrl(input.path),
    inDefinedTermSet: { "@type": "DefinedTermSet", name: `${siteConfig.name} Loan Glossary`, url: absoluteUrl("/glossary") },
  };
}

export function softwareToolSchema(input: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    provider: org(),
  };
}
