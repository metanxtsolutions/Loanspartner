import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { getAudience } from "@/data/partner";

export const alt = "Partner programme";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params;
  const a = getAudience(audience);
  return renderOgImage({
    eyebrow: a ? `For ${a.short}` : "Partner programme",
    title: a?.headline ?? "Partner programme",
    subtitle: a?.summary.slice(0, 160),
  });
}
