import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, Card } from "@/components/shared/section";
import { ContactForm } from "@/components/forms/contact-form";
import { formattedAddress, siteConfig, whatsappUrl } from "@/data/site-config";
import Link from "next/link";

const title = "Contact LoansPartner";
const description = "Reach the LoansPartner credit desk and partner team by phone, WhatsApp, email or the contact form. Working hours Monday to Saturday, 9:30 am to 6 pm IST.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/contact", keywords: ["contact LoansPartner", "loan advisor contact", "loan DSA contact"] });

export default function ContactPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, path: "/contact", type: "ContactPage" })} />
      <PageHero crumbs={[{ name: "Contact", path: "/contact" }]} eyebrow="Contact" title="Talk to a person." lede="Borrowers, partners, lenders and media: one desk, one working day to reply." />
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <Card className="p-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-mute"><Phone className="size-4 text-verdant-600" /> Phone</p><a href={`tel:${siteConfig.contact.phone}`} className="mt-2 block font-display text-2xl text-ink-950 hover:text-verdant-700">{siteConfig.contact.phoneDisplay}</a></Card>
            <Card className="p-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-mute"><MessageCircle className="size-4 text-verdant-600" /> WhatsApp</p><a href={whatsappUrl("Hi LoansPartner, I have a question.")} target="_blank" rel="noopener noreferrer" className="mt-2 block font-bold text-ink-900 hover:text-verdant-700">Message the desk</a></Card>
            <Card className="p-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-mute"><Mail className="size-4 text-verdant-600" /> Email</p><ul className="mt-2 space-y-1 text-sm"><li>Borrowers: <a href={`mailto:${siteConfig.contact.email}`} className="font-bold text-ink-900 hover:text-verdant-700">{siteConfig.contact.email}</a></li><li>Partners: <a href={`mailto:${siteConfig.contact.partnerEmail}`} className="font-bold text-ink-900 hover:text-verdant-700">{siteConfig.contact.partnerEmail}</a></li><li>Complaints: <a href={`mailto:${siteConfig.contact.grievanceEmail}`} className="font-bold text-ink-900 hover:text-verdant-700">{siteConfig.contact.grievanceEmail}</a></li></ul></Card>
            <Card className="p-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-mute"><MapPin className="size-4 text-verdant-600" /> Office</p><p className="mt-2 text-sm text-ink-800">{formattedAddress()}</p><p className="mt-2 flex items-center gap-1.5 text-xs text-mute"><Clock3 className="size-3.5" /> {siteConfig.contact.hours}</p></Card>
            <p className="text-xs text-mute">Have a complaint? See our <Link href="/grievance-redressal" className="font-bold text-verdant-700 underline underline-offset-4">grievance redressal process</Link>.</p>
          </div>
          <Card className="p-6 sm:p-8"><p className="font-display text-2xl">Send a message</p><p className="mt-1 text-sm text-mute">We reply within one working day.</p><div className="mt-6"><ContactForm /></div></Card>
        </div>
      </Section>
    </>
  );
}
