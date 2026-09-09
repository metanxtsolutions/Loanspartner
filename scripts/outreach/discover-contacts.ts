/**
 * Visits each lender's own website and looks for a real, published
 * partnership, DSA, channel or business-development contact email. Only
 * records what it actually finds, with the source page, so every contact in
 * the CRM can be traced back to where it came from.
 *
 *   pnpm outreach:discover-contacts            # lenders with no contact yet
 *   pnpm outreach:discover-contacts -- --all    # re-check every lender
 */
import { prisma } from "@/server/outreach/db";
import { discoverLenderContacts } from "@/server/outreach/contactDiscovery";
import { logActivity } from "@/server/outreach/activity";

const all = process.argv.includes("--all");
const DELAY_MS = 1500;

async function main() {
  const lenders = await prisma.lender.findMany({
    where: all ? {} : { status: { in: ["NEW", "CONTACT_NEEDED"] } },
    include: { contacts: true },
    orderBy: { name: "asc" },
  });

  console.log(`Checking ${lenders.length} lender site(s) for a partnership contact.`);
  let foundHigh = 0;
  let foundSomething = 0;
  let foundNothing = 0;

  for (const lender of lenders) {
    process.stdout.write(`${lender.name}: `);
    try {
      const discovered = await discoverLenderContacts(lender.website);
      let created = 0;
      for (const d of discovered) {
        const existing = lender.contacts.find((c) => c.email === d.email);
        if (existing) continue;
        await prisma.contact.create({
          data: {
            lenderId: lender.id,
            email: d.email,
            confidence: d.confidence,
            sourceUrl: d.sourceUrl,
            sourceNote: d.sourceNote,
            isPrimary: false,
          },
        });
        created++;
      }

      const hasHigh = discovered.some((d) => d.confidence === "HIGH") || lender.contacts.some((c) => c.confidence === "HIGH");
      if (created > 0 || discovered.length > 0) {
        if (lender.status === "NEW") {
          await prisma.lender.update({ where: { id: lender.id }, data: { status: hasHigh ? "READY" : "CONTACT_NEEDED" } });
        }
        // Promote the best candidate to primary if nothing is marked primary yet.
        const stillNoPrimary = !(await prisma.contact.findFirst({ where: { lenderId: lender.id, isPrimary: true } }));
        if (stillNoPrimary) {
          const best = await prisma.contact.findFirst({ where: { lenderId: lender.id }, orderBy: [{ confidence: "asc" }] });
          if (best) await prisma.contact.update({ where: { id: best.id }, data: { isPrimary: true } });
        }
        console.log(`${created} new contact(s) found (${discovered.map((d) => `${d.email} [${d.confidence}]`).join(", ") || "none new"}).`);
        foundSomething++;
        if (hasHigh) foundHigh++;
      } else {
        if (lender.status === "NEW") await prisma.lender.update({ where: { id: lender.id }, data: { status: "CONTACT_NEEDED" } });
        console.log("no email found automatically, needs manual research.");
        foundNothing++;
      }
      await logActivity({ lenderId: lender.id, actor: "system (contact discovery)", action: "contact.discovery_run", meta: { found: discovered.length, created } });
    } catch (err) {
      console.log(`error: ${err instanceof Error ? err.message : String(err)}`);
    }
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  console.log(`\nDone. High-confidence contact found for ${foundHigh}/${lenders.length}. Something found for ${foundSomething}. Needs manual research: ${foundNothing}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
