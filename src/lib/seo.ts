import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

const MAX_DESCRIPTION = 158;

export function clampDescription(description: string, max = MAX_DESCRIPTION) {
  const clean = description.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : cut.length)}…`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  /** Override the auto-generated OG image route with an explicit image path. */
  image?: string;
};

/**
 * Every page calls this. Title is passed bare so the root template applies,
 * while social cards receive the fully expanded title.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
  image,
}: PageMetadataInput): Metadata {
  const url = `${siteConfig.url}${path}`;
  const socialTitle = `${title} | ${siteConfig.name}`;
  const safeDescription = clampDescription(description);

  return {
    title,
    description: safeDescription,
    keywords: keywords ? [...keywords] : undefined,
    alternates: { canonical: url, languages: { "en-IN": url } },
    openGraph: {
      title: socialTitle,
      description: safeDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(type === "article" ? { publishedTime, modifiedTime, authors: [siteConfig.name] } : {}),
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: socialTitle }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: safeDescription,
      ...(image ? { images: [image] } : {}),
    },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}
