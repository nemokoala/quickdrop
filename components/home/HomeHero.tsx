"use client";

import Image from "next/image";

export default function HomeHero() {
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
      <h1 className="text-4xl font-bold tracking-tight">QuickDrop</h1>
      <p className="mt-2 text-muted-foreground">
        {
          "로그인 없이 파일이나 텍스트를 빠르게 공유하세요."
        }
      </p>
    </div>
  );
}
