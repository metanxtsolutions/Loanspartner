import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { getProduct } from "@/data/products";

export const alt = "Loan product";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ product: string }> }) {
  const { product } = await params;
  const p = getProduct(product);
  return renderOgImage({ eyebrow: "Loan product", title: p ? `${p.name} from ${p.rate.from.toFixed(2)}% p.a.` : "Loan product", subtitle: p?.tagline });
}
