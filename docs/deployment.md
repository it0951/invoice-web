# Vercel 배포 가이드

invoice-web 서비스를 Vercel에 배포하는 단계별 절차입니다.

---

## 사전 준비

- GitHub 계정 및 리포지토리 (코드가 push된 상태)
- Vercel 계정 ([vercel.com](https://vercel.com) 가입)
- `.env.local`에 사용하는 모든 환경변수 값 준비

---

## 1단계: GitHub 리포지토리 연결

1. [Vercel 대시보드](https://vercel.com/dashboard)에 로그인합니다.
2. 우측 상단 **"Add New..."** → **"Project"** 클릭합니다.
3. **"Import Git Repository"** 섹션에서 GitHub 계정을 연결합니다.
4. `invoice-web` 리포지토리를 검색하여 **"Import"** 클릭합니다.

---

## 2단계: Vercel 프로젝트 생성

1. Framework Preset이 **Next.js**로 자동 감지되는지 확인합니다.
2. Root Directory는 기본값(`.`)으로 유지합니다.
3. Build and Output Settings는 변경하지 않습니다 (Next.js 기본값 사용).

> 아직 **"Deploy"** 버튼을 누르지 마세요. 환경변수를 먼저 등록해야 합니다.

---

## 3단계: 환경변수 등록

프로젝트 생성 화면의 **"Environment Variables"** 섹션에서 아래 변수를 하나씩 등록합니다.

| 변수명 | 설명 | 예시 값 |
|--------|------|---------|
| `NOTION_API_KEY` | Notion Integration 내부 시크릿 토큰 | `secret_xxxx...` |
| `NOTION_INVOICE_DB_ID` | 견적서 Notion DB ID (32자, 하이픈 없음) | `abc123...` |
| `NOTION_ITEM_DB_ID` | 견적서 항목 Notion DB ID | `def456...` |
| `AUTH_SECRET` | Auth.js JWT 서명 비밀 키 (랜덤 문자열) | `openssl rand -base64 32` 결과값 |
| `NEXTAUTH_URL` | 배포 도메인 (https 포함) | `https://invoice-web.vercel.app` |
| `ADMIN_EMAIL` | 관리자 로그인 이메일 | `admin@example.com` |
| `ADMIN_PASSWORD_HASH` | 관리자 비밀번호 bcrypt 해시 | `$2b$12$...` |

### 환경변수 적용 범위 설정

Vercel은 환경변수에 **Production / Preview / Development** 세 가지 환경을 지정할 수 있습니다.

- `AUTH_SECRET`, `NOTION_API_KEY` 등 민감한 값: **Production** 환경에만 적용 권장
- `NEXTAUTH_URL`: 환경별로 도메인이 달라지므로 각 환경에 맞게 설정

### 배포 후 환경변수 추가·수정 방법

1. Vercel 프로젝트 → **Settings** 탭 → **Environment Variables** 메뉴
2. 변수 추가 또는 수정 후 **재배포(Redeploy)** 를 실행해야 반영됩니다.

---

## 4단계: 프리뷰 배포

로컬 환경에서 Vercel CLI를 사용하면 프리뷰 URL로 배포할 수 있습니다.

```bash
# Vercel CLI 설치 (최초 1회)
npm install -g vercel

# 프리뷰 배포
vercel
```

- 처음 실행 시 로그인 및 프로젝트 연결 절차가 진행됩니다.
- 배포 완료 후 터미널에 프리뷰 URL이 출력됩니다.

---

## 5단계: 프로덕션 배포

```bash
vercel --prod
```

- `main` 브랜치에 push하면 Vercel이 자동으로 프로덕션 배포를 실행합니다.
- 수동으로 즉시 배포하려면 위 명령어를 사용합니다.

---

## ADMIN_PASSWORD_HASH 생성 방법

관리자 비밀번호는 평문으로 저장하지 않고, bcrypt 해시 값을 환경변수에 등록합니다.

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('YOUR_PASSWORD', 12).then(h => console.log(h))"
```

- `YOUR_PASSWORD` 자리에 원하는 비밀번호를 입력합니다.
- 출력된 `$2b$12$...` 형식의 문자열을 `ADMIN_PASSWORD_HASH`에 등록합니다.
- bcrypt가 설치되지 않은 경우: `npm install bcrypt` 후 실행합니다.

> 주의: 생성된 해시 값은 다시 확인할 수 없습니다. 비밀번호를 안전한 곳에 별도 보관하세요.

---

## 배포 확인 체크리스트

- [ ] 모든 환경변수가 Vercel에 등록되었는지 확인
- [ ] `/login` 페이지에서 관리자 로그인 성공 확인
- [ ] `/dashboard` 에서 견적서 목록이 정상 조회되는지 확인
- [ ] 공유 링크 발급 후 `/invoice/[token]` 접근 확인
- [ ] PDF 다운로드 정상 작동 확인
- [ ] `NEXTAUTH_URL`이 실제 배포 도메인과 일치하는지 확인

---

## 자주 발생하는 문제

### Auth.js 로그인 오류

`NEXTAUTH_URL`이 실제 배포 URL과 다르면 로그인 후 리다이렉트가 실패합니다. Vercel 환경변수에서 값을 정확히 확인하세요.

### Notion API 연결 실패

`NOTION_API_KEY`가 올바르게 등록되어 있는지, 그리고 Invoice DB와 InvoiceItem DB 모두 해당 Integration에 **Connections** 설정이 완료되어 있는지 확인하세요.

### 빌드 실패 (TypeScript 오류)

배포 전 로컬에서 아래 명령으로 사전 검사합니다.

```bash
npm run check-all
npm run build
```
