import { notFound } from "next/navigation";
import { getInvoiceById, getInvoiceItems } from "@/lib/dal/invoices";
import { InvoiceDetailHeader } from "./_components/invoice-detail-header";
import { SharePanel } from "./_components/share-panel";
import { InvoiceItemsTable } from "@/app/(client)/invoice/[token]/_components/invoice-items-table";

/**
 * 관리자 전용 견적서 상세 보기 페이지 (서버 컴포넌트)
 *
 * URL: /dashboard/invoices/[id]
 * - 견적서 단건 조회 후 없으면 404 처리
 * - 라인 아이템 목록 병렬 조회
 * - InvoiceDetailHeader: 브레드크럼 + 기본 정보
 * - SharePanel: 공유 상태 요약
 * - InvoiceItemsTable: 견적 항목 테이블 (기존 클라이언트 컴포넌트 재사용)
 */
export default async function InvoiceDetailPage({
  params,
}: {
  // Next.js 16에서 params는 Promise 타입 — await 필요
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 견적서 단건 조회 — 없으면 404
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  // 라인 아이템 목록 조회 (getInvoiceById와 독립적으로 실행 가능하나
  // invoice null 체크 이후에 호출해야 하므로 순차 처리)
  const items = await getInvoiceItems(id);

  return (
    <div className="space-y-6">
      {/* 브레드크럼 + 견적서 기본 정보 헤더 */}
      <InvoiceDetailHeader invoice={invoice} />

      {/* 공유 상태 패널 */}
      <SharePanel invoice={invoice} />

      {/* 견적 항목 섹션 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">견적 항목</h2>
        <InvoiceItemsTable items={items} />
      </section>
    </div>
  );
}
