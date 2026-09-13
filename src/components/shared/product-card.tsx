import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductIcon } from "@/components/shared/product-icon";
import type { LoanProduct } from "@/data/products";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  href,
  cityName,
  className,
  delay = 0,
}: {
  product: LoanProduct;
  href?: string;
  cityName?: string;
  className?: string;
  delay?: number;
}) {
  const link = href ?? `/loans/${product.slug}`;
  return (
    <Link
      href={link}
      data-reveal
      data-reveal-delay={delay}
      className={cn(
        "group rounded-card border-line shadow-soft hover:border-brass-400/60 hover:shadow-lift relative flex h-full flex-col border bg-white p-6 transition-all duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="bg-brass-50 text-brass-600 group-hover:bg-brass-500 flex size-11 items-center justify-center transition-colors group-hover:text-white">
          <ProductIcon icon={product.icon} className="size-5" />
        </span>
        <ArrowUpRight
          className="text-mute-2 group-hover:text-brass-600 size-5 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </div>
      <h3 className="font-display text-ink-950 mt-5 text-[1.35rem] leading-tight">
        {product.name}
        {cityName ? ` in ${cityName}` : ""}
      </h3>
      <p className="text-mute mt-2 line-clamp-3 text-sm leading-relaxed">{product.summary}</p>
      <dl className="border-line mt-5 grid grid-cols-2 gap-3 border-t pt-4 text-xs">
        <div>
          <dt className="text-mute">Rate from</dt>
          <dd className="tnum text-ink-900 mt-0.5 text-base font-bold">
            {product.rate.from.toFixed(2)}%<span className="text-mute text-xs font-semibold"> p.a.</span>
          </dd>
        </div>
        <div>
          <dt className="text-mute">Up to</dt>
          <dd className="tnum text-ink-900 mt-0.5 text-base font-bold">
            ₹{formatINR(product.amount.max, { compact: true })}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
