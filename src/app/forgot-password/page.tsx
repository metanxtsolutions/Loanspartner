import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false, follow: false } };

export default function ForgotPasswordPage() {
  return (
    <div className="bg-ink-950 flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="bg-paper w-full max-w-sm p-8">
        <Logo />
        <h1 className="text-ink-950 mt-6 text-xl font-bold">Reset your password</h1>
        <p className="text-mute mt-1 text-sm">Enter the email on your account and we&apos;ll send you a reset link.</p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
        <p className="text-mute mt-6 text-center text-sm">
          <Link href="/login" className="underline underline-offset-2">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
