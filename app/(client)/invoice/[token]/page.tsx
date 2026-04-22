import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "견적서 | Invoice",
  description: "공유 링크로 전달된 견적서를 확인하세요.",
};

/**
 * 클라이언트(고객) 견적서 상세 페이지
 *
 * 경로: /invoice/[token]
 * 접근: 로그인 불필요. 공유 토큰만으로 접근 가능.
 *
 * 동작(예정):
 * 1) params.token → DAL(`lib/dal/invoices.ts`)의 `getInvoiceByToken()` 호출
 * 2) 토큰 상태 검증 (valid/expired/revoked/not_found/notion_error)
 * 3) valid: 견적서 렌더링 + PDF 다운로드 버튼 제공
 *    invalid: `/error` 페이지로 리다이렉트 (쿼리로 사유 전달)
 *
 * Next.js 16: `params`는 Promise로 전달됨 (async param API).
 */
type InvoicePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { token } = await params;

  // TODO: DAL 연동
  // const result = await getInvoiceByToken(token)
  // if (result.status !== "valid") redirect(`/error?reason=${result.status}`)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">견적서</h1>
        <p className="mt-1 text-xs text-muted-foreground">토큰: {token}</p>
      </header>

      {/* TODO: 견적서 상세 렌더링 + @react-pdf/renderer 다운로드 버튼 */}
      <section
        aria-label="견적서 상세"
        className="rounded-lg border p-8 text-center text-sm text-muted-foreground"
      >
        견적서 상세 영역 (구현 예정)
      </section>
    </div>
  );
}
