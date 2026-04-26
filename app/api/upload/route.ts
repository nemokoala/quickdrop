import { NextRequest, NextResponse } from "next/server";
import Busboy from "busboy";
import { createWriteStream } from "fs";
import { rm } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { prisma } from "@/lib/prisma";
import { generateUniqueCode } from "@/lib/code-generator";
import { createSessionDir, getFilePath } from "@/lib/storage";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL, UPLOAD_DIR } from "@/lib/config";
import { parseUploadExpiryMinutes } from "@/lib/upload-expiry";
import { getRequestLogContext, sendDiscordLog } from "@/lib/discord-webhook";
import { Readable } from "stream";

interface ParsedFile {
  originalName: string;
  storedName: string;
  size: bigint;
  mimeType: string;
}

class UploadSizeLimitError extends Error {
  constructor() {
    super(`Total upload size must be ${MAX_FILE_SIZE_LABEL} or less.`);
    this.name = "UploadSizeLimitError";
  }
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function parseMultipart(
  req: NextRequest,
  sessionDir: string,
  requestId: string,
): Promise<ParsedFile[]> {
  return new Promise((resolve, reject) => {
    const contentType = req.headers.get("content-type") || "";
    const busboy = Busboy({
      headers: { "content-type": contentType },
      limits: { fileSize: MAX_FILE_SIZE },
    });

    const files: ParsedFile[] = [];
    const writes: Promise<void>[] = [];
    let fileIndex = 0;
    let totalSize = 0;
    let settled = false;

    const rejectOnce = (err: Error) => {
      if (settled) return;
      settled = true;
      reject(err);
    };

    busboy.on("file", (fieldname, fileStream, info) => {
      const { filename, mimeType } = info;
      const currentIndex = ++fileIndex;
      const ext = path.extname(filename);
      const storedName = randomUUID() + ext;
      const filePath = getFilePath(path.basename(sessionDir), storedName);
      const writeStream = createWriteStream(filePath);
      let size = BigInt(0);
      let chunkCount = 0;
      const fileStart = Date.now();

      console.log(`[upload][${requestId}] 파일 #${currentIndex} 수신 시작: "${filename}" (${mimeType})`);

      fileStream.on("data", (chunk: Buffer) => {
        if (settled) return;

        size += BigInt(chunk.length);
        totalSize += chunk.length;
        chunkCount++;

        if (totalSize > MAX_FILE_SIZE) {
          console.warn(`[upload][${requestId}] 전체 업로드 크기 제한 초과: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
          rejectOnce(new UploadSizeLimitError());
          fileStream.unpipe(writeStream);
          writeStream.destroy();
          fileStream.resume();
          return;
        }

        if (chunkCount % 100 === 0) {
          console.log(`[upload][${requestId}] 파일 #${currentIndex} "${filename}" 진행중: ${(Number(size) / 1024 / 1024).toFixed(2)} MB (청크 ${chunkCount}개)`);
        }
      });

      fileStream.on("limit", () => {
        console.warn(`[upload][${requestId}] 파일 #${currentIndex} "${filename}" 크기 제한 초과! 현재 ${(Number(size) / 1024 / 1024).toFixed(2)} MB`);
        rejectOnce(new UploadSizeLimitError());
      });

      const writePromise = new Promise<void>((res, rej) => {
        fileStream.pipe(writeStream);
        writeStream.on("finish", () => {
          if (settled || fileStream.truncated) {
            res();
            return;
          }

          const elapsed = Date.now() - fileStart;
          console.log(`[upload][${requestId}] 파일 #${currentIndex} "${filename}" 저장 완료: ${(Number(size) / 1024 / 1024).toFixed(2)} MB, ${elapsed}ms`);
          files.push({
            originalName: filename,
            storedName,
            size,
            mimeType,
          });
          res();
        });
        writeStream.on("error", (err) => {
          console.error(`[upload][${requestId}] 파일 #${currentIndex} "${filename}" 쓰기 오류:`, err);
          rejectOnce(err);
          rej(err);
        });
        fileStream.on("error", (err) => {
          console.error(`[upload][${requestId}] 파일 #${currentIndex} "${filename}" 스트림 오류:`, err);
          rejectOnce(err);
          rej(err);
        });
      });

      writes.push(
        writePromise.catch((err) => {
          if (!settled) rejectOnce(err);
        }),
      );
    });

    busboy.on("finish", async () => {
      if (settled) return;

      console.log(`[upload][${requestId}] busboy 파싱 완료, 파일 ${writes.length}개 쓰기 대기중`);
      await Promise.all(writes);
      if (settled) return;

      settled = true;
      console.log(`[upload][${requestId}] 전체 파일 쓰기 완료, 파일 수: ${files.length}`);
      resolve(files);
    });

    busboy.on("error", (err) => {
      console.error(`[upload][${requestId}] busboy 오류:`, err);
      rejectOnce(toError(err));
    });

    // Node.js Readable에서 Web ReadableStream으로 브릿지
    const body = req.body;
    if (!body) {
      console.error(`[upload][${requestId}] 요청 body 없음`);
      rejectOnce(new Error("No request body"));
      return;
    }

    const readable = Readable.fromWeb(body as import("stream/web").ReadableStream);
    readable.on("error", (err) => {
      console.error(`[upload][${requestId}] 입력 스트림 오류:`, err);
      rejectOnce(toError(err));
    });
    readable.on("end", () => {
      console.log(`[upload][${requestId}] 입력 스트림 종료`);
    });
    readable.pipe(busboy);
  });
}

export async function POST(req: NextRequest) {
  const requestId = randomUUID().slice(0, 8);
  const startTime = Date.now();
  let code: string | null = null;
  const expiryMinutes = parseUploadExpiryMinutes(
    req.headers.get("x-expiry-minutes"),
  );
  try {
    console.log(`[upload][${requestId}] 요청 수신`, new Date().toISOString());
    console.log(`[upload][${requestId}] content-length:`, req.headers.get("content-length"));
    console.log(`[upload][${requestId}] content-type:`, req.headers.get("content-type"));
    console.log(`[upload][${requestId}] expiry-minutes:`, expiryMinutes);

    const contentLength = Number(req.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          code: "UPLOAD_TOO_LARGE",
          error: `Total upload size must be ${MAX_FILE_SIZE_LABEL} or less.`,
        },
        { status: 413 },
      );
    }

    code = await generateUniqueCode();
    console.log(`[upload][${requestId}] 세션 코드 생성: ${code}`);
    await createSessionDir(code);
    console.log(`[upload][${requestId}] 세션 디렉토리 생성 완료`);

    const files = await parseMultipart(req, code, requestId);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    console.log(`[upload][${requestId}] DB 저장 시작`);
    const session = await prisma.session.create({
      data: {
        code,
        kind: "file",
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
    console.log(`[upload][${requestId}] 완료 (총 ${Date.now() - startTime}ms)`);

    await sendDiscordLog({
      type: "upload",
      code: session.code,
      kind: "file",
      fileCount: session.files.length,
      totalSize: session.files.reduce((sum, file) => sum + Number(file.size), 0),
      expiresAt: session.expiresAt,
      files: session.files.map((file) => ({
        originalName: file.originalName,
        size: Number(file.size),
        mimeType: file.mimeType,
      })),
      request: getRequestLogContext(req),
    });

    return NextResponse.json({
      code: session.code,
      kind: "file",
      expiresAt: session.expiresAt.toISOString(),
      files: session.files.map((f) => ({
        id: f.id,
        originalName: f.originalName,
        size: Number(f.size),
        mimeType: f.mimeType,
      })),
      text: null,
    });
  } catch (err) {
    console.error(`[upload][${requestId}] 오류 (${Date.now() - startTime}ms 경과):`, err);
    if (code) {
      await rm(path.join(UPLOAD_DIR, code), { recursive: true, force: true });
    }

    if (err instanceof UploadSizeLimitError) {
      return NextResponse.json(
        { code: "UPLOAD_TOO_LARGE", error: err.message },
        { status: 413 },
      );
    }

    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
