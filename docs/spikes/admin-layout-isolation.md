# SPIKE-7: 관리자 레이아웃 격리 방식

## 결론

**`PublicChrome` Client Component 래퍼** 방식 채택

## 문제

`app/layout.tsx`는 모든 경로에서 `<Navbar />`와 `<Footer />`를 렌더링함.
`app/(admin)/layout.tsx`를 추가해도 Next.js App Router는 중첩 레이아웃을 사용하므로,
루트 레이아웃의 Navbar/Footer가 `/dashboard`에서도 계속 노출됨.

## 해결 방안

### PublicChrome 슬롯 패턴

```tsx
// components/layout/public-chrome.tsx ("use client")
"use client"
import { usePathname } from "next/navigation"

export function PublicChrome({
  navbar,
  footer,
  children,
}: {
  navbar: React.ReactNode
  footer: React.ReactNode
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/dashboard")
  return (
    <>
      {!isAdmin && navbar}
      {children}
      {!isAdmin && footer}
    </>
  )
}
```

```tsx
// app/layout.tsx 수정
<PublicChrome navbar={<Navbar />} footer={<Footer />}>
  <main className="flex-1">{children}</main>
</PublicChrome>
```

### 핵심 원리
- Next.js App Router에서 Server Component를 Client Component의 `props(슬롯)`으로 전달하면, Server Component는 서버에서 렌더링되고 Client Component가 DOM 출력 여부를 결정함
- `Navbar`는 여전히 Server Component(`auth()` 사용 가능), `Footer`도 Server Component 유지
- `usePathname()`으로 `/dashboard`로 시작하는 경로에서 Navbar/Footer 미노출

### 기각된 대안
- **Navbar/Footer를 Client Component로 전환**: `auth()` 서버 함수를 사용할 수 없어 세션 조회 방식 변경 필요 → 복잡도 증가로 기각
- **CSS `display: none` 전략**: DOM에 노출되어 접근성/SEO 영향 → 기각
- **미들웨어 헤더 기반 서버 조건부 렌더**: 미들웨어와 레이아웃 간 결합도 증가 → 기각
