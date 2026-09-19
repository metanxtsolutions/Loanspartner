"use client";

import { useEffect } from "react";
import { ButtonLink } from "@/components/shared/button";

export default function PartnerAppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="border-line bg-cream flex flex-col items-center gap-3 border border-dashed px-6 py-16 text-center">
      <p className="text-ink-900 text-sm font-semibold">Something went wrong</p>
      <p className="text-mute max-w-sm text-sm">We couldn&apos;t load this page. Try again, or head back to your overview.</p>
      <div className="mt-2 flex gap-3">
        <button type="button" onClick={reset} className="bg-ink-900 hover:bg-ink-800 h-11 px-5 text-sm font-semibold text-white transition">
          Try again
        </button>
        <ButtonLink href="/partners" variant="secondary" size="sm">
          Go to overview
        </ButtonLink>
      </div>
    </div>
  );
}
