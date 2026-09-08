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
  { label: "EMI calculator", href: "/tools/emi-calculator", description: "Monthly instalment and total interest for any loan." },
  { label: "Loan eligibility calculator", href: "/tools/eligibility-calculator", description: "How much you can borrow on your income." },
  { label: "Balance transfer calculator", href: "/tools/balance-transfer-calculator", description: "Savings from switching your home loan." },
  { label: "DSA income calculator", href: "/tools/dsa-income-calculator", description: "Estimate partner payouts by product mix." },
  { label: "Interest rates", href: "/interest-rates", description: "Indicative rates across products, updated monthly." },
  { label: "Loan glossary", href: "/glossary", description: "CIBIL, FOIR, KFS, LTV and 30 more terms explained." },
];

const partnerLinks = [
  { label: "Partner programme", href: "/partner", description: "How the channel partner model works." },
  { label: "DSA commission", href: "/partner/commission", description: "Indicative payouts by product." },
  { label: "Register as a partner", href: "/partner/register", description: "Two-minute application, free onboarding." },
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

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50" onMouseLeave={() => setOpen(null)}>
      <div
        className={cn(
          "border-b transition-colors duration-300",
          scrolled ? "border-line bg-paper/85 backdrop-blur-xl" : "border-transparent bg-paper/60 backdrop-blur-md",
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <MenuButton label="Loans" menu="loans" open={open} setOpen={setOpen} active={isActive("/loans")} panelId={`${menuId}-loans`} />
            <MenuButton label="Partner with us" menu="partner" open={open} setOpen={setOpen} active={isActive("/partner")} panelId={`${menuId}-partner`} />
            <MenuButton label="Tools" menu="tools" open={open} setOpen={setOpen} active={isActive("/tools")} panelId={`${menuId}-tools`} />
            <NavLink href="/guides" active={isActive("/guides")} onHover={() => setOpen(null)}>Guides</NavLink>
            <NavLink href="/about" active={isActive("/about")} onHover={() => setOpen(null)}>About</NavLink>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href={`tel:${phone}`} className="inline-flex items-center gap-2 text-sm font-bold text-ink-900 hover:text-verdant-700">
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
            className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-white lg:hidden"
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
          "absolute inset-x-0 top-full hidden origin-top border-b border-line bg-cream shadow-lift transition-all duration-200 lg:block",
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
        hidden={!mobile}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-paper lg:hidden"
      >
        <div className="container-x py-6">
          <MobileGroup title="Loans">
            {nav.products.map((p) => (
              <Link key={p.slug} href={`/loans/${p.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold hover:bg-sand">
                <ProductIcon icon={p.icon} className="size-4 text-verdant-600" aria-hidden />
                {p.name}
              </Link>
            ))}
            <Link href="/loans" className="mt-1 block px-3 py-2 text-sm font-bold text-verdant-700">All loan products</Link>
          </MobileGroup>
          <MobileGroup title="Partner with us">
            {partnerLinks.map((l) => (
              <Link key={l.href} href={l.href} className="block rounded-xl px-3 py-2.5 text-[15px] font-semibold hover:bg-sand">{l.label}</Link>
            ))}
            {nav.audiences.map((a) => (
              <Link key={a.slug} href={`/partner/for/${a.slug}`} className="block rounded-xl px-3 py-2 text-sm text-mute hover:bg-sand">For {a.name.toLowerCase()}</Link>
            ))}
          </MobileGroup>
          <MobileGroup title="Tools and resources">
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="block rounded-xl px-3 py-2.5 text-[15px] font-semibold hover:bg-sand">{t.label}</Link>
            ))}
            <Link href="/guides" className="block rounded-xl px-3 py-2.5 text-[15px] font-semibold hover:bg-sand">Guides</Link>
          </MobileGroup>
          <MobileGroup title="Company">
            <Link href="/about" className="block rounded-xl px-3 py-2.5 text-[15px] font-semibold hover:bg-sand">About</Link>
            <Link href="/lenders" className="block rounded-xl px-3 py-2.5 text-[15px] font-semibold hover:bg-sand">Lending partners</Link>
            <Link href="/cities" className="block rounded-xl px-3 py-2.5 text-[15px] font-semibold hover:bg-sand">Cities we serve</Link>
            <Link href="/contact" className="block rounded-xl px-3 py-2.5 text-[15px] font-semibold hover:bg-sand">Contact</Link>
          </MobileGroup>
          <div className="mt-6 flex flex-col gap-3">
            <ButtonLink href="/apply" size="lg">Check eligibility <ArrowRight className="size-4" aria-hidden /></ButtonLink>
            <ButtonLink href={`tel:${phone}`} variant="light" size="lg"><Phone className="size-4" aria-hidden /> {phoneDisplay}</ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuButton({ label, menu, open, setOpen, active, panelId }: { label: string; menu: MenuKey; open: MenuKey | null; setOpen: (m: MenuKey | null) => void; active: boolean; panelId: string }) {
  const expanded = open === menu;
  return (
    <button
      type="button"
      onMouseEnter={() => setOpen(menu)}
      onFocus={() => setOpen(menu)}
      onClick={() => setOpen(expanded ? null : menu)}
      aria-expanded={expanded}
      aria-controls={panelId}
      className={cn("inline-flex h-10 items-center gap-1 rounded-full px-4 text-sm font-bold transition-colors", active || expanded ? "bg-ink-100 text-ink-900" : "text-ink-800 hover:bg-ink-100")}
    >
      {label}
      <ChevronDown className={cn("size-3.5 transition-transform", expanded && "rotate-180")} aria-hidden />
    </button>
  );
}

function NavLink({ href, active, children, onHover }: { href: string; active: boolean; children: React.ReactNode; onHover: () => void }) {
  return (
    <Link href={href} onMouseEnter={onHover} onFocus={onHover} className={cn("inline-flex h-10 items-center rounded-full px-4 text-sm font-bold transition-colors", active ? "bg-ink-100 text-ink-900" : "text-ink-800 hover:bg-ink-100")}>
      {children}
    </Link>
  );
}

function LoansMenu({ products, categories, cities }: { products: ProductLite[]; categories: CategoryLite[]; cities: CityLite[] }) {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-9 grid grid-cols-3 gap-x-8 gap-y-6">
        {categories.map((cat) => (
          <div key={cat.key}>
            <p className="eyebrow mb-3 text-mute">{cat.label}</p>
            <ul className="space-y-1">
              {products.filter((p) => p.category === cat.key).map((p) => (
                <li key={p.slug}>
                  <Link href={`/loans/${p.slug}`} className="group flex items-start gap-3 rounded-xl p-2 -mx-2 hover:bg-white">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-verdant-50 text-verdant-700 group-hover:bg-verdant-100">
                      <ProductIcon icon={p.icon} className="size-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink-900">{p.name}</span>
                      <span className="block text-xs text-mute">From {p.rateFrom.toFixed(2)}% p.a.</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="col-span-3 rounded-card bg-ink-900 p-5 text-white">
        <p className="eyebrow text-verdant-400">Loans by city</p>
        <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
          {cities.slice(0, 8).map((c) => (
            <li key={c.slug}><Link href={`/cities/${c.slug}`} className="text-white/80 hover:text-white">{c.name}</Link></li>
          ))}
        </ul>
        <Link href="/cities" className="mt-3 inline-block text-sm font-bold text-verdant-400 hover:text-verdant-300">All cities</Link>
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-sm text-white/70">Not sure which loan fits? Our credit desk will tell you in one call.</p>
          <ButtonLink href="/apply" size="sm" className="mt-3">Check eligibility <ArrowRight className="size-3.5" aria-hidden /></ButtonLink>
        </div>
      </div>
    </div>
  );
}

function PartnerMenu({ audiences }: { audiences: AudienceLite[] }) {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-4">
        <p className="eyebrow mb-3 text-mute">Programme</p>
        <ul className="space-y-1">
          {partnerLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="block rounded-xl p-2 -mx-2 hover:bg-white">
                <span className="block text-sm font-bold text-ink-900">{l.label}</span>
                <span className="block text-xs text-mute">{l.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-5">
        <p className="eyebrow mb-3 text-mute">Built for your profession</p>
        <ul className="grid grid-cols-2 gap-1">
          {audiences.map((a) => (
            <li key={a.slug}>
              <Link href={`/partner/for/${a.slug}`} className="block rounded-xl p-2 -mx-2 hover:bg-white">
                <span className="block text-sm font-bold text-ink-900">{a.name}</span>
                <span className="block text-xs text-mute">{a.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-3 rounded-card bg-verdant-600 p-5 text-white">
        <p className="eyebrow text-white/70">Earn on every disbursal</p>
        <p className="mt-2 font-display text-2xl leading-tight">One code. Every lender on our panel. Zero investment.</p>
        <ButtonLink href="/partner/register" variant="light" size="sm" className="mt-4">Register free <ArrowRight className="size-3.5" aria-hidden /></ButtonLink>
      </div>
    </div>
  );
}

function ToolsMenu() {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8 grid grid-cols-2 gap-1">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="block rounded-xl p-3 -mx-2 hover:bg-white">
            <span className="block text-sm font-bold text-ink-900">{t.label}</span>
            <span className="block text-xs text-mute">{t.description}</span>
          </Link>
        ))}
      </div>
      <div className="col-span-4 rounded-card border border-line bg-white p-5">
        <p className="eyebrow text-mute">Guides</p>
        <p className="mt-2 text-sm text-ink-800">Plain-language guides on eligibility, credit scores, balance transfers, business loan documents and staying safe from loan fraud, reviewed by our credit desk.</p>
        <Link href="/guides" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-verdant-700 hover:text-verdant-600">Browse guides <ArrowRight className="size-3.5" aria-hidden /></Link>
      </div>
    </div>
  );
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-line py-2">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-bold text-ink-900">
        {title}
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="pb-3">{children}</div>
    </details>
  );
}
