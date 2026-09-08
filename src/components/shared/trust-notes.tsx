import { BadgeCheck, Clock3, ShieldCheck, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const notes = [
  { icon: Wallet, title: "Zero fee to borrowers", text: "Lenders pay us after disbursal. You never pay for advice, comparison or processing." },
  { icon: ShieldCheck, title: "RBI-regulated lenders only", text: "Every loan comes from a bank, HFC or NBFC, with a Key Fact Statement before you sign." },
  { icon: Clock3, title: "Working-hours contact only", text: "We call between 9:30 am and 6 pm, identify ourselves and the lender, and never pressure." },
  { icon: BadgeCheck, title: "Your data stays yours", text: "Shared only with the lender you choose, protected under the DPDP Act, deleted on request." },
];

export function TrustNotes({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {notes.map((n, i) => (
        <li key={n.title} data-reveal data-reveal-delay={i * 70} className={cn("rounded-card border p-5", tone === "dark" ? "border-white/10 bg-white/5" : "border-line bg-white")}>
          <n.icon className={cn("size-6", tone === "dark" ? "text-verdant-400" : "text-verdant-600")} aria-hidden />
          <p className={cn("mt-3 font-bold", tone === "dark" ? "text-white" : "text-ink-900")}>{n.title}</p>
          <p className={cn("mt-1.5 text-sm leading-relaxed", tone === "dark" ? "text-white/65" : "text-mute")}>{n.text}</p>
        </li>
      ))}
    </ul>
  );
}
