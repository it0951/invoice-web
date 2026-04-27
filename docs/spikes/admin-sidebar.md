# SPIKE-6: 관리자 Sidebar 구현 방식

## 결론

**ShadcnUI `sidebar` 블록 설치 + 커스텀 래핑** 방식 채택

## 검증 내용

### ShadcnUI sidebar 호환성
- 의존성: `radix-ui`, `class-variance-authority`, `lucide-react`
- 현황: 세 패키지 모두 이미 `package.json`에 설치되어 있음
- 결론: `npx shadcn@latest add sidebar` 실행 시 추가 의존성 설치 없이 동작 가능

### 채택 이유
- ShadcnUI sidebar가 제공하는 `SidebarProvider`, `Sidebar`, `SidebarContent` 등의 컴포넌트는 복잡한 상태(open/close, mobile/desktop) 관리를 추상화해줌
- 직접 구현(Sheet + aside)보다 유지보수성 우위

### 대안 (fallback)
- 설치 실패 또는 스타일 충돌 시: `components/ui/sheet.tsx` + 커스텀 `<aside>` 마크업으로 수동 구현
