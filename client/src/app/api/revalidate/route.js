import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Called by the backend after any content mutation so the next
// visitor gets fresh pages instantly instead of cached ones.
export async function POST(req) {
  let secret = "";
  try {
    const body = await req.json();
    secret = body.secret || "";
  } catch {
    secret = "";
  }

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("site-content");
  return NextResponse.json({ success: true, message: "Revalidated" });
}
