"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageToggle from "@/components/shared/LanguageToggle";

export default function HomeHero() {
  const t = useTranslations("Home");

  return (
    <div className="mb-8 text-center">
      <Image
        src="/icon.svg"
        alt=""
        aria-hidden="true"
        width={72}
        height={72}
        className="mx-auto mb-4 h-18 w-18 rounded-2xl ring-1 ring-primary/30 shadow-xl shadow-primary/25"
      />
      <h1 className="text-4xl font-bold tracking-tight">NemoDrop</h1>
      <p className="mt-2 text-muted-foreground">{t("heroDescription")}</p>
      <LanguageToggle />
    </div>
  );
}
