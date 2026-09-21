import type { ApplicationStatus } from "@prisma/client";
import { APPLICATION_PIPELINE, APPLICATION_STATUS_META } from "@/lib/dashboard/statuses";

/**
 * Horizontal magnitude bars for the application pipeline's happy-path
 * stages. A single series (one funnel) needs one hue, not a categorical
 * palette (see the dataviz skill's choosing-a-form guidance), so every bar
 * uses the same brand accent (brass-500 on an ink-100 track) and stages are
 * told apart by their direct labels, not by color. Side-branch statuses
 * (rejected/withdrawn/on hold/draft) are not part of the linear happy path,
 * so they're summarised separately beneath the chart rather than mixed into
 * the same bars.
 *
 * Static server-rendered SVG with native <title> tooltips rather than a
 * custom JS hover layer: a deliberate simplification for this internal
 * admin tool; there is no crosshair or pointer-tracked tooltip.
 */
export function FunnelChart({ counts }: { counts: { status: ApplicationStatus; count: number }[] }) {
  const byStatus = new Map(counts.map((c) => [c.status, c.count]));
  const pipelineRows = APPLICATION_PIPELINE.map((status) => ({ status, count: byStatus.get(status) ?? 0 }));
  const sideStatuses: ApplicationStatus[] = ["DRAFT", "ON_HOLD", "REJECTED", "WITHDRAWN"];
  const sideRows = sideStatuses.map((status) => ({ status, count: byStatus.get(status) ?? 0 })).filter((r) => r.count > 0);

  const max = Math.max(1, ...pipelineRows.map((r) => r.count));
  const barHeight = 26;
  const gap = 12;
  const labelWidth = 150;
  const trackWidth = 420;
  const width = labelWidth + trackWidth + 56;
  const height = pipelineRows.length * (barHeight + gap);

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Applications by pipeline stage" className="w-full" style={{ maxWidth: width }}>
        {pipelineRows.map((row, i) => {
          const y = i * (barHeight + gap);
          const barWidth = Math.max(row.count > 0 ? 4 : 0, (row.count / max) * trackWidth);
          return (
            <g key={row.status}>
              <title>
                {APPLICATION_STATUS_META[row.status].label}: {row.count}
              </title>
              <text x={labelWidth - 10} y={y + barHeight / 2} textAnchor="end" dominantBaseline="middle" fontSize="12" fontWeight={600} fill="#5b6473">
                {APPLICATION_STATUS_META[row.status].label}
              </text>
              <rect x={labelWidth} y={y} width={trackWidth} height={barHeight} rx={4} fill="#e8eef8" />
              <rect x={labelWidth} y={y} width={barWidth} height={barHeight} rx={4} fill="#a87f3d" />
              <text x={labelWidth + trackWidth + 10} y={y + barHeight / 2} dominantBaseline="middle" fontSize="12" fontWeight={700} fill="#06101f">
                {row.count}
              </text>
            </g>
          );
        })}
      </svg>

      {sideRows.length > 0 ? (
        <dl className="border-line mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t pt-3 text-sm">
          {sideRows.map((row) => (
            <div key={row.status} className="flex items-center gap-1.5">
              <dt className="text-mute">{APPLICATION_STATUS_META[row.status].label}:</dt>
              <dd className="text-ink-950 font-semibold">{row.count}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
