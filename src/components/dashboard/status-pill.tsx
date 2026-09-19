import { cn } from "@/lib/utils";
import type { StatusTone } from "@/lib/dashboard/statuses";

const TONE_CLASSES: Record<StatusTone, string> = {
  neutral: "bg-ink-100 text-ink-700",
  info: "bg-ink-100 text-ink-800",
  warning: "bg-brass-100 text-brass-600",
  success: "bg-verdant-100 text-verdant-700",
  danger: "bg-danger-50 text-danger",
};

export function StatusPill({ label, tone, className }: { label: string; tone: StatusTone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold whitespace-nowrap", TONE_CLASSES[tone], className)}>
      <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {label}
    </span>
  );
}
