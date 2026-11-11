import type { Metadata } from "next";
import { Logo } from "@/components/shared/logo";
import { PartnerRegisterForm } from "@/components/partner/partner-register-form";

export const metadata: Metadata = {
  title: "Create a partner account",
  description:
    "Create your LoansPartner partner portal account to submit loan leads, track disbursals and earn commission.",
  robots: { index: false, follow: false },
};

export default function PartnerRegisterPage() {
  return (
    <div className="bg-paper flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="border-line bg-cream w-full max-w-md border p-8">
        <Logo />
        <p className="eyebrow text-mute mt-6">Partner portal</p>
        <h1 className="text-ink-950 mt-2 text-xl font-bold">Create your partner account</h1>
        <p className="text-mute mt-1 text-sm">Submit leads, track disbursals and earn commission.</p>
        <div className="mt-6">
          <PartnerRegisterForm />
        </div>
      </div>
    </div>
  );
}
