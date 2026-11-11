import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { PartnerLoginForm } from "@/components/partner/partner-login-form";

export const metadata: Metadata = {
  title: "Partner sign in",
  description:
    "Sign in to the LoansPartner partner portal to submit leads, upload documents and track disbursals and payouts.",
  robots: { index: false, follow: false },
};

export default function PartnerLoginPage() {
  return (
    <div className="bg-paper flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="border-line bg-cream w-full max-w-md border p-8">
        <Logo />
        <p className="eyebrow text-mute mt-6">Partner portal</p>
        <h1 className="text-ink-950 mt-2 text-xl font-bold">Sign in to your partner account</h1>
        <p className="text-mute mt-1 text-sm">Track leads, documents and payouts in one place.</p>
        <div className="mt-6">
          <PartnerLoginForm />
        </div>
        <p className="text-mute mt-6 text-sm">
          New partner?{" "}
          <Link href="/partners/register" className="text-ink-900 font-semibold underline underline-offset-2">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
