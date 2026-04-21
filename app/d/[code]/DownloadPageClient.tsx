"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clock, Copy } from "lucide-react";
import DownloadActions from "@/components/download/DownloadActions";
import FileTable from "@/components/download/FileTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes, formatExpiry } from "@/lib/format";
import type { FileInfo, SessionKind, TextInfo } from "@/types/quickdrop";

interface Props {
  code: string;
  kind: SessionKind;
  expiresAt: string;
  expired: boolean;
  files: FileInfo[];
  text: TextInfo | null;
}

export default function DownloadPageClient({
  code,
  kind,
  expiresAt,
  expired,
  files,
  text,
}: Props) {
  const [copied, setCopied] = useState(false);
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  const handleCopy = async () => {
    if (!text) return;

    await navigator.clipboard.writeText(text.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">QuickDrop</h1>
          <p className="mt-2 text-muted-foreground">
            {kind === "text" ? "공유된 텍스트" : "파일 받기"}
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-lg font-mono tracking-widest">
                {code}
              </CardTitle>
              <Badge
                variant={expired ? "destructive" : "outline"}
                className="gap-1 text-xs"
              >
                <Clock className="h-3 w-3" />
                {formatExpiry(expiresAt)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {expired ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="font-medium">이 공유 코드는 만료되었습니다.</p>
                <p className="mt-1 text-sm">
                  공유된 내용은 만료 시 자동으로 삭제됩니다.
                </p>
              </div>
            ) : kind === "text" && text ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{text.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(text.size)}
                    </p>
                  </div>
                  <Button onClick={handleCopy} className="gap-2" size="sm">
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copied ? "복사됨" : "텍스트 복사"}
                  </Button>
                </div>
                <textarea
                  readOnly
                  value={text.content}
                  className="min-h-72 rounded-lg border bg-muted/20 px-3 py-3 text-sm outline-none"
                />
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  파일 {files.length}개 / {formatBytes(totalSize)}
                </p>
                <FileTable files={files} />
                {files.length > 1 && (
                  <DownloadActions code={code} fileCount={files.length} />
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 flex justify-center">
          <Button variant="ghost" asChild className="gap-2 text-muted-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              파일 올리기
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
