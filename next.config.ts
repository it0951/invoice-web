import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 네트워크 IP 접속 시 개발 리소스(HMR, 폰트 등) 허용
  // Next.js 16 보안 정책: cross-origin dev 리소스 기본 차단
  allowedDevOrigins: ["192.168.41.157"],
};

export default nextConfig;
