# Notion DB 스키마 & 속성 ID 매핑표

> Sprint 0 [INFRA] 작업 결과물  
> 실제 Notion 작업 후 아래 빈 칸을 채워주세요.

---

## 1단계: Notion Integration 생성

1. [Notion 개발자 설정](https://www.notion.so/my-integrations) 접속
2. **"+ New integration"** 클릭
3. 이름: `invoice-web` 입력, Workspace 선택
4. Capabilities: **Read content**, **Update content**, **Insert content** 체크
5. **Submit** 후 **Internal Integration Secret** 복사 → `.env.local`의 `NOTION_API_KEY`에 저장

```
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 2단계: Invoice DB 생성

Notion 페이지에서 `/database` 명령으로 **Full page database** 생성 후 아래 속성을 추가합니다.

| 속성명 | Notion 타입 | 설명 | 속성 ID (입력 필요) |
|--------|-------------|------|---------------------|
| `title` | Title | 견적서 제목 (기본 제목 속성) | _(자동)_ |
| `clientName` | Rich Text | 고객명 | |
| `clientEmail` | Email | 고객 이메일 | |
| `issueDate` | Date | 발행일 | |
| `status` | Select | 상태 (초안 / 발송 / 확정) | |
| `totalAmount` | Number | 총 금액 (형식: Number) | |
| `shareToken` | Rich Text | 공유 토큰 (UUID) | |
| `tokenExpiresAt` | Date | 토큰 만료 시각 (Include time: ON) | |
| `tokenRevokedAt` | Date | 토큰 회수 시각 (Include time: ON) | |
| `viewCount` | Number | 조회수 (기본값: 0) | |
| `lastViewedAt` | Date | 마지막 조회 시각 (Include time: ON) | |

### status Select 옵션
- `초안`
- `발송`
- `확정`

### DB URL에서 ID 추출 방법
```
https://www.notion.so/workspace/[DATABASE_ID]?v=...
                                ^^^^^^^^^^^^^^
```
→ `.env.local`의 `NOTION_INVOICE_DB_ID`에 저장 (하이픈 없는 32자 형식)

```
NOTION_INVOICE_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 3단계: InvoiceItem DB 생성

| 속성명 | Notion 타입 | 설명 | 속성 ID (입력 필요) |
|--------|-------------|------|---------------------|
| `title` | Title | 항목 설명 (기본 제목 속성) | _(자동)_ |
| `quantity` | Number | 수량 | |
| `unitPrice` | Number | 단가 (원) | |
| `subtotal` | Number | 소계 (quantity × unitPrice) | |
| `invoiceId` | Relation | 상위 Invoice DB 연결 | |

> `invoiceId` Relation 설정: **Relate to** → Invoice DB 선택, **Show on Invoice DB**: ON

```
NOTION_ITEM_DB_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 4단계: Integration Share 처리

Invoice DB와 InvoiceItem DB 각각에서:
1. 우측 상단 **"..."** → **"Connections"** 클릭
2. `invoice-web` Integration 검색 후 **"Confirm"**

두 DB 모두 완료해야 API 접근 가능합니다.

---

## 5단계: 더미 데이터 입력

### 견적서 3건 예시

| 제목 | 고객명 | 고객 이메일 | 발행일 | 상태 | 총액 |
|------|--------|-------------|--------|------|------|
| 웹사이트 개발 견적서 | 홍길동 | hong@example.com | 2026-04-01 | 발송 | 3500000 |
| 모바일 앱 견적서 | 김철수 | kim@example.com | 2026-04-10 | 초안 | 8000000 |
| UI/UX 디자인 견적서 | 이영희 | lee@example.com | 2026-04-15 | 확정 | 2000000 |

### 견적서 항목 예시 (총 10개)

**견적서 1 — 웹사이트 개발 견적서 (4개)**

| 항목 설명 | 수량 | 단가 | 소계 |
|-----------|------|------|------|
| 기획 및 디자인 | 1 | 800000 | 800000 |
| 프론트엔드 개발 | 1 | 1200000 | 1200000 |
| 백엔드 API 개발 | 1 | 1000000 | 1000000 |
| 배포 및 설정 | 1 | 500000 | 500000 |

**견적서 2 — 모바일 앱 견적서 (3개)**

| 항목 설명 | 수량 | 단가 | 소계 |
|-----------|------|------|------|
| iOS 개발 | 1 | 3000000 | 3000000 |
| Android 개발 | 1 | 3000000 | 3000000 |
| QA 테스트 | 1 | 2000000 | 2000000 |

**견적서 3 — UI/UX 디자인 견적서 (3개)**

| 항목 설명 | 수량 | 단가 | 소계 |
|-----------|------|------|------|
| 와이어프레임 제작 | 1 | 500000 | 500000 |
| UI 디자인 (10화면) | 10 | 80000 | 800000 |
| 프로토타입 제작 | 1 | 700000 | 700000 |

---

## 속성 ID 조회 방법

Integration 설정 완료 후 아래 명령으로 속성 ID를 확인할 수 있습니다:

```bash
curl -X GET "https://api.notion.com/v1/databases/$NOTION_INVOICE_DB_ID" \
  -H "Authorization: Bearer $NOTION_API_KEY" \
  -H "Notion-Version: 2022-06-28" | jq '.properties | keys'
```

또는 Next.js 개발 서버에서 `@notionhq/client`로 확인:

```ts
const db = await notion.databases.retrieve({ database_id: NOTION_DB.invoice })
console.log(JSON.stringify(db.properties, null, 2))
```

---

## 완료 체크리스트

- [ ] Notion Integration 생성 및 `NOTION_API_KEY` 발급
- [ ] Invoice DB 생성 (11개 속성)
- [ ] InvoiceItem DB 생성 (5개 속성 + Relation)
- [ ] 두 DB에 Integration Share 처리
- [ ] 더미 견적서 3건 + 항목 10개 입력
- [ ] `NOTION_INVOICE_DB_ID`, `NOTION_ITEM_DB_ID` 확인 및 `.env.local` 기록
