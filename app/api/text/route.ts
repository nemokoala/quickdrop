import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateUniqueCode } from "@/lib/code-generator";
import { MAX_TEXT_BYTES } from "@/lib/config";
import { clampUploadExpiryMinutes } from "@/lib/upload-expiry";

interface TextUploadPayload {
  content?: unknown;
  title?: unknown;
  expiryMinutes?: unknown;
}

export async function POST(req: NextRequest) {
  let body: TextUploadPayload;

  try {
    body = (await req.json()) as TextUploadPayload;
  } catch {
    return NextResponse.json({ error: "잘못된 요청 본문입니다." }, { status: 400 });
  }

  if (typeof body.content !== "string") {
    return NextResponse.json({ error: "텍스트 내용을 입력해주세요." }, { status: 400 });
  }

  if (body.content.trim().length === 0) {
    return NextResponse.json({ error: "텍스트 내용이 비어 있습니다." }, { status: 400 });
  }

  const size = Buffer.byteLength(body.content, "utf8");

  if (size > MAX_TEXT_BYTES) {
    return NextResponse.json(
      { error: "텍스트 크기가 제한을 초과했습니다." },
      { status: 413 },
    );
  }

  const title =
    typeof body.title === "string" && body.title.trim().length > 0
      ? body.title.trim().slice(0, 80)
      : "shared-text.txt";
  const expiryMinutes = clampUploadExpiryMinutes(Number(body.expiryMinutes));
  const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
  const code = await generateUniqueCode();

  const session = await prisma.session.create({
    data: {
      code,
      kind: "text",
      textTitle: title,
      textContent: body.content,
      textSize: size,
      expiresAt,
    },
  });

  return NextResponse.json({
    code: session.code,
    kind: "text",
    expiresAt: session.expiresAt.toISOString(),
    files: [],
    text: {
      title,
      content: body.content,
      size,
    },
  });
}
