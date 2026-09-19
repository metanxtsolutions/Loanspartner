import type { Metadata } from "next";
import { requireAdmin } from "@/server/dashboard/access";
import { listAdmins } from "@/server/dashboard/users";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { AdminRoleForm } from "@/components/console/admin-role-form";
import { ADMIN_ROLE_LABELS } from "@/lib/dashboard/permissions";
import { readableDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Roles", robots: { index: false, follow: false } };

type AdminRow = Awaited<ReturnType<typeof listAdmins>>[number];

export default async function ConsoleRolesPage() {
  await requireAdmin("roles.manage");
  const admins = await listAdmins();

  const columns: Column<AdminRow>[] = [
    { key: "name", header: "Admin", render: (a) => a.name },
    { key: "email", header: "Email", render: (a) => a.email },
    { key: "current", header: "Current role", render: (a) => (a.adminRole ? ADMIN_ROLE_LABELS[a.adminRole] : "-") },
    { key: "joined", header: "Joined", render: (a) => readableDate(a.createdAt) },
    { key: "actions", header: "Set role", render: (a) => <AdminRoleForm userId={a.id} adminRole={a.adminRole ?? "SUPPORT"} /> },
  ];

  return (
    <div>
      <PageHeader title="Roles" subtitle="Assign each admin's AdminRole. Only a Super Admin can change these." />
      <DataTable columns={columns} rows={admins} emptyTitle="No admin accounts yet" />
    </div>
  );
}
