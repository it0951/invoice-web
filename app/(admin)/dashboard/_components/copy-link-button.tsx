"use client";

import { useRef, useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { buildShareUrl } from "@/lib/share/url";
import { copyToClipboard } from "@/lib/share/clipboard";

interface CopyLinkButtonProps {
  token: string;
  className?: string;
}

export function CopyLinkButton({ token, className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function handleCopy() {
    const success = await copyToClipboard(buildShareUrl(token));

    if (success) {
      toast.success("공유 링크가 복사되었습니다");
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        // 2초 후 복귀 시 버튼에 포커스 유지
        buttonRef.current?.focus();
      }, 2000);
    } else {
      toast.error("복사에 실패했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <>
      {/* 스크린 리더용 상태 알림 영역 */}
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {copied ? "공유 링크가 복사되었습니다" : ""}
      </span>
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        aria-label={copied ? "복사 완료" : "공유 링크 복사"}
        className={className}
      >
        {copied ? (
          <Check className="size-4 text-green-600" />
        ) : (
          <Copy className="size-4" />
        )}
      </Button>
    </>
  );
}
