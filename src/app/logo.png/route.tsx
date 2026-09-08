import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/** 512x512 PNG logo for schema.org and manifest consumers that prefer raster. */
export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B1B33", borderRadius: 120 }}>
        <svg width="360" height="360" viewBox="0 0 48 48" fill="none"><path d="M13 31c0-8.3 6.7-15 15-15h7" stroke="#F7F5EF" strokeWidth="4" strokeLinecap="round" /><path d="M35 17c0 8.3-6.7 15-15 15h-7" stroke="#12996F" strokeWidth="4" strokeLinecap="round" /><circle cx="35" cy="17" r="3" fill="#CFAE5E" /></svg>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
