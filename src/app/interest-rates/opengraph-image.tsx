import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Loan interest rates";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Indicative rates", title: "Loan interest rates in India", subtitle: "Rate ranges, fees, amounts and tenures across every product, reviewed monthly by our credit desk." });
}
