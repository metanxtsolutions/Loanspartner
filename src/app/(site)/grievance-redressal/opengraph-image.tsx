import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "Grievance redressal";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Grievance redressal",
    title: "If something went wrong, this is how it gets fixed",
    subtitle: "Four escalation levels, from our desk to the lender to the RBI Integrated Ombudsman Scheme.",
  });
}
