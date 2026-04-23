import { Separator } from "@/components/ui/separator";
import type { InvoiceItem } from "@/types/invoice";

interface InvoiceFooterProps {
  items: InvoiceItem[];
  /** Notion DB의 서버 검증용 합계 금액 */
  totalAmount: number;
}

/** VAT 세율 (10%) */
const VAT_RATE = 0.1;

/**
 * 견적서 푸터 (총액 영역) 컴포넌트
 *
 * 서버에서 quantity × unitPrice를 재계산하여 소계, 세금, 최종 합계를 표시합니다.
 * 재계산 합계와 Notion totalAmount가 다를 경우 재계산값을 우선합니다.
 */
export function InvoiceFooter({ items, totalAmount }: InvoiceFooterProps) {
  // 서버 재계산 — quantity × unitPrice 합산
  const calculatedSubtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );

  const vat = Math.round(calculatedSubtotal * VAT_RATE);
  const grandTotal = calculatedSubtotal + vat;

  // 재계산값과 Notion totalAmount 불일치 감지 (개발 환경 경고)
  if (
    process.env.NODE_ENV === "development" &&
    grandTotal !== totalAmount &&
    totalAmount > 0
  ) {
    console.warn(
      `[InvoiceFooter] 합계 불일치: 재계산=${grandTotal}, Notion=${totalAmount}`,
    );
  }

  return (
    <footer className="mt-6 ml-auto w-full max-w-xs space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">공급가액</span>
        <span className="tabular-nums">
          {calculatedSubtotal.toLocaleString("ko-KR")}원
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">부가세 (10%)</span>
        <span className="tabular-nums">{vat.toLocaleString("ko-KR")}원</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold text-base">
        <span>합계</span>
        <span className="tabular-nums">
          {grandTotal.toLocaleString("ko-KR")}원
        </span>
      </div>
    </footer>
  );
}
