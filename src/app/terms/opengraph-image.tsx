import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Terms of use";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Legal", title: "Terms of use", subtitle: "Our role as a distribution partner, what we do not do, and the terms that govern this site." });
}
