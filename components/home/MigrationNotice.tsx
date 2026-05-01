"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FALLBACK_BASE_URL = "https://nemodrop.nemokoala.com";

function getDisplaySiteUrl(url: string) {
  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  try {
    return new URL(normalized).origin;
  } catch {
    return normalized;
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
  const siteUrl = getDisplaySiteUrl(baseUrl);

  return (
    <div className="relative -mt-7 mb-7 rounded-lg border border-primary/30 bg-card/80 px-4 py-3.5 shadow-sm ring-1 ring-primary/10">
      <div className="flex flex-col flex-wrap items-center justify-center gap-2.5 text-center">
        <Badge
          variant="secondary"
          className="border-primary/30 bg-primary/15 font-medium text-foreground"
        >
          {t("migrationBadge")}
        </Badge>
        <div className="flex max-w-full flex-col gap-1.5 text-sm leading-relaxed sm:text-base">
          <p className="text-pretty text-foreground">
            {t("migrationNoticeLead")}
            <span className="mx-1 inline-block max-w-full break-all font-mono text-sm font-semibold text-primary sm:text-base">
              {siteUrl}
            </span>
            {t("migrationNoticeTail")}
          </p>
          <p className="text-pretty text-sm text-foreground/80">
            {t("migrationExpiry")}
          </p>
        </div>
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
