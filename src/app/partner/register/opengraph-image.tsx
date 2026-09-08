import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Register as a partner";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Partner application", title: "Register as a channel partner", subtitle: "Free, no obligation, and a partner manager calls within one working day." });
}
