import { Buffer } from "node:buffer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DownloadPageClient from "./DownloadPageClient";

interface PageProps {
  params: Promise<{ code: string; locale: string }>;
}

export function generateMetadata(): Metadata {
  return {
    title: "NemoDrop",
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function DownloadPage({ params }: PageProps) {
  const { code } = await params;

  const session = await prisma.session.findUnique({
    where: { code },
    include: { files: true },
  });

  if (!session) {
    notFound();
  }

  const expired = session.expiresAt < new Date();

  return (
    <DownloadPageClient
      code={code}
      kind={session.kind === "text" ? "text" : "file"}
      expiresAt={session.expiresAt.toISOString()}
      expired={expired}
      files={
        expired || session.kind !== "file"
          ? []
          : session.files.map((file) => ({
              id: file.id,
              originalName: file.originalName,
              size: Number(file.size),
              mimeType: file.mimeType,
            }))
      }
      text={
        expired || session.kind !== "text" || !session.textContent
          ? null
          : {
              title: session.textTitle || "shared-text.txt",
              content: session.textContent,
              size:
                session.textSize ??
                Buffer.byteLength(session.textContent, "utf8"),
            }
      }
    />
  );
}
