import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckList({ items, columns = 1, className, tone = "light" }: { items: readonly string[]; columns?: 1 | 2; className?: string; tone?: "light" | "dark" }) {
  return (
    <ul className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2", className)}>
      {items.map((it) => (
        <li key={it} className={cn("flex items-start gap-3 text-[15px] leading-relaxed", tone === "dark" ? "text-white/80" : "text-ink-800")}>
          <span className={cn("mt-1 flex size-5 shrink-0 items-center justify-center rounded-full", tone === "dark" ? "bg-verdant-500/25 text-verdant-400" : "bg-verdant-100 text-verdant-700")}><Check className="size-3" strokeWidth={3} /></span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
