import "server-only";

import { unstable_cache } from "next/cache";

import { listInvoices } from "./invoices";
import type { Invoice } from "@/types/invoice";

/**
 * 활성 공유 여부 판별
 * - shareToken이 존재하고, 회수되지 않았으며, 만료되지 않은 경우 true
 */
function isActiveShare(invoice: Invoice): boolean {
  const { shareToken, tokenRevokedAt, tokenExpiresAt } = invoice;
  if (!shareToken || tokenRevokedAt) return false;
  if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) return false;
  return true;
}

/**
 * 만료된 공유 여부 판별
 * - shareToken이 존재하고, 회수되지 않았으며, tokenExpiresAt이 현재 시각보다 이전인 경우 true
 */
function isExpiredShare(invoice: Invoice): boolean {
  const { shareToken, tokenRevokedAt, tokenExpiresAt } = invoice;
  if (!shareToken || tokenRevokedAt) return false;
  if (!tokenExpiresAt) return false;
  return new Date(tokenExpiresAt) < new Date();
}

/** 통계 결과 타입 */
export interface InvoiceStats {
  /** 전체 견적서 수 */
  total: number;
  /** 활성 공유 건수 (유효한 공유 링크) */
  activeShares: number;
  /** 총 조회수 누적 합계 */
  totalViews: number;
  /** 만료된 공유 건수 */
  expiredShares: number;
}

/**
 * 대시보드 통계 위젯용 견적서 통계 조회
 * - unstable_cache로 60초 TTL 캐싱
 * - "invoice-stats" 태그로 수동 무효화 가능
 */
export const getInvoiceStats = unstable_cache(
  async (): Promise<InvoiceStats> => {
    const invoices = await listInvoices();
    return {
      total: invoices.length,
      activeShares: invoices.filter(isActiveShare).length,
      totalViews: invoices.reduce((sum, inv) => sum + inv.viewCount, 0),
      expiredShares: invoices.filter(isExpiredShare).length,
    };
  },
  ["invoice-stats"],
  { revalidate: 60, tags: ["invoice-stats"] },
);
