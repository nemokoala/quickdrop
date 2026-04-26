"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/lib/format";
import {
  formatUploadExpiryMinutes,
  MAX_UPLOAD_EXPIRY_MINUTES,
  MIN_UPLOAD_EXPIRY_MINUTES,
  UPLOAD_EXPIRY_STEP_MINUTES,
} from "@/lib/upload-expiry";
import type { UploadProgress } from "@/types/quickdrop";

interface FileListProps {
  files: File[];
  progress: UploadProgress | null;
  isUploading: boolean;
  expiryMinutes: number;
  onExpiryChange: (minutes: number) => void;
  onRemove: (index: number) => void;
  onUpload: () => void;
  onReset: () => void;
}

export default function FileList({
  files,
  progress,
  isUploading,
  expiryMinutes,
  onExpiryChange,
  onRemove,
  onUpload,
  onReset,
}: FileListProps) {
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null);
  const locale = useLocale();
  const t = useTranslations("FileList");

  const previews = useMemo(() => {
    const urls: Record<string, string> = {};

    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        urls[`${file.name}-${file.size}`] = URL.createObjectURL(file);
      }
    });

    return urls;
  }, [files]);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  if (files.length === 0) return null;

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const duration = formatUploadExpiryMinutes(expiryMinutes, locale);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {t("summary", { count: files.length, size: formatBytes(totalSize) })}
          </span>
          {!isUploading && (
            <Button variant="outline" size="sm" onClick={onReset}>
              {t("removeAll")}
            </Button>
          )}
        </div>

        <ul className="flex max-h-60 flex-col gap-2 overflow-y-auto">
          {files.map((file, index) => {
            const previewUrl = previews[`${file.name}-${file.size}`];

            return (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2"
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-8 w-8 shrink-0 cursor-zoom-in rounded object-cover"
                    onClick={() => setOverlayUrl(previewUrl)}
                  />
                ) : (
                  <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                  </p>
                </div>

                {!isUploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => onRemove(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>

        <div className="rounded-lg border bg-background/70 px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">{t("expiryTitle")}</p>
              <p className="text-xs text-muted-foreground">
                {t("expiryDescription", { duration })}
              </p>
            </div>
            <span className="rounded-md bg-muted px-2 py-1 text-sm font-semibold">
              {duration}
            </span>
          </div>

          <input
            type="range"
            min={MIN_UPLOAD_EXPIRY_MINUTES}
            max={MAX_UPLOAD_EXPIRY_MINUTES}
            step={UPLOAD_EXPIRY_STEP_MINUTES}
            value={expiryMinutes}
            onChange={(event) => onExpiryChange(Number(event.target.value))}
            disabled={isUploading}
            className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed"
            aria-label={t("expiryAria")}
          />

          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{t("minDuration")}</span>
            <span>{t("maxDuration")}</span>
          </div>
        </div>

        {isUploading && progress !== null && (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t("uploading")}</span>
              <span>{progress.percent}%</span>
            </div>
            <Progress value={progress.percent} className="h-2" />
          </div>
        )}

        {!isUploading && (
          <Button onClick={onUpload} className="w-full" size="lg">
            {t("upload")}
          </Button>
        )}
      </div>

      <Dialog
        open={!!overlayUrl}
        onOpenChange={(open) => !open && setOverlayUrl(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="place-items-center border-none bg-transparent p-0 shadow-none sm:max-w-[90vw]"
        >
          <DialogTitle className="sr-only">{t("previewTitle")}</DialogTitle>
          {overlayUrl && (
            <div className="relative w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={overlayUrl}
                alt={t("previewAlt")}
                className="block max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              />
              <DialogClose className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/80">
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
