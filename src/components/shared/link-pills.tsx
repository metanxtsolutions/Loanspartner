import Link from "next/link";
import { cn } from "@/lib/utils";

export function LinkPills({
  title,
  links,
  className,
  tone = "light",
}: {
  title?: string;
  links: { label: string; href: string }[];
  className?: string;
  tone?: "light" | "dark";
}) {
  if (!links.length) return null;
  return (
    <div className={className}>
      {title && <p className={cn("eyebrow mb-3", tone === "dark" ? "text-white/60" : "text-mute")}>{title}</p>}
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={`${l.href}::${l.label}`}>
            <Link
              href={l.href}
              className={cn(
                "inline-block border px-3.5 py-1.5 text-[13px] font-semibold transition-colors",
                tone === "dark"
                  ? "border-white/20 text-white/85 hover:bg-white/10"
                  : "border-line text-ink-800 hover:border-brass-500 hover:text-brass-600 bg-white",
              )}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
