import "server-only";

import { cache } from "react";
import { revalidateTag, unstable_cache } from "next/cache";
import { isFullPage } from "@notionhq/client";

import { getNotionClient, NOTION_DB } from "@/lib/notion/client";
import { toInvoice, toInvoiceItem } from "@/lib/notion/mappers";
import { withRetry } from "@/lib/notion/retry";
import { getCachedPageId, setCachedPageId } from "@/lib/notion/cache";
import type {
  Invoice,
  InvoiceItem,
  PublicInvoice,
  TokenVerifyResult,
} from "@/types/invoice";

/**
 * 관리자용: 전체 견적서 목록 조회 (발행일 내림차순)
 * unstable_cache: 60초 TTL, "invoices:list" 태그로 무효화 가능
 */
export const listInvoices = unstable_cache(
  async (): Promise<Invoice[]> => {
    const notion = getNotionClient();
    const response = await withRetry(() =>
      notion.databases.query({
        database_id: NOTION_DB.invoice,
        sorts: [{ property: "issueDate", direction: "descending" }],
      }),
    );
    return response.results.filter(isFullPage).map(toInvoice);
  },
  ["invoices:list"],
  { revalidate: 60, tags: ["invoices:list"] },
);

/**
 * 관리자용: ID로 견적서 단건 조회
 */
export const getInvoiceById = cache(
  async (id: string): Promise<Invoice | null> => {
    const notion = getNotionClient();
    const page = await withRetry(() => notion.pages.retrieve({ page_id: id }));
    if (!isFullPage(page)) return null;
    return toInvoice(page);
  },
);

/**
 * 견적서의 라인 아이템 목록 조회 (캐싱 포함)
 * invoiceId Relation 필드로 필터링하여 가져옵니다.
 */
export const getInvoiceItems = cache(
  async (invoiceId: string): Promise<InvoiceItem[]> => {
    return fetchInvoiceItems(invoiceId);
  },
);

/**
 * 클라이언트용: 공유 토큰으로 견적서 조회 + 검증
 *
 * 검증 순서:
 * 1. 인메모리 캐시 → Notion DB 토큰 조회 (full-scan 최소화)
 * 2. 토큰 존재 여부 (not_found)
 * 3. 회수 여부 (revoked)
 * 4. 만료 여부 (expired)
 * 5. valid → 라인 아이템 포함 PublicInvoice 반환
 */
export const getInvoiceByToken = cache(
  async (token: string): Promise<TokenVerifyResult> => {
    const notion = getNotionClient();

    try {
      // 캐시에서 pageId 조회 → 없으면 Notion DB full-scan
      let pageId = getCachedPageId(token);

      if (!pageId) {
        const response = await withRetry(() =>
          notion.databases.query({
            database_id: NOTION_DB.invoice,
            filter: {
              property: "shareToken",
              rich_text: { equals: token },
            },
          }),
        );

        const pages = response.results.filter(isFullPage);
        if (pages.length === 0) {
          return {
            status: "not_found",
            message: "존재하지 않는 공유 토큰입니다.",
          };
        }

        pageId = pages[0].id;
        setCachedPageId(token, pageId);
      }

      // 견적서 상세 조회
      const page = await withRetry(() =>
        notion.pages.retrieve({ page_id: pageId as string }),
      );

      if (!isFullPage(page)) {
        return { status: "not_found", message: "견적서를 찾을 수 없습니다." };
      }

      const invoice = toInvoice(page);

      // 회수 여부 검증
      if (invoice.tokenRevokedAt) {
        return {
          status: "revoked",
          message: "관리자가 회수한 공유 링크입니다.",
        };
      }

      // 만료 여부 검증
      if (
        invoice.tokenExpiresAt &&
        new Date(invoice.tokenExpiresAt) < new Date()
      ) {
        return {
          status: "expired",
          message: "만료된 공유 링크입니다. 재발급을 요청해주세요.",
        };
      }

      // 라인 아이템 조회
      const items = await getInvoiceItems(invoice.id);

      // PublicInvoice DTO (민감 필드 제거)
      const publicInvoice: PublicInvoice = {
        id: invoice.id,
        title: invoice.title,
        clientName: invoice.clientName,
        issueDate: invoice.issueDate,
        status: invoice.status,
        totalAmount: invoice.totalAmount,
        items,
      };

      // 비동기로 viewCount / lastViewedAt 업데이트 (응답 블로킹 금지)
      bumpViewCount(invoice.id, invoice.viewCount).catch(() => {
        // 열람 로그 실패는 무시 (서비스 영향 없음)
      });

      return { status: "valid", invoice: publicInvoice };
    } catch (error) {
      console.error("[getInvoiceByToken] Notion API 오류:", error);
      return {
        status: "notion_error",
        message:
          "견적서를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      };
    }
  },
);

/**
 * 열람 카운트 및 마지막 열람 시각 업데이트 (비동기 호출용)
 * 응답을 블로킹하지 않도록 `getInvoiceByToken` 내부에서 fire-and-forget으로 호출합니다.
 */
export async function bumpViewCount(
  invoiceId: string,
  currentViewCount: number,
): Promise<void> {
  const notion = getNotionClient();
  await notion.pages.update({
    page_id: invoiceId,
    properties: {
      viewCount: { number: currentViewCount + 1 },
      lastViewedAt: { date: { start: new Date().toISOString() } },
    },
  });
}

/**
 * 관리자용: 공유 토큰 발급
 * - crypto.randomUUID()로 토큰 생성
 * - Notion에 shareToken, tokenExpiresAt 기록, tokenRevokedAt 초기화
 * - "invoices:list" 캐시 무효화
 */
export async function createShareToken(
  invoiceId: string,
  expiresInDays: number,
): Promise<{ token: string; expiresAt: string }> {
  const token = crypto.randomUUID();
  const expiresAt = new Date(
    Date.now() + expiresInDays * 86_400_000,
  ).toISOString();

  const notion = getNotionClient();
  await withRetry(() =>
    notion.pages.update({
      page_id: invoiceId,
      properties: {
        shareToken: { rich_text: [{ text: { content: token } }] },
        tokenExpiresAt: { date: { start: expiresAt } },
        tokenRevokedAt: { date: null },
      },
    }),
  );

  // Next.js 16: revalidateTag는 두 번째 인수(profile)가 필수
  revalidateTag("invoices:list", "max");
  return { token, expiresAt };
}

/**
 * 관리자용: 공유 토큰 회수
 * - Notion에 tokenRevokedAt = now 기록
 * - "invoices:list" 캐시 무효화
 */
export async function revokeShareToken(invoiceId: string): Promise<void> {
  const notion = getNotionClient();
  await withRetry(() =>
    notion.pages.update({
      page_id: invoiceId,
      properties: {
        tokenRevokedAt: { date: { start: new Date().toISOString() } },
      },
    }),
  );

  // Next.js 16: revalidateTag는 두 번째 인수(profile)가 필수
  revalidateTag("invoices:list", "max");
}

/** Notion Item DB에서 invoiceId Relation으로 라인 아이템 목록 조회 (내부용) */
export async function fetchInvoiceItems(
  invoiceId: string,
): Promise<InvoiceItem[]> {
  const notion = getNotionClient();
  const response = await withRetry(() =>
    notion.databases.query({
      database_id: NOTION_DB.item,
      filter: {
        property: "invoiceId",
        relation: { contains: invoiceId },
      },
    }),
  );
  return response.results.filter(isFullPage).map(toInvoiceItem);
}
