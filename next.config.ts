import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
  },
  ...(process.env.NODE_ENV === "production"
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/(.*)\\.(svg|png|jpg|jpeg|webp|avif|ico|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      // Common legacy or guessed URLs collapse to canonical routes.
      { source: "/personal-loan", destination: "/loans/personal-loan", permanent: true },
      { source: "/home-loan", destination: "/loans/home-loan", permanent: true },
      { source: "/business-loan", destination: "/loans/business-loan", permanent: true },
      { source: "/loan-against-property", destination: "/loans/loan-against-property", permanent: true },
      { source: "/dsa", destination: "/partner", permanent: true },
      { source: "/become-a-partner", destination: "/partner", permanent: true },
      { source: "/emi-calculator", destination: "/tools/emi-calculator", permanent: true },
      { source: "/blog", destination: "/guides", permanent: true },
      { source: "/blog/:slug", destination: "/guides/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
