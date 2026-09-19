import type { Metadata } from "next";
import { requireAdmin } from "@/server/dashboard/access";
import { products } from "@/data/products";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = { title: "Products", robots: { index: false, follow: false } };

type ProductRow = (typeof products)[number] & { id: string };

export default async function ConsoleProductsPage() {
  await requireAdmin();
  const rows: ProductRow[] = products.map((p) => ({ ...p, id: p.slug }));

  const columns: Column<ProductRow>[] = [
    { key: "name", header: "Product", render: (p) => p.name },
    { key: "category", header: "Category", render: (p) => p.category },
    { key: "rate", header: "Rate", render: (p) => `${p.rate.from}% to ${p.rate.to}%` },
    { key: "amount", header: "Amount", render: (p) => `₹${formatINR(p.amount.min, { compact: true })} to ₹${formatINR(p.amount.max, { compact: true })}` },
    { key: "ticket", header: "DSA ticket size", render: (p) => p.dsa.ticketSize },
    { key: "payout", header: "DSA payout band", render: (p) => `${p.dsa.payoutFrom}% to ${p.dsa.payoutTo}%` },
  ];

  return (
    <div>
      <PageHeader title="Products" subtitle="Read-only reference of every loan product and its published DSA payout band." />
      <DataTable columns={columns} rows={rows} emptyTitle="No products configured" />
    </div>
  );
}
