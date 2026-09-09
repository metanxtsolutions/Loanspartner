import { NextResponse } from "next/server";
import { pollInboundReplies } from "@/server/outreach/imap";

export const maxDuration = 60;

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

/** Scheduled by vercel.json. Also callable manually with the same Bearer token to poll on demand. */
export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const result = await pollInboundReplies("system (cron: poll-replies)");
  return NextResponse.json(result);
}
