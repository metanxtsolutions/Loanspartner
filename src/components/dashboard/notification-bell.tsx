"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { cn, readableDate } from "@/lib/utils";

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  link: string | null;
  readAt: Date | null;
  createdAt: Date;
};

export function NotificationBell({
  notifications,
  unreadCount,
  markAllReadAction,
}: {
  notifications: NotificationItem[];
  unreadCount: number;
  markAllReadAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        className="text-ink-700 hover:bg-ink-100 relative flex size-10 items-center justify-center transition"
      >
        <Bell className="size-5" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="bg-brass-500 text-ink-950 absolute top-1.5 right-1.5 flex size-4 items-center justify-center text-[10px] font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>
      {open ? (
        <div className="border-line shadow-lift bg-cream absolute right-0 z-20 mt-2 w-80 max-w-[90vw] border">
          <div className="border-line flex items-center justify-between border-b px-4 py-3">
            <p className="text-ink-900 text-sm font-semibold">Notifications</p>
            {unreadCount > 0 ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => startTransition(() => markAllReadAction())}
                className="text-mute hover:text-ink-900 text-xs font-medium underline underline-offset-2 disabled:opacity-60"
              >
                Mark all read
              </button>
            ) : null}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-mute px-4 py-6 text-center text-sm">You&apos;re all caught up.</p>
            ) : (
              notifications.map((n) => {
                const Content = (
                  <div className={cn("border-line border-b px-4 py-3 last:border-b-0", !n.readAt && "bg-brass-50")}>
                    <p className="text-ink-900 text-sm font-semibold">{n.title}</p>
                    <p className="text-mute mt-0.5 text-xs">{n.body}</p>
                    <p className="text-mute-2 mt-1 text-[11px]">{readableDate(n.createdAt)}</p>
                  </div>
                );
                return n.link ? (
                  <Link key={n.id} href={n.link} onClick={() => setOpen(false)} className="block">
                    {Content}
                  </Link>
                ) : (
                  <div key={n.id}>{Content}</div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
