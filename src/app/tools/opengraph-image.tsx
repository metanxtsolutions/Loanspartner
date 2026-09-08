import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Loan calculators";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Free tools", title: "Run the numbers before anyone runs them for you", subtitle: "EMI, eligibility, balance transfer and partner income calculators. No sign-up, nothing stored." });
}
