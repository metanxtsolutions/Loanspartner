import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "About LoansPartner";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "About us",
    title: "A credit desk that works for the borrower, paid by the lender",
    subtitle:
      "Former bank and NBFC credit professionals, zero fee to borrowers, and advice that names the cheaper product.",
  });
}
