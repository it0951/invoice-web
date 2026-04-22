# 노션 기반 견적서 웹 서비스 MVP 개발 로드맵

> 기준 문서: docs/PRD.md
> 생성일: 2026-04-17
> 최종 업데이트: 2026-04-22 (Sprint 2 UI 구현 완료 — invoice-table, share-dialog, revoke-dialog, skeleton, dashboard 조립)
> 총 예상 기간: 6.5주 (Sprint 0 포함 약 7주)
> 착수 예정일: 2026-04-20 (월)
> MVP 런칭 목표일: 2026-06-05 (금)

---

## 개요

노션(Notion) DB에 입력된 견적서를 **고객이 별도 로그인 없이 공유 링크(토큰)로 확인**하고 **PDF로 다운로드**할 수 있게 만드는 MVP 서비스입니다. 관리자는 Auth.js 기반 로그인 후 대시보드에서 견적서 목록을 확인하고 공유 링크를 발급·회수할 수 있습니다. 핵심 기술적 불확실성은 `@react-pdf/renderer`의 React 19 호환성과 한글 폰트 처리이며, 이는 Sprint 0에서 선제적으로 검증합니다.

---

## 현재 프로젝트 상태 (2026-04-22 기준)

> Sprint 0 완료, Sprint 1 완료, Sprint 2 진행중 (구현 완료, Playwright E2E 테스트 일부 수동 검증 필요). @notionhq/client v4.0.2 사용.

### 완료된 항목

- [x] 기술 스택 세팅 완료: Next.js 16.2.3, React 19.2.4, TailwindCSS v4, ShadcnUI, Zod v4, React Query v5
- [x] 레이아웃 & Provider 체인: `ThemeProvider > QueryProvider > TooltipProvider` (`app/layout.tsx`)
- [x] 공용 컴포넌트: Navbar, Footer (`components/layout/`)
- [x] ShadcnUI 27개 컴포넌트 설치 완료 (`components/ui/`)
- [x] 라우트 스켈레톤: `/login`, `/(admin)/dashboard`, `/(client)/invoice/[token]`, `/error`
- [x] API 라우트 스켈레톤(501 Not Implemented): `/api/invoices`, `/api/share`, `/api/invoice/[token]`
- [x] 타입 정의: `types/invoice.ts` (Invoice, InvoiceItem, PublicInvoice, TokenStatus, TokenVerifyResult)
- [x] 오류 안내 페이지: `TokenStatus` 기반 메시지 분기 완료 (`app/error/page.tsx`)
- [x] 환경변수 예시: `.env.local.example` 존재
- [x] 핵심 패키지 4종 설치: `next-auth@beta`, `@notionhq/client`, `@react-pdf/renderer`, `bcrypt`
- [x] `@react-pdf/renderer` React 19.2 호환성 검증 완료 (`docs/spikes/react-pdf-react19.md`)
- [x] 한글 폰트 NotoSansKR 검증 완료 (`public/fonts/NotoSansKR-Regular.ttf`)
- [x] Auth.js v5 + bcrypt 최소 인증 흐름 검증 완료 (`docs/spikes/auth-v5.md`)
- [x] Notion DB 스키마 문서화 (`docs/notion-schema.md`)
- [x] Auth.js 실제 설정 구현 (`lib/auth/config.ts`, `lib/auth/auth.config.ts`)
- [x] bcrypt 비교 로직 구현 (`lib/auth/verify.ts`)
- [x] NextAuth 라우트 핸들러 등록 (`app/api/auth/[...nextauth]/route.ts`)
- [x] 세션 타입 확장 (`types/next-auth.d.ts`)
- [x] 미들웨어 라우트 보호 구현 (`middleware.ts`)
- [x] 로그인 페이지 Server Action 연동 (`app/login/page.tsx` — Mock 제거, `signInAction` 호출)
- [x] Navbar 로그인/로그아웃 버튼 추가 (`components/layout/navbar.tsx`)
- [x] 로그아웃 Server Action 구현 (`lib/auth/actions.ts`)
- [x] `.env.local` 환경변수 설정 완료 (NOTION_API_KEY, AUTH_SECRET, ADMIN_EMAIL 등)
- [x] Notion API Rate Limit 캐시 검증 완료 (`docs/spikes/notion-cache.md` — cold 90%, warm 100%)
- [x] `@notionhq/client` v4.0.2로 다운그레이드 (v5 `dataSources.query` 일반 Notion DB 비호환 확인, `databases.query` 유지)
- [x] Notion 클라이언트 싱글톤 구현 (`lib/notion/client.ts` — `Client({ auth })` + `requireEnv`)
- [x] Notion 응답 → DTO 변환 헬퍼 구현 (`lib/notion/mappers.ts` — `toInvoice`, `toInvoiceItem`)
- [x] DAL 함수 구현 (`listInvoices`, `getInvoiceById`, `createShareToken`, `revokeShareToken`)
- [x] BFF API 라우트 구현 (`GET /api/invoices`, `POST /api/share`, `DELETE /api/share`)
- [x] 대시보드 UI 구현 (`invoice-table.tsx`, `share-dialog.tsx`, `revoke-dialog.tsx`, `invoice-table-skeleton.tsx`)
- [x] 대시보드 페이지 조립 (`app/(admin)/dashboard/page.tsx` — TanStack Query 연동)
- [x] 미들웨어 API 401 응답 개선 (`lib/auth/auth.config.ts` — API 라우트에 redirect 대신 401 반환)

### 미구현 항목

- [ ] DAL 스텁: `getInvoiceItems`, `getInvoiceByToken` (Sprint 3)
- [ ] 공유 토큰 검증 로직: `getInvoiceByToken` + 토큰 캐시 + 지수 백오프 (Sprint 3)
- [ ] Sprint 2 Playwright E2E 테스트 (로그인 후 대시보드/공유/회수) — 실제 자격증명으로 수동 검증 필요
- [ ] `app/api/invoice/[token]/route.ts` — 501 stub (Sprint 3)
- [ ] `app/(client)/invoice/[token]/page.tsx` — skeleton (Sprint 3)
- [ ] 고객 견적서 상세 컴포넌트 (header, items-table, footer, download-button) (Sprint 3)
- [ ] `app/error.tsx`, `app/not-found.tsx` (Sprint 3)
- [ ] PDF 렌더링 컴포넌트 및 API (`lib/pdf/`, `app/api/invoice/[token]/pdf/`) (Sprint 4)
- [ ] 에러/로딩 UI, 반응형 마감 (Sprint 5)

---

## 마일스톤

| #  | 마일스톤              | 목표                                               | 예상 기간 | 완료 예정일      | 상태      |
| -- | --------------------- | -------------------------------------------------- | --------- | ---------------- | --------- |
| M0 | 기술 검증 완료        | 스파이크 리스크 해소, Notion DB/Integration 준비   | 1주       | 2026-04-24 (금)  | 완료      |
| M1 | 관리자 인증 + 대시보드 | 로그인하여 견적서 목록 조회 가능                   | 2주       | 2026-05-08 (금)  | 진행중    |
| M2 | 공유 링크 + 고객 열람 | 토큰 발급/회수, 공개 페이지에서 견적서 확인        | 1.5주     | 2026-05-20 (수)  | 미착수    |
| M3 | PDF 다운로드          | 한글 포함 PDF 다운로드 동작                        | 1주       | 2026-05-27 (수)  | 미착수    |
| M4 | 마감 + 배포           | 오류·반응형 QA, Vercel 배포                        | 1주       | 2026-06-05 (금)  | 미착수    |

---

## 스프린트 계획

### Sprint 0: 스파이크 & 환경 세팅

**기간**: 2026-04-20 (월) ~ 2026-04-24 (금), 5일
**상태**: 완료
**목표**: 기술적 위험 요소 검증, Notion 리소스 준비, 핵심 패키지 설치
**관련 기능**: 선행 작업 (모든 기능의 전제조건)

#### 태스크

**[SPIKE] 기술 검증**

- [x] **[SPIKE-1]** `@react-pdf/renderer` + React 19.2 호환성 검증 (1일)
  - 검증 항목: `npm install @react-pdf/renderer` 후 간단한 `Document/Page/Text` 렌더링 + Next.js 16 Turbopack 빌드 통과 여부
  - 성공 기준: `/api/pdf-test` 라우트에서 PDF 바이너리 스트리밍 응답, 브라우저 다운로드 정상
  - 실패 시 대안: `pdf-lib` + 자체 레이아웃 수동 구현 또는 서버사이드 Puppeteer 전환 검토
  - 결과물: `docs/spikes/react-pdf-react19.md`
- [x] **[SPIKE-2]** 한글 폰트(NotoSansKR) 등록 및 렌더링 검증 (0.5일)
  - 검증 항목: `public/fonts/NotoSansKR-Regular.ttf` 배치 → `Font.register({ family, src })` → PDF에서 "안녕하세요 견적서" 출력
  - 성공 기준: 글자 깨짐(`□□`) 없이 한글 PDF 출력
  - 실패 시 대안: 웹폰트 CDN URL 사용 또는 Pretendard 폰트로 교체
- [x] **[SPIKE-3]** Notion API Rate Limit 대응 검증 (0.5일)
  - 검증 항목: `unstable_cache` + `revalidate: 60` 적용된 쿼리로 10회 연속 호출 시 실제 Notion 호출 횟수 측정
  - 성공 기준: 캐시 히트율 90% 이상, 60초 이내 중복 요청 없음
  - 결과물: `docs/spikes/notion-cache.md`
- [x] **[SPIKE-4]** Auth.js v5 + Credentials + bcrypt 최소 흐름 검증 (1일)
  - 검증 항목: `next-auth@beta` + `bcrypt` 설치, `authorize()` 내 해시 비교, JWT 세션 발급, `auth()` 헬퍼로 세션 조회
  - 성공 기준: `/login` → 폼 제출 → 쿠키 발급 → `/dashboard` 접근 가능

**[SETUP] 패키지 설치** *(현재 모두 미설치)*

- [x] `next-auth@beta` 설치 + `@auth/core`
  - 파일: `package.json`
- [x] `bcrypt` + `@types/bcrypt` 설치
- [x] `@notionhq/client` 설치
- [x] `@react-pdf/renderer` 설치
- [x] `uuid` + `@types/uuid` 설치 (또는 `crypto.randomUUID()`만 사용 결정)

**[INFRA] 노션 리소스 준비**

- [x] Notion Integration 생성 및 Token 발급
- [x] Notion **Invoice DB** 생성 (PRD 데이터 모델 기준 12개 속성)
  - 속성: title, clientName, clientEmail, issueDate, status(Select), totalAmount(Number), shareToken, tokenExpiresAt, tokenRevokedAt, viewCount, lastViewedAt
- [x] Notion **InvoiceItem DB** 생성 (5개 속성, invoiceId는 Relation)
  - 속성: description, quantity, unitPrice, subtotal, invoiceId(Relation → Invoice DB)
- [x] Integration을 양쪽 DB에 Share
- [x] 테스트용 더미 견적서 3건 + 항목 10개 입력
- [x] 결과물: `docs/notion-schema.md` (속성 ID/타입 매핑표)

**[ENV] 환경변수 설정** *(`.env.local` 미생성 상태)*

- [x] `.env.local` 생성 (`.env.local.example` 기반)
  - `NOTION_API_KEY`, `NOTION_INVOICE_DB_ID`, `NOTION_ITEM_DB_ID`
  - `AUTH_SECRET` (`openssl rand -base64 32`)
  - `NEXTAUTH_URL=http://localhost:3000`
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (bcrypt 해시)

**완료 기준**:
- 4개 스파이크 모두 성공 문서 존재 (`docs/spikes/*.md`)
- `npm run dev` → `npm run build` 모두 에러 없이 성공
- Notion DB 2개에 더미 데이터 존재, Integration 접근 가능 확인
- `.env.local` 로드 정상, `lib/notion/client.ts`의 `requireEnv` 통과

---

### Sprint 1: 관리자 인증 구현

**기간**: 2026-04-27 (월) ~ 2026-05-01 (금), 5일
**상태**: 완료
**목표**: Auth.js 기반 실제 로그인 동작 + 미들웨어 라우트 보호
**관련 기능**: F010

#### 태스크

**[AUTH] Auth.js 실제 구성**

- [x] Auth.js 설정 구현체 작성
  - 파일: `lib/auth/config.ts` (기존 placeholder 교체 — 현재 `providers: []` 빈 설정만 존재)
  - 내용: `NextAuth({ providers: [Credentials({ authorize })], session: { strategy: "jwt" }, pages: { signIn: "/login" } })` export
  - `handlers, auth, signIn, signOut` 모두 export
- [x] `authorize()` 내부에 bcrypt 해시 비교 로직
  - 파일: `lib/auth/verify.ts` (신규)
  - 의존: Sprint 0 SPIKE-4
- [x] NextAuth 라우트 핸들러 등록
  - 파일: `app/api/auth/[...nextauth]/route.ts` (신규 — 현재 미존재)
  - 내용: `export { GET, POST } from "@/lib/auth/config"` (handlers 재export)
- [x] Auth.js 세션 타입 확장 (email, role 포함)
  - 파일: `types/next-auth.d.ts` (신규)

**[MIDDLEWARE] 라우트 보호**

- [x] `middleware.ts` 작성 — 미인증 시 `/login` 리다이렉트
  - 파일: `middleware.ts` (루트, 신규 — 현재 미존재)
  - matcher: `/(admin)/:path*`, `/api/invoices/:path*`, `/api/share/:path*`
  - 의존: Auth.js 설정 완료

**[UI] 로그인 페이지 실제 연동**

- [x] 로그인 폼 `onSubmit` 교체 — Mock → `signIn("credentials", ...)` 호출
  - 파일: `app/login/page.tsx` (기존 수정 — 현재 `setTimeout(1500)` + `toast.success` 고정)
  - 성공 시 `/dashboard`로 이동, 실패 시 Sonner 토스트
- [x] 로딩/에러 상태 세분화 (잘못된 이메일 / 잘못된 비밀번호 / 서버 오류)
- [x] "비밀번호 찾기", "회원가입" 링크는 MVP 범위에서 제거 또는 비활성화 처리 (PRD 기준 — 현재 페이지에는 두 링크 모두 존재)

**[LAYOUT] 인증 상태 반영**

- [x] Navbar에 로그인/로그아웃 버튼 추가
  - 파일: `components/layout/navbar.tsx` (수정)
  - 서버 컴포넌트에서 `auth()`로 세션 조회
- [x] 로그아웃 Server Action
  - 파일: `lib/auth/actions.ts` (신규)

**테스트**

- [x] **[TEST]** 로그인 정상/실패 플로우 Playwright MCP 테스트
  - 시나리오:
    - 정상: 올바른 자격증명 입력 → `/dashboard` 진입 → 세션 쿠키 존재 확인
    - 오류(잘못된 비밀번호): 에러 토스트 표시, URL 유지
    - 오류(빈 필드): Zod 검증 메시지 표시
  - 도구: `mcp__playwright__browser_navigate`, `mcp__playwright__browser_fill_form`, `mcp__playwright__browser_snapshot`
  - 성공 기준: `/dashboard`에 "대시보드" 헤더가 렌더링되고, 미인증 시 `/login`으로 리다이렉트됨
- [x] **[TEST]** 미들웨어 라우트 보호 검증
  - 시나리오: 로그아웃 상태에서 `/dashboard` 직접 접근 → `/login` 리다이렉트 확인
  - 도구: `mcp__playwright__browser_navigate` + URL 확인

**완료 기준**:
- `.env.local`의 `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH`로 로그인 성공
- 미로그인 상태에서 `/dashboard` 접근 시 `/login`으로 리다이렉트됨
- 로그아웃 버튼 클릭 시 세션 삭제 + `/login`으로 이동
- 잘못된 비밀번호 입력 시 "이메일 또는 비밀번호를 확인해주세요" 토스트
- 위 Playwright 테스트 전체 통과
- `npm run lint` 경고 없음

---

### Sprint 2: 견적서 목록 & 공유 링크 관리 (대시보드)

**기간**: 2026-05-04 (월) ~ 2026-05-08 (금), 5일
**상태**: 진행중
**목표**: 대시보드에서 견적서 목록 조회 + 공유 링크 발급/회수
**관련 기능**: F001, F002, F005, F006

#### 태스크

**[DAL] Notion DAL 구현**

- [x] Notion 클라이언트 실제 구현
  - 파일: `lib/notion/client.ts`
  - `Client({ auth: NOTION_API_KEY })` 인스턴스 + 싱글톤 export
- [x] Notion 응답 → DTO 변환 헬퍼
  - 파일: `lib/notion/mappers.ts`
  - `toInvoice(page)`, `toInvoiceItem(page)` 등
- [x] `listInvoices()` 구현 (Sort by issueDate desc)
  - 파일: `lib/dal/invoices.ts`
  - `unstable_cache` 적용, `revalidate: 60`, tag: `["invoices:list"]`
- [x] `getInvoiceById()` 구현
- [ ] `getInvoiceItems(invoiceId)` 구현 (Relation 쿼리, 현재 throw — Sprint 3)
- [x] `createShareToken()` 구현
  - `crypto.randomUUID()` 토큰 생성 → Notion에 shareToken, tokenExpiresAt, tokenRevokedAt=null 업데이트
  - `revalidateTag("invoices:list", "max")` 호출
- [x] `revokeShareToken()` 구현
  - tokenRevokedAt = now() 업데이트 + revalidate

**[API] BFF 엔드포인트 구현**

- [x] `GET /api/invoices` 구현
  - 파일: `app/api/invoices/route.ts`
  - `auth()` 세션 검증 → 미인증 401 → DAL `listInvoices()` 반환
- [x] `POST /api/share` 구현 (공유 링크 생성)
  - Zod body: `{ invoiceId: string, expiresInDays: number().int().min(1).max(90) }`
  - 응답: `{ token, expiresAt, url }`
- [x] `DELETE /api/share` 구현 (공유 링크 회수)
  - Zod body: `{ invoiceId: string }`

**[UI] 대시보드 견적서 목록**

- [x] 견적서 목록 테이블 컴포넌트
  - 파일: `app/(admin)/dashboard/_components/invoice-table.tsx`
  - 컬럼: 제목, 고객명, 발행일, 상태, 총액, 공유 상태, 조회수, 액션
  - ShadcnUI `Table` 사용, TanStack Query `useQuery(['invoices'])`
  - 모바일 카드 뷰 / 데스크톱 테이블 뷰 반응형 구현
- [x] 공유 링크 생성 다이얼로그
  - 파일: `app/(admin)/dashboard/_components/share-dialog.tsx`
  - 만료일(7/14/30/90일) 선택 → POST /api/share → URL 표시 + 클립보드 복사
  - Sonner 토스트, 로딩 스피너, 다이얼로그 닫힘 시 상태 초기화
- [x] 공유 링크 회수 확인 다이얼로그
  - 파일: `app/(admin)/dashboard/_components/revoke-dialog.tsx`
  - Dialog + AlertTriangle 아이콘으로 파괴적 액션 강조, DELETE /api/share 호출
- [x] 대시보드 페이지 조립
  - 파일: `app/(admin)/dashboard/page.tsx` (InvoiceTable 컴포넌트 연동)
- [x] 빈 상태 / 로딩 / 에러 UI
  - 파일: `app/(admin)/dashboard/_components/invoice-table-skeleton.tsx`
  - Alert(에러), 빈 상태 안내, Skeleton(로딩) 처리

**테스트**

- [x] **[TEST]** `GET /api/invoices` 인증 검증 — 미인증 401 확인 ✅
  - 미인증 시나리오: `fetch('/api/invoices', { redirect: 'manual' })` → 401 검증 완료
  - 인증 시나리오(200): 실제 자격증명 필요 — 수동 검증 필요
- [ ] **[TEST]** 대시보드 테이블 렌더링 검증
  - 시나리오: 로그인 → `/dashboard` → Notion 더미 견적서 3건이 테이블에 표시되는지 스냅샷 확인
  - 도구: `mcp__playwright__browser_snapshot`
- [ ] **[TEST]** 공유 링크 생성/회수 E2E
  - 시나리오:
    - 공유 생성: "공유 링크 생성" 버튼 → 다이얼로그 만료일 입력 → 생성 → 토스트 + 테이블 "공유됨" 뱃지
    - 공유 회수: 회수 버튼 → AlertDialog 확인 → 토스트 + 뱃지 제거
    - Notion DB에 shareToken / tokenRevokedAt 실제 반영 여부 확인
  - 도구: `mcp__playwright__browser_click`, `mcp__playwright__browser_fill_form`, `mcp__playwright__browser_snapshot`
- [ ] **[TEST]** 캐시 검증
  - 시나리오: 60초 이내 대시보드 재진입 시 Notion API 호출 횟수 증가하지 않음 (서버 로그로 확인)

**완료 기준**:
- `/dashboard` 접속 시 Notion 견적서 3건(더미)이 테이블에 표시
- 견적서에 공유 링크 생성 → 토큰이 Notion DB에 기록 + 테이블에 "공유됨" 뱃지 표시
- 공유 링크 회수 → Notion의 tokenRevokedAt 값이 업데이트됨
- 같은 견적서를 60초 내 재조회 시 Notion API 호출 횟수가 증가하지 않음 (캐시 검증)
- 미로그인 사용자가 `/api/invoices` 직접 호출 시 401 반환
- 위 Playwright 테스트 전체 통과

---

### Sprint 3: 고객 견적서 열람 & 토큰 검증

**기간**: 2026-05-11 (월) ~ 2026-05-20 (수), 8일(1.5주)
**상태**: 미착수
**목표**: 공유 링크로 견적서 열람 + 토큰 상태별 오류 분기
**관련 기능**: F003, F011

#### 태스크

**[CACHE] 토큰 캐시**

- [ ] `token → pageId` 인메모리 캐시 모듈
  - 파일: `lib/notion/cache.ts` (신규)
  - TTL 60초, `Map` 기반 또는 `lru-cache` (서버리스 고려: 단일 인스턴스 내 캐시)
  - 주의사항 문서화: Vercel 환경에서 인스턴스별 독립 캐시임

**[DAL] 토큰 검증 로직**

- [ ] `getInvoiceByToken(token)` 구현
  - 파일: `lib/dal/invoices.ts` (현재 throw)
  - 흐름: 캐시 조회 → 미스 시 Notion filter 쿼리(shareToken equals) → 토큰 상태 검증
  - 반환: `TokenVerifyResult` 유니온 (`valid` / `expired` / `revoked` / `not_found` / `notion_error`)
  - `PublicInvoice` DTO 변환 (shareToken, tokenExpiresAt 등 민감 필드 제거)
- [ ] 뷰 카운트 업데이트 (비동기, 논블로킹)
  - 파일: `lib/dal/invoices.ts` 내 `bumpViewCount(invoiceId)`
  - `after()` API 또는 `queueMicrotask` 사용, 실패해도 응답 영향 없음
- [ ] 지수 백오프 재시도 유틸 (Notion API 전용)
  - 파일: `lib/notion/retry.ts` (신규)
  - 3회 재시도, 백오프 200ms → 400ms → 800ms

**[API] 공개 조회 엔드포인트**

- [ ] `GET /api/invoice/[token]` 구현
  - 파일: `app/api/invoice/[token]/route.ts` (현재 501 반환)
  - TokenStatus에 따라 HTTP 상태 분기 (valid=200, expired/revoked=410, not_found=404, notion_error=503)

**[UI] 고객 견적서 상세 페이지**

- [ ] 서버 컴포넌트에서 DAL 직접 호출 + 상태별 분기
  - 파일: `app/(client)/invoice/[token]/page.tsx` (현재 "구현 예정" 문구만 표시)
  - invalid 시 `redirect('/error?reason=...')`
- [ ] 견적서 헤더 컴포넌트 (제목, 고객명, 발행일, 상태 뱃지)
  - 파일: `app/(client)/invoice/[token]/_components/invoice-header.tsx`
- [ ] 견적서 라인 아이템 테이블
  - 파일: `app/(client)/invoice/[token]/_components/invoice-items-table.tsx`
  - 수량 × 단가 = 소계, 합계 행
- [ ] 견적서 푸터 (총액 강조)
  - 파일: `app/(client)/invoice/[token]/_components/invoice-footer.tsx`
- [ ] 반응형: 모바일에서 테이블 카드형으로 전환

**[ERROR] 오류 페이지 개선**

- [ ] `/error` 페이지에 홈/재시도 버튼 추가
  - 파일: `app/error/page.tsx` (기존 수정 — 현재 TokenStatus 메시지 분기만 구현)
  - `notion_error`의 경우 "다시 시도" 버튼 제공
- [ ] 전역 `error.tsx` (App Router error boundary)
  - 파일: `app/error.tsx` (신규, 경로 오류 페이지와 구분)
- [ ] `not-found.tsx`
  - 파일: `app/not-found.tsx` (신규)

**테스트**

- [ ] **[TEST]** 토큰 상태별 분기 Playwright MCP 테스트
  - 시나리오:
    - valid: 정상 토큰 URL 접속 → 견적서 제목 + 라인 아이템 + 총액 렌더링
    - expired: 만료 토큰 → `/error?reason=expired` 리다이렉트 + "링크가 만료되었습니다" 표시
    - revoked: 회수 토큰 → `/error?reason=revoked` 리다이렉트
    - not_found: 존재하지 않는 토큰 → `/error?reason=not_found`
    - notion_error: 잘못된 DB ID 환경으로 호출 → 3회 재시도 후 `/error?reason=notion_error`
  - 도구: `mcp__playwright__browser_navigate`, `mcp__playwright__browser_snapshot`, URL 확인
- [ ] **[TEST]** 민감 필드 노출 검증
  - 시나리오: 고객 페이지 네트워크 탭에서 `shareToken`, `tokenExpiresAt`, `tokenRevokedAt` 필드가 응답에 포함되지 않음
  - 도구: `mcp__playwright__browser_network_requests`
- [ ] **[TEST]** 반응형 레이아웃
  - 시나리오: 모바일(375px), 태블릿(768px), 데스크톱(1280px)에서 테이블/카드 전환 확인
  - 도구: `mcp__playwright__browser_resize`, `mcp__playwright__browser_snapshot`

**완료 기준**:
- 유효한 토큰 URL 접속 시 견적서 제목 + 라인 아이템 + 총액 렌더링됨
- 만료된 토큰 → `/error?reason=expired` 리다이렉트 + "링크가 만료되었습니다" 표시
- 회수된 토큰 → `/error?reason=revoked` 리다이렉트
- 존재하지 않는 토큰 → `/error?reason=not_found`
- Notion API 장애 시뮬레이션(invalid DB ID) → 3회 재시도 후 `/error?reason=notion_error`
- 모바일(375px) 해상도에서 레이아웃 깨짐 없음
- `PublicInvoice` DTO에 shareToken 등 민감 필드 포함되지 않음 (네트워크 탭 확인)
- 위 Playwright 테스트 전체 통과

---

### Sprint 4: PDF 다운로드 + 한글 폰트

**기간**: 2026-05-21 (목) ~ 2026-05-27 (수), 5일(1주)
**상태**: 미착수
**목표**: 견적서 상세 페이지에서 PDF 다운로드 버튼으로 한글 PDF 획득
**관련 기능**: F004

#### 태스크

**[ASSET] 한글 폰트 배치**

- [ ] NotoSansKR 폰트 파일 배치
  - 파일: `public/fonts/NotoSansKR-Regular.ttf`, `NotoSansKR-Bold.ttf` (현재 `public/fonts/` 디렉토리 자체가 없음)
  - 라이선스(SIL OFL) 확인 및 `docs/licenses.md` 기록
- [ ] Font.register 유틸
  - 파일: `lib/pdf/fonts.ts` (신규)
  - 서버사이드 렌더링 시 절대 경로 처리 주의 (`path.join(process.cwd(), 'public/fonts/...')`)

**[PDF] PDF 문서 컴포넌트**

- [ ] PDF 레이아웃 컴포넌트
  - 파일: `lib/pdf/invoice-pdf.tsx` (신규)
  - 구조: Header(제목/고객), Table(라인 아이템), Footer(총액/발행일)
  - StyleSheet, 한글 폰트 적용
- [ ] PDF 생성 API
  - 파일: `app/api/invoice/[token]/pdf/route.ts` (신규)
  - 토큰 검증 통과 시에만 PDF 스트리밍 응답
  - `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="invoice-{id}.pdf"`
  - 파일명 한글 처리: RFC 5987 `filename*=UTF-8''...` 형식
- [ ] 토큰 검증 재사용 — Sprint 3의 `getInvoiceByToken` 직접 호출

**[UI] 다운로드 버튼**

- [ ] "PDF 다운로드" 버튼 컴포넌트
  - 파일: `app/(client)/invoice/[token]/_components/download-button.tsx` (신규)
  - 클라이언트에서 `fetch`로 blob 수신 → `URL.createObjectURL` → 자동 다운로드 트리거
  - 로딩 스피너, 실패 시 Sonner 에러 토스트
- [ ] 다운로드 버튼을 견적서 상세 페이지에 통합
  - 파일: `app/(client)/invoice/[token]/page.tsx` (수정)

**[PRINT] 인쇄 CSS (보조)**

- [ ] 인쇄 최적화 스타일
  - 파일: `app/(client)/invoice/[token]/print.css` 또는 `@media print` globals.css
  - 헤더/푸터/사이드 내비 비노출, A4 페이지 분할

**테스트**

- [ ] **[TEST]** PDF 다운로드 E2E Playwright MCP 테스트
  - 시나리오:
    - 정상: 유효 토큰 페이지에서 "PDF 다운로드" 버튼 클릭 → PDF 파일 저장 → 파일 시그니처(`%PDF-`) 확인
    - 오류: 만료/회수 토큰으로 `/api/invoice/[token]/pdf` 직접 호출 → 410/404 반환
  - 도구: `mcp__playwright__browser_click`, `mcp__playwright__browser_evaluate` (blob 검증)
- [ ] **[TEST]** 한글 렌더링 검증
  - 시나리오: 다운로드한 PDF를 텍스트 추출 도구(`pdfjs-dist` 또는 수동)로 검사, "견적서", 고객명 등 한글 문자열이 온전히 추출되는지 확인
  - 도구: PDF 파싱 스크립트 + 수동 확인
- [ ] **[TEST]** PDF 파일 크기 검증
  - 시나리오: 다운로드 파일 크기가 2MB 이하인지 확인 (폰트 서브셋팅 검증)

**완료 기준**:
- 유효한 토큰 페이지에서 "PDF 다운로드" 클릭 → 한글이 포함된 PDF 파일 저장됨
- PDF 내 한글 깨짐 없음 (모든 문자 정상 출력)
- 만료/회수된 토큰으로 `/api/invoice/[token]/pdf` 직접 호출 시 410/404 반환
- 크롬에서 "인쇄" 미리보기 깔끔 (UI 요소 숨김 확인)
- 다운로드한 PDF 파일 크기가 2MB 이하 (폰트 서브셋팅 확인)
- 위 Playwright 테스트 전체 통과

---

### Sprint 5: 마감 QA + 배포

**기간**: 2026-05-28 (목) ~ 2026-06-05 (금), 7일(1주)
**상태**: 미착수
**목표**: 전체 기능 QA, 에러·반응형 마감, Vercel 프로덕션 배포
**관련 기능**: 전체

#### 태스크

**[QA] 시나리오 테스트**

- [ ] 관리자 시나리오 체크리스트 수행
  - 로그인 → 대시보드 → 공유 링크 생성 → URL 복사 → 새 브라우저에서 열람 → 공유 링크 회수 → 동일 URL 접근 시 오류
- [ ] 고객 시나리오 체크리스트 수행
  - 공유 URL 접속 → 견적서 확인 → PDF 다운로드 → 한글 확인
- [ ] 오류 시나리오 체크리스트 수행
  - 만료 토큰, 회수 토큰, 무효 토큰, Notion API 다운(가상)
- [ ] 결과물: `docs/qa-checklist.md`

**[UX] 반응형 & 접근성 마감**

- [ ] 모바일(375px), 태블릿(768px), 데스크톱(1280px) 레이아웃 점검
- [ ] 다크모드 전체 페이지 확인
- [ ] 키보드 탐색(Tab), 포커스 아웃라인 확인
- [ ] ARIA 속성 보강 (`aria-label`, `aria-live` 등)
- [ ] Lighthouse 점수 측정 (Performance/Accessibility 90+ 목표)

**[ERROR] 에러 처리 최종 점검**

- [ ] 모든 API 라우트 try/catch + 구조화 로깅
  - 파일: `lib/logger.ts` (신규, 선택)
- [ ] Notion API 오류 메시지 → 사용자 친화 메시지 매핑
- [ ] Sonner 토스트 디자인 일관성 확인

**[SECURITY] 보안 점검**

- [ ] `shareToken`이 클라이언트 응답에서 노출되지 않는지 네트워크 탭 검증
- [ ] `/api/invoices`, `/api/share` 미인증 접근 차단 재확인
- [ ] `ADMIN_PASSWORD_HASH`가 Git에 커밋되지 않았는지 `.gitignore` 확인
- [ ] CSP 헤더 검토 (Next.js 기본값 + 필요 시 커스텀)
  - 파일: `next.config.ts`

**[DEPLOY] Vercel 배포**

- [ ] Vercel 프로젝트 생성 및 Git 연결
- [ ] Vercel 환경변수 등록 (`NOTION_API_KEY`, `AUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXTAUTH_URL` 등)
- [ ] 프리뷰 배포 → 스모크 테스트
- [ ] 커스텀 도메인 연결 (선택)
- [ ] 프로덕션 배포
- [ ] `allowedDevOrigins` 프로덕션 설정 확인 (`next.config.ts`)

**[DOCS] 문서 마감**

- [ ] `README.md`에 로컬 실행 방법, 환경변수 설명 추가
- [ ] `docs/deployment.md`에 Vercel 배포 가이드 기록
- [ ] `docs/admin-guide.md`에 관리자 사용법 기록 (비밀번호 해시 생성법 포함)

**테스트**

- [ ] **[TEST]** 프로덕션 스모크 테스트 Playwright MCP
  - 시나리오: 프로덕션 URL로 로그인 → 대시보드 → 공유 생성 → 시크릿 창에서 공유 URL 열람 → PDF 다운로드 → 한글 확인
  - 도구: `mcp__playwright__browser_navigate`, `mcp__playwright__browser_snapshot`

**완료 기준**:
- QA 체크리스트 전 항목 통과
- 프로덕션 URL에서 5개 페이지(로그인/대시보드/견적서/오류/404) 모두 정상 동작
- Lighthouse Performance ≥ 85, Accessibility ≥ 90
- 3개 화면 크기에서 레이아웃 문제 없음
- 프로덕션 환경에서 PDF 다운로드 한글 정상 출력

---

## 기술적 위험 관리

| 위험                                        | 확률 | 영향 | 대응 전략                                                                     | 담당 스프린트 |
| ------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------- | ------------- |
| `@react-pdf/renderer` React 19 미호환       | 중간 | 높음 | Sprint 0 스파이크로 선검증, 실패 시 `pdf-lib`/Puppeteer 대안                  | Sprint 0      |
| 한글 폰트 깨짐                              | 중간 | 높음 | NotoSansKR 서브셋 + `Font.register()` 검증                                    | Sprint 0, 4   |
| Notion API Rate Limit (3 req/s)             | 중간 | 중간 | `unstable_cache` TTL 60s + 인메모리 token 캐시 + 지수 백오프                  | Sprint 2, 3   |
| Notion 단일 의존성(장애 시 전체 마비)        | 낮음 | 높음 | 지수 백오프 3회 + `notion_error` 전용 오류 페이지 + "다시 시도"               | Sprint 3      |
| Auth.js v5 Beta API 불안정                  | 낮음 | 중간 | `next-auth@beta` 버전 고정, 마이그레이션 시 공식 문서 확인                    | Sprint 1      |
| Vercel 서버리스 인메모리 캐시 미공유         | 중간 | 낮음 | TTL 60s로 짧게 설정, 인스턴스별 독립 허용, 문서화                             | Sprint 3      |
| Notion DB 스키마 변경                       | 낮음 | 중간 | `mappers.ts` 단일 책임 + DTO 경계 유지                                        | Sprint 2      |
| PDF 파일 크기 과대 (폰트 미서브셋)          | 중간 | 낮음 | 폰트 subset 툴(`pyftsubset`)로 한글 상용 한자만 포함                          | Sprint 4      |

---

## 의존성 맵

```
Sprint 0 (스파이크 + 패키지 + Notion DB)
    ├──→ Sprint 1 (Auth.js 인증 + 미들웨어) ──┐
    │                                           │
    ├──→ Sprint 2 (DAL + 대시보드 + 공유 링크) ─┤
    │         │                                 │
    │         └──→ Sprint 3 (토큰 검증 + 고객 열람)
    │                   │
    │                   └──→ Sprint 4 (PDF 다운로드)
    │                              │
    └──────────────────────────────┴──→ Sprint 5 (QA + 배포)

기능 의존성:
  F010 (인증) ──→ F001 (목록) ──→ F002 (공유 생성)
                        │              ├──→ F006 (공유 회수)
                        │              └──→ F003 (토큰 열람) ──→ F004 (PDF)
                        │                         │
                        │                         └──→ F011 (오류)
                        └──→ F005 (목록 관리)
```

---

## 개발 착수 즉시 확인 체크리스트

- [x] `.env.local` 파일 생성 완료
  - `NOTION_API_KEY` — Notion Integration 발급
  - `NOTION_INVOICE_DB_ID`, `NOTION_ITEM_DB_ID` — Notion DB URL에서 추출
  - `AUTH_SECRET` — `openssl rand -base64 32`
  - `NEXTAUTH_URL=http://localhost:3000`
  - `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` — bcrypt로 해시 생성
- [x] `npm install` 실행 후 `npm run dev`로 서버 기동 확인 (기본 패키지만 설치됨)
- [x] 핵심 패키지 4종 설치 (`next-auth@beta`, `@notionhq/client`, `@react-pdf/renderer`, `bcrypt`)
- [ ] `node_modules/next/dist/docs/` 내 Next.js 16 관련 가이드 열람 (특히 App Router/async params)
- [ ] Notion Integration을 Invoice DB와 InvoiceItem DB 양쪽에 Share 처리
- [x] `public/fonts/` 디렉토리 생성 및 NotoSansKR 폰트 다운로드
- [ ] GitHub 리포지토리에 `.env.local`, `public/fonts/*.ttf`(필요 시) `.gitignore` 등록 확인

---

## 제외 범위 (MVP 이후)

- 견적서 생성/편집 기능 (현재 관리자는 노션에서 직접 입력)
- 사용자 회원가입 / 비밀번호 찾기 / 다중 관리자 계정
- 이메일 발송(SendGrid/Resend 등)
- 견적서 서명/승인 워크플로우
- 결제 연동(PG사)
- 견적서 PDF 커스텀 템플릿(로고/색상 변경)
- 견적서 목록 페이지네이션 (현재는 최신 N건 반환)
- 다국어(i18n)
- 감사 로그(Audit log) / 권한 레벨 세분화
- 모바일 앱
- Webhook 기반 Notion 변경 실시간 반영 (현재는 60초 캐시)
- QR 코드 공유 (Sprint 2에서 선택 항목으로만 고려)
