import Link from "next/link";
import type { Metadata } from "next";
import type { TokenStatus } from "@/types/invoice";
import { Button } from "@/components/ui/button";
import { RefreshButton } from "./_components/RefreshButton";

export const metadata: Metadata = {
  title: "오류 | Invoice",
  description: "요청을 처리할 수 없습니다.",
};

/**
 * 오류 안내 페이지
 *
 * 경로: /error?reason=<TokenStatus>
 * 용도: 토큰 검증 실패 / Notion API 오류 등 사용자에게 상황을 안내.
 *
 * 이 페이지는 Next.js의 라우트 레벨 error boundary(`error.tsx`)와는 별개의
 * "명시적 오류 랜딩 페이지"입니다. 이유는 쿼리 파라미터(`reason`)로 전달.
 *
 * Next.js 16: `searchParams`는 Promise로 전달됨 (async param API).
 */
type ErrorPageProps = {
  searchParams: Promise<{ reason?: string }>;
};

const REASON_MESSAGES: Record<
  Exclude<TokenStatus, "valid">,
  { title: string; description: string; showRetry: boolean }
> = {
  expired: {
    title: "링크가 만료되었습니다",
    description:
      "이 견적서 공유 링크는 유효 기간이 지났습니다. 발신자에게 재발급을 요청해주세요.",
    showRetry: false,
  },
  revoked: {
    title: "링크가 회수되었습니다",
    description:
      "이 견적서 공유 링크는 더 이상 사용할 수 없습니다. 발신자에게 문의해주세요.",
    showRetry: false,
  },
  not_found: {
    title: "견적서를 찾을 수 없습니다",
    description: "링크가 올바르지 않거나 삭제된 견적서입니다.",
    showRetry: false,
  },
  notion_error: {
    title: "일시적인 오류가 발생했습니다",
    description:
      "견적서를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
    showRetry: true,
  },
};

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const { reason } = await searchParams;
  const key = (reason ?? "not_found") as Exclude<TokenStatus, "valid">;
  const message = REASON_MESSAGES[key] ?? REASON_MESSAGES.not_found;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{message.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {message.description}
      </p>

      {/* 서비스 제공자 문의 안내 */}
      <p className="mt-4 text-xs text-muted-foreground">
        문제가 계속되면 서비스 제공자에게 문의해주세요.
      </p>

      {/* 액션 버튼 */}
      <div className="mt-6 flex flex-row gap-3">
        {/* notion_error일 때만 다시 시도 버튼 표시 */}
        {message.showRetry && <RefreshButton />}
        <Button variant={message.showRetry ? "ghost" : "outline"} asChild>
          <Link href="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    </div>
  );
}
