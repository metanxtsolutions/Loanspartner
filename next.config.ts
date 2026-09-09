import type { NextConfig } from "next";

/**
 * Scripts allow 'unsafe-inline' on purpose. Next.js emits inline bootstrap and
 * flight-data scripts on every page, and the alternative, per-request nonces,
 * needs middleware that would make every static page render dynamically.
 * The host allowlist is still the part that matters: it blocks a script
 * injected from anywhere we have not named. Revisit if a nonce becomes free.
 *
 * googletagmanager and google-analytics are the GA4 tag.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
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
      // Browsers and crawlers still probe /favicon.ico by convention.
      { source: "/favicon.ico", destination: "/icon.svg", permanent: true },
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
