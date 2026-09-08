import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline-light" | "brass";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-verdant-500 disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-verdant-600 text-white hover:bg-verdant-700 hover:shadow-glow active:translate-y-px",
  secondary: "bg-ink-900 text-white hover:bg-ink-800 active:translate-y-px",
  ghost: "text-ink-900 hover:bg-ink-100",
  light: "bg-white text-ink-900 hover:bg-cream shadow-soft active:translate-y-px",
  "outline-light": "border border-white/30 text-white hover:bg-white/10",
  brass: "bg-brass-300 text-ink-950 hover:bg-brass-400 active:translate-y-px",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function Button({ variant = "primary", size = "md", className, children, ...rest }: Common & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", className, children, href, ...rest }: Common & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
