import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { ClaimAccountForm } from "./claim-account-form";

export const metadata: Metadata = { title: "Set up your account", robots: { index: false, follow: false } };

export default async function ClaimAccountPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <div className="bg-ink-950 flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="bg-paper w-full max-w-sm p-8">
        <Logo />
        <h1 className="text-ink-950 mt-6 text-xl font-bold">Set up your account</h1>
        <p className="text-mute mt-1 text-sm">Choose a password to finish setting up the account created for you.</p>
        <div className="mt-6">
          <ClaimAccountForm token={token ?? ""} />
        </div>
      </div>
    </div>
  );
}
