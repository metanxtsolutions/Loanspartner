import { NextResponse } from "next/server";
import { getActor } from "@/server/dashboard/access";
import { getDocumentForActor } from "@/server/dashboard/documents";

/**
 * Gated document delivery: the blob URL is never handed to the browser
 * directly (see src/server/dashboard/documents.ts). A viewer must be signed
 * in and either own the document, be the partner who sourced the
 * application it belongs to, or be an admin: checked fresh on every
 * request, not cached in a link.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await getActor();
  if (!actor) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    const doc = await getDocumentForActor(id, actor);
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.redirect(doc.fileUrl);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
