"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { signOutAction } from "@/lib/auth/actions";

// 사이드바 Props 인터페이스
interface AdminSidebarProps {
  email: string;
}

// 메뉴 네비게이션 아이템 공통 Props
interface AdminNavItemsProps {
  /** 메뉴 아이템 클릭 시 호출되는 콜백 (모바일 Sheet 닫기 등에 활용) */
  onNavigate?: () => void;
  /** 현재 활성 경로 */
  pathname: string;
}

// 활성 메뉴 아이템 타입
interface MenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// 비활성(disabled) 메뉴 아이템 타입
interface DisabledMenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// 활성 메뉴 목록
const menuItems: MenuItem[] = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/dashboard/invoices", label: "견적서 목록", icon: FileText },
];

// 비활성(준비 중) 메뉴 목록
const disabledItems: DisabledMenuItem[] = [
  { href: "/dashboard/stats", label: "통계", icon: BarChart3 },
  { href: "/dashboard/settings", label: "설정", icon: Settings },
];

/**
 * 공유 가능한 관리자 네비게이션 메뉴 컴포넌트.
 *
 * AdminSidebar와 AdminMobileHeader 양쪽에서 재사용합니다.
 * onNavigate 콜백을 통해 클릭 후 동작(Sheet 닫기 등)을 주입할 수 있습니다.
 */
export function AdminNavItems({ onNavigate, pathname }: AdminNavItemsProps) {
  return (
    <nav className="flex-1 p-4 space-y-1" aria-label="관리자 메뉴">
      {/* 활성 메뉴 목록 */}
      {menuItems.map((item) => {
        // 대시보드(/)는 정확히 일치, 하위 경로는 startsWith로 매칭
        const isActive =
          item.href === "/dashboard"
            ? pathname === item.href
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={onNavigate}
            className={[
              "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            <Icon className="size-4 shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}

      {/* 비활성(준비 중) 메뉴 목록 */}
      {disabledItems.map((item) => {
        const Icon = item.icon;

        return (
          <span
            key={`${item.href}-${item.label}`}
            aria-disabled="true"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none"
          >
            <Icon className="size-4 shrink-0" />
            <span className="text-sm font-medium">{item.label}</span>
          </span>
        );
      })}
    </nav>
  );
}

/**
 * 관리자 전용 사이드바 컴포넌트 (Client Component).
 *
 * md 이상 화면에서만 표시되며 현재 경로에 따라 활성 메뉴를 강조합니다.
 * 하단에 이메일, 로그아웃 버튼, 테마 토글을 포함합니다.
 */
export function AdminSidebar({ email }: AdminSidebarProps) {
  // 현재 경로 감지 — 활성 메뉴 판별에 사용
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-muted/40 border-r border-border">
      {/* 상단: 로고 및 타이틀 */}
      <div className="h-14 border-b border-border px-4 flex items-center gap-2">
        <Zap className="size-5 text-primary" />
        <span className="text-sm font-semibold">관리자</span>
      </div>

      {/* 공유 메뉴 컴포넌트 사용 */}
      <AdminNavItems pathname={pathname} />

      {/* 하단: 이메일, 로그아웃, 테마 토글 */}
      <div className="p-4 border-t border-border space-y-2">
        {/* 현재 로그인된 이메일 표시 */}
        <p className="text-xs text-muted-foreground truncate" title={email}>
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
    </aside>
  );
}
