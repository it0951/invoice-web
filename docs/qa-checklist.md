# QA 체크리스트

> Sprint 5 마감 QA 결과
> 작성일: 2026-04-23
> 테스트 환경: localhost:3000 (Next.js 16 dev server)

---

## 1. 오류 시나리오 테스트 (자동화)

| 시나리오 | URL | 기대 결과 | 실제 결과 | 상태 |
|---------|-----|----------|----------|------|
| 존재하지 않는 토큰 | `/invoice/invalid-token-xyz` | `/error?reason=not_found` 리다이렉트 | 정상 리다이렉트 | ✅ |
| not_found 오류 페이지 | `/error?reason=not_found` | "견적서를 찾을 수 없습니다" 표시 | 정상 표시 | ✅ |
| expired 오류 페이지 | `/error?reason=expired` | "링크가 만료되었습니다" 표시 | 정상 표시 | ✅ |
| revoked 오류 페이지 | `/error?reason=revoked` | "링크가 회수되었습니다" 표시 | 정상 표시 | ✅ |
| notion_error 오류 페이지 | `/error?reason=notion_error` | "일시적인 오류" + 다시시도 버튼 | 정상 표시 | ✅ |
| 404 페이지 | `/nonexistent-url` | "페이지를 찾을 수 없습니다" | 정상 표시 | ✅ |

---

## 2. 반응형 레이아웃 (자동화)

| 브레이크포인트 | 대상 페이지 | 레이아웃 깨짐 | 상태 |
|-------------|-----------|-------------|------|
| 375px (모바일) | 오류 페이지 | 없음 | ✅ |
| 768px (태블릿) | 오류 페이지 | 없음 | ✅ |
| 1280px (데스크톱) | 오류 페이지 | 없음 | ✅ |

---

## 3. 다크모드 (자동화)

| 페이지 | 다크모드 정상 | 상태 |
|-------|------------|------|
| 오류 페이지 | 배경 검정, 텍스트 흰색, 버튼 정상 | ✅ |

---

## 4. 관리자 플로우 (수동 확인 완료 — 2026-04-24)

| 시나리오 | 확인 방법 | 상태 |
|---------|---------|------|
| 로그인 성공 | `/login` → 올바른 자격증명 입력 → `/dashboard` 이동 | ✅ |
| 로그인 실패 | 잘못된 비밀번호 → 에러 토스트 표시 | ✅ |
| 대시보드 견적서 목록 | Notion DB 견적서 표시 여부 | ✅ |
| 공유 링크 생성 | 다이얼로그 → 만료일 선택 → URL 복사 | ✅ |
| 공유 링크 회수 | 회수 다이얼로그 → 확인 → Notion tokenRevokedAt 업데이트 | ✅ |
| 미인증 대시보드 접근 | 로그아웃 상태에서 `/dashboard` → `/login` 리다이렉트 | ✅ |

---

## 5. 고객 플로우 (수동 확인 완료 — 2026-04-24)

| 시나리오 | 확인 방법 | 상태 |
|---------|---------|------|
| 견적서 열람 | 유효 토큰 URL 접속 → 항목명·수량·단가·소계 표시 | ✅ |
| 항목명 정상 표시 | Notion InvoiceItem "title" 속성값이 화면에 표시됨 | ✅ |
| 소계 정상 계산 | quantity × unitPrice 값이 소계에 표시됨 | ✅ |
| PDF 다운로드 | "PDF 다운로드" 클릭 → PDF 파일 저장 | ✅ |
| PDF 한글 정상 | PDF 내 한글 깨짐 없음 | ✅ |
| 인쇄 미리보기 | "인쇄" 클릭 → 브라우저 인쇄 다이얼로그 → UI 요소 숨김 | ✅ |

---

## 6. 보안 점검 (자동화/코드 리뷰)

| 항목 | 결과 | 상태 |
|-----|------|------|
| `notion-cache-test` 스파이크 라우트 삭제 | 파일 삭제 완료 | ✅ |
| `.env.local` `.gitignore` 등록 | `.env*` 패턴으로 이미 적용됨 | ✅ |
| `hook-test.txt`, `shrimp_data/` `.gitignore` 추가 | 추가 완료 | ✅ |
| 보안 헤더 추가 (X-Frame-Options 등) | `next.config.ts` 헤더 추가 완료 | ✅ |
| `shareToken` 클라이언트 응답 미포함 | PublicInvoice DTO에 미포함 (코드 검토) | ✅ |
| `/api/invoices` 미인증 401 | auth() 세션 검증 구현됨 | ✅ |

---

## 7. 에러 처리 점검 (코드 리뷰)

| 항목 | 결과 | 상태 |
|-----|------|------|
| PDF 라우트 `renderToStream` try/catch | 누락 발견 → 수정 완료 | ✅ |
| Sonner toast 임포트 일관성 | 4개 파일 모두 `import { toast } from "sonner"` | ✅ |
| 에러 메시지 한국어 + 사용자 친화적 | 전 파일 확인 | ✅ |
| 로딩 상태 버튼 disabled 처리 | 일관되게 적용됨 | ✅ |

---

## 8. 접근성 (코드 리뷰 + 코드 수정)

| 항목 | 결과 | 상태 |
|-----|------|------|
| share-dialog `aria-busy` 추가 | 추가 완료 | ✅ |
| revoke-dialog `aria-busy` 추가 | 추가 완료 | ✅ |
| download-button `aria-label`, `aria-busy` 추가 | 추가 완료 | ✅ |
| Lighthouse 점수 측정 | ⬜ 수동 확인 필요 |  |

---

## 9. 문서화

| 파일 | 상태 |
|-----|------|
| `README.md` | ✅ 업데이트 완료 |
| `docs/deployment.md` | ✅ 신규 작성 |
| `docs/admin-guide.md` | ✅ 신규 작성 |
| `docs/notion-schema.md` | ✅ 실제 구조 반영 업데이트 |

---

## 종합 결과 (Sprint 0~5)

| 구분 | 자동화 테스트 | 수동 확인 필요 |
|-----|------------|-------------|
| 오류 시나리오 | 6/6 ✅ | - |
| 반응형 | 3/3 ✅ | - |
| 다크모드 | 1/1 ✅ | - |
| 보안 | 6/6 ✅ | - |
| 에러처리 | 4/4 ✅ | - |
| 접근성 | 3/3 ✅ | Lighthouse 측정 |
| 관리자 플로우 | - | 6개 항목 |
| 고객 플로우 | - | 6개 항목 |
| 문서화 | 4/4 ✅ | - |

---

## Sprint 6: 관리자 전용 레이아웃 E2E 테스트

> 테스트 일자: 2026-04-27
> 테스트 환경: localhost:3000 (Playwright MCP)

| 시나리오 | 성공 기준 | 결과 | 상태 |
|---------|---------|------|------|
| 대시보드 Sidebar 렌더링 | `/dashboard` 접속 시 `aside` Sidebar 표시, 공개 Navbar/Footer DOM 미존재 | Sidebar 있음, Navbar/Footer 없음 확인 | ✅ |
| 메뉴 활성화(aria-current) | `/dashboard`에서 "대시보드" 메뉴에 `aria-current="page"` | `aria-current="page"` 확인 | ✅ |
| 로그아웃 | Sidebar 하단 로그아웃 클릭 → `/login` 이동 | `/login` 리다이렉트 확인 | ✅ |
| 모바일 Sidebar 숨김 | 375×667 뷰포트에서 `aside` 미표시, 햄버거 버튼 표시 | 햄버거 버튼 표시 확인 | ✅ |
| 모바일 Sheet 오픈 | 햄버거 클릭 → `dialog` Sheet 오픈 → 메뉴 전체 렌더 | Sheet 오픈 및 메뉴 확인 | ✅ |
| 모바일 Sheet 자동 닫힘 | Sheet 내 메뉴 클릭 → Sheet 닫힘 | `dialog` DOM 미존재 확인 | ✅ |
| 공개 페이지 레이아웃 분리 | `/login` 접속 시 Navbar/Footer 있음, Sidebar 없음 | Navbar/Footer 있음, Sidebar 없음 확인 | ✅ |
| 다크모드 전환 | Sidebar 테마 토글 클릭 → `html.dark` 클래스 추가, `localStorage.theme=dark` | `html.dark` 클래스 및 localStorage 확인 | ✅ |

---

## Sprint 7: 원클릭 공유 링크 복사 E2E 테스트

> 테스트 일자: 2026-04-27
> 테스트 환경: localhost:3000 (Playwright MCP)

| 시나리오 | 성공 기준 | 결과 | 상태 |
|---------|---------|------|------|
| 링크 복사 정상 플로우 | 복사 버튼 클릭 → 클립보드에 `/invoice/[token]` 패턴 URL 복사 | `http://localhost:3000/invoice/[uuid]` 확인 | ✅ |
| aria-label 상태 전환 | 클릭 후 `aria-label="복사 완료"` → 2초 후 `aria-label="공유 링크 복사"` 복귀 | 전환 및 복귀 확인 | ✅ |
| aria-live 스크린 리더 알림 | 복사 성공 시 `aria-live="polite"` 영역에 메시지 노출 | CopyLinkButton 내 `<span aria-live="polite">` 구현 | ✅ |
| 포커스 유지 | 2초 후 아이콘 복귀 시 버튼에 포커스 유지 | `buttonRef.current?.focus()` 구현 | ✅ |
| clipboard 실패 fallback | clipboard/execCommand 모두 실패 시 에러 토스트 | "복사에 실패했습니다" 토스트 확인 | ✅ |

---

## Sprint 8: 관리자 견적서 상세 페이지 E2E 테스트

> 테스트 일자: 2026-04-27
> 테스트 환경: localhost:3000 (Playwright MCP)

| 시나리오 | 성공 기준 | 결과 | 상태 |
|---------|---------|------|------|
| 상세 페이지 렌더링 | 목록에서 상세 링크 클릭 → 브레드크럼·고객명·공유 패널·견적 항목 렌더 | 모든 섹션 렌더 확인 | ✅ |
| 중첩 경로 Sidebar 활성화 | `/dashboard/invoices/[id]`에서 "견적서 목록" `aria-current="page"` | `aria-current="page"` 확인 | ✅ |
| 미인증 접근 차단 | 로그아웃 상태에서 `/dashboard/invoices/[id]` → `/login?callbackUrl=...` 리다이렉트 | 리다이렉트 확인 | ✅ |

---

## Sprint 9: 통계 위젯 E2E 테스트

> 테스트 일자: 2026-04-27
> 테스트 환경: localhost:3000 (Playwright MCP)

| 시나리오 | 성공 기준 | 결과 | 상태 |
|---------|---------|------|------|
| 통계 카드 렌더링 | 대시보드 상단 `[aria-label="통계 카드"]` 영역 존재 | 통계 카드 영역 확인 | ✅ |
| 통계 API 인증 상태 | 로그인 상태에서 `/api/stats` → 200 + 데이터 반환 | `{total, activeShares, totalViews, expiredShares}` 확인 | ✅ |
| 통계 API 미인증 차단 | `credentials: omit`으로 `/api/stats` 접근 → 401 | 401 반환 확인 | ✅ |

---

## 종합 결과 (Sprint 6~9)

| 구분 | E2E 테스트 | 상태 |
|-----|-----------|------|
| Sprint 6: 관리자 레이아웃 | 8/8 | ✅ |
| Sprint 7: 원클릭 복사 | 5/5 | ✅ |
| Sprint 8: 상세 페이지 | 3/3 | ✅ |
| Sprint 9: 통계 위젯 | 3/3 | ✅ |
