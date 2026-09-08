import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { getProduct } from "@/data/products";

export const alt = "Product DSA programme";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = slug.endsWith("-dsa") ? getProduct(slug.slice(0, -4)) : undefined;
  return renderOgImage({ eyebrow: "DSA programme", title: p ? `${p.name} DSA: earn ${p.dsa.payoutFrom}% to ${p.dsa.payoutTo}%` : "DSA programme", subtitle: p?.dsa.pitch });
}
