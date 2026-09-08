import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Disclaimer";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Legal", title: "Disclaimer", subtitle: "Rates, fees and calculator outputs are indicative. Lenders decide every loan and its terms." });
}
