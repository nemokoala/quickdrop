"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadZone from "@/components/upload/UploadZone";
import FileList from "@/components/upload/FileList";
import ShareResult from "@/components/upload/ShareResult";
import { useUpload } from "@/queries/upload/mutations";
import type { UploadResult } from "@/types/quickdrop";
import CodeInput from "@/components/shared/CodeInput";

export default function HomePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<UploadResult | null>(null);
  const { upload, progress, isUploading, reset: resetUpload } = useUpload();

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      const deduped = newFiles.filter((f) => !existing.has(f.name + f.size));
      return [...prev, ...deduped];
    });
  }, []);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    resetUpload();
  }, [resetUpload]);

  const handleUpload = async () => {
    if (files.length === 0) return;
    try {
      const data = await upload(files);
      setResult(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "업로드 실패");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 overflow-x-hidden">
      <div className="w-full max-w-lg min-w-0">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">QuickDrop</h1>
          <p className="mt-2 text-muted-foreground">
            로그인 없이 파일을 빠르게 공유하세요
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {result ? "공유 코드" : "파일 업로드"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <ShareResult result={result} onReset={handleReset} />
            ) : (
              <div className="flex flex-col gap-4">
                <UploadZone
                  onFilesSelected={handleFilesSelected}
                  disabled={isUploading}
                />
                <FileList
                  files={files}
                  progress={progress}
                  isUploading={isUploading}
                  onRemove={handleRemove}
                  onUpload={handleUpload}
                  onReset={handleReset}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="relative my-6 flex items-center">
          <div className="flex-1 border-t border-muted-foreground/20" />
          <span className="mx-4 text-xs text-muted-foreground">또는</span>
          <div className="flex-1 border-t border-muted-foreground/20" />
        </div>

        <div className="text-center mb-3">
          <p className="text-sm font-medium text-muted-foreground">코드로 파일 받기</p>
        </div>

        <CodeInput />
      </div>
    </main>
  );
}
