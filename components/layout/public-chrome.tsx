"use client";

import { usePathname } from "next/navigation";

/**
 * 공개 경로에서만 Navbar와 Footer를 렌더링하는 슬롯 패턴 컴포넌트.
 * /dashboard 경로에서는 Navbar와 Footer를 숨긴다.
 * Navbar/Footer는 Server Component이므로 props(슬롯)로 주입받아 처리한다.
 */
export function PublicChrome({
  navbar,
  footer,
  children,
}: {
  navbar: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // /dashboard로 시작하는 경로는 관리자 영역으로 판단
  const isAdmin = pathname.startsWith("/dashboard");

  return (
    <>
      {!isAdmin && navbar}
      {children}
      {!isAdmin && footer}
    </>
  );
}
