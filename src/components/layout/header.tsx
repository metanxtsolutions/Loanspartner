"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { ButtonLink } from "@/components/shared/button";
import { ProductIcon } from "@/components/shared/product-icon";
import type { AudienceLite, CategoryLite, CityLite, NavData, ProductLite } from "@/data/lite-types";
import { cn } from "@/lib/utils";

const tools = [
  {
    label: "EMI calculator",
    href: "/tools/emi-calculator",
    description: "Monthly instalment and total interest for any loan.",
  },
  {
    label: "Loan eligibility calculator",
    href: "/tools/eligibility-calculator",
    description: "How much you can borrow on your income.",
  },
  {
    label: "Balance transfer calculator",
    href: "/tools/balance-transfer-calculator",
    description: "Savings from switching your home loan.",
  },
  {
    label: "DSA income calculator",
    href: "/tools/dsa-income-calculator",
    description: "Estimate partner payouts by product mix.",
  },
  {
    label: "Interest rates",
    href: "/interest-rates",
    description: "Indicative rates across products, updated monthly.",
  },
  { label: "Loan glossary", href: "/glossary", description: "CIBIL, FOIR, KFS, LTV and 30 more terms explained." },
];

const partnerLinks = [
  { label: "Partner programme", href: "/partner", description: "How the channel partner model works." },
  { label: "DSA commission", href: "/partner/commission", description: "Indicative payouts by product." },
  {
    label: "Register as a partner",
    href: "/partner/register",
    description: "Two-minute application, free onboarding.",
  },
];

type MenuKey = "loans" | "partner" | "tools";

export function Header({ nav, phone, phoneDisplay }: { nav: NavData; phone: string; phoneDisplay: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const drawerId = `${menuId}-drawer`;
  const toggleRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close everything when the route changes, without an effect-driven re-render.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const closeAll = useCallback(() => {
    setOpen(null);
    setMobile(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (open || mobile)) closeAll();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, mobile, closeAll]);

  /**
   * The drawer covers the page but its siblings stay in the document, so
   * without this Tab walks straight out of it into content the user cannot
   * see. Focus moves into the panel on open and cycles within the header,
   * which on mobile means the logo, the close button and the panel. Escape
   * closes and returns focus to the toggle, handled above.
   */
  useEffect(() => {
    if (!mobile) return;
    const header = headerRef.current;
    const drawer = drawerRef.current;
    if (!header || !drawer) return;
    const SELECTOR =
      'a[href], button:not([disabled]), summary, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusable = () =>
      Array.from(header.querySelectorAll<HTMLElement>(SELECTOR)).filter((el) => el.offsetParent !== null);
    drawer.querySelector<HTMLElement>(SELECTOR)?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const outside = !active || !header.contains(active);
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobile]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header ref={headerRef} className="sticky top-0 z-50" onMouseLeave={() => setOpen(null)}>
      <div
        className={cn(
          "border-b transition-colors duration-300",
          scrolled ? "border-line bg-paper/85 backdrop-blur-xl" : "bg-paper/60 border-transparent backdrop-blur-md",
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <MenuButton
              label="Loans"
              menu="loans"
              open={open}
              setOpen={setOpen}
              active={isActive("/loans")}
              panelId={`${menuId}-loans`}
            />
            <MenuButton
              label="Partner with us"
              menu="partner"
              open={open}
              setOpen={setOpen}
              active={isActive("/partner")}
              panelId={`${menuId}-partner`}
            />
            <MenuButton
              label="Tools"
              menu="tools"
              open={open}
              setOpen={setOpen}
              active={isActive("/tools")}
              panelId={`${menuId}-tools`}
            />
            <NavLink href="/guides" active={isActive("/guides")} onHover={() => setOpen(null)}>
              Guides
            </NavLink>
            <NavLink href="/about" active={isActive("/about")} onHover={() => setOpen(null)}>
              About
            </NavLink>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={`tel:${phone}`}
              className="text-ink-900 hover:text-brass-600 inline-flex items-center gap-2 text-sm font-bold"
            >
              <Phone className="size-4" aria-hidden />
              {phoneDisplay}
            </a>
            <ButtonLink href="/apply" size="md">
              Check eligibility
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="border-line inline-flex size-11 items-center justify-center border bg-white lg:hidden"
            aria-label={mobile ? "Close menu" : "Open menu"}
            aria-expanded={mobile}
            aria-controls={drawerId}
            onClick={() => setMobile((v) => !v)}
          >
            {mobile ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </div>

      {/* Desktop mega menus */}
      <div
        id={open ? `${menuId}-${open}` : undefined}
        className={cn(
          "border-line bg-cream shadow-lift absolute inset-x-0 top-full hidden origin-top border-b transition-all duration-200 lg:block",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
        hidden={!open}
      >
        <div className="container-x py-8">
          {open === "loans" && <LoansMenu products={nav.products} categories={nav.categories} cities={nav.cities} />}
          {open === "partner" && <PartnerMenu audiences={nav.audiences} />}
          {open === "tools" && <ToolsMenu />}
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id={drawerId}
        ref={drawerRef}
        hidden={!mobile}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="bg-paper fixed inset-x-0 top-[var(--header-h)] bottom-0 z-40 overflow-y-auto lg:hidden"
      >
        <div className="container-x py-6">
          <MobileGroup title="Loans">
            {nav.products.map((p) => (
              <Link
                key={p.slug}
                href={`/loans/${p.slug}`}
                className="hover:bg-sand flex items-center gap-3 px-3 py-2.5 text-[15px] font-semibold"
              >
                <ProductIcon icon={p.icon} className="text-brass-600 size-4" aria-hidden />
                {p.name}
              </Link>
            ))}
            <Link href="/loans" className="text-brass-600 mt-1 block px-3 py-2 text-sm font-bold">
              All loan products
            </Link>
          </MobileGroup>
          <MobileGroup title="Partner with us">
            {partnerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:bg-sand block px-3 py-2.5 text-[15px] font-semibold">
                {l.label}
              </Link>
            ))}
            {nav.audiences.map((a) => (
              <Link
                key={a.slug}
                href={`/partner/for/${a.slug}`}
                className="text-mute hover:bg-sand block px-3 py-2 text-sm"
              >
                For {a.name.toLowerCase()}
              </Link>
            ))}
          </MobileGroup>
          <MobileGroup title="Tools and resources">
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="hover:bg-sand block px-3 py-2.5 text-[15px] font-semibold">
                {t.label}
              </Link>
            ))}
            <Link href="/guides" className="hover:bg-sand block px-3 py-2.5 text-[15px] font-semibold">
              Guides
            </Link>
          </MobileGroup>
          <MobileGroup title="Company">
            <Link href="/about" className="hover:bg-sand block px-3 py-2.5 text-[15px] font-semibold">
              About
            </Link>
            <Link href="/lenders" className="hover:bg-sand block px-3 py-2.5 text-[15px] font-semibold">
              Lending partners
            </Link>
            <Link href="/cities" className="hover:bg-sand block px-3 py-2.5 text-[15px] font-semibold">
              Cities we serve
            </Link>
            <Link href="/contact" className="hover:bg-sand block px-3 py-2.5 text-[15px] font-semibold">
              Contact
            </Link>
          </MobileGroup>
          <div className="mt-6 flex flex-col gap-3">
            <ButtonLink href="/apply" size="lg">
              Check eligibility <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href={`tel:${phone}`} variant="light" size="lg">
              <Phone className="size-4" aria-hidden /> {phoneDisplay}
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuButton({
  label,
  menu,
  open,
  setOpen,
  active,
  panelId,
}: {
  label: string;
  menu: MenuKey;
  open: MenuKey | null;
  setOpen: (m: MenuKey | null) => void;
  active: boolean;
  panelId: string;
}) {
  const expanded = open === menu;
  return (
    <button
      type="button"
      onMouseEnter={() => setOpen(menu)}
      onFocus={() => setOpen(menu)}
      onClick={() => setOpen(expanded ? null : menu)}
      aria-expanded={expanded}
      aria-controls={panelId}
      className={cn(
        "inline-flex h-10 items-center gap-1 px-4 text-sm font-bold transition-colors",
        active || expanded ? "bg-ink-100 text-ink-900" : "text-ink-800 hover:bg-ink-100",
      )}
    >
      {label}
      <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} aria-hidden />
    </button>
  );
}

function NavLink({
  href,
  active,
  children,
  onHover,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onHover: () => void;
}) {
  return (
    <Link
      href={href}
      onMouseEnter={onHover}
      onFocus={onHover}
      className={cn(
        "inline-flex h-10 items-center px-4 text-sm font-bold transition-colors",
        active ? "bg-ink-100 text-ink-900" : "text-ink-800 hover:bg-ink-100",
      )}
    >
      {children}
    </Link>
  );
}

function LoansMenu({
  products,
  categories,
  cities,
}: {
  products: ProductLite[];
  categories: CategoryLite[];
  cities: CityLite[];
}) {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-9 grid grid-cols-3 gap-x-8 gap-y-6">
        {categories.map((cat) => (
          <div key={cat.key}>
            <p className="eyebrow text-mute mb-3">{cat.label}</p>
            <ul className="space-y-1">
              {products
                .filter((p) => p.category === cat.key)
                .map((p) => (
                  <li key={p.slug}>
                    <Link href={`/loans/${p.slug}`} className="group -mx-2 flex items-start gap-3 p-2 hover:bg-white">
                      <span className="bg-brass-50 text-brass-600 group-hover:bg-brass-100 mt-0.5 flex size-8 shrink-0 items-center justify-center">
                        <ProductIcon icon={p.icon} className="size-4" aria-hidden />
                      </span>
                      <span>
                        <span className="text-ink-900 block text-sm font-bold">{p.name}</span>
                        <span className="text-mute block text-xs">From {p.rateFrom.toFixed(2)}% p.a.</span>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="rounded-card bg-ink-900 col-span-3 p-5 text-white">
        <p className="eyebrow text-brass-400">Loans by city</p>
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
          {cities.slice(0, 8).map((c) => (
            <li key={c.slug}>
              <Link href={`/cities/${c.slug}`} className="text-white/80 hover:text-white">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/cities" className="text-brass-400 hover:text-brass-300 mt-3 inline-block text-sm font-bold">
          All cities
        </Link>
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-sm text-white/70">Not sure which loan fits? Our credit desk will tell you in one call.</p>
          <ButtonLink href="/apply" size="sm" className="mt-3">
            Check eligibility <ArrowRight className="size-3.5" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function PartnerMenu({ audiences }: { audiences: AudienceLite[] }) {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-4">
        <p className="eyebrow text-mute mb-3">Programme</p>
        <ul className="space-y-1">
          {partnerLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="-mx-2 block p-2 hover:bg-white">
                <span className="text-ink-900 block text-sm font-bold">{l.label}</span>
                <span className="text-mute block text-xs">{l.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-5">
        <p className="eyebrow text-mute mb-3">Built for your profession</p>
        <ul className="grid grid-cols-2 gap-1">
          {audiences.map((a) => (
            <li key={a.slug}>
              <Link href={`/partner/for/${a.slug}`} className="-mx-2 block p-2 hover:bg-white">
                <span className="text-ink-900 block text-sm font-bold">{a.name}</span>
                <span className="text-mute block text-xs">{a.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-card bg-ink-900 col-span-3 p-5 text-white">
        <p className="eyebrow text-brass-300">Earn on every disbursal</p>
        <p className="font-display mt-2 text-2xl leading-tight">
          One code. Every lender on our panel. Zero investment.
        </p>
        <ButtonLink href="/partner/register" variant="light" size="sm" className="mt-4">
          Register free <ArrowRight className="size-3.5" aria-hidden />
        </ButtonLink>
      </div>
    </div>
  );
}

function ToolsMenu() {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8 grid grid-cols-2 gap-1">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="-mx-2 block p-3 hover:bg-white">
            <span className="text-ink-900 block text-sm font-bold">{t.label}</span>
            <span className="text-mute block text-xs">{t.description}</span>
          </Link>
        ))}
      </div>
      <div className="rounded-card border-line col-span-4 border bg-white p-5">
        <p className="eyebrow text-mute">Guides</p>
        <p className="text-ink-800 mt-2 text-sm">
          Plain-language guides on eligibility, credit scores, balance transfers, business loan documents and staying
          safe from loan fraud, reviewed by our credit desk.
        </p>
        <Link
          href="/guides"
          className="text-brass-600 hover:text-brass-600 mt-3 inline-flex items-center gap-1 text-sm font-bold"
        >
          Browse guides <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-line border-b py-2">
      <summary className="text-ink-900 flex cursor-pointer list-none items-center justify-between py-3 text-base font-bold">
        {title}
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="pb-3">{children}</div>
    </details>
  );
}
