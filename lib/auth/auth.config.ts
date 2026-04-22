import type { NextAuthConfig } from "next-auth";

/**
 * Edge Runtime 호환 최소 Auth 설정.
 *
 * middleware.ts에서 import하므로 bcrypt 등 Node.js 전용 모듈을 포함해선 안 됩니다.
 * Credentials provider는 bcrypt가 필요하므로 lib/auth/config.ts에서만 추가합니다.
 */
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    // API 라우트는 401, 페이지 라우트는 /login 리다이렉트
    authorized({ auth, request: { nextUrl } }) {
      if (!!auth) return true;
      if (nextUrl.pathname.startsWith("/api/")) {
        return Response.json({ message: "인증이 필요합니다" }, { status: 401 });
      }
      return false;
    },
  },
} satisfies NextAuthConfig;
