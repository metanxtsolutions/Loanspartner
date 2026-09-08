import Link from "next/link";

export function Toc({ items, title = "On this page" }: { items: { id: string; label: string }[]; title?: string }) {
  return (
    <nav aria-label={title} className="rounded-card border border-line bg-white p-5">
      <p className="eyebrow text-mute">{title}</p>
      <ol className="mt-3 space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.id}><Link href={`#${it.id}`} className="text-ink-800 hover:text-verdant-700">{it.label}</Link></li>
        ))}
      </ol>
    </nav>
  );
}
