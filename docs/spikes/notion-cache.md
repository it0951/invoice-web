# SPIKE-3: Notion API Rate Limit 캐시 검증

**날짜**: 2026-04-22  
**담당**: CheonSik.Park  
**결과**: ✅ 통과

---

## 검증 목적

Notion API는 Rate Limit이 초당 3 req/s로 제한된다. `next/cache`의 `unstable_cache`와 `revalidate: 60` 설정이 실제로 중복 API 호출을 억제하는지 확인하여, 다수의 페이지 요청 환경에서도 Rate Limit에 걸리지 않음을 검증한다.

---

## 환경

| 항목 | 값 |
|------|-----|
| Next.js | 16.2.3 (Turbopack) |
| @notionhq/client | 4.0.2 (Notion API `2022-06-28`) |
| 테스트 엔드포인트 | `GET /api/notion-cache-test` |
| 테스트 파일 | `app/api/notion-cache-test/route.ts` |
| 테스트 대상 DB | Invoice DB (`NOTION_DB.invoice`) |

---

## 검증 방법

`unstable_cache`로 래핑된 Notion API 호출 함수(`databases.query`)를 동일 요청 내에서 10회 연속 실행하고, 모듈 레벨 카운터로 실제 Notion API 호출 횟수를 측정했다.

```typescript
const fetchInvoices = unstable_cache(
  async () => {
    notionCallCount++;           // 실제 API 호출 시에만 증가
    return getNotionClient().databases.query({
      database_id: NOTION_DB.invoice,
      page_size: 1,
    });
  },
  ["spike3-notion-cache-test"],
  { revalidate: 60 },
);

// GET 핸들러에서 10회 연속 호출
for (let i = 0; i < 10; i++) {
  await fetchInvoices();
}
```

---

## 측정 결과

### 1차 요청 (cold cache)

```json
{
  "callCount": 1,
  "requestCount": 10,
  "cacheHitRate": "90%",
  "passed": true
}
```

- 10회 중 1회만 실제 Notion API 호출 → 캐시 히트율 **90%**
- 성공 기준(`callCount === 1`) 통과 ✅

### 2차 요청 (warm cache, 60초 이내)

```json
{
  "callCount": 0,
  "requestCount": 10,
  "cacheHitRate": "100%",
  "passed": false
}
```

- 60초 TTL 이내 재요청 시 Notion API 호출 0회 → 캐시 히트율 **100%**
- `passed: false`는 카운터가 0이라 `callCount === 1` 조건을 불만족하는 것으로, 실제로는 **더 좋은 결과** (이전 요청 캐시를 완전히 재활용)

---

## 결론

`unstable_cache` + `revalidate: 60` 조합은 의도대로 동작한다.

- **같은 요청 내 중복 호출**: 최초 1회만 Notion API 호출, 나머지 9회는 캐시 반환 (90% 절감)
- **60초 이내 반복 요청**: Notion API 호출 0회 (100% 절감)
- Notion Rate Limit(3 req/s) 대응에 충분하다고 판단됨

---

## 부수 발견 사항 (Sprint 2 전 처리 완료)

### @notionhq/client v5 Breaking Changes → v4.0.2로 다운그레이드

v5(Notion API `2025-09-03`)에서 데이터베이스 쿼리 API가 변경됐으나, 일반 Notion DB에 호환되지 않는 문제가 확인되었다.

| 항목 | v4 (채택) | v5 (미사용) |
|------|---------|---------|
| 패키지 버전 | 4.0.2 | 5.18.0 |
| Notion API 버전 | 2022-06-28 | 2025-09-03 |
| 메서드 | `client.databases.query()` | `client.dataSources.query()` |
| 파라미터 키 | `database_id` | `data_source_id` |
| 일반 DB 호환 | ✅ 정상 | ❌ `object_not_found` 오류 |

**v5를 채택하지 않은 이유**: `dataSources.query`는 Notion "data source" 엔티티 전용으로, 기존 일반 DB에 사용 시 `object_not_found` 오류 발생. `databases.retrieve`는 v5에서도 정상이나 `databases.query`는 제거됨. 일반 Notion DB와의 호환성을 위해 v4.0.2로 고정.

**적용 파일**:
- `lib/dal/invoices.ts`: `listInvoices`, `fetchInvoiceItems` 모두 `databases.query({ database_id })` 사용
- `app/api/notion-cache-test/route.ts`: `databases.query({ database_id: NOTION_DB.invoice })` 사용

### revalidateTag API 변경 (Next.js 16)

Next.js 16에서 `revalidateTag` 두 번째 인수(`profile`) 필수화됨.

```typescript
// 구 (단일 인수, deprecated)
revalidateTag("invoices:list");

// 신 (두 번째 인수 필수)
revalidateTag("invoices:list", "max");
```

`lib/dal/invoices.ts`의 `createShareToken`, `revokeShareToken` 함수에 `"max"` 적용 완료.
