import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONE = {
  warning: "border-brass-300 bg-brass-50 text-ink-900",
  danger: "border-danger-50 bg-danger-50 text-danger",
  info: "border-ink-200 bg-ink-50 text-ink-900",
};

export function Banner({ tone = "warning", title, body, action }: { tone?: keyof typeof TONE; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className={cn("mb-6 flex flex-col gap-2 border px-4 py-3 sm:flex-row sm:items-center sm:justify-between", TONE[tone])} role="status">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {body ? <p className="mt-0.5 text-sm opacity-90">{body}</p> : null}
      </div>
      {action}
    </div>
  );
}
