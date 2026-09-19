import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getActor, dashboardPathFor } from "@/server/dashboard/access";
import { Logo } from "@/components/shared/logo";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: false } };

export default async function RegisterPage() {
  const actor = await getActor();
  if (actor) redirect(dashboardPathFor(actor.role));

  return (
    <div className="bg-ink-950 flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="bg-paper w-full max-w-sm p-8">
        <Logo />
        <h1 className="text-ink-950 mt-6 text-xl font-bold">Create your account</h1>
        <p className="text-mute mt-1 text-sm">Apply for a loan and track it from one dashboard.</p>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="text-mute mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-ink-900 font-semibold underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
