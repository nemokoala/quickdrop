"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion, Home } from "lucide-react";
import CodeInput from "@/components/shared/CodeInput";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <Card className="border-2 border-muted-foreground/20 bg-card/50 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-destructive/50 via-destructive to-destructive/50" />

          <CardHeader className="text-center pb-2 pt-10">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
              <FileQuestion className="h-14 w-14" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
              코드를 찾을 수 없습니다
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-8 px-8 pb-10">
            <div className="space-y-3">
              <p className="text-muted-foreground text-lg leading-relaxed">
                입력하신 공유 코드가 유효하지 않거나,
                <br />
                파일이 이미 만료되어 삭제되었을 수 있습니다.
              </p>
            </div>

            <CodeInput />

            <div className="flex flex-col gap-3 pt-2">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full h-12 text-md font-medium hover:bg-muted/50 transition-all"
              >
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  홈으로 돌아가기
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t border-muted/20">
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                QuickDrop은 보안을 위해
                <br />
                공유된 파일을 24시간 후 시스템에서 영구 삭제합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
