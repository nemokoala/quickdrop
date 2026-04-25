"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Check, Clock3, Copy, FileText, Trash2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getUploadHistory,
  removeUploadHistoryItem,
  UPLOAD_HISTORY_EVENT,
  type UploadHistoryItem,
} from "@/lib/upload-history";
import { formatBytes, formatExpiry } from "@/lib/format";

function formatSavedAt(savedAt: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(savedAt));
}

export default function UploadHistory() {
  const [items, setItems] = useState<UploadHistoryItem[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const refreshHistory = useCallback(() => {
    setItems(getUploadHistory());
  }, []);

  useEffect(() => {
    window.queueMicrotask(refreshHistory);

    window.addEventListener(UPLOAD_HISTORY_EVENT, refreshHistory);
    window.addEventListener("storage", refreshHistory);

    return () => {
      window.removeEventListener(UPLOAD_HISTORY_EVENT, refreshHistory);
      window.removeEventListener("storage", refreshHistory);
    };
  }, [refreshHistory]);

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/d/${code}`);
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRemove = (code: string) => {
    removeUploadHistoryItem(code);
  };

  if (items.length === 0) return null;

  return (
    <section className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">이전 업로드</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            이 브라우저에서 업로드한 항목만 표시됩니다.
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 text-xs">
          최근 {items.length}개
        </Badge>
      </div>

      <div className="overflow-hidden rounded-xl border border-primary/15 bg-card/90 shadow-lg shadow-primary/5 backdrop-blur">
        <ul className="divide-y divide-border/70">
          {items.map((item) => {
            const Icon = item.kind === "text" ? FileText : Upload;

            return (
              <li key={item.code} className="p-3">
                <div className="flex min-w-0 items-start gap-3 mt-1">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/d/${item.code}`}
                      className="block truncate text-sm font-semibold hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-mono font-medium text-foreground">
                        {item.code}
                      </span>
                      <span>{item.detail}</span>
                      <span>{formatBytes(item.totalSize)}</span>
                      <span>{formatSavedAt(item.savedAt)}</span>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="h-3 w-3" />
                      {formatExpiry(item.expiresAt)}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleCopy(item.code)}
                      aria-label="공유 링크 복사"
                    >
                      {copiedCode === item.code ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemove(item.code)}
                      aria-label="히스토리에서 삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
