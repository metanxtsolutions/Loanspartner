import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { AdminLoginForm } from "@/components/console/login-form";

export const metadata: Metadata = { title: "Console sign in", robots: { index: false, follow: false } };

export default async function ConsoleLoginPage() {
  const session = await getSession();
  if (session && session.role === "ADMIN") redirect("/console");

  return (
    <div className="bg-ink-950 flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="bg-paper w-full max-w-sm border border-white/10 p-8 shadow-xl">
        <p className="text-brass-600 text-xs font-semibold tracking-wide uppercase">LoansPartner</p>
        <h1 className="text-ink-950 mt-1 text-xl font-semibold">Admin control center</h1>
        <p className="text-mute mt-1 text-sm">Internal tool for LoansPartner staff. Sign in with your admin account.</p>
        <div className="mt-6">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
