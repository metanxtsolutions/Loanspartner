import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/section";
import { ButtonLink } from "@/components/shared/button";
import { products } from "@/data/products";

export default function NotFound() {
  return (
    <Section tone="paper" className="!py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow text-verdant-600">404</p>
        <h1 className="display mt-4 text-4xl text-ink-950 sm:text-5xl">That page has moved or never existed.</h1>
        <p className="mt-4 text-lg text-mute">The loan you are looking for is probably one of these.</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {products.slice(0, 6).map((p) => (<li key={p.slug}><Link href={`/loans/${p.slug}`} className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink-800 hover:border-verdant-500 hover:text-verdant-700">{p.name}</Link></li>))}
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><ButtonLink href="/">Go home</ButtonLink><ButtonLink href="/apply" variant="secondary">Check eligibility <ArrowRight className="size-4" /></ButtonLink></div>
      </div>
    </Section>
  );
}
