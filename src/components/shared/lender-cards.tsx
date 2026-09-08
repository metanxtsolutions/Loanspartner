import Link from "next/link";
import { ArrowUpRight, Landmark } from "lucide-react";
import type { Lender } from "@/data/lenders";
import { Pill } from "@/components/shared/section";

export function LenderCards({ lenders, limit }: { lenders: Lender[]; limit?: number }) {
  const list = limit ? lenders.slice(0, limit) : lenders;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((l, i) => (
        <li key={l.slug} data-reveal data-reveal-delay={(i % 3) * 60}>
          <Link href={`/lenders/${l.slug}`} className="group flex h-full flex-col rounded-card border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-verdant-400/60 hover:shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-ink-50 text-ink-700"><Landmark className="size-5" /></span>
              <ArrowUpRight className="size-4 text-mute-2 group-hover:text-verdant-600" />
            </div>
            <p className="mt-4 font-display text-xl text-ink-950">{l.name}</p>
            <Pill tone="sand" className="mt-2 w-fit">{l.type}</Pill>
            <p className="mt-3 line-clamp-2 text-sm text-mute">{l.bestFor}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
