import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.metaDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f5ef",
    theme_color: "#0b1b33",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }, { src: "/logo.png", sizes: "512x512", type: "image/png" }],
  };
}
