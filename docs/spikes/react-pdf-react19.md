# SPIKE-1: @react-pdf/renderer + React 19 호환성 검증

> 검증일: 2026-04-17  
> 결과: **성공**

---

## 환경

| 항목 | 버전 |
|------|------|
| Next.js | 16.2.3 (Turbopack) |
| React | 19.2.4 |
| @react-pdf/renderer | 4.5.1 |

---

## 검증 결과

### ✅ 성공

- `/api/pdf-test` 라우트에서 `Content-Type: application/pdf` 응답 반환
- PDF 파일 시그니처 `%PDF-1.3` 정상 확인
- `npm run build` TypeScript 검사 통과
- Turbopack 컴파일 성공

### 주요 트러블슈팅

#### 1. JSX in API Route — `.tsx` 확장자 필수
Route Handler 파일에서 JSX 사용 시 `.ts` → `.tsx` 확장자 변경 필요.

#### 2. Turbopack 호환 설정 필요
`next.config.ts`에 `serverExternalPackages` 추가:
```ts
serverExternalPackages: ["@react-pdf/renderer"]
```

#### 3. renderToStream 반환 타입 캐스트
`@react-pdf/renderer` v4의 `ReadableStream` 타입이 `BodyInit`과 불일치.  
`any` 사용 금지 규칙에 따라 `unknown` 경유 캐스트로 해결:
```ts
return new Response(stream as unknown as BodyInit, { ... })
```

---

## 구현 패턴 (Sprint 4에서 재사용)

```tsx
// lib/pdf/invoice-pdf.tsx — PDF 문서 컴포넌트
import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer"

// app/api/invoice/[token]/pdf/route.tsx — PDF 스트리밍 라우트
const stream = await renderToStream(<InvoicePDF invoice={data} />)
return new Response(stream as unknown as BodyInit, {
  headers: { "Content-Type": "application/pdf" },
})
```

---

---

## SPIKE-2: NotoSansKR 한글 폰트 검증

> 검증일: 2026-04-17 | 결과: **성공**

### 폰트 정보

| 항목 | 내용 |
|------|------|
| 폰트 | NotoSansKR-Regular (Google Fonts v39) |
| 다운로드 경로 | `public/fonts/NotoSansKR-Regular.ttf` |
| 파일 크기 | 5.9MB |
| 라이선스 | SIL OFL 1.1 |

### 검증 결과

- `Font.register({ family: "NotoSansKR", src: path.join(process.cwd(), "public/fonts/...") })` 정상 동작
- PDF 내 `NotoSansKR` 폰트 참조 확인
- "안녕하세요 견적서" 한글 코드포인트 292개 임베딩 확인
- 생성된 PDF 크기: 3.7KB (폰트 서브셋팅 적용)

### 핵심 패턴 (Sprint 4 재사용)

```ts
// lib/pdf/fonts.ts
import path from "node:path"
import { Font } from "@react-pdf/renderer"

Font.register({
  family: "NotoSansKR",
  src: path.join(process.cwd(), "public/fonts/NotoSansKR-Regular.ttf"),
})
```

### 주의사항

- 서버사이드에서 반드시 `path.join(process.cwd(), ...)` 절대 경로 사용
- CDN URL 방식은 서버리스 환경에서 불안정 — 로컬 파일 필수
- `public/fonts/*.ttf`는 `.gitignore`에서 제외 (or LFS 사용 권장)

---

## 결론

`@react-pdf/renderer@4.5.1`은 React 19.2.4 + Next.js 16.2.3 Turbopack 환경에서 **정상 동작**.  
NotoSansKR 한글 폰트 임베딩 확인. 위 패턴을 Sprint 4 PDF 기능 구현에 그대로 적용 가능.
