"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FALLBACK_BASE_URL = "https://nemodrop.nemokoala.com";

function getDisplayHost(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

export default function MigrationNotice() {
  const searchParams = useSearchParams();
  const t = useTranslations("Home");
  const [isMigrated] = useState(() => searchParams.get("migrated") === "1");
  const [isVisible, setIsVisible] = useState(isMigrated);

  useEffect(() => {
    if (!isMigrated) return;

    const nextParams = new URLSearchParams(window.location.search);
    nextParams.delete("migrated");

    const nextQuery = nextParams.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;

    window.history.replaceState(window.history.state, "", nextUrl);
  }, [isMigrated]);

  if (!isMigrated || !isVisible) return null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_BASE_URL;
  const host = getDisplayHost(baseUrl);

  return (
    <div className="relative mb-5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 -mt-4 text-sm shadow-sm">
      <div className="flex flex-col flex-wrap items-center justify-center gap-2 text-center text-muted-foreground">
        <Badge variant="secondary" className="border-primary/20 bg-background">
          {t("migrationBadge")}
        </Badge>
        <span className="flex flex-col gap-0.5">
          <span>{t("migrationNotice", { host })}</span>
          <span>{t("migrationExpiry")}</span>
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
        onClick={() => setIsVisible(false)}
        aria-label={t("migrationDismiss")}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
