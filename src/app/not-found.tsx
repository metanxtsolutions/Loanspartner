import type { Metadata } from "next";
import SiteLayout from "@/app/(site)/layout";
import { NotFoundContent } from "@/components/layout/not-found-content";

/**
 * Catches a URL that matches no route segment at all, which Next renders
 * inside the bare root layout rather than (site)/layout.tsx, so this
 * brings its own chrome instead of assuming Header/Footer are already
 * there. See (site)/not-found.tsx for the in-tree case.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteLayout>
      <NotFoundContent />
    </SiteLayout>
  );
}
