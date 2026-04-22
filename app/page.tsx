import { redirect } from "next/navigation";

/**
 * 루트 페이지
 *
 * 현재 서비스는 관리자용 대시보드와 클라이언트용 토큰 기반 견적서 페이지로 구성됩니다.
 * 루트(`/`) 접근 시 관리자 로그인 페이지(`/login`)로 리다이렉트합니다.
 *
 * - 관리자: /login → /dashboard
 * - 클라이언트: 공유 링크(/invoice/[token])를 통해 직접 진입
 */
export default function RootPage() {
  redirect("/login");
}
