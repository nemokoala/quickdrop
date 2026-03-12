import { NextResponse } from "next/server";
import { cleanupExpiredSessions } from "@/lib/cleanup";

export async function POST() {
  try {
    const count = await cleanupExpiredSessions();
    return NextResponse.json({ deleted: count });
  } catch (err) {
    console.error("[cleanup]", err);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
