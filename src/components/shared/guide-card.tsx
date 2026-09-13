import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { Guide } from "@/data/guides";
import { readableDate } from "@/lib/utils";
import { Pill } from "@/components/shared/section";

export function GuideCard({ guide, delay = 0 }: { guide: Guide; delay?: number }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      data-reveal
      data-reveal-delay={delay}
      className="group rounded-card border-line shadow-soft hover:shadow-lift flex h-full flex-col border bg-white p-6 transition-all hover:-translate-y-1"
    >
      <div className="flex items-center justify-between gap-3">
        <Pill tone="sand">{guide.category}</Pill>
        <span className="text-mute flex items-center gap-1 text-xs">
          <Clock className="size-3.5" /> {guide.readTime}
        </span>
      </div>
      <h3 className="font-display text-ink-950 group-hover:text-brass-600 mt-4 text-[1.3rem] leading-snug">
        {guide.title}
      </h3>
      <p className="text-mute mt-3 line-clamp-3 text-sm leading-relaxed">{guide.excerpt}</p>
      <div className="text-mute mt-auto flex items-center justify-between pt-5 text-xs">
        <span>Updated {readableDate(guide.updatedDate)}</span>
        <span className="text-brass-600 inline-flex items-center gap-1 font-bold">
          Read <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
