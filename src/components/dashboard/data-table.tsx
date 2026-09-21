import type { ReactNode } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/dashboard/empty-state";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

/**
 * Presentational only: search/filter is done server-side via URL query
 * params on the page that renders this (see e.g. /console/applications),
 * so the table itself needs no client JavaScript. When `rowHref` is given,
 * the first column's content becomes the row's link rather than an
 * absolutely-positioned overlay, which stays well-behaved inside <table>
 * layout and needs no extra CSS positioning context.
 */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyTitle,
  emptyBody,
  rowHref,
}: {
  columns: Column<T>[];
  rows: T[];
  emptyTitle: string;
  emptyBody?: string;
  rowHref?: (row: T) => string;
}) {
  if (rows.length === 0) return <EmptyState title={emptyTitle} body={emptyBody} />;

  return (
    <div className="border-line overflow-x-auto border">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-line bg-cream border-b text-left">
            {columns.map((col) => (
              <th key={col.key} scope="col" className="text-mute px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const href = rowHref?.(row);
            return (
              <tr key={row.id} className="border-line hover:bg-cream/70 border-b last:border-b-0">
                {columns.map((col, i) => (
                  <td key={col.key} className={`text-ink-900 px-4 py-3 align-middle ${col.className ?? ""}`}>
                    {href && i === 0 ? (
                      <Link href={href} className="text-ink-950 hover:text-brass-600 font-semibold underline decoration-transparent underline-offset-2 hover:decoration-current">
                        {col.render(row)}
                      </Link>
                    ) : (
                      col.render(row)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
