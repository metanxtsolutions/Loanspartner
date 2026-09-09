import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { getLender } from "@/data/lenders";

export const alt = "Lending partner";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = getLender(slug);
  return renderOgImage({
    eyebrow: l ? l.type : "Lending partner",
    title: l ? l.name : "Lending partner",
    subtitle: l?.bestFor,
  });
}
