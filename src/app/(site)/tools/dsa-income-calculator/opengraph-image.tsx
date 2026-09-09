import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "DSA income calculator";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Free tool",
    title: "DSA income calculator",
    subtitle: "Model partner payouts from files closed, ticket size and your slab for each product.",
  });
}
