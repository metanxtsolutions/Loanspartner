import "server-only";
import { prisma } from "@/server/db";
import { lenders, lenderTypes, type Lender } from "@/data/lenders";
import { logAudit } from "@/server/dashboard/audit";

export type LenderWithOpsStatus = Pick<Lender, "slug" | "name" | "shortName" | "type" | "products" | "website"> & {
  isAcceptingApplications: boolean;
  internalNote: string | null;
};

export async function listLendersWithOpsStatus(): Promise<LenderWithOpsStatus[]> {
  const settings = await prisma.lenderOpsSetting.findMany();
  const bySlug = new Map(settings.map((s) => [s.lenderSlug, s]));
  return lenders.map((l) => ({
    slug: l.slug,
    name: l.name,
    shortName: l.shortName,
    type: l.type,
    products: l.products,
    website: l.website,
    isAcceptingApplications: bySlug.get(l.slug)?.isAcceptingApplications ?? true,
    internalNote: bySlug.get(l.slug)?.internalNote ?? null,
  }));
}

export async function setLenderAcceptingApplications(params: { lenderSlug: string; isAcceptingApplications: boolean; internalNote?: string; actor: { id: string; role: "ADMIN" } }) {
  const setting = await prisma.lenderOpsSetting.upsert({
    where: { lenderSlug: params.lenderSlug },
    create: { lenderSlug: params.lenderSlug, isAcceptingApplications: params.isAcceptingApplications, internalNote: params.internalNote || null },
    update: { isAcceptingApplications: params.isAcceptingApplications, internalNote: params.internalNote || null },
  });
  await logAudit({ actorUserId: params.actor.id, actorRole: params.actor.role, action: "lender.ops_status_changed", entityType: "LenderOpsSetting", entityId: params.lenderSlug, meta: { isAcceptingApplications: params.isAcceptingApplications } });
  return setting;
}

export { lenderTypes };
