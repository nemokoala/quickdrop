"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
  const locale = useLocale();
  const t = useTranslations("NotFound");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="max-w-md animate-in space-y-6 text-center fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center justify-center">
          <h1 className="select-none text-9xl font-black text-primary/10">404</h1>
          <div className="-mt-16 rounded-full border bg-background p-4 shadow-xl">
            <Compass className="h-16 w-16 animate-pulse text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("pageTitle")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("pageDescription")}
          </p>
        </div>

        <div className="pt-4">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 font-semibold shadow-lg transition-all hover:shadow-primary/20"
          >
            <Link href={`/${locale}`}>
              <Home className="mr-2 h-5 w-5" />
              {t("home")}
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
