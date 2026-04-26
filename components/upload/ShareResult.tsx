"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import QRCodeSVG from "react-qr-code";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BASE_URL } from "@/lib/config";
import { formatBytes, formatExpiry } from "@/lib/format";
import type { UploadResult } from "@/types/quickdrop";

interface ShareResultProps {
  result: UploadResult;
  onReset: () => void;
}

export default function ShareResult({ result, onReset }: ShareResultProps) {
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const locale = useLocale();
  const t = useTranslations("ShareResult");
  const shareUrl = `${BASE_URL}/${locale}/d/${result.code}`;

  const summary =
    result.kind === "text" && result.text
      ? `${result.text.title} / ${formatBytes(result.text.size)}`
      : t("fileSummary", { count: result.files.length });

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(result.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setUrlCopied(true);
    window.setTimeout(() => setUrlCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-2 text-xs">
          {formatExpiry(result.expiresAt, locale)}
        </Badge>
        <p className="text-sm text-muted-foreground">{t("instruction")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{summary}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-5xl font-bold tracking-widest">
          {result.code}
        </span>
        <Button variant="outline" size="icon" onClick={handleCopyCode}>
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator className="w-full" />

      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">{t("qrInstruction")}</p>
        <div className="rounded-xl border bg-white p-3 shadow-sm">
          <QRCodeSVG value={shareUrl} size={180} />
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleCopyUrl}
          className="h-auto max-w-full whitespace-normal break-all px-3 py-2 text-center font-mono text-base font-semibold leading-relaxed"
          aria-label={t("copyLink")}
        >
          {shareUrl}
        </Button>
        <p
          aria-live="polite"
          className={`min-h-3 text-xs font-medium text-green-600 transition-opacity duration-200 ${
            urlCopied ? "opacity-100" : "opacity-0"
          }`}
        >
          {t("linkCopied")}
        </p>
      </div>

      <Button variant="outline" onClick={onReset} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        {t("newUpload")}
      </Button>
    </div>
  );
}
