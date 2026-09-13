import { JsonLd } from "@/components/shared/json-ld";
import { webPageSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Section } from "@/components/shared/section";
import { readableDate } from "@/lib/utils";

export function LegalPage({
  title,
  description,
  path,
  updated,
  children,
}: {
  title: string;
  description: string;
  path: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, path, dateModified: updated })} />
      <Section tone="paper" className="!pt-8">
        <Breadcrumbs items={[{ name: title, path }]} className="mb-8" />
        <div className="max-w-3xl">
          <h1 className="display text-ink-950 text-4xl sm:text-5xl">{title}</h1>
          <p className="text-mute mt-3 text-sm">Last updated {readableDate(updated)}</p>
          <div className="prose-lp mt-10">{children}</div>
        </div>
      </Section>
    </>
  );
}
