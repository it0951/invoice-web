import type { PublicInvoice } from "@/types/invoice";

interface InvoiceHeaderProps {
  invoice: PublicInvoice;
}

/**
 * 견적서 헤더 컴포넌트
 *
 * 발행자 정보, 고객명, 견적 번호, 발행일 표시
 */
export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  const formattedDate = invoice.issueDate
    ? new Date(invoice.issueDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  return (
    <header className="mb-8 space-y-6">
      {/* 견적서 제목 */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">견적서</h1>
          <p className="mt-1 text-sm text-muted-foreground">#{invoice.title}</p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          <p>발행일</p>
          <p className="font-medium text-foreground">{formattedDate}</p>
        </div>
      </div>

      {/* 수신인 정보 */}
      <div className="rounded-lg bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground">수신</p>
        <p className="mt-1 text-lg font-semibold">{invoice.clientName} 귀중</p>
      </div>
    </header>
  );
}
