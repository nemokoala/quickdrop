"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FileQuestion, Home } from "lucide-react";
import CodeInput from "@/components/shared/CodeInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("NotFound");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <Card className="overflow-hidden border-2 border-muted-foreground/20 bg-card/50 backdrop-blur-sm">
          <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-destructive/50 via-destructive to-destructive/50" />

          <CardHeader className="pb-2 pt-10 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
              <FileQuestion className="h-14 w-14" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              {t("codeTitle")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-10 text-center">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {t("codeDescription")}
            </p>

            <CodeInput />

            <div className="flex flex-col gap-3 pt-2">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 w-full text-md font-medium transition-all hover:bg-muted/50"
              >
                <Link href={`/${locale}`}>
                  <Home className="mr-2 h-5 w-5" />
                  {t("home")}
                </Link>
              </Button>
            </div>

            <div className="border-t border-muted/20 pt-4">
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {t("securityNote")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
