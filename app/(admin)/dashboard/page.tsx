import type { Metadata } from "next";
import { InvoiceTable } from "./_components/invoice-table";
import { StatsCards } from "./_components/stats-cards";

export const metadata: Metadata = {
  title: "대시보드 | Invoice",
  description: "견적서 목록 관리 및 공유 링크 발급/회수",
};

/**
 * 관리자 대시보드 페이지 (Server Component)
 *
 * 기능:
 * - 노션 DB의 견적서 목록 조회 (InvoiceTable → GET /api/invoices)
 * - 견적서별 공유 링크 생성 / 회수 (ShareDialog / RevokeDialog)
 * - 토큰 만료일 설정, 조회수 확인
 *
 * 인증: Auth.js 세션이 필요. 미로그인 시 `/login`으로 리다이렉트 (middleware 처리).
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">견적서 목록</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          견적서 목록을 확인하고 공유 링크를 관리하세요.
        </p>
      </header>

      {/* 통계 카드 — TanStack Query로 /api/stats 호출 */}
      <section aria-label="통계 카드" className="mb-8">
        <StatsCards />
      </section>

      {/* 견적서 목록 테이블 — TanStack Query로 /api/invoices 호출 */}
      <section aria-label="견적서 목록">
        <InvoiceTable />
      </section>
    </div>
  );
}
