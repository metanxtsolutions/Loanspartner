import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Frequently asked questions";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Questions",
    title: "Straight answers before you apply",
    subtitle: "How we work, what we charge, what happens to your data, and how the partner programme pays.",
  });
}
