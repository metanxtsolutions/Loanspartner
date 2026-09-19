import type { Metadata } from "next";
import Link from "next/link";
import { PartnerRegisterForm } from "@/components/partner/partner-register-form";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function PartnerRegisterPage() {
  return (
    <div className="bg-paper flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="border-line bg-cream w-full max-w-md border p-8">
        <Link href="/" className="text-ink-950 text-sm font-bold">
          LoansPartner <span className="text-mute font-medium">/ Partner</span>
        </Link>
        <h1 className="text-ink-950 mt-4 text-xl font-bold">Create your partner account</h1>
        <p className="text-mute mt-1 text-sm">Submit leads, track disbursals and earn commission.</p>
        <div className="mt-6">
          <PartnerRegisterForm />
        </div>
      </div>
    </div>
  );
}
