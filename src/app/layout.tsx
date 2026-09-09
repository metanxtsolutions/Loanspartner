import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/site-config";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

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
  keywords: [
    "loan advisory India",
    "loan DSA",
    "personal loan",
    "home loan",
    "business loan",
    "loan against property",
    "become loan DSA",
    "loan channel partner",
  ],
  alternates: { canonical: siteConfig.url, languages: { "en-IN": siteConfig.url } },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name}: ${siteConfig.tagline}`,
    description: siteConfig.metaDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  category: "finance",
  // Search Console ownership token for https://loanspartner.in. Public by
  // design: Google requires it to be readable in the page source.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "zrBMnCOyWz2w5FtBJUO8ekDCJVQJ-ykw4qaA_3DpuqQ",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b1b33",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/**
 * Deliberately free of request-time APIs (headers(), cookies()) so every
 * page under here can still prerender as static HTML. The public site's
 * chrome (Header/Footer/Analytics/JsonLd) lives in (site)/layout.tsx, and
 * /admin has its own layout tree; neither needs anything from this file
 * beyond fonts and the html/body shell.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${instrumentSerif.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
