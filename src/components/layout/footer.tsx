import Link from "next/link";
import { Mail, MapPin, Phone, ShieldAlert } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { products } from "@/data/products";
import { cities } from "@/data/cities";
import { partnerAudiences } from "@/data/partner";
import { formattedAddress, siteConfig } from "@/data/site-config";

const resourceLinks = [
  { label: "EMI calculator", href: "/tools/emi-calculator" },
  { label: "Eligibility calculator", href: "/tools/eligibility-calculator" },
  { label: "Balance transfer calculator", href: "/tools/balance-transfer-calculator" },
  { label: "DSA income calculator", href: "/tools/dsa-income-calculator" },
  { label: "Interest rates", href: "/interest-rates" },
  { label: "Guides", href: "/guides" },
  { label: "Loan glossary", href: "/glossary" },
  { label: "FAQs", href: "/faqs" },
];

const companyLinks = [
  { label: "About LoansPartner", href: "/about" },
  { label: "Lending partners", href: "/lenders" },
  { label: "Cities we serve", href: "/cities" },
  { label: "Contact", href: "/contact" },
  { label: "Grievance redressal", href: "/grievance-redressal" },
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of use", href: "/terms" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-950 text-white">
      <div className="container-x">
        <div className="grid gap-10 border-b border-white/10 py-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">{siteConfig.metaDescription}</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5 text-white/80"><Phone className="mt-0.5 size-4 shrink-0 text-verdant-400" /><a href={`tel:${siteConfig.contact.phone}`} className="hover:text-white">{siteConfig.contact.phoneDisplay}</a></li>
              <li className="flex items-start gap-2.5 text-white/80"><Mail className="mt-0.5 size-4 shrink-0 text-verdant-400" /><a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">{siteConfig.contact.email}</a></li>
              <li className="flex items-start gap-2.5 text-white/80"><MapPin className="mt-0.5 size-4 shrink-0 text-verdant-400" /><span>{formattedAddress()}</span></li>
            </ul>
            <p className="mt-4 text-xs text-white/50">{siteConfig.contact.hours}</p>
          </div>
          <FooterCol title="Loans" className="lg:col-span-2">
            {products.map((p) => (<FooterLink key={p.slug} href={`/loans/${p.slug}`}>{p.name}</FooterLink>))}
          </FooterCol>
          <FooterCol title="Cities" className="lg:col-span-2">
            {cities.map((c) => (<FooterLink key={c.slug} href={`/cities/${c.slug}`}>Loans in {c.name}</FooterLink>))}
          </FooterCol>
          <FooterCol title="Partner programme" className="lg:col-span-2">
            <FooterLink href="/partner">Become a channel partner</FooterLink>
            <FooterLink href="/partner/commission">DSA commission</FooterLink>
            <FooterLink href="/partner/register">Register free</FooterLink>
            {partnerAudiences.map((x) => (<FooterLink key={x.slug} href={`/partner/for/${x.slug}`}>For {x.short}</FooterLink>))}
          </FooterCol>
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-1">
            <FooterCol title="Resources">{resourceLinks.map((l) => (<FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>))}</FooterCol>
            <FooterCol title="Company">{companyLinks.map((l) => (<FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>))}</FooterCol>
          </div>
        </div>

        <div className="grid gap-6 py-8 text-xs leading-relaxed text-white/50 lg:grid-cols-2">
          <p>{siteConfig.compliance.dsaDisclosure}</p>
          <p>{siteConfig.compliance.rateDisclaimer}</p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2"><ShieldAlert className="size-4 text-brass-400" /> We never charge borrowers. Never pay anyone for loan approval in our name.</p>
          <p>© {year} {siteConfig.legalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="eyebrow mb-4 text-verdant-400">{title}</p>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li><Link href={href} className="text-sm text-white/70 transition-colors hover:text-white">{children}</Link></li>
  );
}
