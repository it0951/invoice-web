"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

/** 네비게이션 링크 정의 타입 */
interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  /** 모바일 메뉴에 표시할 네비게이션 링크 목록 */
  navLinks: NavLink[];
  /** 인증 영역 (로그인/로그아웃 버튼 등) */
  authSlot: React.ReactNode;
}

/**
 * 모바일 햄버거 메뉴 (Client Component).
 *
 * useState로 Sheet 열림 상태를 관리하므로 클라이언트 전용으로 분리합니다.
 * md 브레이크포인트 미만에서만 렌더링됩니다.
 */
export function MobileMenu({ navLinks, authSlot }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="메뉴 열기"
        >
          <Menu className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Zap className="size-4 text-primary" />
            Next Starter
          </SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* 모바일 인증 영역 */}
        <Separator className="my-4" />
        <div className="px-1">{authSlot}</div>
      </SheetContent>
    </Sheet>
  );
}
