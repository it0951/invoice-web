import "server-only";

/**
 * 토큰-pageId 매핑 캐시 엔트리
 */
interface CacheEntry {
  /** 연결된 Notion 견적서 페이지 ID */
  pageId: string;
  /** 캐시 저장 일시 (Unix ms) */
  cachedAt: number;
}

/** 캐시 TTL: 60초 */
const CACHE_TTL_MS = 60_000;

/**
 * 인메모리 토큰 캐시 (singleton Map)
 *
 * PRD 설계:
 * - token → pageId 매핑을 서버 캐시에 유지
 * - TTL 60초
 * - Notion DB full-scan(filter) 횟수 최소화
 *
 * 주의: 서버 재시작 시 캐시가 초기화됩니다.
 * Next.js Serverless 환경에서는 인스턴스별 캐시이므로 완전한 일관성을 보장하지 않습니다.
 */
const tokenCache = new Map<string, CacheEntry>();

/**
 * 캐시에서 토큰에 해당하는 pageId를 조회합니다.
 * 만료된 엔트리는 삭제 후 null을 반환합니다.
 */
export function getCachedPageId(token: string): string | null {
  const entry = tokenCache.get(token);
  if (!entry) return null;

  // TTL 만료 확인
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    tokenCache.delete(token);
    return null;
  }

  return entry.pageId;
}

/**
 * 토큰-pageId 매핑을 캐시에 저장합니다.
 */
export function setCachedPageId(token: string, pageId: string): void {
  tokenCache.set(token, { pageId, cachedAt: Date.now() });
}

/**
 * 특정 토큰의 캐시를 무효화합니다.
 * 공유 토큰 회수(revoke) 시 호출합니다.
 */
export function invalidateCachedToken(token: string): void {
  tokenCache.delete(token);
}

/**
 * 전체 토큰 캐시를 초기화합니다. (테스트/관리 목적)
 */
export function clearTokenCache(): void {
  tokenCache.clear();
}
