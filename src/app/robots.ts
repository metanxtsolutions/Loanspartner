import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    // /apply/thank-you carries a noindex tag; it is deliberately not disallowed
    // here, because a blocked URL is one Googlebot can never read that tag from.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
