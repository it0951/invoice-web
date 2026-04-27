import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CopyLinkButton } from "@/app/(admin)/dashboard/_components/copy-link-button";
import type { Invoice } from "@/types/invoice";

interface SharePanelProps {
  invoice: Invoice;
}

/**
 * 현재 공유 토큰이 유효한 공유 상태인지 판별
 * - 토큰 없음, 회수됨, 만료됨 → false
 */
function isActiveShare(invoice: Invoice): boolean {
  const { shareToken, tokenRevokedAt, tokenExpiresAt } = invoice;
  if (!shareToken || tokenRevokedAt) return false;
  if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) return false;
  return true;
}

/**
 * ISO 8601 날짜 문자열을 한국어 날짜/시각 포맷으로 변환
 */
function formatDatetime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 견적서 공유 상태 패널 컴포넌트
 *
 * 공유 토큰 발급 여부에 따라 두 가지 상태를 표시합니다:
 * - 공유 중: 발급일, 만료일, 조회수, 회수 여부, 링크 복사 버튼
 * - 미공유: "공유 링크가 없습니다" 안내 메시지
 */
export function SharePanel({ invoice }: SharePanelProps) {
  const active = isActiveShare(invoice);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">공유 정보</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 토큰이 없는 경우: 미공유 안내 */}
        {!invoice.shareToken ? (
          <p className="text-sm text-muted-foreground">
            공유 링크가 없습니다. 대시보드에서 공유 링크를 생성하세요.
          </p>
        ) : (
          /* 토큰이 존재하는 경우: 상세 공유 상태 표시 */
          <div className="space-y-4">
            {/* 공유 상태 뱃지 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">현재 상태</span>
              {active ? (
                <Badge variant="default">공유 중</Badge>
              ) : invoice.tokenRevokedAt ? (
                <Badge variant="destructive">회수됨</Badge>
              ) : (
                <Badge variant="secondary">만료됨</Badge>
              )}
            </div>

            {/* 공유 정보 그리드 */}
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
              {/* 만료일 */}
              {invoice.tokenExpiresAt && (
                <div>
                  <dt className="font-medium text-foreground">만료일</dt>
                  <dd className="mt-1 text-muted-foreground tabular-nums">
                    {formatDatetime(invoice.tokenExpiresAt)}
                  </dd>
                </div>
              )}

              {/* 조회수 */}
              <div>
                <dt className="font-medium text-foreground">조회수</dt>
                <dd className="mt-1 text-muted-foreground tabular-nums">
                  {invoice.viewCount.toLocaleString("ko-KR")}회
                </dd>
              </div>

              {/* 마지막 조회 시각 */}
              {invoice.lastViewedAt && (
                <div>
                  <dt className="font-medium text-foreground">마지막 조회</dt>
                  <dd className="mt-1 text-muted-foreground tabular-nums">
                    {formatDatetime(invoice.lastViewedAt)}
                  </dd>
                </div>
              )}

              {/* 회수 시각 (회수된 경우에만 표시) */}
              {invoice.tokenRevokedAt && (
                <div>
                  <dt className="font-medium text-foreground">회수일</dt>
                  <dd className="mt-1 text-muted-foreground tabular-nums">
                    {formatDatetime(invoice.tokenRevokedAt)}
                  </dd>
                </div>
              )}
            </dl>

            {/* 공유 중인 경우에만 링크 복사 버튼 표시 */}
            {active && (
              <div className="flex items-center gap-2 pt-2 border-t">
                <span className="text-sm text-muted-foreground flex-1 truncate">
                  공유 링크 복사
                </span>
                <CopyLinkButton token={invoice.shareToken} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
