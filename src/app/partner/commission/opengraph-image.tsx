import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "DSA commission structure";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Commission structure", title: "What you earn, product by product", subtitle: "Indicative payout slabs, typical ticket sizes and what a typical file pays." });
}
