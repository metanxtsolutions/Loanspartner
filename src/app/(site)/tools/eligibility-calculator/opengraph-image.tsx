import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Loan eligibility calculator";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Free tool",
    title: "Loan eligibility calculator",
    subtitle: "How much you can borrow on your income and existing EMIs, using the method lenders apply.",
  });
}
