import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvoiceItem } from "@/types/invoice";

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
}

/**
 * 견적서 라인 아이템 테이블 컴포넌트
 *
 * 항목명, 수량, 단가, 소계를 표 형태로 표시합니다.
 * 반응형: 모바일에서는 카드 형태로 표시합니다.
 */
export function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
        견적 항목이 없습니다.
      </div>
    );
  }

  return (
    <section aria-label="견적 항목">
      {/* 모바일: 카드 뷰 */}
      <div className="space-y-3 md:hidden">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-lg border p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                항목 {index + 1}
              </span>
              <span className="text-sm font-semibold tabular-nums">
                {item.subtotal.toLocaleString("ko-KR")}원
              </span>
            </div>
            <p className="font-medium">{item.description}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>수량: {item.quantity}</span>
              <span>단가: {item.unitPrice.toLocaleString("ko-KR")}원</span>
            </div>
          </div>
        ))}
      </div>

      {/* 데스크톱: 테이블 뷰 */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">항목명</TableHead>
              <TableHead className="text-right">수량</TableHead>
              <TableHead className="text-right">단가</TableHead>
              <TableHead className="text-right">소계</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.description}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {item.unitPrice.toLocaleString("ko-KR")}원
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {item.subtotal.toLocaleString("ko-KR")}원
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
