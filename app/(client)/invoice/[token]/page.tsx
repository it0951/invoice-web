import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { getInvoiceByToken } from "@/lib/dal/invoices";
import { InvoiceHeader } from "./_components/invoice-header";
import { InvoiceItemsTable } from "./_components/invoice-items-table";
import { InvoiceFooter } from "./_components/invoice-footer";
import { DownloadButton } from "./_components/download-button";

export const metadata: Metadata = {
  title: "견적서 | Invoice",
  description: "공유 링크로 전달된 견적서를 확인하세요.",
};

/**
 * 클라이언트(고객) 견적서 상세 페이지 (Server Component)
 *
 * 경로: /invoice/[token]
 * 접근: 로그인 불필요. 공유 토큰만으로 접근 가능.
 *
 * 동작:
 * 1) params.token → DAL `getInvoiceByToken()` 호출
 * 2) 토큰 상태 검증 (valid/expired/revoked/not_found/notion_error)
 * 3) valid: 견적서 렌더링 + PDF 다운로드 버튼 제공
 *    invalid: `/error?reason=<status>` 페이지로 리다이렉트
 *
 * Next.js 16: `params`는 Promise로 전달됨 (async param API).
 */
type InvoicePageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { token } = await params;

  const result = await getInvoiceByToken(token);

  if (result.status !== "valid") {
    redirect(`/error?reason=${result.status}`);
  }

  const { invoice } = result;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 print:px-0 print:py-4">
      {/* 다운로드/인쇄 버튼 — 인쇄 시 숨김 처리 */}
      <div className="mb-6 flex justify-end print:hidden">
        <DownloadButton token={token} invoiceTitle={invoice.title} />
      </div>

      {/* 견적서 본문 */}
      <article className="rounded-lg border p-8 space-y-8 print:border-none print:p-0">
        {/* 헤더: 발행자 정보, 고객명, 견적 번호, 발행일 */}
        <InvoiceHeader invoice={invoice} />

        {/* 견적 항목 테이블 */}
        <InvoiceItemsTable items={invoice.items} />

        {/* 금액 합계 영역 */}
        <InvoiceFooter
          items={invoice.items}
          totalAmount={invoice.totalAmount}
        />
      </article>
    </div>
  );
}
