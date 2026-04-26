"use client";

import { useTranslations } from "next-intl";
import { Download, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/format";
import type { FileInfo } from "@/types/quickdrop";

interface FileTableProps {
  files: FileInfo[];
}

export default function FileTable({ files }: FileTableProps) {
  const t = useTranslations("Download");

  const handleDownload = (file: FileInfo) => {
    const anchor = document.createElement("a");
    anchor.href = `/api/download/${file.id}`;
    anchor.download = file.originalName;
    anchor.click();
  };

  return (
    <ul className="flex flex-col gap-2">
      {files.map((file) => (
        <li
          key={file.id}
          className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2"
        >
          <FileIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.originalName}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => handleDownload(file)}
            aria-label={t("downloadFile", { name: file.originalName })}
          >
            <Download className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
