import { NextResponse } from "next/server";
import { requirePartner } from "@/server/dashboard/access";
import { listCommissionsForPartner } from "@/server/dashboard/commissions";

function csvCell(value: string) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/**
 * Re-derives the commission rows for the signed-in partner server-side,
 * nothing about which partner's data to export is taken from the request,
 * so there's no id or filter a caller could tamper with.
 */
export async function GET() {
  const user = await requirePartner();
  const commissions = await listCommissionsForPartner(user.id);

  const header = ["Application", "Product", "Base amount", "Rate (%)", "Commission", "Status", "Date"];
  const rows = commissions.map((c) => [
    c.application.code,
    c.application.productSlug,
    String(c.baseAmount),
    String(c.rate),
    String(c.amount),
    c.status,
    c.createdAt.toISOString(),
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="commissions-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
