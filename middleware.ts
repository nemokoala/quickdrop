import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/api/upload") {
    console.log(
      `[middleware] 업로드 요청 도달 ${new Date().toISOString()}`,
      `content-length: ${req.headers.get("content-length")}`,
      `content-type: ${req.headers.get("content-type")?.split(";")[0]}`,
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/upload",
};
