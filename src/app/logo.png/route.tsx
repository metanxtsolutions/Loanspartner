import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/** 512x512 PNG logo for schema.org and manifest consumers that prefer raster. */
export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B1B33",
        borderRadius: 115,
      }}
    >
      <svg width="297" height="297" viewBox="0 0 100 100" fill="none">
        <path d="M27 14 V86 H70" stroke="#FBFAF7" strokeWidth="13" />
        <path d="M27 14 H51 a19.5 19.5 0 0 1 0 39 H27" stroke="#C6A15B" strokeWidth="13" />
      </svg>
    </div>,
    { width: 512, height: 512 },
  );
}
