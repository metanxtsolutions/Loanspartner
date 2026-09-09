import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { getProduct } from "@/data/products";
import { getCity } from "@/data/cities";

export const alt = "Loan product in city";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ product: string; city: string }> }) {
  const { product, city } = await params;
  const p = getProduct(product);
  const c = getCity(city);
  return renderOgImage({
    eyebrow: c ? `${c.name}, ${c.state}` : "City desk",
    title: p && c ? `${p.name} in ${c.name}` : "Loans by city",
    subtitle: c?.tagline,
  });
}
