"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button, ButtonLink } from "@/components/shared/button";

/**
 * Without this boundary a render error, or a form submit that fails because
 * the connection dropped, replaced the whole page with Next's bare default
 * screen. Rendered inside (site)/layout.tsx, so the header, footer and the
 * mobile call / WhatsApp bar stay available. Deliberately imports no data
 * files: this is a client component and would ship them to every visitor.
 */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-paper py-24">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-brass-600">Something went wrong</p>
          <h1 className="display text-ink-950 mt-4 text-4xl sm:text-5xl">This page did not load properly.</h1>
          <p className="text-mute mt-4 text-lg">
            It is usually a dropped connection. Try again, and if you were sending us a form, check that it went through
            before sending it twice. You can always reach our credit desk directly instead.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>
              <RotateCcw className="size-4" aria-hidden /> Try again
            </Button>
            <ButtonLink href="/contact" variant="secondary">
              Contact us <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <p className="text-mute mt-6 text-sm">
            Or go back to the{" "}
            <Link href="/" className="text-brass-600 font-bold underline underline-offset-4">
              home page
            </Link>
            .
          </p>
          {error.digest && <p className="text-mute mt-8 font-mono text-xs">Reference: {error.digest}</p>}
        </div>
      </div>
    </section>
  );
}
