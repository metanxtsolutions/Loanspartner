"use client";

import { signOut } from "@/actions/outreach/auth";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="text-mute hover:bg-ink-100 hover:text-ink-900 px-2.5 py-1 transition"
    >
      Sign out
    </button>
  );
}
