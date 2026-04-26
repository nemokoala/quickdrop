"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import FileList from "@/components/upload/FileList";
import ShareResult from "@/components/upload/ShareResult";
import TextUploadForm from "@/components/upload/TextUploadForm";
import UploadZone from "@/components/upload/UploadZone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  clampUploadExpiryMinutes,
  DEFAULT_UPLOAD_EXPIRY_MINUTES,
} from "@/lib/upload-expiry";
import { saveUploadHistory } from "@/lib/upload-history";
import { useUpload } from "@/queries/upload/mutations";
import type { SessionKind, UploadResult } from "@/types/quickdrop";

export default function SendTabContent() {
  const t = useTranslations("Send");
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
      let nextResult: UploadResult;

      if (mode === "file") {
        if (files.length === 0) return;
        nextResult = await uploadFiles(files, expiryMinutes);
      } else {
        if (textContent.trim().length === 0) return;
        nextResult = await uploadText(textContent, textTitle, expiryMinutes);
      }

      saveUploadHistory(nextResult);
      setResult(nextResult);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("uploadFailed"));
    }
  }, [
    expiryMinutes,
    files,
    mode,
    t,
    textContent,
    textTitle,
    uploadFiles,
    uploadText,
  ]);

  return (
    <Card className="animate-in border-primary/20 bg-card/95 shadow-lg shadow-primary/10 fade-in slide-in-from-bottom-2 duration-300 backdrop-blur">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">
          {result
            ? t("shareCode")
            : mode === "file"
              ? t("fileUpload")
              : t("textShare")}
        </CardTitle>
        {!result && <CardDescription>{t("description")}</CardDescription>}
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
                {t("file")}
              </Button>
              <Button
                type="button"
                variant={mode === "text" ? "default" : "outline"}
                onClick={() => setMode("text")}
                disabled={isUploading}
              >
                {t("text")}
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
  );
}
