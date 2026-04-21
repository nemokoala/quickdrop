"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { MAX_FILE_SIZE_LABEL } from "@/lib/config";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export default function UploadZone({
  onFilesSelected,
  disabled,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFilesSelected(Array.from(files));
    },
    [onFilesSelected],
  );

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (!disabled) handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      className={cn(
        "cursor-pointer select-none rounded-2xl border-2 border-dashed p-10 transition-colors",
        "flex flex-col items-center justify-center gap-3",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/30",
        disabled && "pointer-events-none opacity-50",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <div className="rounded-full bg-primary/10 p-4">
        <Upload className="h-8 w-8 text-primary" />
      </div>
      <div className="text-center">
        <p className="text-base font-medium">파일을 끌어놓거나 클릭해서 선택하세요</p>
        <p className="mt-1 text-sm text-muted-foreground">
          여러 파일을 올릴 수 있고, 파일당 최대 {MAX_FILE_SIZE_LABEL}까지 지원합니다.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
        disabled={disabled}
      />
    </div>
  );
}
