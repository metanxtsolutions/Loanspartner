import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

export function ProofStrip({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-6 lg:grid-cols-4", className)}>
      {siteConfig.proof.map((p, i) => (
        <div key={p.label} data-reveal data-reveal-delay={i * 80} className={cn("border-l-2 pl-5", tone === "dark" ? "border-verdant-400" : "border-brass-400")}>
          <dd className={cn("display tnum text-4xl lg:text-5xl", tone === "dark" ? "text-white" : "text-ink-950")}>{p.value}</dd>
          <dt className={cn("mt-2 text-sm", tone === "dark" ? "text-white/60" : "text-mute")}>{p.label}</dt>
        </div>
      ))}
    </dl>
  );
}
