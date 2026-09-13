import Link from "next/link";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { siteConfig, whatsappUrl } from "@/data/site-config";

/** Persistent bottom action bar on small screens. */
export function MobileCta() {
  return (
    <div
      className="border-line fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-2.5 backdrop-blur lg:hidden"
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-[3rem_3rem_1fr] gap-2">
        <a
          href={`tel:${siteConfig.contact.phone}`}
          aria-label="Call us"
          className="border-line bg-cream text-ink-900 flex h-12 items-center justify-center border"
        >
          <Phone className="size-5" />
        </a>
        <a
          href={whatsappUrl("Hi LoansPartner, I would like to check my loan eligibility.")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp us"
          className="border-line bg-cream text-brass-600 flex h-12 items-center justify-center border"
        >
          <MessageCircle className="size-5" />
        </a>
        <Link
          href="/apply"
          className="bg-brass-500 text-ink-950 flex h-12 items-center justify-center gap-2 text-sm font-bold"
        >
          Check eligibility <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
