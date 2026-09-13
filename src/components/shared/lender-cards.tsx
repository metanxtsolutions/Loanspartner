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
          <Link
            href={`/lenders/${l.slug}`}
            className="group rounded-card border-line hover:border-brass-400/60 hover:shadow-soft flex h-full flex-col border bg-white p-5 transition-all hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="bg-ink-50 text-ink-700 flex size-10 items-center justify-center">
                <Landmark className="size-5" />
              </span>
              <ArrowUpRight className="text-mute-2 group-hover:text-brass-600 size-4" />
            </div>
            <p className="font-display text-ink-950 mt-4 text-xl">{l.name}</p>
            <Pill tone="sand" className="mt-2 w-fit">
              {l.type}
            </Pill>
            <p className="text-mute mt-3 line-clamp-2 text-sm">{l.bestFor}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
