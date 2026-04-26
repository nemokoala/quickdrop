"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const locale = useLocale();
  const t = useTranslations("CodeInput");

  const handleGo = (event?: FormEvent) => {
    event?.preventDefault();
    if (code.length === 6) {
      router.push(`/${locale}/d/${code}`);
    }
  };

  return (
    <form
      onSubmit={handleGo}
      className={cn("flex flex-col items-center gap-4", className)}
    >
      <div className="relative flex items-center gap-2">
        <InputOTP
          maxLength={6}
          value={code}
          onChange={setCode}
          autoFocus={autoFocus}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <InputOTPGroup key={index}>
              <InputOTPSlot
                index={index}
                className="h-12 w-12 bg-background text-lg font-mono outline-black"
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
            "absolute -right-10 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full transition-opacity hover:bg-muted-foreground/10 active:bg-muted-foreground/20 dark:hover:bg-muted-foreground/30 dark:active:bg-muted-foreground/40",
            code.length === 0 ? "pointer-events-none opacity-0" : "opacity-100",
          )}
          aria-label={t("clear")}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <Button
        type="submit"
        disabled={code.length !== 6}
        className="mt-4 h-11 w-full font-semibold"
      >
        {t("open")}
      </Button>
    </form>
  );
}
