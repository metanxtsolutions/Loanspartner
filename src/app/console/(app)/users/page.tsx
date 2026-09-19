import type { Metadata } from "next";
import { requireAdmin } from "@/server/dashboard/access";
import { listUsersForAdmin } from "@/server/dashboard/users";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { UserStatusForm } from "@/components/console/user-status-form";
import { readableDate, cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Users", robots: { index: false, follow: false } };

type UserRow = Awaited<ReturnType<typeof listUsersForAdmin>>[number];

const ROLES = ["CUSTOMER", "PARTNER", "ADMIN"] as const;

export default async function ConsoleUsersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdmin("users.manage");
  const params = await searchParams;
  const role = ROLES.includes(params.role as (typeof ROLES)[number]) ? (params.role as (typeof ROLES)[number]) : undefined;
  const search = params.q?.trim() || undefined;

  const users = await listUsersForAdmin({ role, search });

  const columns: Column<UserRow>[] = [
    { key: "name", header: "Name", render: (u) => u.name },
    { key: "email", header: "Email", render: (u) => u.email },
    { key: "role", header: "Role", render: (u) => (u.role === "PARTNER" && u.partnerProfile ? `Partner · ${u.partnerProfile.kycStatus}` : u.role) },
    { key: "status", header: "Status", render: (u) => u.status },
    { key: "joined", header: "Joined", render: (u) => readableDate(u.createdAt) },
    { key: "actions", header: "", className: "text-right", render: (u) => <UserStatusForm userId={u.id} status={u.status} /> },
  ];

  const hrefFor = (r?: string) => {
    const p = new URLSearchParams();
    if (r) p.set("role", r);
    if (search) p.set("q", search);
    const qs = p.toString();
    return qs ? `/console/users?${qs}` : "/console/users";
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Every customer, partner and admin account on the platform." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex flex-wrap gap-2" aria-label="Filter by role">
          <a href={hrefFor()} className={cn("border-line px-3 py-1.5 text-xs font-semibold", !role ? "bg-ink-900 border-ink-900 text-white" : "hover:bg-cream border")}>
            All
          </a>
          {ROLES.map((r) => (
            <a key={r} href={hrefFor(r)} className={cn("border-line px-3 py-1.5 text-xs font-semibold", role === r ? "bg-ink-900 border-ink-900 text-white" : "hover:bg-cream border")}>
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </a>
          ))}
        </nav>
        <form method="get" className="flex gap-2">
          {role ? <input type="hidden" name="role" value={role} /> : null}
          <input type="search" name="q" defaultValue={search} placeholder="Search name or email" className="field h-10 w-56 py-1.5 text-sm" />
          <button type="submit" className="bg-ink-900 hover:bg-ink-800 h-10 px-4 text-sm font-semibold text-white transition">
            Search
          </button>
        </form>
      </div>

      <DataTable columns={columns} rows={users} emptyTitle="No users found" emptyBody="Try a different role filter or search term." />
    </div>
  );
}
