import Link from "next/link";
import { ArrowRight, Handshake, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const paths = [
  {
    icon: UserRound,
    eyebrow: "I need a loan",
    title: "For borrowers",
    text: "Compare products, check eligibility without a bureau enquiry, and have one complete file processed to disbursal. Zero fee to you.",
    href: "/borrowers",
    cta: "How it works for borrowers",
  },
  {
    icon: Handshake,
    eyebrow: "I want to distribute loans",
    title: "For channel partners",
    text: "One partner code, our whole lender panel, processing handled by our desk. Free to join, no targets.",
    href: "/partner",
    cta: "Partner programme",
  },
];

/** The two ways into the site, side by side, so each audience finds its own page in one click. */
export function AudiencePaths({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-5 md:grid-cols-2", className)}>
      {paths.map((p, i) => (
        <Link
          key={p.href}
          href={p.href}
          data-reveal
          data-reveal-delay={i * 70}
          className="group rounded-card border-line shadow-soft hover:border-brass-400/60 hover:shadow-lift flex items-start gap-5 border bg-white p-6 transition-all hover:-translate-y-1"
        >
          <span className="bg-brass-50 text-brass-600 group-hover:bg-brass-500 flex size-11 shrink-0 items-center justify-center transition-colors group-hover:text-white">
            <p.icon className="size-5" aria-hidden />
          </span>
          <span>
            <span className="eyebrow text-mute block">{p.eyebrow}</span>
            <span className="font-display text-ink-950 group-hover:text-brass-600 mt-2 block text-2xl">{p.title}</span>
            <span className="text-mute mt-2 block text-sm leading-relaxed">{p.text}</span>
            <span className="text-brass-600 mt-4 inline-flex items-center gap-1 text-sm font-bold">
              {p.cta} <ArrowRight className="size-3.5" aria-hidden />
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}
