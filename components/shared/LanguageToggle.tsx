"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { routing, type AppLocale } from "@/i18n/routing";

export default function LanguageToggle() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Language");

  const switchLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;

    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/") || `/${nextLocale}`);
  };

  return (
    <div
      className="mx-auto mt-4 inline-flex rounded-full border bg-background/80 p-1 text-xs shadow-sm"
      aria-label={t("label")}
    >
      {routing.locales.map((item) => (
        <Button
          key={item}
          type="button"
          variant={item === locale ? "default" : "ghost"}
          size="sm"
          className="h-7 rounded-full px-3 text-xs"
          onClick={() => switchLocale(item)}
        >
          {item.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
