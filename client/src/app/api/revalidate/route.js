import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Called by the backend after a content mutation. Accepts an optional
// tags list so only the changed sections uncache — everything else
// keeps serving from cache. Defaults to a full purge.
export async function POST(req) {
  let secret = "";
  let tags = ["site"];
  try {
    const body = await req.json();
    secret = body.secret || "";
    if (Array.isArray(body.tags) && body.tags.length > 0) {
      tags = body.tags.filter((t) => typeof t === "string").slice(0, 10);
      if (tags.length === 0) tags = ["site"];
    }
  } catch {
    secret = "";
  }

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
  }

  for (const tag of tags) revalidateTag(tag);
  return NextResponse.json({ success: true, message: "Revalidated", tags });
}
