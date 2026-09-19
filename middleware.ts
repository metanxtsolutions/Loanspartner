import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/dashboard/session-token";

/**
 * Single choke point for the three dashboard-platform role trees. Deliberately
 * new for this repo (the existing /admin/outreach tool guards itself in its
 * own layout.tsx instead) because three role trees with many nested pages
 * don't scale safely with a per-page guard: forgetting one is a real
 * "broken access control" risk. Each layout still re-checks server-side as
 * defense in depth (see src/server/dashboard/access.ts).
 *
 * Does NOT touch /admin/** at all — that tree keeps its own separate login
 * and session cookie, untouched by this feature.
 */
const PUBLIC_PARTNER_PATHS = ["/partners/login", "/partners/register", "/partners/forgot-password", "/partners/reset-password"];
const PUBLIC_CONSOLE_PATHS = ["/console/login", "/console/forgot-password", "/console/reset-password"];

function isPublic(pathname: string, prefix: "/partners" | "/console") {
  const list = prefix === "/partners" ? PUBLIC_PARTNER_PATHS : PUBLIC_CONSOLE_PATHS;
  return list.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? verifySessionToken(token) : null;

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  };

  if (pathname.startsWith("/dashboard")) {
    if (!session || session.role !== "CUSTOMER") return redirectTo("/login");
  } else if (pathname.startsWith("/partners") && !isPublic(pathname, "/partners")) {
    if (!session || session.role !== "PARTNER") return redirectTo("/partners/login");
  } else if (pathname.startsWith("/console") && !isPublic(pathname, "/console")) {
    if (!session || session.role !== "ADMIN") return redirectTo("/console/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/partners/:path*", "/console/:path*"],
};
