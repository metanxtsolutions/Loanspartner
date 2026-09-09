import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Lending partners";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Lending partners",
    title: "The panel behind every shortlist",
    subtitle: "Public sector banks, private banks, housing finance companies and NBFCs, and what each is best at.",
  });
}
