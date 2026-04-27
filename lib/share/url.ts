/**
 * 공유 토큰으로 공개 견적서 URL을 생성한다.
 * 서버/클라이언트 환경 모두에서 안전하게 동작하도록 typeof window 체크.
 */
export function buildShareUrl(token: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");
  return `${base}/invoice/${token}`;
}
