/**
 * Creates or updates an admin login for /admin/outreach.
 *
 *   pnpm outreach:create-admin -- --email you@loanspartner.in --password "a strong password" --name "Your Name"
 */
import { prisma } from "@/server/outreach/db";
import { hashPassword } from "@/server/outreach/auth";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const email = arg("email")?.toLowerCase().trim();
  const password = arg("password");
  const name = arg("name");
  if (!email || !password) {
    console.error('Usage: pnpm outreach:create-admin -- --email you@loanspartner.in --password "a strong password" [--name "Your Name"]');
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }
  const passwordHash = hashPassword(password);
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, name },
    update: { passwordHash, name },
  });
  console.log(`Admin ready: ${email}. Sign in at /admin/login.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
