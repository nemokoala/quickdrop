"use client";

import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import CodeInput from "@/components/shared/CodeInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReceiveTabContent() {
  const t = useTranslations("Receive");

  return (
    <Card className="animate-in border-primary/20 bg-card/95 shadow-lg shadow-primary/10 fade-in slide-in-from-bottom-2 duration-300 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="h-5 w-5 text-primary" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <CodeInput />
      </CardContent>
    </Card>
  );
}
