import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({ children, className, id, tone = "paper" }: { children: ReactNode; className?: string; id?: string; tone?: "paper" | "cream" | "ink" | "white" }) {
  const tones = {
    paper: "bg-paper",
    cream: "bg-cream",
    white: "bg-white",
    ink: "bg-ink-900 text-white",
  };
  return (
    <section id={id} className={cn("section-y", tones[tone], className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)} data-reveal>
      {eyebrow && <p className={cn("eyebrow mb-3", tone === "dark" ? "text-verdant-400" : "text-verdant-600")}>{eyebrow}</p>}
      <h2 className={cn("display text-3xl sm:text-4xl lg:text-[2.75rem]", tone === "dark" ? "text-white" : "text-ink-950")}>{title}</h2>
      {lede && <p className={cn("mt-4 text-[1.05rem] leading-relaxed", tone === "dark" ? "text-white/70" : "text-mute")}>{lede}</p>}
    </div>
  );
}

export function Card({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "article" | "li" }) {
  return <Tag className={cn("rounded-card border border-line bg-white shadow-soft", className)}>{children}</Tag>;
}

export function Pill({ children, className, tone = "sand" }: { children: ReactNode; className?: string; tone?: "sand" | "verdant" | "brass" | "ink" | "outline" }) {
  const tones = {
    sand: "bg-sand text-ink-800",
    verdant: "bg-verdant-100 text-verdant-700",
    brass: "bg-brass-100 text-brass-600",
    ink: "bg-ink-900 text-white",
    outline: "border border-white/25 text-white/90",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold", tones[tone], className)}>{children}</span>;
}
