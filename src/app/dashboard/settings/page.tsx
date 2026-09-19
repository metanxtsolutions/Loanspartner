import { requireCustomer } from "@/server/dashboard/access";
import { prisma } from "@/server/db";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileForm } from "@/components/customer/profile-form";
import { PasswordForm } from "@/components/customer/password-form";

export default async function SettingsPage() {
  const actor = await requireCustomer();
  // No dedicated read helper for a customer's own profile row, so this reads it directly, scoped to the server-derived actor.id.
  const profile = await prisma.customerProfile.findUnique({ where: { userId: actor.id } });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Settings" subtitle="Update your profile and password." />

      <section>
        <h2 className="text-ink-950 mb-3 text-base font-bold">Profile</h2>
        <ProfileForm name={actor.name} phone={actor.phone ?? ""} city={profile?.city ?? ""} />
      </section>

      <section>
        <h2 className="text-ink-950 mb-3 text-base font-bold">Change password</h2>
        <PasswordForm />
      </section>
    </div>
  );
}
