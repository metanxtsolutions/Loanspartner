import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Check your loan eligibility";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Free eligibility check", title: "Tell us what you need", subtitle: "Two minutes, no documents yet, no fee, and no impact on your credit score." });
}
