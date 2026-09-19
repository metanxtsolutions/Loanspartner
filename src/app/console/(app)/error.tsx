"use client";

import { useEffect } from "react";

export default function ConsoleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="border-danger-50 bg-danger-50 flex flex-col items-start gap-3 border px-6 py-10">
      <p className="text-danger text-sm font-semibold">Something went wrong loading this page.</p>
      <p className="text-mute text-sm">{error.message || "An unexpected error occurred."}</p>
      <button type="button" onClick={() => reset()} className="bg-ink-900 hover:bg-ink-800 px-4 py-2 text-sm font-semibold text-white transition">
        Try again
      </button>
    </div>
  );
}
