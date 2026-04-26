"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("Download");

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
      {t("downloadZip", { count: fileCount })}
    </Button>
  );
}
