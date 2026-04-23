# invoice-web

Notion DB를 데이터 저장소로 사용하는 견적서 관리 서비스입니다. 관리자가 견적서를 등록·관리하고, 공유 링크를 통해 고객이 견적서를 열람하거나 PDF로 다운로드할 수 있습니다.

---

## 로컬 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 변수를 입력합니다. 각 변수의 의미는 [환경변수 목록](#환경변수-목록)을 참고하세요.

```env
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_INVOICE_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_ITEM_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AUTH_SECRET=your-random-secret-string
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=$2b$12$...
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

---

## 환경변수 목록

| 변수명 | 설명 |
|--------|------|
| `NOTION_API_KEY` | Notion Integration의 내부 시크릿 토큰. Notion 개발자 설정에서 발급 |
| `NOTION_INVOICE_DB_ID` | 견적서(Invoice) Notion DB의 ID (URL에서 추출, 하이픈 없는 32자) |
| `NOTION_ITEM_DB_ID` | 견적서 항목(InvoiceItem) Notion DB의 ID |
| `AUTH_SECRET` | Auth.js JWT 서명에 사용하는 비밀 키. `openssl rand -base64 32`로 생성 권장 |
| `NEXTAUTH_URL` | 서비스의 공개 URL (로컬: `http://localhost:3000`, 배포: `https://your-domain.com`) |
| `ADMIN_EMAIL` | 관리자 로그인 이메일 |
| `ADMIN_PASSWORD_HASH` | 관리자 비밀번호의 bcrypt 해시 (bcrypt rounds=12 권장) |

> ADMIN_PASSWORD_HASH 생성 방법:
> ```bash
> node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_PASSWORD', 12).then(h => console.log(h))"
> ```

---

## 기술 스택

| 항목 | 버전 / 패키지 |
|------|---------------|
| Next.js | 16.2.3 (App Router, Turbopack) |
| React | 19.2.4 |
| TypeScript | strict 모드 |
| TailwindCSS | v4 (CSS-first 설정) |
| UI 컴포넌트 | ShadcnUI (radix-ui 기반) |
| 인증 | Auth.js v5 (next-auth@beta) — JWT 전략, Credentials 방식 |
| DB 연동 | @notionhq/client v4.0.2 |
| PDF 생성 | @react-pdf/renderer (한글 폰트 지원) |
| 폼 | react-hook-form + Zod v4 |
| 서버 상태 | TanStack React Query v5 |
| 토스트 | Sonner v2 |
| 다크모드 | next-themes |
| 아이콘 | lucide-react |

---

## 주요 페이지 목록

| 경로 | 설명 |
|------|------|
| `/login` | 관리자 로그인 페이지 (이메일 + 비밀번호 인증) |
| `/dashboard` | 관리자 대시보드 — 견적서 목록 조회, 공유 링크 발급·회수 |
| `/invoice/[token]` | 고객용 견적서 공개 열람 페이지 — 공유 토큰 기반 접근 |
| `/error` | 공유 링크 오류 안내 페이지 (만료·회수·미존재) |

---

## 개발 명령어

```bash
npm run dev          # 개발 서버 (0.0.0.0:3000)
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버
npm run lint         # ESLint 검사
npm run check-all    # 모든 검사 통합 실행 (권장)
```

---

## 관련 문서

- [Notion DB 스키마 설계](docs/notion-schema.md)
- [Vercel 배포 가이드](docs/deployment.md)
- [관리자 사용 가이드](docs/admin-guide.md)
- [프로젝트 요구사항 (PRD)](docs/PRD.md)
