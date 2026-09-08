import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site-config";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Brand-consistent social card. System fonts only, so it renders offline at build time. */
export function renderOgImage({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  const long = title.length > 70;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "linear-gradient(135deg, #0B1B33 0%, #10264A 60%, #163464 100%)", color: "white", fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <div style={{ position: "absolute", right: -160, top: -160, width: 520, height: 520, borderRadius: 9999, background: "rgba(18,153,111,0.22)", filter: "blur(40px)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="13" fill="#F7F5EF" /><path d="M13 31c0-8.3 6.7-15 15-15h7" stroke="#0B1B33" strokeWidth="4" strokeLinecap="round" /><path d="M35 17c0 8.3-6.7 15-15 15h-7" stroke="#12996F" strokeWidth="4" strokeLinecap="round" /><circle cx="35" cy="17" r="3" fill="#CFAE5E" /></svg>
          <div style={{ display: "flex", fontSize: 34, letterSpacing: -1 }}>Loans<span style={{ color: "#3FB48E" }}>Partner</span></div>
          {eyebrow && <div style={{ marginLeft: "auto", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, letterSpacing: 3, textTransform: "uppercase", color: "#CFAE5E", fontWeight: 700 }}>{eyebrow}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: long ? 52 : 64, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1000 }}>{title}</div>
          {subtitle && <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 26, lineHeight: 1.35, color: "rgba(255,255,255,0.72)", maxWidth: 900 }}>{subtitle}</div>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "Helvetica, Arial, sans-serif", fontSize: 20, color: "rgba(255,255,255,0.6)" }}>
          <div>{siteConfig.url.replace(/^https?:\/\//, "")}</div>
          <div style={{ display: "flex", gap: 24 }}><span>Zero fee to borrowers</span><span>our lender panel</span><span>RBI-regulated lending only</span></div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
