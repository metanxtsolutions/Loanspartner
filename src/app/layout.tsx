import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { RevealObserver } from "@/components/layout/reveal";
import { Analytics } from "@/components/layout/analytics";
import { JsonLd } from "@/components/shared/json-ld";
import { organizationSchema, webSiteSchema } from "@/lib/schema";
import { siteConfig } from "@/data/site-config";
import { cityNames } from "@/data/cities";
import { navData } from "@/data/lite";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", axes: ["opsz", "SOFT"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name}: Loan Advisory and DSA Partner in India`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.metaDescription,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.legalName,
  keywords: ["loan advisory India", "loan DSA", "personal loan", "home loan", "business loan", "loan against property", "become loan DSA", "loan channel partner"],
  alternates: { canonical: siteConfig.url, languages: { "en-IN": siteConfig.url } },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.metaDescription,
  },
  twitter: { card: "summary_large_image", title: `${siteConfig.name}: ${siteConfig.tagline}`, description: siteConfig.metaDescription },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "finance",
  // Search Console ownership token for https://loanspartner.in. Public by
  // design: Google requires it to be readable in the page source.
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "zrBMnCOyWz2w5FtBJUO8ekDCJVQJ-ykw4qaA_3DpuqQ" },
};

export const viewport: Viewport = {
  themeColor: "#0b1b33",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col pb-[4.5rem] lg:pb-0">
        <JsonLd data={[organizationSchema({ cities: cityNames }), webSiteSchema()]} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
        <Header nav={navData} phone={siteConfig.contact.phone} phoneDisplay={siteConfig.contact.phoneDisplay} />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
        <MobileCta />
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
