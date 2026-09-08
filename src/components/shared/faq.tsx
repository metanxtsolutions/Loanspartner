import { Plus } from "lucide-react";
import type { Faq } from "@/data/products";
import { cn } from "@/lib/utils";

/** Native details/summary accordion: works without JS, keyboard accessible. */
export function FaqList({ faqs, className, tone = "light" }: { faqs: readonly Faq[]; className?: string; tone?: "light" | "dark" }) {
  return (
    <div className={cn("divide-y", tone === "dark" ? "divide-white/10" : "divide-line", className)}>
      {faqs.map((f, i) => (
        <details key={i} className="group py-1">
          <summary className={cn("flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-left text-[15px] font-bold", tone === "dark" ? "text-white" : "text-ink-900")}>
            <span>{f.question}</span>
            <span className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full transition-transform group-open:rotate-45", tone === "dark" ? "bg-white/10 text-white" : "bg-sand text-ink-800")}>
              <Plus className="size-3.5" aria-hidden />
            </span>
          </summary>
          <p className={cn("pb-5 pr-10 text-[15px] leading-relaxed", tone === "dark" ? "text-white/70" : "text-mute")}>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
