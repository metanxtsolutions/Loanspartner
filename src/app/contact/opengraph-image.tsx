import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Contact LoansPartner";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Contact", title: "Talk to a person", subtitle: "Borrowers, partners, lenders and media. One desk, one working day to reply." });
}
