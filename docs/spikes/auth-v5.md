# SPIKE-4: Auth.js v5 + Credentials + bcrypt 최소 흐름 검증

> 검증일: 2026-04-17  
> 결과: **코드 구현 완료, 런타임 테스트는 .env.local 설정 후 가능**

---

## 환경

| 항목 | 버전 |
|------|------|
| next-auth | 5.0.0-beta.31 |
| @auth/core | 0.41.2 |
| bcrypt | 6.0.0 |
| Next.js | 16.2.3 (App Router) |

---

## 구현 결과

### 생성/수정 파일

| 파일 | 변경 | 설명 |
|------|------|------|
| `lib/auth/verify.ts` | 신규 | bcrypt.compare() 비밀번호 검증 유틸 |
| `lib/auth/config.ts` | 수정 | placeholder → 실제 NextAuth() 설정 |
| `app/api/auth/[...nextauth]/route.ts` | 신규 | GET/POST 핸들러 라우트 |
| `types/next-auth.d.ts` | 신규 | Session 타입 확장 (role 필드) |

### 핵심 패턴

```ts
// lib/auth/config.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials): Promise<{ id: string; email: string } | null> {
        // ADMIN_EMAIL / ADMIN_PASSWORD_HASH 환경변수 기반 검증
        // bcrypt.compare()로 해시 비교
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
})
```

---

## 런타임 테스트 전제조건

`.env.local`에 아래 변수 설정 필요:

```bash
AUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=$(node -e "require('bcrypt').hash('비밀번호',12).then(console.log)")
```

설정 후 `/login` → 폼 제출 → `/dashboard` 진입으로 최종 검증.

---

## 주요 결정사항

1. **any 타입 미사용**: `credentials` 파라미터 타입을 `Partial<Record<string, string>>`로 처리
2. **server-only 유지**: `lib/auth/config.ts` 최상단 `import "server-only"` 유지
3. **환경변수 fail-fast**: `ADMIN_EMAIL`/`ADMIN_PASSWORD_HASH` 미설정 시 즉시 `null` 반환 (인증 거부)
4. **Sprint 1 연속성**: 이 파일들을 Sprint 1에서 그대로 완성 구현에 사용

---

## npm run build 결과

```
✓ Compiled successfully
✓ TypeScript 검사 통과
/api/auth/[...nextauth] 라우트 동적 등록 확인
```
