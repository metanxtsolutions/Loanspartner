"use client";

import { useEffect } from "react";
import { Banner } from "@/components/dashboard/banner";
import { Button } from "@/components/shared/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col gap-4">
      <Banner tone="danger" title="Something went wrong" body="We couldn't load this page. Try again, or come back in a moment." />
      <Button variant="secondary" size="sm" onClick={reset} className="self-start">
        Try again
      </Button>
    </div>
  );
}
