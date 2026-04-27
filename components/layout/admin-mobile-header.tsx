"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Zap, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AdminNavItems } from "@/components/layout/admin-sidebar";
import { signOutAction } from "@/lib/auth/actions";

// 모바일 헤더 Props 인터페이스
interface AdminMobileHeaderProps {
  email: string;
}

/**
 * 모바일 전용 관리자 상단 헤더 컴포넌트 (Client Component).
 *
 * md 미만 화면에서만 표시되며, 햄버거 버튼 클릭 시
 * Sheet로 사이드바 메뉴를 노출합니다.
 * 메뉴 클릭 후 Sheet가 자동으로 닫힙니다.
 */
export function AdminMobileHeader({ email }: AdminMobileHeaderProps) {
  // Sheet 열림/닫힘 상태
  const [open, setOpen] = useState(false);

  // 현재 경로 감지 — 활성 메뉴 판별에 사용
  const pathname = usePathname();

  // 메뉴 클릭 시 Sheet 닫기 핸들러
  const handleNavigate = () => setOpen(false);

  return (
    // md 이상에서는 숨김 — AdminSidebar가 담당
    <header className="flex md:hidden h-14 items-center gap-3 border-b border-border px-4 bg-background">
      {/* 햄버거 버튼 — Sheet 열기 트리거 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
      >
        <Menu className="size-5" />
      </Button>

      {/* 로고 영역 */}
      <div className="flex items-center gap-2 font-semibold">
        <Zap className="size-5 text-primary" />
        <span className="text-sm">관리자</span>
      </div>

      {/* Sheet — 왼쪽에서 슬라이드 인 */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64">
          {/* 접근성을 위해 SheetTitle 필수 포함 (sr-only로 시각적으로 숨김) */}
          <SheetHeader className="sr-only">
            <SheetTitle>관리자 메뉴</SheetTitle>
          </SheetHeader>

          {/* Sheet 내부 사이드바 레이아웃 */}
          <div className="flex flex-col h-full">
            {/* 상단: 로고 및 타이틀 */}
            <div className="h-14 border-b border-border px-4 flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              <span className="text-sm font-semibold">관리자</span>
            </div>

            {/* 공유 메뉴 컴포넌트 — 클릭 시 Sheet 닫힘 */}
            <AdminNavItems pathname={pathname} onNavigate={handleNavigate} />

            {/* 하단: 이메일, 로그아웃, 테마 토글 */}
            <div className="p-4 border-t border-border space-y-2">
              {/* 현재 로그인된 이메일 표시 */}
              <p
                className="text-xs text-muted-foreground truncate"
                title={email}
              >
                {email}
              </p>

              {/* 로그아웃 폼 — Server Action 연결 */}
              <form action={signOutAction}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <LogOut className="size-4" />
                  로그아웃
                </Button>
              </form>

              {/* 다크/라이트 모드 전환 */}
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
