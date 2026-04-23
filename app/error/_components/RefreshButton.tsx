"use client";

import { Button } from "@/components/ui/button";

/**
 * 페이지 새로고침 버튼 — 클라이언트 컴포넌트
 *
 * notion_error 오류 시 사용자가 다시 시도할 수 있도록 현재 페이지를 새로고침합니다.
 * `window.location.reload()`는 브라우저 환경에서만 동작하므로 'use client' 필수.
 */
export function RefreshButton() {
  return (
    <Button variant="outline" onClick={() => window.location.reload()}>
      다시 시도
    </Button>
  );
}
