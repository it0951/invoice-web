import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Invoice, InvoiceStatus } from "@/types/invoice";

interface InvoiceDetailHeaderProps {
  invoice: Invoice;
}

/**
 * 견적서 상태에 따른 Badge variant 반환
 */
function getStatusVariant(
  status: InvoiceStatus,
): "secondary" | "default" | "outline" {
  switch (status) {
    case "초안":
      return "secondary";
    case "발송":
      return "default";
    case "확정":
      return "outline";
  }
}

/**
 * 견적서 상세 페이지 헤더 컴포넌트
 *
 * 브레드크럼 네비게이션과 견적서 기본 정보(제목, 고객명, 발행일, 상태)를 표시합니다.
 */
export function InvoiceDetailHeader({ invoice }: InvoiceDetailHeaderProps) {
  return (
    <div className="space-y-4">
      {/* 브레드크럼 네비게이션: 대시보드 > 견적서 목록 > 현재 견적서 제목 */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">대시보드</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">견적서 목록</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {/* 현재 페이지: 클릭 불가 */}
            <BreadcrumbPage>{invoice.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 견적서 제목 및 상태 뱃지 */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{invoice.title}</h1>
        <Badge variant={getStatusVariant(invoice.status)}>
          {invoice.status}
        </Badge>
      </div>

      {/* 고객명 및 발행일 요약 정보 */}
      <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">고객명</span>
          <span className="ml-2">{invoice.clientName}</span>
        </div>
        <div>
          <span className="font-medium text-foreground">발행일</span>
          <span className="ml-2">
            {new Date(invoice.issueDate).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div>
          <span className="font-medium text-foreground">총액</span>
          <span className="ml-2 tabular-nums">
            {invoice.totalAmount.toLocaleString("ko-KR")}원
          </span>
        </div>
      </div>
    </div>
  );
}
