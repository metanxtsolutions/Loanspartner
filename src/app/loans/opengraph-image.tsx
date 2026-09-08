import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Loan products";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Loan products", title: "Twelve products, one desk that knows which lender wants your file", subtitle: "Personal, home, business, property and vehicle loans across banks, housing finance companies and NBFCs." });
}
