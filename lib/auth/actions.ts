"use server";

import { signIn, signOut } from "@/lib/auth/config";
import { AuthError } from "next-auth";

/**
 * 로그인 Server Action.
 *
 * Credentials provider로 이메일/비밀번호 인증을 수행합니다.
 * 성공 시 undefined 반환, 실패 시 에러 메시지 문자열을 반환합니다.
 * Client Component(login/page.tsx)에서 호출합니다.
 */
export async function signInAction(
  email: string,
  password: string,
): Promise<string | undefined> {
  try {
    // redirectTo를 지정하면 성공 시 NextAuth가 서버사이드 redirect 처리
    // redirect: false 대신 이 방식을 써야 세션 쿠키가 정상 설정됨
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    // AuthError: 자격증명 불일치 등 인증 실패
    if (error instanceof AuthError) {
      return "이메일 또는 비밀번호를 확인해주세요.";
    }
    // NEXT_REDIRECT는 재throw — Next.js가 클라이언트 내비게이션으로 처리
    throw error;
  }
}

/**
 * 로그아웃 Server Action.
 *
 * 현재 세션을 종료하고 /login 페이지로 리다이렉트합니다.
 * Navbar의 "로그아웃" 버튼에서 form action으로 호출됩니다.
 */
export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
