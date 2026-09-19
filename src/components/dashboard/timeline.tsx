import { readableDate } from "@/lib/utils";

export type TimelineEntry = {
  id: string;
  label: string;
  note?: string | null;
  actorName?: string | null;
  createdAt: Date | string;
};

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  if (entries.length === 0) return <p className="text-mute text-sm">No activity yet.</p>;
  return (
    <ol className="flex flex-col gap-0">
      {entries.map((entry, i) => (
        <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
          <div className="flex flex-col items-center">
            <span className="bg-brass-500 mt-1 size-2.5 shrink-0 rounded-full" aria-hidden="true" />
            {i < entries.length - 1 ? <span className="bg-line w-px flex-1" aria-hidden="true" /> : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-ink-900 text-sm font-semibold">{entry.label}</p>
            {entry.note ? <p className="text-mute mt-0.5 text-sm">{entry.note}</p> : null}
            <p className="text-mute-2 mt-1 text-xs">
              {readableDate(entry.createdAt)}
              {entry.actorName ? ` · ${entry.actorName}` : ""}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
