import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionEmail } from "@/server/outreach/auth";
import { LoginForm } from "@/components/outreach/login-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const email = await getSessionEmail();
  if (email) redirect("/admin/outreach");
  return (
    <div className="bg-ink-950 flex min-h-full items-center justify-center px-4 py-16">
      <div className="bg-paper w-full max-w-sm border border-white/10 p-8 shadow-xl">
        <p className="text-brass-600 text-xs font-semibold tracking-wide uppercase">LoansPartner</p>
        <h1 className="text-ink-950 mt-1 text-xl font-semibold">Partnership outreach</h1>
        <p className="text-mute mt-1 text-sm">Internal tool. Sign in with your admin account.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
