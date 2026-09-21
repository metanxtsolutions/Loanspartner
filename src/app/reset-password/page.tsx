import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Set a new password", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;

  return (
    <div className="bg-ink-950 flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="bg-paper w-full max-w-sm p-8">
        <Logo />
        <h1 className="text-ink-950 mt-6 text-xl font-bold">Set a new password</h1>
        <p className="text-mute mt-1 text-sm">Choose a new password for your account.</p>
        <div className="mt-6">
          <ResetPasswordForm token={token ?? ""} />
        </div>
      </div>
    </div>
  );
}
