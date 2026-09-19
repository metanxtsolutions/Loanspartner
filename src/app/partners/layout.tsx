import type { ReactNode } from "react";

/**
 * Thin pass-through. The (auth) route group holds /partners/login and
 * /partners/register (unauthenticated), and the (app) route group holds
 * every authenticated page behind its own guarded layout, see
 * src/app/partners/(app)/layout.tsx. Route groups don't affect the URL, so
 * this file must not itself call requirePartner() or every child would
 * inherit that gate, including the login/register pages.
 */
export default function PartnersLayout({ children }: { children: ReactNode }) {
  return children;
}
