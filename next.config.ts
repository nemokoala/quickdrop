import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 대용량 파일 업로드를 위해 Server Actions body size 제한 설정
  // lib/config.ts의 MAX_FILE_SIZE와 동일하게 유지
  experimental: {
    serverActions: {
      bodySizeLimit: "5gb",
    },
  },
};

export default nextConfig;
