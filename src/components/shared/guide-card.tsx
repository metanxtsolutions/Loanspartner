import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Guide } from "@/data/guides";
import { readableDate } from "@/lib/utils";
import { Pill } from "@/components/shared/section";

export function GuideCard({ guide, delay = 0 }: { guide: Guide; delay?: number }) {
  return (
    <Link href={`/guides/${guide.slug}`} data-reveal data-reveal-delay={delay} className="group flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-center justify-between gap-3">
        <Pill tone="sand">{guide.category}</Pill>
        <span className="flex items-center gap-1 text-xs text-mute"><Clock className="size-3.5" /> {guide.readTime}</span>
      </div>
      <h3 className="mt-4 font-display text-[1.3rem] leading-snug text-ink-950 group-hover:text-verdant-700">{guide.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mute">{guide.excerpt}</p>
      <div className="mt-auto flex items-center justify-between pt-5 text-xs text-mute">
        <span>Updated {readableDate(guide.updatedDate)}</span>
        <span className="inline-flex items-center gap-1 font-bold text-verdant-700">Read <ArrowRight className="size-3.5" /></span>
      </div>
    </Link>
  );
}
