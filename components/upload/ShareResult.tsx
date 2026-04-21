"use client";

import { useState } from "react";
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
  const shareUrl = `${BASE_URL}/d/${result.code}`;

  const summary =
    result.kind === "text" && result.text
      ? `${result.text.title} / ${formatBytes(result.text.size)}`
      : `파일 ${result.files.length}개`;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(result.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-2 text-xs">
          {formatExpiry(result.expiresAt)}
        </Badge>
        <p className="text-sm text-muted-foreground">
          아래 코드나 링크를 상대방에게 전달하세요.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{summary}</p>
      </div>

      {/* 6자리 공유 코드 */}
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

      {/* QR 코드 및 공유 링크 */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">QR 코드 또는 링크로 열기</p>
        <div className="rounded-xl border bg-white p-3 shadow-sm">
          <QRCodeSVG value={shareUrl} size={180} />
        </div>
        <p className="break-all text-xs text-muted-foreground">{shareUrl}</p>
      </div>

      <Button variant="outline" onClick={onReset} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        새로 업로드
      </Button>
    </div>
  );
}
