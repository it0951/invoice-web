"use client";

import { useState } from "react";
import { Loader2, Copy, Link } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Invoice } from "@/types/invoice";

/** 공유 링크 생성 API 응답 타입 */
interface ShareApiResponse {
  token: string;
  expiresAt: string;
  url: string;
}

interface ShareDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 공유 링크 생성 성공 후 목록 갱신을 위한 콜백 (token, expiresAt 전달) */
  onSuccess: (token: string, expiresAt: string) => void;
}

/** 만료일 선택 옵션 */
const EXPIRES_OPTIONS = [
  { value: "7", label: "7일" },
  { value: "14", label: "14일" },
  { value: "30", label: "30일" },
  { value: "90", label: "90일" },
] as const;

/**
 * 공유 링크 생성 다이얼로그
 * - 만료일 선택 후 POST /api/share 호출
 * - 생성된 URL 표시 및 클립보드 복사 제공
 */
export function ShareDialog({
  invoice,
  open,
  onOpenChange,
  onSuccess,
}: ShareDialogProps) {
  /** 선택된 만료 기간 (일) */
  const [expiresInDays, setExpiresInDays] = useState<string>("30");
  /** 공유 링크 생성 로딩 상태 */
  const [isLoading, setIsLoading] = useState(false);
  /** 생성된 공유 URL (null이면 아직 생성 안 됨) */
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  /** 다이얼로그 닫힐 때 상태 초기화 */
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setGeneratedUrl(null);
      setExpiresInDays("30");
    }
    onOpenChange(nextOpen);
  }

  /** 공유 링크 생성 요청 */
  async function handleCreate() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
          expiresInDays: Number(expiresInDays),
        }),
      });

      if (!res.ok) {
        throw new Error("공유 링크 생성 실패");
      }

      const data: ShareApiResponse = await res.json();
      setGeneratedUrl(data.url);
      onSuccess(data.token, data.expiresAt);
    } catch {
      toast.error("공유 링크 생성에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  }

  /** 클립보드에 URL 복사 */
  async function handleCopy() {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      toast.success("링크가 복사되었습니다");
    } catch {
      toast.error("복사에 실패했습니다");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>공유 링크 생성</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{invoice.title}</span>{" "}
            견적서의 공유 링크를 생성합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* 만료일 선택 */}
          {!generatedUrl && (
            <div className="space-y-2">
              <Label htmlFor="expires-select">링크 만료 기간</Label>
              <Select value={expiresInDays} onValueChange={setExpiresInDays}>
                <SelectTrigger id="expires-select" className="w-full">
                  <SelectValue placeholder="만료 기간 선택" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {EXPIRES_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 생성된 URL 표시 영역 */}
          {generatedUrl && (
            <div className="space-y-2">
              <Label>생성된 공유 링크</Label>
              <div className="flex min-w-0 items-center gap-2 rounded-md border bg-muted/50 px-3 py-2">
                <Link className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-sm text-muted-foreground">
                  {generatedUrl}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="shrink-0"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">복사</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                위 링크를 고객에게 전달하세요. 만료일 이후에는 접근이
                불가합니다.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            {generatedUrl ? "닫기" : "취소"}
          </Button>

          {/* 아직 생성 전일 때만 생성 버튼 표시 */}
          {!generatedUrl && (
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  생성 중...
                </>
              ) : (
                "생성"
              )}
            </Button>
          )}

          {/* 생성 완료 후 복사 버튼 표시 */}
          {generatedUrl && (
            <Button type="button" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              링크 복사
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
