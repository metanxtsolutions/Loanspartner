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

/**
 * Everything public-site-specific lives here rather than in the root
 * layout, so the root layout stays free of request-time APIs (headers(),
 * cookies()) and the marketing pages keep prerendering as static HTML.
 * /admin has its own layout tree and never renders this one.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col pb-[4.5rem] lg:pb-0">
      <JsonLd data={[organizationSchema({ cities: cityNames }), webSiteSchema()]} />
      <a
        href="#main"
        className="focus:bg-ink-900 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header nav={navData} phone={siteConfig.contact.phone} phoneDisplay={siteConfig.contact.phoneDisplay} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileCta />
      <RevealObserver />
      <Analytics />
    </div>
  );
}
