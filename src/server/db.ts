import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Dev-mode singleton (same pattern as src/server/outreach/db.ts, kept as a
 * separate file so the dashboard platform never imports from outreach/).
 * Both point at the same globalThis key, so in practice they share one
 * connection pool even though the files are independent.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
