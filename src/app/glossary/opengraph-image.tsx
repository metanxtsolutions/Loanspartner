import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Loan glossary";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Glossary", title: "The vocabulary of Indian lending, without the jargon", subtitle: "CIBIL, FOIR, APR, the Key Fact Statement, loan to value and 35 more terms in plain language." });
}
