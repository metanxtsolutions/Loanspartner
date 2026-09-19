import Link from "next/link";
import { requireCustomer } from "@/server/dashboard/access";
import { listNotifications } from "@/server/dashboard/notifications";
import { markNotificationsReadAction } from "@/actions/customer/applications";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cn, readableDate } from "@/lib/utils";

export default async function NotificationsPage() {
  const actor = await requireCustomer();
  const notifications = await listNotifications(actor.id, 100);
  const hasUnread = notifications.some((n) => !n.readAt);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        subtitle="Updates on your applications and documents."
        action={
          hasUnread ? (
            <form action={markNotificationsReadAction}>
              <button type="submit" className="text-mute hover:text-ink-900 text-sm font-medium underline underline-offset-2">
                Mark all read
              </button>
            </form>
          ) : null
        }
      />
      {notifications.length === 0 ? (
        <EmptyState title="No notifications yet" body="We'll let you know when there's something new." />
      ) : (
        <ul className="border-line border-t">
          {notifications.map((n) => {
            const content = (
              <div className={cn("flex flex-col gap-1 px-4 py-3", !n.readAt && "bg-brass-50")}>
                <p className="text-ink-900 text-sm font-semibold">{n.title}</p>
                <p className="text-mute text-sm">{n.body}</p>
                <p className="text-mute-2 text-xs">{readableDate(n.createdAt)}</p>
              </div>
            );
            return (
              <li key={n.id} className="border-line border-b">
                {n.link ? (
                  <Link href={n.link} className="hover:bg-cream block transition">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
