import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/auth.config";

/**
 * Auth.js v5 미들웨어.
 *
 * Edge Runtime 호환을 위해 bcrypt가 없는 authConfig만 사용합니다.
 * 보호된 경로에 미인증 사용자가 접근하면 /login 으로 리다이렉트합니다.
 */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * 보호 대상 경로:
     * - /dashboard/** : 관리자 페이지 전체 (route group (admin)은 URL에 미포함)
     * - /api/invoices/** : 견적서 API
     * - /api/share/** : 공유 API
     *
     * 제외 경로:
     * - Next.js 내부 파일 (_next/static, _next/image)
     * - favicon.ico
     */
    "/dashboard/:path*",
    "/dashboard",
    "/api/invoices/:path*",
    "/api/share/:path*",
  ],
};
