import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { getCity } from "@/data/cities";

export const alt = "Loans in city";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const c = getCity(city);
  return renderOgImage({
    eyebrow: c ? c.state : "City desk",
    title: c ? `Loans in ${c.name}` : "Loans by city",
    subtitle: c?.tagline,
  });
}
