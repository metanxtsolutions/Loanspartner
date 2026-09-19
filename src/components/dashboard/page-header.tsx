import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-ink-950 text-xl font-bold sm:text-2xl">{title}</h1>
        {subtitle ? <p className="text-mute mt-1 text-sm">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
