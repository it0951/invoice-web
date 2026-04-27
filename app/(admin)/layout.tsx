import { auth } from "@/lib/auth/config";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminMobileHeader } from "@/components/layout/admin-mobile-header";

// 관리자 전용 레이아웃 (서버 컴포넌트)
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const email = session?.user?.email ?? "";

  return (
    <div className="flex min-h-screen">
      {/* 데스크톱: 좌측 사이드바 (md 이상에서만 표시) */}
      <AdminSidebar email={email} />
      <div className="flex flex-col flex-1 min-w-0">
        {/* 모바일: 상단 햄버거 헤더 (md 미만에서만 표시) */}
        <AdminMobileHeader email={email} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
