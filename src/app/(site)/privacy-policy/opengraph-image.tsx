import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Privacy policy";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Legal",
    title: "Privacy policy",
    subtitle: "What we collect, why, who we share it with, and your rights under the DPDP Act.",
  });
}
