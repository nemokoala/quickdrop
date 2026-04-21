import { Buffer } from "node:buffer";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> },
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
    kind: session.kind === "text" ? "text" : "file",
    createdAt: session.createdAt.toISOString(),
    expiresAt: session.expiresAt.toISOString(),
    files:
      session.kind === "file"
        ? session.files.map((file) => ({
            id: file.id,
            originalName: file.originalName,
            size: Number(file.size),
            mimeType: file.mimeType,
          }))
        : [],
    text:
      session.kind === "text" && session.textContent
        ? {
            title: session.textTitle || "shared-text.txt",
            content: session.textContent,
            size:
              session.textSize ??
              Buffer.byteLength(session.textContent, "utf8"),
          }
        : null,
  });
}
