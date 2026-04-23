"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

interface DownloadButtonProps {
  token: string;
  invoiceTitle: string;
}

/**
 * PDF 다운로드 및 인쇄 버튼 컴포넌트 (클라이언트 컴포넌트)
 *
 * - PDF 다운로드: GET /api/invoice/[token]/pdf 호출 → Blob 다운로드
 * - 인쇄: window.print() (PDF 장애 시 대체 수단)
 */
export function DownloadButton({ token, invoiceTitle }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    setIsDownloading(true);
    try {
      const res = await fetch(`/api/invoice/${token}/pdf`);

      if (!res.ok) {
        throw new Error(`PDF 생성 실패: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      // 브라우저 파일 저장 다이얼로그 트리거
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `견적서_${invoiceTitle}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);

      toast.success("PDF 다운로드가 완료되었습니다.");
    } catch (error) {
      console.error("[DownloadButton] PDF 다운로드 오류:", error);
      toast.error("PDF 다운로드에 실패했습니다. 인쇄 버튼을 이용해주세요.");
    } finally {
      setIsDownloading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex items-center gap-2 print:hidden">
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className="gap-2"
        aria-label={
          isDownloading
            ? "PDF 생성 중, 잠시 기다려주세요"
            : `${invoiceTitle} PDF 다운로드`
        }
        aria-busy={isDownloading}
      >
        <Download className="h-4 w-4" />
        {isDownloading ? "생성 중..." : "PDF 다운로드"}
      </Button>
      <Button
        variant="outline"
        onClick={handlePrint}
        className="gap-2"
        aria-label={`${invoiceTitle} 인쇄`}
      >
        <Printer className="h-4 w-4" />
        인쇄
      </Button>
    </div>
  );
}
