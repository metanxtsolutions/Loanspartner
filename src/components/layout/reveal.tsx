"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Adds `js` to <html> and reveals [data-reveal] elements as they enter the viewport. */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = Number(el.dataset.revealDelay ?? 0);
            el.style.transitionDelay = delay ? `${delay}ms` : "";
            el.classList.add("is-visible");
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
