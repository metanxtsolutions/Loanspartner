import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "For borrowers";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "For borrowers",
    title: "Borrow once, from the right lender, with a credit desk on your side.",
    subtitle:
      "Compare loans from banks, HFCs and NBFCs, check eligibility with no bureau enquiry, and track your application. Zero fee.",
  });
}
