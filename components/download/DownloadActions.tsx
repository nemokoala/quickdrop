"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadActionsProps {
  code: string;
  fileCount: number;
}

export default function DownloadActions({
  code,
  fileCount,
}: DownloadActionsProps) {
  const handleDownloadAll = () => {
    const anchor = document.createElement("a");
    anchor.href = `/api/download-all/${code}`;
    anchor.download = `quickdrop-${code}.zip`;
    anchor.click();
  };

  if (fileCount === 0) return null;

  return (
    <Button onClick={handleDownloadAll} className="w-full gap-2" size="lg">
      <Download className="h-4 w-4" />
      전체 ZIP 다운로드 ({fileCount}개)
    </Button>
  );
}
