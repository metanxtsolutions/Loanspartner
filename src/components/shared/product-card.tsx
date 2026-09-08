import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductIcon } from "@/components/shared/product-icon";
import type { LoanProduct } from "@/data/products";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ProductCard({ product, href, cityName, className, delay = 0 }: { product: LoanProduct; href?: string; cityName?: string; className?: string; delay?: number }) {
  const link = href ?? `/loans/${product.slug}`;
  return (
    <Link
      href={link}
      data-reveal
      data-reveal-delay={delay}
      className={cn("group relative flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-verdant-400/60 hover:shadow-lift", className)}
    >
      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-verdant-50 text-verdant-700 transition-colors group-hover:bg-verdant-600 group-hover:text-white">
          <ProductIcon icon={product.icon} className="size-5" />
        </span>
        <ArrowUpRight className="size-5 text-mute-2 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-verdant-600" aria-hidden />
      </div>
      <h3 className="mt-5 font-display text-[1.35rem] leading-tight text-ink-950">
        {product.name}{cityName ? ` in ${cityName}` : ""}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mute">{product.summary}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-xs">
        <div><dt className="text-mute">Rate from</dt><dd className="tnum mt-0.5 text-base font-bold text-ink-900">{product.rate.from.toFixed(2)}%<span className="text-xs font-semibold text-mute"> p.a.</span></dd></div>
        <div><dt className="text-mute">Up to</dt><dd className="tnum mt-0.5 text-base font-bold text-ink-900">₹{formatINR(product.amount.max, { compact: true })}</dd></div>
      </dl>
    </Link>
  );
}
