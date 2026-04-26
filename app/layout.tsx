import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Suspense } from "react";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import QueryProviders from "@/providers/QueryProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get("x-next-intl-locale") ?? "ko";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <QueryProviders>{children}</QueryProviders>
        <Suspense fallback={null}>
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID} />
        </Suspense>
      </body>
    </html>
  );
}
