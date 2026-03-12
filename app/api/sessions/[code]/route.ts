import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const session = await prisma.session.findUnique({
    where: { code },
    include: { files: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Code not found" }, { status: 404 });
  }

  if (session.expiresAt < new Date()) {
    return NextResponse.json({ error: "Code expired" }, { status: 410 });
  }

  return NextResponse.json({
    code: session.code,
    createdAt: session.createdAt.toISOString(),
    expiresAt: session.expiresAt.toISOString(),
    files: session.files.map((f) => ({
      id: f.id,
      originalName: f.originalName,
      size: Number(f.size),
      mimeType: f.mimeType,
    })),
  });
}
