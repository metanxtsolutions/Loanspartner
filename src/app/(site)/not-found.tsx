import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/not-found-content";

/**
 * The root layout declares index/follow for real pages. Without this override a
 * 404 answered with the root metadata emitted both that and Next's own noindex,
 * which is contradictory even though the status code already prevents indexing.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundContent />;
}
