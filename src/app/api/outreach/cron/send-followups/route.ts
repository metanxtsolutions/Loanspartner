import { NextResponse } from "next/server";
import { runFollowUpSequence } from "@/server/outreach/followups";

export const maxDuration = 60;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

/** Scheduled by vercel.json. Drafts (and, only if auto-send is enabled in settings, sends) the next due follow-up per lender. */
export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await runFollowUpSequence("system (cron: send-followups)");
  return NextResponse.json(result);
}
