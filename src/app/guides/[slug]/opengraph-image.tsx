import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { getGuide } from "@/data/guides";

export const alt = "Guide";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  return renderOgImage({ eyebrow: g?.category ?? "Guide", title: g?.title ?? "Guide", subtitle: g?.excerpt });
}
