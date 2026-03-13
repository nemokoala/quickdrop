import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Compass } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center flex-col items-center">
            <h1 className="text-9xl font-black text-primary/10 select-none">404</h1>
            <div className="-mt-16 p-4 bg-background rounded-full border shadow-xl">
                <Compass className="h-16 w-16 text-primary animate-pulse" />
            </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">길을 잃으셨나요?</h2>
          <p className="text-muted-foreground text-lg">
            요청하신 페이지를 찾을 수 없습니다. <br />
            주소가 정확한지 다시 한번 확인해주세요.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-primary/20 transition-all font-semibold">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
