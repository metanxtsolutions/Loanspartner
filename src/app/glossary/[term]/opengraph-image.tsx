import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { getTerm } from "@/data/glossary";

export const alt = "Loan glossary term";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params;
  const t = getTerm(term);
  return renderOgImage({ eyebrow: "Loan glossary", title: t ? t.term : "Loan glossary", subtitle: t?.short });
}
