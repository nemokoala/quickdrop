"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeInputProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export default function CodeInput({
  placeholder = "코드 6자리 입력",
  className,
  autoFocus = false,
}: CodeInputProps) {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleGo = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = code.replace(/\D/g, "").slice(0, 6);
    if (trimmed.length === 6) {
      router.push(`/d/${trimmed}`);
    }
  };

  return (
    <form onSubmit={handleGo} className={cn("flex gap-2 w-full", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          maxLength={6}
          autoFocus={autoFocus}
          value={code}
          onChange={(e) =>
            setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          className="pl-10 h-11 text-center font-mono text-lg tracking-widest"
        />
      </div>
      <Button
        type="submit"
        disabled={code.length !== 6}
        className="h-11 px-6 font-semibold shadow-sm"
      >
        받기
      </Button>
    </form>
  );
}
