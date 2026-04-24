"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { toast } from "sonner";
import UploadZone from "@/components/upload/UploadZone";
import FileList from "@/components/upload/FileList";
import ShareResult from "@/components/upload/ShareResult";
import TextUploadForm from "@/components/upload/TextUploadForm";
import CodeInput from "@/components/shared/CodeInput";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DEFAULT_UPLOAD_EXPIRY_MINUTES,
  clampUploadExpiryMinutes,
} from "@/lib/upload-expiry";
import { useUpload } from "@/queries/upload/mutations";
import type { SessionKind, UploadResult } from "@/types/quickdrop";

export default function HomePage() {
  const [mode, setMode] = useState<SessionKind>("file");
  const [files, setFiles] = useState<File[]>([]);
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);
  const [expiryMinutes, setExpiryMinutes] = useState(
    DEFAULT_UPLOAD_EXPIRY_MINUTES,
  );
  const {
    uploadFiles,
    uploadText,
    progress,
    isUploading,
    reset: resetUpload,
  } = useUpload();

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((file) => `${file.name}-${file.size}`));
      const deduped = newFiles.filter(
        (file) => !existing.has(`${file.name}-${file.size}`),
      );

      return [...prev, ...deduped];
    });
  }, []);

  const handleRemove = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  }, []);

  const handleReset = useCallback(() => {
    setFiles([]);
    setTextTitle("");
    setTextContent("");
    setResult(null);
    setExpiryMinutes(DEFAULT_UPLOAD_EXPIRY_MINUTES);
    resetUpload();
  }, [resetUpload]);

  const handleUpload = useCallback(async () => {
    try {
      if (mode === "file") {
        if (files.length === 0) return;
        setResult(await uploadFiles(files, expiryMinutes));
        return;
      }

      if (textContent.trim().length === 0) return;

      setResult(await uploadText(textContent, textTitle, expiryMinutes));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "업로드에 실패했습니다.",
      );
    }
  }, [
    expiryMinutes,
    files,
    mode,
    textContent,
    textTitle,
    uploadFiles,
    uploadText,
  ]);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-start overflow-x-hidden bg-background px-4 pb-12 pt-[10vh] md:pt-[15vh]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-48 mx-auto h-104 w-104 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-lg min-w-0">
        <div className="mb-8 text-center">
          <Image
            src="/icon.svg"
            alt=""
            aria-hidden="true"
            width={72}
            height={72}
            className="mx-auto mb-4 h-18 w-18 rounded-2xl ring-1 ring-primary/30 shadow-xl shadow-primary/25"
          />
          <h1 className="text-4xl font-bold tracking-tight">QuickDrop</h1>
          <p className="mt-2 text-muted-foreground">
            로그인 없이 파일이나 텍스트를 빠르게 공유하세요.
          </p>
        </div>

        <Tabs defaultValue="send" className="w-full">
          <TabsList className="mb-6 grid min-h-12 w-full grid-cols-2 rounded-xl bg-primary/10 p-1">
            <TabsTrigger
              value="send"
              className="h-full rounded-lg text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              공유하기
            </TabsTrigger>
            <TabsTrigger
              value="receive"
              className="h-full rounded-lg text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              가져오기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="mt-0">
            <Card className="animate-in border-primary/20 bg-card/95 shadow-lg shadow-primary/10 fade-in slide-in-from-bottom-2 duration-300 backdrop-blur">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">
                  {result
                    ? "공유 코드"
                    : mode === "file"
                      ? "파일 업로드"
                      : "텍스트 공유"}
                </CardTitle>
                {!result && (
                  <CardDescription>
                    파일 공유와 텍스트 공유를 전환해서 사용할 수 있습니다.
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {result ? (
                  <ShareResult result={result} onReset={handleReset} />
                ) : (
                  <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={mode === "file" ? "default" : "outline"}
                        onClick={() => setMode("file")}
                        disabled={isUploading}
                      >
                        파일
                      </Button>
                      <Button
                        type="button"
                        variant={mode === "text" ? "default" : "outline"}
                        onClick={() => setMode("text")}
                        disabled={isUploading}
                      >
                        텍스트
                      </Button>
                    </div>

                    {mode === "file" ? (
                      <>
                        <UploadZone
                          onFilesSelected={handleFilesSelected}
                          disabled={isUploading}
                        />
                        <FileList
                          files={files}
                          progress={progress}
                          isUploading={isUploading}
                          expiryMinutes={expiryMinutes}
                          onExpiryChange={(value) =>
                            setExpiryMinutes(clampUploadExpiryMinutes(value))
                          }
                          onRemove={handleRemove}
                          onUpload={handleUpload}
                          onReset={handleReset}
                        />
                      </>
                    ) : (
                      <TextUploadForm
                        title={textTitle}
                        content={textContent}
                        expiryMinutes={expiryMinutes}
                        isUploading={isUploading}
                        onTitleChange={setTextTitle}
                        onContentChange={setTextContent}
                        onExpiryChange={(value) =>
                          setExpiryMinutes(clampUploadExpiryMinutes(value))
                        }
                        onUpload={handleUpload}
                        onReset={handleReset}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="receive" className="mt-0">
            <Card className="animate-in border-primary/20 bg-card/95 shadow-lg shadow-primary/10 fade-in slide-in-from-bottom-2 duration-300 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Download className="h-5 w-5 text-primary" />
                  공유 열기
                </CardTitle>
                <CardDescription>
                  6자리 공유 코드를 입력하면 파일을 받거나 텍스트를 복사할 수
                  있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeInput />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
