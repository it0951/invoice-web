/**
 * 404 Not Found 페이지
 *
 * Next.js App Router 규약: `app/not-found.tsx`에 위치하면
 * 존재하지 않는 경로 접근 시 자동으로 렌더링됩니다.
 *
 * 서버 컴포넌트로 유지하여 metadata export가 가능합니다.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다 | Invoice",
  description: "요청하신 페이지를 찾을 수 없습니다.",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl font-bold text-muted-foreground">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <div className="mt-6">
        <Button asChild variant="outline">
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
