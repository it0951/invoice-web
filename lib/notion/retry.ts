import "server-only";

/**
 * 지수 백오프 재시도 옵션
 */
export interface RetryOptions {
  /** 최대 재시도 횟수 (기본: 3) */
  maxAttempts?: number;
  /** 초기 대기 시간(ms) (기본: 500) */
  initialDelayMs?: number;
  /** 재시도 여부를 판단하는 함수 (기본: 모든 에러 재시도) */
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Notion API 속도 제한(429) 에러 여부 판단
 */
function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("429") ||
      error.message.toLowerCase().includes("rate limit") ||
      ("status" in error && (error as { status: number }).status === 429)
    );
  }
  return false;
}

/**
 * 지수 백오프 재시도 유틸
 *
 * Notion API Rate Limit(3 req/s) 대응용.
 * 기본: 최대 3회, 500ms → 1000ms → 2000ms 대기 후 재시도.
 * 429 에러 또는 shouldRetry 함수가 true를 반환하는 경우에만 재시도합니다.
 *
 * @example
 * const result = await withRetry(() => notion.databases.query({ ... }));
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelayMs = 500,
    shouldRetry = isRateLimitError,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 마지막 시도이거나 재시도 대상이 아니면 즉시 throw
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      // 지수 백오프: 500ms, 1000ms, 2000ms ...
      const delayMs = initialDelayMs * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // 이 라인에 도달하지 않지만 TypeScript 타입 완전성을 위해 throw
  throw lastError;
}
