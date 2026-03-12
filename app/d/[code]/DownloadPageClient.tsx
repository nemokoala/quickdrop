"use client";

import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FileTable from "@/components/download/FileTable";
import DownloadActions from "@/components/download/DownloadActions";
import { formatBytes, formatExpiry } from "@/lib/format";
import type { FileInfo } from "@/types/quickdrop";

interface Props {
  code: string;
  expiresAt: string;
  expired: boolean;
  files: FileInfo[];
}

export default function DownloadPageClient({ code, expiresAt, expired, files }: Props) {
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">QuickDrop</h1>
          <p className="mt-2 text-muted-foreground">파일 다운로드</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-mono tracking-widest">
                {code}
              </CardTitle>
              <Badge
                variant={expired ? "destructive" : "outline"}
                className="gap-1 text-xs"
              >
                <Clock className="h-3 w-3" />
                {expired ? "만료됨" : formatExpiry(expiresAt)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {expired ? (
              <div className="py-8 text-center text-muted-foreground">
                <p className="font-medium">이 코드는 만료되었습니다.</p>
                <p className="mt-1 text-sm">파일이 자동으로 삭제되었습니다.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {files.length}개 파일 · {formatBytes(totalSize)}
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
