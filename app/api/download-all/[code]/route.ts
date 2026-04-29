import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { createReadStream } from "fs";
import { Readable, PassThrough } from "stream";
import { prisma } from "@/lib/prisma";
import { getFilePath } from "@/lib/storage";
import { getRequestLogContext, sendDiscordLog } from "@/lib/discord-webhook";

export async function GET(
  req: NextRequest,
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

  if (session.kind !== "file") {
    return NextResponse.json(
      { error: "ZIP download is only available for file shares" },
      { status: 400 },
    );
  }

  await sendDiscordLog({
    type: "download",
    code: session.code,
    mode: "zip",
    fileCount: session.files.length,
    totalSize: session.files.reduce((sum, file) => sum + Number(file.size), 0),
    request: getRequestLogContext(req),
  });

  const passThrough = new PassThrough();
  const archive = archiver("zip", { zlib: { level: 5 } });

  archive.on("error", (err) => {
    console.error("[download-all] archive error:", err);
    passThrough.destroy(err);
  });

  archive.pipe(passThrough);

  for (const file of session.files) {
    const filePath = getFilePath(code, file.storedName);
    archive.append(createReadStream(filePath), { name: file.originalName });
  }

  archive.finalize();

  const webStream = Readable.toWeb(passThrough) as ReadableStream;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="nemodrop-${code}.zip"`,
    },
  });
}
