"use client";

import { X, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  if (files.length === 0) return null;

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="flex flex-col gap-3">
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
            <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
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
        <Button onClick={onUpload} className="w-full" size="lg">
          업로드
        </Button>
      )}
    </div>
  );
}
