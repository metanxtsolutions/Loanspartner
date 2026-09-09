import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "EMI calculator";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Free tool",
    title: "EMI calculator",
    subtitle: "Monthly instalment, total interest and a year by year repayment schedule for any loan.",
  });
}
