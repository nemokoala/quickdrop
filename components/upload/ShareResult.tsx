"use client";

import { useState } from "react";
import QRCodeSVG from "react-qr-code";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BASE_URL } from "@/lib/config";
import { formatExpiry } from "@/lib/format";
import type { UploadResult } from "@/types/quickdrop";

interface ShareResultProps {
  result: UploadResult;
  onReset: () => void;
}

export default function ShareResult({ result, onReset }: ShareResultProps) {
  const [copied, setCopied] = useState(false);
  const downloadUrl = `${BASE_URL}/d/${result.code}`;

  const copyCode = async () => {
    await navigator.clipboard.writeText(result.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <Badge variant="outline" className="mb-2 text-xs">
          {formatExpiry(result.expiresAt)}
        </Badge>
        <p className="text-sm text-muted-foreground">아래 코드를 상대방에게 알려주세요</p>
      </div>

      {/* 6자리 코드 */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-5xl font-bold tracking-widest">
          {result.code}
        </span>
        <Button variant="outline" size="icon" onClick={copyCode}>
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator className="w-full" />

      {/* QR 코드 */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground">또는 QR 코드 스캔</p>
        <div className="rounded-xl border bg-white p-3 shadow-sm">
          <QRCodeSVG value={downloadUrl} size={180} />
        </div>
        <p className="text-xs text-muted-foreground break-all">{downloadUrl}</p>
      </div>

      <Button variant="outline" onClick={onReset} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        새로 업로드
      </Button>
    </div>
  );
}
