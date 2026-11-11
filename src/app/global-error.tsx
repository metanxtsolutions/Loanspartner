"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Last-resort boundary for an error in the root layout itself, which no
 * segment-level error.tsx can catch. It replaces the root layout, so it brings
 * its own <html> and <body> and keeps to plain markup.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body className="bg-paper text-ink-900 flex min-h-dvh items-center justify-center px-4">
        <main className="max-w-lg py-16 text-center">
          <p className="eyebrow text-brass-600">LoansPartner</p>
          <h1 className="text-ink-950 mt-4 text-3xl font-bold">Something went wrong.</h1>
          <p className="text-mute mt-4">
            The site did not load properly. Try again in a moment, or write to us from the contact page.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="bg-brass-500 text-ink-950 hover:bg-brass-400 inline-flex h-12 items-center px-5 text-sm font-bold"
            >
              Try again
            </button>
            {/* A plain anchor: a full page load is the point after the root layout has failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              className="bg-ink-900 hover:bg-ink-800 inline-flex h-12 items-center px-5 text-sm font-bold text-white"
            >
              Go to the home page
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
