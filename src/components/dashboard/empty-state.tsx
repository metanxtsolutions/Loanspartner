import type { ReactNode } from "react";

export function EmptyState({ title, body, action, icon }: { title: string; body?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="border-line bg-cream flex flex-col items-center gap-3 border border-dashed px-6 py-14 text-center">
      {icon ? <span className="text-ink-300" aria-hidden="true">{icon}</span> : null}
      <p className="text-ink-900 text-sm font-semibold">{title}</p>
      {body ? <p className="text-mute max-w-sm text-sm">{body}</p> : null}
      {action}
    </div>
  );
}
