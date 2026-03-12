import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DownloadPageClient from "./DownloadPageClient";

interface PageProps {
  params: Promise<{ code: string }>;
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
      expiresAt={session.expiresAt.toISOString()}
      expired={expired}
      files={
        expired
          ? []
          : session.files.map((f) => ({
              id: f.id,
              originalName: f.originalName,
              size: Number(f.size),
              mimeType: f.mimeType,
            }))
      }
    />
  );
}
