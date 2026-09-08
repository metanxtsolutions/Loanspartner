import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { siteConfig } from "@/data/site-config";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Loan advisory partner", title: siteConfig.tagline, subtitle: siteConfig.metaDescription });
}
