import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { prisma } from "@/lib/prisma";
import { getFilePath } from "@/lib/storage";
import { Readable } from "stream";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params;
  const id = Number(fileId);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
  }

  const file = await prisma.file.findUnique({
    where: { id },
    include: { session: true },
  });

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  if (file.session.expiresAt < new Date()) {
    return NextResponse.json({ error: "File expired" }, { status: 410 });
  }

  const filePath = getFilePath(file.session.code, file.storedName);

  try {
    const stat = statSync(filePath);
    const stream = createReadStream(filePath);
    const webStream = Readable.toWeb(stream) as ReadableStream;

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": file.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
        "Content-Length": String(stat.size),
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found on disk" }, { status: 404 });
  }
}
