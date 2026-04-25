"use client";

import HomeHero from "@/components/home/HomeHero";
import ReceiveTabContent from "@/components/home/ReceiveTabContent";
import SendTabContent from "@/components/home/SendTabContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-start overflow-x-hidden bg-background px-4 pb-12 pt-[10vh] md:pt-[13vh]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-48 mx-auto h-104 w-104 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-lg min-w-0">
        <HomeHero />

        <Tabs defaultValue="send" className="w-full">
          <TabsList className="mb-6 grid min-h-12 w-full grid-cols-2 rounded-xl bg-primary/10 p-1">
            <TabsTrigger
              value="send"
              className="h-full rounded-lg text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              공유하기
            </TabsTrigger>
            <TabsTrigger
              value="receive"
              className="h-full rounded-lg text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              가져오기
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="mt-0">
            <SendTabContent />
          </TabsContent>

          <TabsContent value="receive" className="mt-0">
            <ReceiveTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
