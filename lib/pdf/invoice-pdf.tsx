import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  type DocumentProps,
} from "@react-pdf/renderer";
import type React from "react";
import type { PublicInvoice } from "@/types/invoice";

/** VAT 세율 (10%) */
const VAT_RATE = 0.1;

/** PDF 스타일시트 */
const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansKR",
    fontSize: 10,
    padding: 40,
    color: "#111",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 10,
    color: "#666",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    color: "#666",
    fontSize: 9,
  },
  value: {
    fontWeight: "bold",
  },
  clientBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    padding: 12,
    marginBottom: 24,
  },
  clientLabel: {
    fontSize: 9,
    color: "#666",
    marginBottom: 4,
  },
  clientName: {
    fontSize: 13,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colSubtotal: { flex: 1.5, textAlign: "right" },
  headerText: {
    fontSize: 9,
    color: "#666",
  },
  summarySection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginBottom: 4,
  },
  summaryLabel: {
    color: "#666",
    fontSize: 9,
  },
  summaryValue: {
    fontSize: 9,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    width: 200,
    marginVertical: 6,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 11,
    fontWeight: "bold",
  },
});

interface InvoicePdfProps {
  invoice: PublicInvoice;
}

/**
 * @react-pdf/renderer 기반 견적서 PDF 문서 컴포넌트
 *
 * NotoSansKR 폰트 등록(`registerFonts()`) 후 사용해야 합니다.
 * Route Handler에서 `renderToStream(createInvoicePdfElement(invoice))`로 호출합니다.
 *
 * renderToStream은 React.ReactElement<DocumentProps>를 요구하므로
 * 반환 타입을 명시적으로 선언합니다.
 */
export function InvoicePdf({
  invoice,
}: InvoicePdfProps): React.ReactElement<DocumentProps> {
  const formattedDate = invoice.issueDate
    ? new Date(invoice.issueDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  // 서버 재계산
  const subtotal = invoice.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const vat = Math.round(subtotal * VAT_RATE);
  const grandTotal = subtotal + vat;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 헤더 */}
        <Text style={styles.title}>견적서</Text>
        <Text style={styles.invoiceNumber}>#{invoice.title}</Text>

        {/* 발행일 */}
        <View style={styles.row}>
          <Text style={styles.label}>발행일</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>

        {/* 수신인 */}
        <View style={styles.clientBox}>
          <Text style={styles.clientLabel}>수신</Text>
          <Text style={styles.clientName}>{invoice.clientName} 귀중</Text>
        </View>

        {/* 견적 항목 테이블 헤더 */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colDesc, styles.headerText]}>항목명</Text>
          <Text style={[styles.colQty, styles.headerText]}>수량</Text>
          <Text style={[styles.colPrice, styles.headerText]}>단가</Text>
          <Text style={[styles.colSubtotal, styles.headerText]}>소계</Text>
        </View>

        {/* 견적 항목 행 */}
        {invoice.items.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.colDesc}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>
              {item.unitPrice.toLocaleString("ko-KR")}원
            </Text>
            <Text style={styles.colSubtotal}>
              {item.subtotal.toLocaleString("ko-KR")}원
            </Text>
          </View>
        ))}

        {/* 합계 영역 */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>공급가액</Text>
            <Text style={styles.summaryValue}>
              {subtotal.toLocaleString("ko-KR")}원
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>부가세 (10%)</Text>
            <Text style={styles.summaryValue}>
              {vat.toLocaleString("ko-KR")}원
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>합계</Text>
            <Text style={styles.totalValue}>
              {grandTotal.toLocaleString("ko-KR")}원
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
