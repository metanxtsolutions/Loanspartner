import type { Metadata } from "next";
import { requireCustomer } from "@/server/dashboard/access";
import { PageHeader } from "@/components/dashboard/page-header";
import { ApplicationForm } from "@/components/customer/application-form";
import { cityOptions, productOptions } from "@/data/lite";

export const metadata: Metadata = { title: "New loan enquiry" };

export default async function NewApplicationPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  await requireCustomer();
  const { product } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="New loan enquiry" subtitle="Tell us a bit about what you need and our desk will take it from there." />
      <ApplicationForm products={productOptions} cities={cityOptions} defaultProductSlug={product} />
    </div>
  );
}
