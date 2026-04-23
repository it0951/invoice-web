import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";

import { getInvoiceByToken } from "@/lib/dal/invoices";
import { registerFonts } from "@/lib/pdf/fonts";
import { InvoicePdf } from "@/lib/pdf/invoice-pdf";

/**
 * Node.js 런타임 강제 지정
 * @react-pdf/renderer는 Edge Runtime 미지원 (fs, path 의존)
 */
export const runtime = "nodejs";

/**
 * GET /api/invoice/[token]/pdf
 *
 * 공유 토큰으로 견적서 PDF를 생성하여 반환합니다.
 *
 * 인증: 필요 없음 (토큰 기반 접근 제어).
 *
 * 동작:
 * 1) token → DAL `getInvoiceByToken(token)` 호출
 * 2) 토큰 검증 실패 시 4xx 반환
 * 3) NotoSansKR 폰트 등록 → InvoicePdf 렌더링 → PDF 스트림 반환
 *
 * Next.js 16: 동적 세그먼트의 `params`는 Promise로 전달됨.
 */
type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;

  const result = await getInvoiceByToken(token);

  if (result.status !== "valid") {
    const statusCodeMap: Record<string, number> = {
      not_found: 404,
      expired: 410,
      revoked: 410,
      notion_error: 502,
    };
    const httpStatus = statusCodeMap[result.status] ?? 400;
    return NextResponse.json(
      { status: result.status, message: result.message },
      { status: httpStatus },
    );
  }

  const { invoice } = result;

  // NotoSansKR 폰트 등록 (중복 등록 방지 플래그 내부에서 처리)
  registerFonts();

  try {
    // InvoicePdf는 React.ReactElement<DocumentProps>를 반환하므로 타입 호환
    const stream = await renderToStream(<InvoicePdf invoice={invoice} />);

    const fileName = `견적서_${invoice.title}.pdf`;
    const encodedFileName = encodeURIComponent(fileName);

    return new Response(stream as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFileName}`,
      },
    });
  } catch (error) {
    // renderToStream 또는 PDF 렌더링 과정에서 발생하는 예외 처리
    console.error("[PDF Route] PDF 생성 오류:", error);
    return NextResponse.json(
      { status: "render_error", message: "PDF 생성 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
