import Link from "next/link";
import { cn } from "@/lib/utils";

export const PAGE_SIZE = 20;

export function paginate<T>(items: T[], page: number, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { rows: items.slice(start, start + pageSize), page: safePage, totalPages, total: items.length };
}

export function Pagination({ page, totalPages, basePath, searchParams }: { page: number; totalPages: number; basePath: string; searchParams?: Record<string, string | undefined> }) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams ?? {})) if (v) params.set(k, v);
    params.set("page", String(p));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between gap-3 text-sm">
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={page <= 1}
        className={cn("border-line px-3 py-1.5", page <= 1 ? "text-mute-2 pointer-events-none opacity-50" : "text-ink-800 hover:bg-cream border")}
      >
        Previous
      </Link>
      <span className="text-mute text-xs">
        Page {page} of {totalPages}
      </span>
      <Link
        href={hrefFor(page + 1)}
        aria-disabled={page >= totalPages}
        className={cn("border-line px-3 py-1.5", page >= totalPages ? "text-mute-2 pointer-events-none opacity-50" : "text-ink-800 hover:bg-cream border")}
      >
        Next
      </Link>
    </nav>
  );
}
