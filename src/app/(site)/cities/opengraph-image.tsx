import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Cities we serve";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Cities we serve",
    title: "Local desks, one national lender panel",
    subtitle:
      "Property rules, employer categories and lender appetite change by city. Our city pages explain what changes.",
  });
}
