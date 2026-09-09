/**
 * Loads the lenders CRM table from src/data/lenders.ts, the same real
 * roster the public /lenders pages render from. Safe to run repeatedly: it
 * upserts by slug and never overwrites a lender's CRM status or contacts.
 *
 *   pnpm outreach:seed
 */
import { prisma } from "@/server/outreach/db";
import { lenders } from "@/data/lenders";

async function main() {
  let created = 0;
  let updated = 0;
  for (const lender of lenders) {
    const result = await prisma.lender.upsert({
      where: { slug: lender.slug },
      create: {
        slug: lender.slug,
        name: lender.name,
        website: lender.website,
        type: lender.type,
        products: lender.products,
        strengths: lender.strengths,
        summary: lender.summary,
        bestFor: lender.bestFor,
      },
      update: {
        name: lender.name,
        website: lender.website,
        type: lender.type,
        products: lender.products,
        strengths: lender.strengths,
        summary: lender.summary,
        bestFor: lender.bestFor,
      },
    });
    if (result.createdAt.getTime() === result.updatedAt.getTime()) created++;
    else updated++;
  }
  console.log(`Seeded ${lenders.length} lenders: ${created} created, ${updated} already present (refreshed).`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
