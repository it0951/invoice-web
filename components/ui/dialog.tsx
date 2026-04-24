"use client";

/**
 * @fileoverview Radix UI Dialog 래퍼 컴포넌트 모음.
 *
 * 화면 중앙에 표시되는 모달 다이얼로그를 제공합니다.
 * 오버레이가 배경을 흐리게 처리하고, 포커스를 다이얼로그 내부에 가둡니다.
 *
 * 구성 컴포넌트:
 * - Dialog: 루트 (열림/닫힘 상태)
 * - DialogTrigger: 다이얼로그를 여는 트리거
 * - DialogContent: 실제 모달 패널 (showCloseButton prop)
 * - DialogHeader: 제목·설명 영역
 * - DialogFooter: 액션 버튼 영역 (showCloseButton으로 닫기 버튼 추가 가능)
 * - DialogTitle: 다이얼로그 제목
 * - DialogDescription: 다이얼로그 설명
 * - DialogOverlay: 배경 오버레이
 * - DialogClose: 다이얼로그를 닫는 요소
 */

import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

/**
 * 다이얼로그 루트.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>모달 열기</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>제목</DialogTitle>
 *       <DialogDescription>설명</DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter>
 *       <Button>확인</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/** 다이얼로그를 여는 트리거 요소 */
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/** 다이얼로그 Portal — DOM 트리 최상단에 렌더링하여 z-index 문제를 방지합니다. */
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/** 다이얼로그를 닫는 요소 — asChild로 커스텀 버튼에 닫기 기능을 부여할 수 있습니다. */
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/** 다이얼로그 배경 오버레이 — 클릭 시 다이얼로그가 닫힙니다. */
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * 다이얼로그 메인 콘텐츠 패널.
 *
 * DialogOverlay 위에 화면 중앙에 표시됩니다.
 *
 * @param showCloseButton - 우측 상단 X 닫기 버튼 표시 여부 (기본값: true)
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** 우측 상단 X 닫기 버튼 표시 여부 (기본값: true) */
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-2 right-2"
              size="icon-sm"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

/** 다이얼로그 상단 헤더 — 제목과 설명을 수직 배치합니다. */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/**
 * 다이얼로그 하단 푸터 — 액션 버튼 영역.
 *
 * @param showCloseButton - "Close" 텍스트 닫기 버튼 포함 여부 (기본값: false)
 */
function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** "Close" 텍스트 버튼을 하단에 자동 추가할지 여부 (기본값: false) */
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

/** 다이얼로그 제목 — 스크린 리더에 다이얼로그 이름으로 전달됩니다. */
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className,
      )}
      {...props}
    />
  );
}

/** 다이얼로그 설명 — 스크린 리더에 다이얼로그 설명으로 전달됩니다. */
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
