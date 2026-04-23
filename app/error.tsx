"use client";

/**
 * 전역 App Router error boundary
 *
 * Next.js App Router 규약에 따라 `app/error.tsx`에 위치해야 하며,
 * `'use client'` 디렉티브가 필수입니다.
 *
 * 용도: 렌더링 중 예기치 않은 예외가 발생했을 때 사용자에게 오류를 안내하고
 *       `reset()`으로 재시도할 수 있는 UI를 제공합니다.
 *
 * 주의: `metadata` export는 클라이언트 컴포넌트에서 사용 불가.
 */

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  /** 발생한 에러 객체. Next.js가 digest(서버 에러 ID)를 포함할 수 있음 */
  error: Error & { digest?: string };
  /** error boundary를 초기화하여 렌더링을 재시도하는 함수 */
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  // 서버 에러 digest를 포함하여 콘솔에 로깅 (디버깅 용도)
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        예기치 않은 오류가 발생했습니다
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        페이지를 로드하는 중 문제가 발생했습니다. 다시 시도하거나 홈으로
        돌아가주세요.
      </p>
      <div className="mt-6 flex flex-row gap-3">
        {/* 렌더링을 재시도 — error boundary 초기화 */}
        <Button variant="outline" onClick={reset}>
          다시 시도
        </Button>
        {/* 홈으로 이동 */}
        <Button asChild variant="outline">
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
