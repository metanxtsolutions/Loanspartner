import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Balance transfer calculator";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Free tool", title: "Balance transfer calculator", subtitle: "Whether switching your home loan actually saves money once the costs are counted." });
}
