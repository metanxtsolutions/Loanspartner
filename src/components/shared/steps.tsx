import { cn } from "@/lib/utils";

export function Steps({ steps, tone = "light", columns = false }: { steps: readonly (string | { name: string; text: string })[]; tone?: "light" | "dark"; columns?: boolean }) {
  return (
    <ol className={cn(columns ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-6")}>
      {steps.map((s, i) => {
        const name = typeof s === "string" ? undefined : s.name;
        const text = typeof s === "string" ? s : s.text;
        return (
          <li key={i} data-reveal data-reveal-delay={i * 70} className="flex gap-4">
            <span className={cn("display flex size-11 shrink-0 items-center justify-center rounded-full border text-lg", tone === "dark" ? "border-white/20 text-verdant-400" : "border-line bg-white text-verdant-700")}>{String(i + 1).padStart(2, "0")}</span>
            <div className="pt-1.5">
              {name && <p className={cn("font-bold", tone === "dark" ? "text-white" : "text-ink-900")}>{name}</p>}
              <p className={cn("text-[15px] leading-relaxed", tone === "dark" ? "text-white/70" : "text-mute", name && "mt-1")}>{text}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
