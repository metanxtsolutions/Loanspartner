import { requirePartner } from "@/server/dashboard/access";
import { PageHeader } from "@/components/dashboard/page-header";
import { LeadForm } from "@/components/partner/lead-form";
import { productOptions, cityOptions } from "@/data/lite";

export default async function NewLeadPage() {
  await requirePartner();

  return (
    <>
      <PageHeader
        title="Submit a lead"
        subtitle="Tell us about the customer and what they need. We'll create their application and keep you posted on it."
      />
      <div className="border-line bg-cream max-w-2xl border p-6">
        <LeadForm products={productOptions} cities={cityOptions} />
      </div>
    </>
  );
}
