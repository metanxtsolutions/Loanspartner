import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Loan guides";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Guides",
    title: "How lending actually works, from people who did the underwriting",
    subtitle:
      "Eligibility, credit scores, balance transfers, business loan documents and staying safe from loan fraud.",
  });
}
