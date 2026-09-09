import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { ButtonLink } from "@/components/shared/button";
import { products } from "@/data/products";

/**
 * Shared between the two not-found boundaries this route-group layout
 * needs: src/app/(site)/not-found.tsx for misses inside the marketing
 * tree (already wrapped by that segment's layout), and src/app/not-found.tsx
 * for a URL that matches no segment at all, which Next renders inside the
 * bare root layout and so has to bring its own chrome.
 */
export function NotFoundContent() {
  return (
    <Section tone="paper" className="!py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-brass-600">404</p>
        <h1 className="display text-ink-950 mt-4 text-4xl sm:text-5xl">That page has moved or never existed.</h1>
        <p className="text-mute mt-4 text-lg">The loan you are looking for is probably one of these.</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {products.slice(0, 6).map((p) => (
            <li key={p.slug}>
              <Link
                href={`/loans/${p.slug}`}
                className="border-line text-ink-800 hover:border-brass-500 hover:text-brass-600 inline-block border bg-white px-3.5 py-1.5 text-[13px] font-semibold"
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Go home</ButtonLink>
          <ButtonLink href="/apply" variant="secondary">
            Check eligibility <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
