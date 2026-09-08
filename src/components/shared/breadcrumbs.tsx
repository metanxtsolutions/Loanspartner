import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

/** Visual breadcrumb and its BreadcrumbList schema come from the same array. */
export function Breadcrumbs({ items, className, tone = "light" }: { items: Crumb[]; className?: string; tone?: "light" | "dark" }) {
  const all: Crumb[] = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className={cn("text-[13px]", className)}>
      <JsonLd data={breadcrumbSchema(all)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className={tone === "dark" ? "text-white/80" : "text-ink-900 font-semibold"}>
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className={cn("hover:underline underline-offset-4", tone === "dark" ? "text-white/60 hover:text-white" : "text-mute hover:text-ink-900")}>
                  {c.name}
                </Link>
              )}
              {!last && <ChevronRight className={cn("size-3.5", tone === "dark" ? "text-white/40" : "text-mute-2")} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
