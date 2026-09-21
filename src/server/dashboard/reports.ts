import "server-only";
import { prisma } from "@/server/db";
import { productOption } from "@/data/lite";

export async function funnelByStatus() {
  const rows = await prisma.loanApplication.groupBy({ by: ["status"], _count: { _all: true } });
  return rows.map((r) => ({ status: r.status, count: r._count._all }));
}

export async function conversionByProduct() {
  const rows = await prisma.loanApplication.groupBy({ by: ["productSlug", "status"], _count: { _all: true } });
  const byProduct = new Map<string, { total: number; disbursed: number }>();
  for (const row of rows) {
    const entry = byProduct.get(row.productSlug) ?? { total: 0, disbursed: 0 };
    entry.total += row._count._all;
    if (row.status === "DISBURSED") entry.disbursed += row._count._all;
    byProduct.set(row.productSlug, entry);
  }
  return [...byProduct.entries()]
    .map(([slug, v]) => ({ slug, name: productOption(slug)?.name ?? slug, total: v.total, disbursed: v.disbursed, rate: v.total ? Math.round((v.disbursed / v.total) * 100) : 0 }))
    .sort((a, b) => b.total - a.total);
}

export async function partnerLeaderboard(limit = 10) {
  const partners = await prisma.user.findMany({
    where: { role: "PARTNER" },
    select: {
      id: true,
      name: true,
      applicationsAsPartner: { select: { status: true, sanctionedAmount: true } },
    },
  });
  return partners
    .map((p) => {
      const disbursedApps = p.applicationsAsPartner.filter((a) => a.status === "DISBURSED");
      return {
        id: p.id,
        name: p.name,
        totalLeads: p.applicationsAsPartner.length,
        disbursedCount: disbursedApps.length,
        disbursedVolume: disbursedApps.reduce((sum, a) => sum + (a.sanctionedAmount ?? 0), 0),
      };
    })
    .filter((p) => p.totalLeads > 0)
    .sort((a, b) => b.disbursedVolume - a.disbursedVolume)
    .slice(0, limit);
}

export async function commissionPayableSummary() {
  const [accrued, approved, paid] = await Promise.all([
    prisma.commissionEntry.aggregate({ where: { status: "ACCRUED" }, _sum: { amount: true }, _count: { _all: true } }),
    prisma.commissionEntry.aggregate({ where: { status: "APPROVED" }, _sum: { amount: true }, _count: { _all: true } }),
    prisma.commissionEntry.aggregate({ where: { status: "PAID" }, _sum: { amount: true }, _count: { _all: true } }),
  ]);
  return {
    accrued: { amount: accrued._sum.amount ?? 0, count: accrued._count._all },
    approved: { amount: approved._sum.amount ?? 0, count: approved._count._all },
    paid: { amount: paid._sum.amount ?? 0, count: paid._count._all },
  };
}
