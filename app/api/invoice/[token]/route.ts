import { NextResponse } from "next/server";
import { getInvoiceByToken } from "@/lib/dal/invoices";

/**
 * GET /api/invoice/[token]
 *
 * 클라이언트 공개 견적서 조회 API (BFF).
 *
 * 인증: 필요 없음 (토큰 기반 접근 제어).
 *
 * 동작:
 * 1) token → DAL `getInvoiceByToken(token)` 호출
 * 2) 토큰 상태 분기 (valid / expired / revoked / not_found / notion_error)
 * 3) valid: PublicInvoice DTO 반환 (민감 필드 제외)
 *    invalid: { status, message } 형태로 4xx 반환
 * 4) viewCount / lastViewedAt 업데이트 (비동기, 응답 블로킹 금지)
 *
 * Next.js 16: 동적 세그먼트의 `params`는 Promise로 전달됨.
 */
type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;

  const result = await getInvoiceByToken(token);

  if (result.status === "valid") {
    return NextResponse.json(result.invoice, { status: 200 });
  }

  // 오류 상태별 HTTP 코드 매핑
  const statusCodeMap: Record<string, number> = {
    not_found: 404,
    expired: 410, // Gone
    revoked: 410, // Gone
    notion_error: 502, // Bad Gateway
  };

  const httpStatus = statusCodeMap[result.status] ?? 400;

  return NextResponse.json(
    { status: result.status, message: result.message },
    { status: httpStatus },
  );
}
