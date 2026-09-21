import type { Metadata } from "next";
import Link from "next/link";
import { verifyEmailAction } from "@/actions/auth/shared";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = { title: "Verify your email", robots: { index: false, follow: false } };

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const result = await verifyEmailAction(token ?? "");

  return (
    <div className="bg-ink-950 flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="bg-paper w-full max-w-sm p-8 text-center">
        <Logo className="mx-auto" />
        <h1 className="text-ink-950 mt-6 text-xl font-bold">{result.ok ? "Email verified" : "Verification failed"}</h1>
        <p className="text-mute mt-2 text-sm">{result.message}</p>
        <Link
          href={result.redirectTo ?? "/login"}
          className="bg-ink-900 hover:bg-ink-800 mt-6 inline-flex h-12 items-center justify-center px-6 text-sm font-semibold text-white transition"
        >
          Continue to sign in
        </Link>
      </div>
    </div>
  );
}
