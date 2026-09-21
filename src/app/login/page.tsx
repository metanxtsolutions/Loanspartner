import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getActor, dashboardPathFor } from "@/server/dashboard/access";
import { Logo } from "@/components/shared/logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  const actor = await getActor();
  if (actor) redirect(dashboardPathFor(actor.role));

  return (
    <div className="bg-ink-950 flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="bg-paper w-full max-w-sm p-8">
        <Logo />
        <h1 className="text-ink-950 mt-6 text-xl font-bold">Sign in to your account</h1>
        <p className="text-mute mt-1 text-sm">Track your loan applications and documents.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
        <p className="text-mute mt-6 text-center text-sm">
          New here?{" "}
          <Link href="/register" className="text-ink-900 font-semibold underline underline-offset-2">
            Create an account
          </Link>
        </p>
        <p className="text-mute mt-2 text-center text-sm">
          <Link href="/forgot-password" className="underline underline-offset-2">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
}
