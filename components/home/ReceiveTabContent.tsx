"use client";

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
  return (
    <Card className="animate-in border-primary/20 bg-card/95 shadow-lg shadow-primary/10 fade-in slide-in-from-bottom-2 duration-300 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="h-5 w-5 text-primary" />
          {"공유 열기"}
        </CardTitle>
        <CardDescription>
          {
            "6자리 공유 코드를 입력하면 파일을 받거나 텍스트를 복사할 수 있습니다."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CodeInput />
      </CardContent>
    </Card>
  );
}
