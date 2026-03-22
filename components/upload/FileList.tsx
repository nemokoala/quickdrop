"use client";

import { useEffect, useState } from "react";
import { X, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatBytes } from "@/lib/format";
import type { UploadProgress } from "@/types/quickdrop";

interface FileListProps {
  files: File[];
  progress: UploadProgress | null;
  isUploading: boolean;
  onRemove: (index: number) => void;
  onUpload: () => void;
  onReset: () => void;
}

export default function FileList({
  files,
  progress,
  isUploading,
  onRemove,
  onUpload,
  onReset,
}: FileListProps) {
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null);

  const [previews, setPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    const urls: Record<string, string> = {};
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        urls[file.name + file.size] = URL.createObjectURL(file);
      }
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviews(urls);
    return () => {
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  if (files.length === 0) return null;

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <>
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {files.length}개 파일 · {formatBytes(totalSize)}
        </span>
        {!isUploading && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            모두 제거
          </Button>
        )}
      </div>

      <ul className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {files.map((file, i) => (
          <li
            key={`${file.name}-${i}`}
            className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2"
          >
            {previews[file.name + file.size] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previews[file.name + file.size]}
                alt={file.name}
                className="h-8 w-8 shrink-0 rounded object-cover cursor-zoom-in"
                onClick={() => setOverlayUrl(previews[file.name + file.size])}
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
                onClick={() => onRemove(i)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </li>
        ))}
      </ul>

      {isUploading && progress !== null && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>업로드 중...</span>
            <span>{progress.percent}%</span>
          </div>
          <Progress value={progress.percent} className="h-2" />
        </div>
      )}

      {!isUploading && (
        <Button onClick={onUpload} className="w-full mt-2" size="lg">
          업로드
        </Button>
      )}
    </div>

    <Dialog open={!!overlayUrl} onOpenChange={(open) => !open && setOverlayUrl(null)}>
      <DialogContent showCloseButton={false} className="w-fit max-w-[90vw] sm:max-w-[90vw] p-0 bg-transparent border-none shadow-none place-items-center">
        <DialogTitle className="sr-only">이미지 미리보기</DialogTitle>
        {overlayUrl && (
          <div className="relative w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={overlayUrl}
              alt="미리보기"
              className="block max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            />
            <DialogClose className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/80">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
