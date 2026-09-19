"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell, type NotificationItem } from "@/components/dashboard/notification-bell";

export type NavItem = { href: string; label: string; icon: ReactNode };
export type NavSection = { title?: string; items: NavItem[] };

export function DashboardShell({
  brand,
  sections,
  userName,
  userSubtitle,
  banner,
  notifications,
  unreadCount,
  markAllReadAction,
  signOutAction,
  children,
}: {
  brand: string;
  sections: NavSection[];
  userName: string;
  userSubtitle: string;
  banner?: ReactNode;
  notifications: NotificationItem[];
  unreadCount: number;
  markAllReadAction: () => Promise<void>;
  signOutAction: () => Promise<void>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => (href === sections[0]?.items[0]?.href ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  const Nav = (
    <nav aria-label="Dashboard navigation" className="flex flex-col gap-6 px-4 py-6">
      {sections.map((section, i) => (
        <div key={section.title ?? i} className="flex flex-col gap-1">
          {section.title ? <p className="text-mute-2 px-3 pb-1 text-[11px] font-bold tracking-wide uppercase">{section.title}</p> : null}
          {section.items.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition",
                  active ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-ink-100",
                )}
              >
                <span className="shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="bg-paper text-ink-950 min-h-dvh">
      <a href="#dashboard-main" className="sr-only focus:not-sr-only focus:bg-brass-300 focus:text-ink-950 focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2">
        Skip to content
      </a>

      <header className="border-line bg-cream sticky top-0 z-30 border-b">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen((v) => !v)} className="text-ink-800 hover:bg-ink-100 -ml-1 flex size-10 items-center justify-center lg:hidden" aria-label="Toggle navigation" aria-expanded={mobileOpen}>
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <Link href="/" className="text-ink-950 text-sm font-bold">
              LoansPartner <span className="text-mute font-medium">/ {brand}</span>
            </Link>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <NotificationBell notifications={notifications} unreadCount={unreadCount} markAllReadAction={markAllReadAction} />
            <div className="border-line mx-1 hidden h-6 border-l sm:block" />
            <div className="hidden text-right sm:block">
              <p className="text-ink-900 text-sm leading-tight font-semibold">{userName}</p>
              <p className="text-mute-2 text-xs leading-tight">{userSubtitle}</p>
            </div>
            <form action={signOutAction}>
              <button type="submit" className="text-ink-700 hover:bg-ink-100 flex size-10 items-center justify-center" aria-label="Sign out">
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        <aside className="border-line bg-cream sticky top-[57px] hidden h-[calc(100dvh-57px)] w-64 shrink-0 overflow-y-auto border-r lg:block">{Nav}</aside>

        {mobileOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/30" />
            <aside className="bg-cream border-line relative h-full w-72 max-w-[80vw] overflow-y-auto border-r">{Nav}</aside>
          </div>
        ) : null}

        <main id="dashboard-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {banner}
          {children}
        </main>
      </div>
    </div>
  );
}
