import Link from "next/link";
import { requirePartner } from "@/server/dashboard/access";
import { listNotifications } from "@/server/dashboard/notifications";
import { markNotificationsReadAction } from "@/actions/partner/leads";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cn, readableDate } from "@/lib/utils";

export default async function PartnerNotificationsPage() {
  const user = await requirePartner();
  const notifications = await listNotifications(user.id, 100);
  const hasUnread = notifications.some((n) => !n.readAt);

  return (
    <>
      <PageHeader
        title="Notifications"
        action={
          hasUnread ? (
            <form action={markNotificationsReadAction}>
              <button type="submit" className="text-mute hover:text-ink-900 text-sm font-medium underline underline-offset-2">
                Mark all read
              </button>
            </form>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState title="No notifications yet" body="You'll see updates on your leads, KYC and payouts here." />
      ) : (
        <ul className="border-line border">
          {notifications.map((n) => {
            const row = (
              <div className={cn("border-line border-b px-4 py-3 last:border-b-0", !n.readAt && "bg-brass-50")}>
                <p className="text-ink-900 text-sm font-semibold">{n.title}</p>
                <p className="text-mute mt-0.5 text-sm">{n.body}</p>
                <p className="text-mute-2 mt-1 text-xs">{readableDate(n.createdAt)}</p>
              </div>
            );
            return (
              <li key={n.id}>
                {n.link ? (
                  <Link href={n.link} className="hover:bg-cream/70 block">
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
