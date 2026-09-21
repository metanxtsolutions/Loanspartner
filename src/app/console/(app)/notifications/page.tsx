import type { Metadata } from "next";
import { requireAdmin } from "@/server/dashboard/access";
import { listNotifications } from "@/server/dashboard/notifications";
import { adminRoleHasPermission } from "@/lib/dashboard/permissions";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { BroadcastForm } from "@/components/console/broadcast-form";
import { readableDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications", robots: { index: false, follow: false } };

export default async function ConsoleNotificationsPage() {
  const actor = await requireAdmin();
  const canBroadcast = adminRoleHasPermission(actor.adminRole, "notifications.broadcast");
  const notifications = await listNotifications(actor.id, 50);

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Send a platform-wide announcement and review your own notification history." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {canBroadcast ? (
          <div className="lg:col-span-1">
            <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Broadcast</h2>
            <BroadcastForm />
          </div>
        ) : null}

        <div className={canBroadcast ? "lg:col-span-2" : "lg:col-span-3"}>
          <h2 className="text-ink-950 mb-3 text-sm font-bold tracking-wide uppercase">Your notifications</h2>
          {notifications.length === 0 ? (
            <EmptyState title="No notifications yet" body="Notifications about KYC reviews, applications and broadcasts you send will appear here." />
          ) : (
            <ul className="border-line divide-line divide-y border">
              {notifications.map((n) => (
                <li key={n.id} className="flex flex-col gap-0.5 px-4 py-3">
                  <p className="text-ink-900 text-sm font-semibold">{n.title}</p>
                  <p className="text-mute text-sm">{n.body}</p>
                  <p className="text-mute-2 text-xs">{readableDate(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
