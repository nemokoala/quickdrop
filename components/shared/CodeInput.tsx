"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";

interface CodeInputProps {
  className?: string;
  autoFocus?: boolean;
}

export default function CodeInput({
  className,
  autoFocus = false,
}: CodeInputProps) {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleGo = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (code.length === 6) {
      router.push(`/d/${code}`);
    }
  };

  return (
    <form
      onSubmit={handleGo}
      className={cn("flex flex-col items-center gap-4", className)}
    >
      <div className="flex items-center gap-2 relative">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={setCode}
          autoFocus={autoFocus}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPGroup key={i}>
              <InputOTPSlot
                index={i}
                className="h-12 w-12 text-lg font-mono bg-background outline-black"
              />
            </InputOTPGroup>
          ))}
        </InputOTP>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setCode("")}
          className={cn(
            "absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full transition-opacity hover:bg-muted-foreground/10 active:bg-muted-foreground/20 dark:hover:bg-muted-foreground/30 dark:active:bg-muted-foreground/40",
            code.length === 0 ? "opacity-0 pointer-events-none" : "opacity-100",
          )}
          aria-label="초기화"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Button
        type="submit"
        disabled={code.length !== 6}
        className="w-full h-11 font-semibold mt-4"
      >
        다운로드
      </Button>
    </form>
  );
}
