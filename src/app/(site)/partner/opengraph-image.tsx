import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Partner programme";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Channel partner programme",
    title: "One partner code, our whole lender panel. We process, you earn.",
    subtitle: "Free registration, published payout slabs, processing and compliance handled by our credit desk.",
  });
}
