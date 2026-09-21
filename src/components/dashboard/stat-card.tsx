import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "brass" | "verdant" | "danger";
  className?: string;
}) {
  const toneClasses = {
    default: "border-line bg-cream",
    brass: "border-brass-300 bg-brass-50",
    verdant: "border-verdant-100 bg-verdant-50",
    danger: "border-danger-50 bg-danger-50",
  }[tone];

  return (
    <div className={cn("border p-5", toneClasses, className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-mute text-xs font-semibold tracking-wide uppercase">{label}</p>
        {icon ? <span className="text-ink-400" aria-hidden="true">{icon}</span> : null}
      </div>
      <p className="text-ink-950 mt-2 text-2xl font-bold">{value}</p>
      {hint ? <p className="text-mute mt-1 text-xs">{hint}</p> : null}
    </div>
  );
}
