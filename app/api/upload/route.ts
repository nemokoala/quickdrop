import { NextRequest, NextResponse } from "next/server";
import Busboy from "busboy";
import { createWriteStream } from "fs";
import { randomUUID } from "crypto";
import path from "path";
import { prisma } from "@/lib/prisma";
import { generateUniqueCode } from "@/lib/code-generator";
import { createSessionDir, getFilePath } from "@/lib/storage";
import { MAX_FILE_SIZE, SESSION_EXPIRY_HOURS } from "@/lib/config";
import { Readable } from "stream";

interface ParsedFile {
  originalName: string;
  storedName: string;
  size: bigint;
  mimeType: string;
}

function parseMultipart(
  req: NextRequest,
  sessionDir: string
): Promise<ParsedFile[]> {
  return new Promise((resolve, reject) => {
    const contentType = req.headers.get("content-type") || "";
    const busboy = Busboy({
      headers: { "content-type": contentType },
      limits: { fileSize: MAX_FILE_SIZE },
    });

    const files: ParsedFile[] = [];
    const writes: Promise<void>[] = [];

    busboy.on("file", (fieldname, fileStream, info) => {
      const { filename, mimeType } = info;
      const ext = path.extname(filename);
      const storedName = randomUUID() + ext;
      const filePath = getFilePath(path.basename(sessionDir), storedName);
      const writeStream = createWriteStream(filePath);
      let size = BigInt(0);

      fileStream.on("data", (chunk: Buffer) => {
        size += BigInt(chunk.length);
      });

      const writePromise = new Promise<void>((res, rej) => {
        fileStream.pipe(writeStream);
        writeStream.on("finish", () => {
          files.push({
            originalName: filename,
            storedName,
            size,
            mimeType,
          });
          res();
        });
        writeStream.on("error", rej);
        fileStream.on("error", rej);
      });

      writes.push(writePromise);
    });

    busboy.on("finish", async () => {
      await Promise.all(writes);
      resolve(files);
    });

    busboy.on("error", reject);

    // Node.js Readable에서 Web ReadableStream으로 브릿지
    const body = req.body;
    if (!body) {
      reject(new Error("No request body"));
      return;
    }
    Readable.fromWeb(body as import("stream/web").ReadableStream).pipe(busboy);
  });
}

export async function POST(req: NextRequest) {
  try {
    const code = await generateUniqueCode();
    await createSessionDir(code);

    const files = await parseMultipart(req, code);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const expiresAt = new Date(
      Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000
    );

    const session = await prisma.session.create({
      data: {
        code,
        expiresAt,
        files: {
          create: files.map((f) => ({
            originalName: f.originalName,
            storedName: f.storedName,
            size: f.size,
            mimeType: f.mimeType,
          })),
        },
      },
      include: { files: true },
    });

    return NextResponse.json({
      code: session.code,
      expiresAt: session.expiresAt.toISOString(),
      files: session.files.map((f) => ({
        id: f.id,
        originalName: f.originalName,
        size: Number(f.size),
        mimeType: f.mimeType,
      })),
    });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
