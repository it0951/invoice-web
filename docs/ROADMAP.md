# 노션 기반 견적서 웹 서비스 - 고도화(Post-MVP) 개발 로드맵

> 기준 문서: docs/PRD.md, docs/roadmaps/ROADMAP_v1.md (MVP 완료분)
> 생성일: 2026-04-24
> MVP 완료일: 2026-04-24 (Vercel 프로덕션 배포 완료)
> 총 예상 기간: 2.5주 (Sprint 6 ~ Sprint 7, 필요 시 Sprint 8·9 추가)
> 최종 업데이트: 2026-04-27

---

## 개요

MVP(Sprint 0~5)가 성공적으로 완료되어 Vercel 프로덕션에 배포된 상태에서, 관리자 경험(Admin UX)을 개선하는 **고도화 단계(Post-MVP Enhancement)** 로드맵입니다. 핵심 목표는 두 가지입니다.

1. **관리자 전용 레이아웃 분리** — 공개 Navbar/Footer와 분리된 사이드바 기반 관리자 UI로 전환
2. **목록에서 원클릭 공유 링크 복사** — 다이얼로그 없이 목록 테이블에서 즉시 공유 URL을 복사하는 UX 개선

이 두 가지 개선은 관리자의 일상 업무 동선을 단축하고, 향후 관리자 기능(통계, 상세 조회, 설정 등)을 확장할 토대를 마련합니다.

---

## MVP 대비 달라지는 점 (Delta 요약)

| 영역 | MVP (현재) | 고도화 (목표) |
|------|------------|----------------|
| 관리자 레이아웃 | 루트 레이아웃의 공개 Navbar/Footer 사용 | `(admin)` 라우트 그룹 전용 Layout + Sidebar |
| 공유 링크 복사 | ShareDialog 열기 → URL 확인 → 복사 버튼 클릭 (3단계) | 목록 액션 컬럼에서 복사 아이콘 1회 클릭 (1단계) |
| 관리자 네비게이션 | 없음 | 견적서 목록 / (확장) 통계 / (확장) 설정 메뉴 |
| 모바일 관리자 UX | 공개 페이지와 동일한 Mobile Menu | 햄버거 버튼 → Sheet로 열리는 Sidebar |

---

## 마일스톤

| # | 마일스톤 | 목표 | 예상 기간 | 상태 |
|---|----------|------|-----------|------|
| M5 | 관리자 레이아웃 & UX 개선 | 관리자 전용 Sidebar + 목록 원클릭 복사 | 2주 | ✅ 완료 (2026-04-27) |
| M6 | (선택) 관리자 기능 확장 | 견적서 상세 보기, 통계 위젯 | 1주 ~ | ✅ 완료 (2026-04-27) |

---

## 스프린트 계획

### Sprint 6: 관리자 전용 레이아웃 구축

**기간**: 2026-04-27 (월) ~ 2026-05-01 (금), 5일
**상태**: ✅ 완료 (구현 + E2E 테스트 완료)
**완료일**: 2026-04-27
**목표**: `(admin)` 라우트 그룹에 전용 레이아웃과 Sidebar를 적용하여 공개 페이지와 시각적·구조적으로 분리한다.
**관련 요구사항**: 요구사항 1 (관리자 전용 레이아웃)

#### 태스크

**[SPIKE] 기술 검증**

- [x] **[SPIKE-6]** ShadcnUI Sidebar 패턴 조사 (0.5일)
  - 검증 항목: ShadcnUI 공식 `sidebar` 블록 설치(`npx shadcn@latest add sidebar`) vs 커스텀 Sheet 기반 구현 비교
  - 성공 기준: Next.js 16 App Router + React 19 환경에서 정상 동작하는 최소 예제 확보
  - 실패 시 대안: 기존 `sheet.tsx` + 커스텀 `aside` 마크업으로 수동 구현
  - 결과물: `docs/spikes/admin-sidebar.md` ✅ (Sheet + 커스텀 aside 방식 채택)
- [x] **[SPIKE-7]** 라우트 그룹 Layout 격리 검증 (0.5일)
  - 검증 항목: `app/(admin)/layout.tsx`에서 루트 레이아웃의 Navbar/Footer를 우회(override) 가능한지 확인
  - 성공 기준: `/dashboard` 접속 시 공개 Navbar 미노출, 관리자 Sidebar만 표시됨
  - 참고: Next.js 16 App Router의 중첩 Layout은 항상 부모 Layout을 감싸므로, 루트 Layout에서 조건부 렌더링 또는 `(admin)/layout.tsx`에서 Navbar를 숨기는 CSS 전략 필요
  - 결과물: `docs/spikes/admin-layout-isolation.md` ✅ (PublicChrome 슬롯 패턴 채택)

**[SETUP] 의존 컴포넌트 준비**

- [x] 필요 시 `sidebar` ShadcnUI 블록 설치 (SPIKE-6 결과에 따라 결정)
  - SPIKE-6 결과: Sheet + 커스텀 aside 방식 채택 → ShadcnUI sidebar 블록 설치 생략
- [x] 아이콘 확인: `lucide-react`에서 `LayoutDashboard`, `FileText`, `Menu`, `LogOut`, `Settings`, `BarChart3` 사용 가능 여부 확인 ✅

**[LAYOUT] 관리자 전용 레이아웃 구현**

- [x] 관리자 Layout 파일 신규 작성
  - 파일: `app/(admin)/layout.tsx` ✅
  - 내용: `AdminSidebar` + `AdminMobileHeader` + `<main>{children}</main>` 구조
  - 서버 컴포넌트에서 `auth()`로 세션 조회 후 이메일 전달
- [x] 루트 Layout의 공개 Navbar/Footer가 관리자 경로에서 노출되지 않도록 처리 ✅
  - 채택 방식: `components/layout/public-chrome.tsx` Client Component 슬롯 패턴
  - `usePathname()`으로 `/dashboard` 시작 경로에서 Navbar/Footer 미노출
  - Navbar·Footer는 Server Component 그대로 유지

**[UI] 관리자 Sidebar 컴포넌트**

- [x] 관리자 Sidebar 컴포넌트 작성
  - 파일: `components/layout/admin-sidebar.tsx` ✅
  - 메뉴: 대시보드, 견적서 목록, 통계(disabled), 설정(disabled)
  - 하단: 이메일, 로그아웃, 테마 토글
  - `AdminNavItems` 추출로 모바일 헤더와 메뉴 공유
- [x] 활성 메뉴 하이라이트 로직 ✅
  - `usePathname()`으로 `aria-current="page"` 적용
- [x] 모바일 반응형 — 햄버거 버튼 + Sheet
  - 파일: `components/layout/admin-mobile-header.tsx` ✅
  - md 미만: 햄버거 버튼 + Sheet 슬라이드
  - AdminNavItems 공유로 메뉴 내용 동일

**[UI] 대시보드 페이지 정리**

- [x] 기존 `app/(admin)/dashboard/page.tsx`의 상단 헤더 조정 ✅
  - `<h1>대시보드</h1>` → `<h1>견적서 목록</h1>` 변경
  - 통계 카드(`StatsCards`) 섹션 상단 추가

**테스트**

- [x] **[TEST]** 관리자 레이아웃 렌더링 Playwright MCP 테스트 ✅
  - 결과: Sidebar 렌더, 공개 Navbar/Footer DOM 미존재, aria-current 확인
- [x] **[TEST]** 모바일 햄버거 메뉴 E2E ✅
  - 결과: 375×667 뷰포트에서 Sidebar 숨김, Sheet 오픈, 메뉴 클릭 후 Sheet 자동 닫힘 확인
- [x] **[TEST]** 공개 페이지와의 레이아웃 분리 검증 ✅
  - 결과: 공개 페이지 Navbar/Footer 있음, 대시보드 Sidebar만 있음 확인
- [x] **[TEST]** 다크모드 전환 검증 ✅
  - 결과: `html.dark` 클래스 추가, `localStorage.theme=dark` 확인

**완료 기준**:
- `/dashboard` 접속 시 좌측 Sidebar + 우측 컨텐츠 레이아웃 렌더
- 공개 페이지(`/`, `/login`, `/invoice/[token]`)는 기존 Navbar/Footer 그대로 유지됨
- 모바일에서 햄버거 → Sheet → 메뉴 이동 플로우 정상 동작
- 다크모드에서 Sidebar 색상 대비 충분 (WCAG AA 4.5:1 이상)
- `npm run check-all` 통과, `npm run build` 성공
- 위 Playwright 테스트 전체 통과

---

### Sprint 7: 목록 원클릭 공유 링크 복사

**기간**: 2026-05-04 (월) ~ 2026-05-08 (금), 5일
**상태**: ✅ 완료 (구현 + 접근성 보강 + E2E 테스트 완료)
**완료일**: 2026-04-27
**목표**: 견적서 목록 테이블의 액션 컬럼에서 다이얼로그 없이 공유 링크를 즉시 복사하는 UX를 구현한다.
**관련 요구사항**: 요구사항 2 (링크 직접 복사)

#### 태스크

**[UTIL] 클립보드 유틸 및 헬퍼**

- [x] 공유 URL 생성 헬퍼
  - 파일: `lib/share/url.ts` ✅ (`buildShareUrl(token)`, typeof window 체크)
- [x] 클립보드 복사 유틸
  - 파일: `lib/share/clipboard.ts` ✅ (`copyToClipboard`, execCommand fallback 포함)
- [ ] 환경변수 추가 (필요 시)
  - `.env.local.example` 미생성 — Vercel 환경변수에 `NEXT_PUBLIC_APP_URL` 수동 등록 필요

**[UI] 복사 버튼 컴포넌트**

- [x] 복사 버튼 컴포넌트 추출
  - 파일: `app/(admin)/dashboard/_components/copy-link-button.tsx` ✅
  - Copy → Check 아이콘 2초 전환, toast 성공/실패, aria-label 포함

**[UI] 견적서 테이블 개선**

- [x] 데스크톱 테이블 액션 컬럼 수정 ✅
  - 공유 중: 상세보기(Eye) → CopyLinkButton → 회수 버튼 순서
  - 미공유: ShareDialog 트리거 버튼 유지
- [x] 모바일 카드 뷰 액션 수정 ✅
  - 공유 중: `CopyLinkButton className="w-full"` 추가
- [ ] Tooltip으로 공유 URL 미리보기 (선택) — 미구현

**[UX] ShareDialog 역할 재정의**

- [x] 공유 링크가 이미 존재하는 견적서에서 ShareDialog 미자동 열림 확인 ✅
  - 기존 `isActiveShare` 분기로 이미 처리됨
- [x] ShareDialog 클립보드 유틸 통일 ✅
  - `navigator.clipboard.writeText` → `copyToClipboard()` 교체
  - 토스트 메시지 통일: "공유 링크가 복사되었습니다"

**[A11Y] 접근성 보강**

- [x] 복사 성공 후 스크린 리더 알림 ✅
  - `CopyLinkButton` 내 `<span aria-live="polite" aria-atomic="true">` 추가
- [x] 포커스 관리: 복사 후 버튼에 포커스 유지 ✅
  - `buttonRef.current?.focus()` — 2초 후 아이콘 복귀 시 포커스 유지

**테스트**

- [x] **[TEST]** 링크 복사 정상 플로우 Playwright MCP 테스트 ✅
  - 결과: 클립보드에 `/invoice/[token]` 패턴 URL 복사 확인
- [x] **[TEST]** 복사 아이콘 상태 전환 테스트 ✅
  - 결과: `aria-label="복사 완료"` 전환 후 2초 뒤 `aria-label="공유 링크 복사"` 복귀 확인
- [x] **[TEST]** 클립보드 실패 fallback ✅
  - 결과: clipboard/execCommand 모두 실패 시 "복사에 실패했습니다" 에러 토스트 노출 확인

**완료 기준**:
- 공유 중인 견적서 행에서 아이콘 1회 클릭으로 공유 URL이 클립보드에 복사됨
- 복사 성공 시 Sonner 토스트 + 아이콘 상태 전환 확인
- 데스크톱 테이블과 모바일 카드 뷰 모두 지원
- 기존 ShareDialog는 신규 링크 생성 시에만 오픈 (회수 동작 영향 없음)
- 위 Playwright 테스트 전체 통과
- `npm run check-all` 통과, `npm run build` 성공

---

### Sprint 8 (선택): 관리자 견적서 상세 보기 페이지

**기간**: 2026-05-11 (월) ~ 2026-05-15 (금), 5일
**상태**: ✅ 완료 (구현 + E2E 테스트 완료)
**완료일**: 2026-04-27
**목표**: 관리자가 공유 링크 없이도 견적서 상세(라인 아이템 포함)를 확인할 수 있는 관리자 전용 상세 페이지를 제공한다.
**관련 요구사항**: PRD 제외 목록 중 "견적서 관리자 상세 보기" (선택 채택)

#### 태스크

**[ROUTE] 관리자 상세 라우트 신규**

- [x] 관리자 상세 페이지 라우트 추가
  - 파일: `app/(admin)/dashboard/invoices/[id]/page.tsx` ✅
  - `getInvoiceById` + `getInvoiceItems` DAL 호출, notFound() 처리
- [x] 미들웨어 matcher 확장 확인 ✅
  - 기존 `"/dashboard/:path*"` 패턴이 이미 커버 — 수정 불필요

**[UI] 상세 레이아웃**

- [x] 상세 페이지 헤더 컴포넌트
  - 파일: `_components/invoice-detail-header.tsx` ✅ (Breadcrumb + 고객명/발행일/총액/상태 뱃지)
- [x] 공유 링크 관리 패널
  - 파일: `_components/share-panel.tsx` ✅ (만료일·조회수 요약 + CopyLinkButton)
- [ ] 라인 아이템 테이블 재사용 — 상세 페이지 내 기본 구현, 공용 컴포넌트 리팩터링은 미완료

**[NAV] Sidebar 메뉴 활성화**

- [ ] Sprint 6에서 placeholder로 둔 "견적서 목록" 메뉴를 이 페이지로 연결 (필요 시)
- [ ] Sidebar의 현재 활성 메뉴 표시 로직이 중첩 경로(`/dashboard/invoices/[id]`)에서도 정상 동작하는지 확인

**테스트**

- [x] **[TEST]** 관리자 상세 페이지 렌더링 ✅
  - 결과: 브레드크럼, 견적서 헤더(고객명), 공유 패널, 견적 항목 섹션 모두 렌더 확인
- [x] **[TEST]** 중첩 경로 Sidebar 활성화 ✅
  - 결과: `/dashboard/invoices/[id]`에서 "견적서 목록" `aria-current="page"` 확인
- [x] **[TEST]** 미인증 접근 차단 ✅
  - 결과: 로그아웃 후 `/dashboard/invoices/[id]` 접근 → `/login?callbackUrl=...` 리다이렉트 확인

**완료 기준**:
- 목록 테이블에서 상세 페이지 진입 가능
- 상세 페이지에서 공유 링크 생성/복사/회수 모두 수행 가능
- 미인증 사용자 차단 확인
- 위 테스트 전체 통과

---

### Sprint 9 (선택): 관리자 대시보드 통계 위젯

**기간**: 2026-05-18 (월) ~ 2026-05-22 (금), 5일
**상태**: ✅ 완료 (구현 + E2E 테스트 완료)
**완료일**: 2026-04-27
**목표**: 관리자가 한눈에 확인할 수 있는 요약 지표(총 견적서 수, 공유 중 링크 수, 누적 조회수)를 제공한다.
**관련 요구사항**: PRD 제외 목록 중 "통계 대시보드" (선택 채택)

#### 태스크

- [x] 통계 집계 DAL 함수
  - 파일: `lib/dal/stats.ts` ✅ (`getInvoiceStats`, unstable_cache 60초 TTL, InvoiceStats 타입 export)
- [x] 통계 API 라우트
  - 파일: `app/api/stats/route.ts` ✅ (`auth()` 검증 → 401, 정상 → JSON)
- [x] 통계 카드 컴포넌트
  - 파일: `app/(admin)/dashboard/_components/stats-cards.tsx` ✅ (Card 4개, Skeleton 로딩, useQuery)
- [x] 대시보드 페이지에 통계 섹션 추가
  - `app/(admin)/dashboard/page.tsx` ✅ (테이블 상단 `<StatsCards />` 배치)
- [x] **[TEST]** 통계 렌더링 및 인증 검증 Playwright MCP 테스트 ✅
  - 결과: 통계 카드 영역 렌더, `/api/stats` 200 + 데이터 확인, 미인증 401 확인

**완료 기준**:
- 통계 카드 4종이 대시보드 상단에 정상 렌더
- 60초 캐시로 Notion 부하 최소화
- 미인증 접근 차단

---

## 기술적 위험 관리

| 위험 | 확률 | 영향 | 대응 전략 | 담당 스프린트 |
|------|------|------|-----------|---------------|
| 루트 Layout Navbar/Footer 격리 어려움 | 중간 | 중간 | `usePathname()` 기반 조건부 렌더 + SPIKE-7에서 사전 검증 | Sprint 6 |
| ShadcnUI Sidebar 블록이 React 19/Next 16과 미호환 | 낮음 | 중간 | Sheet + 커스텀 `aside` 대안 준비 (SPIKE-6) | Sprint 6 |
| `navigator.clipboard` 권한 거부 또는 HTTP 환경 | 낮음 | 낮음 | `execCommand('copy')` fallback + 실패 토스트 | Sprint 7 |
| 기존 ShareDialog 회귀 버그 | 중간 | 중간 | Sprint 7 테스트에서 ShareDialog 생성·복사 플로우 포함 | Sprint 7 |
| 모바일 Sheet + 기존 MobileMenu 충돌 | 낮음 | 낮음 | 관리자 경로에서는 루트 Layout의 MobileMenu 미노출 확정 | Sprint 6 |
| `NEXT_PUBLIC_APP_URL` 환경변수 누락 | 중간 | 낮음 | Vercel 환경변수 사전 등록 + `window.location.origin` fallback | Sprint 7 |

---

## 의존성 맵

```
MVP 완료 (Sprint 0~5)
        │
        ├──→ Sprint 6 (관리자 Layout + Sidebar)
        │          │
        │          └──→ Sprint 7 (목록 원클릭 복사)
        │                     │
        │                     ├──→ Sprint 8 (관리자 상세 보기) [선택]
        │                     │
        │                     └──→ Sprint 9 (통계 위젯) [선택]

요구사항 의존성:
  요구사항1 (관리자 Layout) ──→ 요구사항2 (목록 복사)
                                     │
                                     └──→ 관리자 상세 (확장)
                                     └──→ 통계 대시보드 (확장)
```

Sprint 7은 Sprint 6에 **강하게 의존하지 않음** (UI 분리만 강화되므로 병렬 진행도 가능하나, 권장은 순차)

---

## 개발 착수 즉시 확인 체크리스트

- [x] MVP 프로덕션 URL 동작 최종 확인 (`https://invoice-web.vercel.app`)
- [x] 최신 `master` 브랜치 pull 후 `npm install` 재실행
- [x] Sprint 6 착수 전 SPIKE-6 / SPIKE-7 수행 ✅ (docs/spikes/ 결과물 생성)
- [x] `npx shadcn@latest add sidebar` 실행 여부 결정 (Sheet + aside 방식 채택으로 설치 생략)
- [x] Vercel 환경변수에 `NEXT_PUBLIC_APP_URL` 추가 — **완료 (Vercel 대시보드에서 등록됨)**
- [x] 기존 Playwright MCP 테스트 실행 완료 — 2026-04-27
- [x] `docs/qa-checklist.md`에 Sprint 6·7·8·9용 체크리스트 섹션 추가 — 완료

---

## 제외 범위 (본 고도화에서도 다루지 않음)

- 견적서 생성/편집 기능 (노션 직접 입력 유지)
- 사용자 회원가입 / 비밀번호 찾기 / 다중 관리자 계정
- 이메일 발송(SendGrid/Resend 등)
- 견적서 서명/승인 워크플로우
- 결제 연동(PG사)
- PDF 커스텀 템플릿(로고/색상 변경)
- 목록 페이지네이션 (현재는 최신 N건 반환, 필요 시 별도 스프린트)
- 다국어(i18n)
- 감사 로그(Audit log) / 권한 레벨 세분화
- 모바일 앱
- Webhook 기반 실시간 Notion 반영

---

## 참고 문서

- MVP 로드맵: `docs/roadmaps/ROADMAP_v1.md`
- PRD: `docs/PRD.md`
- 배포 가이드: `docs/deployment.md`
- 관리자 가이드: `docs/admin-guide.md`
- QA 체크리스트: `docs/qa-checklist.md`
- 스파이크 결과: `docs/spikes/`
