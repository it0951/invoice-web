/**
 * @fileoverview 상단 고정 네비게이션 바 (Server Component).
 *
 * auth()로 세션을 조회하여 로그인/로그아웃 버튼을 조건부 렌더링합니다.
 * 클라이언트 상태가 필요한 테마 토글과 모바일 메뉴는 별도 Client Component로 분리합니다.
 *   - ThemeToggle : components/layout/theme-toggle.tsx
 *   - MobileMenu  : components/layout/mobile-menu.tsx
 */

import Link from "next/link";
import { Zap } from "lucide-react";
import { auth } from "@/lib/auth/config";
import { signOutAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileMenu } from "@/components/layout/mobile-menu";

/** 데스크탑·모바일 공용 네비게이션 링크 목록 */
const navLinks = [
  { href: "/", label: "홈" },
  { href: "/dashboard", label: "대시보드" },
];

/**
 * 사이트 상단 고정 네비게이션 바.
 *
 * - 로그인 상태: "로그아웃" 버튼 표시 (Server Action 호출)
 * - 비로그인 상태: "로그인" 버튼 표시 (/login 링크)
 */
export async function Navbar() {
  // 서버에서 세션 조회 — auth()는 Server Component/Action에서만 사용 가능
  const session = await auth();
  const isAuthenticated = !!session;

  /** 데스크탑·모바일 공용 인증 영역 */
  const authNode = isAuthenticated ? (
    // 로그아웃: form + Server Action 패턴 (Client JS 없이 동작)
    <form action={signOutAction}>
      <Button type="submit" variant="outline" size="sm" className="w-full">
        로그아웃
      </Button>
    </form>
  ) : (
    <Button asChild variant="outline" size="sm" className="w-full">
      <Link href="/login">로그인</Link>
    </Button>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Zap className="size-5 text-primary" />
          <span>Next Starter</span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 오른쪽 액션 영역 */}
        <div className="flex items-center gap-2">
          {/* 다크모드 토글 (Client Component) */}
          <ThemeToggle />

          {/* 데스크탑 인증 버튼 */}
          <div className="hidden md:block">{authNode}</div>

          {/* 모바일 햄버거 메뉴 (Client Component) — authSlot으로 인증 버튼 전달 */}
          <MobileMenu navLinks={navLinks} authSlot={authNode} />
        </div>
      </div>
    </header>
  );
}
