"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, ExternalLink } from "lucide-react";
import type { Invoice, InvoiceStatus } from "@/types/invoice";
import { InvoiceTableSkeleton } from "./invoice-table-skeleton";
import { ShareDialog } from "./share-dialog";
import { RevokeDialog } from "./revoke-dialog";

/**
 * 공유 상태를 판별해 Badge의 variant와 라벨을 반환하는 헬퍼
 */
function getShareStatus(invoice: Invoice): {
  variant: "default" | "destructive" | "secondary" | "outline";
  label: string;
} {
  const { shareToken, tokenRevokedAt, tokenExpiresAt } = invoice;

  // 토큰 미발급
  if (!shareToken) {
    return { variant: "outline", label: "미발급" };
  }

  // 회수됨
  if (tokenRevokedAt) {
    return { variant: "destructive", label: "회수됨" };
  }

  // 만료됨 (tokenExpiresAt이 현재 시각보다 과거)
  if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) {
    return { variant: "secondary", label: "만료됨" };
  }

  // 정상 공유 중
  return { variant: "default", label: "공유됨" };
}

/**
 * 견적서 상태(InvoiceStatus)에 따른 Badge variant 반환
 */
function getStatusVariant(
  status: InvoiceStatus,
): "secondary" | "default" | "outline" {
  switch (status) {
    case "초안":
      return "secondary";
    case "발송":
      return "default";
    case "확정":
      return "outline";
  }
}

/**
 * 공유 링크 액션 버튼 렌더링
 * - 공유 중: "회수" 버튼 (RevokeDialog)
 * - 그 외: "공유 링크 생성" 버튼 (ShareDialog)
 */
function isActiveShare(invoice: Invoice): boolean {
  const { shareToken, tokenRevokedAt, tokenExpiresAt } = invoice;
  if (!shareToken || tokenRevokedAt) return false;
  if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) return false;
  return true;
}

/**
 * 모바일용 카드 뷰 — 테이블 대신 카드 형태로 각 견적서 표시
 */
function InvoiceCard({
  invoice,
  onShareClick,
  onRevokeClick,
}: {
  invoice: Invoice;
  onShareClick: (invoice: Invoice) => void;
  onRevokeClick: (invoice: Invoice) => void;
}) {
  const shareStatus = getShareStatus(invoice);
  const active = isActiveShare(invoice);

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium truncate">{invoice.title}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(invoice.issueDate).toLocaleDateString("ko-KR")}
          </p>
        </div>
        <Badge variant={getStatusVariant(invoice.status)}>
          {invoice.status}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">총액</span>
        <span className="font-medium">
          {invoice.totalAmount.toLocaleString("ko-KR")}원
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">공유 상태</span>
        <Badge variant={shareStatus.variant}>{shareStatus.label}</Badge>
      </div>

      <div className="pt-1 space-y-2">
        {/* 상세보기 버튼 */}
        {active ? (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <a
              href={`/invoice/${invoice.shareToken!}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              상세보기
            </a>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled
            title="공유 링크 생성 후 상세보기 가능"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            상세보기
          </Button>
        )}

        {/* 기존 공유/회수 버튼 (아래로 이동) */}
        {active ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => onRevokeClick(invoice)}
          >
            회수
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onShareClick(invoice)}
          >
            공유 링크 생성
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * 견적서 목록 테이블 컴포넌트
 * - TanStack Query로 GET /api/invoices 호출
 * - 공유 링크 생성(ShareDialog) / 회수(RevokeDialog) 기능 포함
 * - 반응형: 모바일은 카드 뷰, md 이상은 테이블 뷰
 */
export function InvoiceTable() {
  const queryClient = useQueryClient();

  /** 공유 다이얼로그 대상 견적서 */
  const [shareDialogInvoice, setShareDialogInvoice] = useState<Invoice | null>(
    null,
  );
  /** 회수 다이얼로그 대상 견적서 */
  const [revokeDialogInvoice, setRevokeDialogInvoice] =
    useState<Invoice | null>(null);

  const {
    data: invoices,
    isLoading,
    isError,
  } = useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await fetch("/api/invoices", { cache: "no-store" });
      if (!res.ok) throw new Error("목록 조회 실패");
      return res.json() as Promise<Invoice[]>;
    },
  });

  /** 공유 링크 생성 성공: 낙관적 업데이트로 즉시 UI 반영 */
  function handleShareSuccess(token: string, expiresAt: string) {
    queryClient.setQueryData<Invoice[]>(
      ["invoices"],
      (old) =>
        old?.map((inv) =>
          inv.id === shareDialogInvoice?.id
            ? {
                ...inv,
                shareToken: token,
                tokenExpiresAt: expiresAt,
                tokenRevokedAt: null,
              }
            : inv,
        ) ?? [],
    );
  }

  /** 공유 링크 회수 성공: 낙관적 업데이트로 즉시 UI 반영 */
  function handleRevokeSuccess() {
    queryClient.setQueryData<Invoice[]>(
      ["invoices"],
      (old) =>
        old?.map((inv) =>
          inv.id === revokeDialogInvoice?.id
            ? { ...inv, tokenRevokedAt: new Date().toISOString() }
            : inv,
        ) ?? [],
    );
  }

  // 로딩 상태
  if (isLoading) {
    return <InvoiceTableSkeleton />;
  }

  // 에러 상태
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>오류</AlertTitle>
        <AlertDescription>
          견적서 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.
        </AlertDescription>
      </Alert>
    );
  }

  // 빈 상태
  if (!invoices || invoices.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center">
        <p className="text-sm text-muted-foreground">견적서가 없습니다.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Notion DB에 견적서를 추가하면 이곳에 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 모바일 카드 뷰 (md 미만) */}
      <div className="space-y-3 md:hidden">
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            invoice={invoice}
            onShareClick={setShareDialogInvoice}
            onRevokeClick={setRevokeDialogInvoice}
          />
        ))}
      </div>

      {/* 데스크톱 테이블 뷰 (md 이상) */}
      <div className="hidden md:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>고객명</TableHead>
              <TableHead>발행일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">총액</TableHead>
              <TableHead>공유 상태</TableHead>
              <TableHead className="text-right">조회수</TableHead>
              <TableHead>액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const shareStatus = getShareStatus(invoice);
              const active = isActiveShare(invoice);

              return (
                <TableRow key={invoice.id}>
                  {/* 제목 */}
                  <TableCell className="font-medium max-w-[180px] truncate">
                    {invoice.title}
                  </TableCell>

                  {/* 고객명 */}
                  <TableCell>{invoice.clientName}</TableCell>

                  {/* 발행일 */}
                  <TableCell>
                    {new Date(invoice.issueDate).toLocaleDateString("ko-KR")}
                  </TableCell>

                  {/* 견적서 상태 Badge */}
                  <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </TableCell>

                  {/* 총액 */}
                  <TableCell className="text-right tabular-nums">
                    {invoice.totalAmount.toLocaleString("ko-KR")}원
                  </TableCell>

                  {/* 공유 상태 Badge */}
                  <TableCell>
                    <Badge variant={shareStatus.variant}>
                      {shareStatus.label}
                    </Badge>
                  </TableCell>

                  {/* 조회수 */}
                  <TableCell className="text-right tabular-nums">
                    {invoice.viewCount}
                  </TableCell>

                  {/* 액션 버튼 */}
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {/* 상세보기 아이콘 버튼 */}
                      {active ? (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          asChild
                          title="새 탭에서 상세보기"
                        >
                          <a
                            href={`/invoice/${invoice.shareToken!}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">상세보기</span>
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled
                          title="공유 링크 생성 후 상세보기 가능"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="sr-only">상세보기 불가</span>
                        </Button>
                      )}

                      {/* 기존 공유/회수 버튼 */}
                      {active ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive hover:bg-destructive/10"
                          onClick={() => setRevokeDialogInvoice(invoice)}
                        >
                          회수
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShareDialogInvoice(invoice)}
                        >
                          공유 링크 생성
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 공유 링크 생성 다이얼로그 */}
      {shareDialogInvoice && (
        <ShareDialog
          invoice={shareDialogInvoice}
          open={shareDialogInvoice !== null}
          onOpenChange={(open) => {
            if (!open) setShareDialogInvoice(null);
          }}
          onSuccess={handleShareSuccess}
        />
      )}

      {/* 공유 링크 회수 다이얼로그 */}
      {revokeDialogInvoice && (
        <RevokeDialog
          invoice={revokeDialogInvoice}
          open={revokeDialogInvoice !== null}
          onOpenChange={(open) => {
            if (!open) setRevokeDialogInvoice(null);
          }}
          onSuccess={handleRevokeSuccess}
        />
      )}
    </>
  );
}
