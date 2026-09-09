import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionEmail } from "@/server/outreach/auth";
import { SignOutButton } from "@/components/outreach/sign-out-button";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin/outreach", label: "Pipeline" },
  { href: "/admin/outreach/approvals", label: "Approvals" },
  { href: "/admin/outreach/analytics", label: "Analytics" },
  { href: "/admin/outreach/settings", label: "Settings" },
];

export default async function OutreachLayout({ children }: { children: React.ReactNode }) {
  const email = await getSessionEmail();
  if (!email) redirect("/admin/login");

  return (
    <div className="bg-paper text-ink-950 min-h-full">
      <header className="border-line bg-cream border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin/outreach" className="text-ink-950 text-sm font-semibold">
              LoansPartner <span className="text-mute">/ Outreach</span>
            </Link>
            <nav className="flex items-center gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-mute hover:bg-ink-100 hover:text-ink-900 px-3 py-1.5 text-sm transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="text-mute flex items-center gap-3 text-sm">
            <span>{email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
