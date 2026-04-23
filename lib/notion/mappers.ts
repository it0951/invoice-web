import "server-only";

import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { Invoice, InvoiceItem, InvoiceStatus } from "@/types/invoice";

type NotionProperties = PageObjectResponse["properties"];

function getText(properties: NotionProperties, name: string): string {
  const prop = properties[name];
  if (!prop) return "";
  if (prop.type === "title") {
    return prop.title.map((t) => t.plain_text).join("");
  }
  if (prop.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("");
  }
  if (prop.type === "email") {
    return prop.email ?? "";
  }
  return "";
}

function getTextOrNull(
  properties: NotionProperties,
  name: string,
): string | null {
  const value = getText(properties, name);
  return value === "" ? null : value;
}

function getNumber(properties: NotionProperties, name: string): number {
  const prop = properties[name];
  if (prop?.type === "number") return prop.number ?? 0;
  return 0;
}

function getDate(properties: NotionProperties, name: string): string | null {
  const prop = properties[name];
  if (prop?.type === "date") return prop.date?.start ?? null;
  return null;
}

function getSelect(properties: NotionProperties, name: string): string {
  const prop = properties[name];
  if (prop?.type === "select") return prop.select?.name ?? "";
  return "";
}

export function toInvoice(page: PageObjectResponse): Invoice {
  const p = page.properties;
  return {
    id: page.id,
    title: getText(p, "title"),
    clientName: getText(p, "clientName"),
    clientEmail: getText(p, "clientEmail"),
    issueDate: getDate(p, "issueDate") ?? "",
    status: getSelect(p, "status") as InvoiceStatus,
    totalAmount: getNumber(p, "totalAmount"),
    shareToken: getTextOrNull(p, "shareToken"),
    tokenExpiresAt: getDate(p, "tokenExpiresAt"),
    tokenRevokedAt: getDate(p, "tokenRevokedAt"),
    viewCount: getNumber(p, "viewCount"),
    lastViewedAt: getDate(p, "lastViewedAt"),
  };
}

export function toInvoiceItem(page: PageObjectResponse): InvoiceItem {
  const p = page.properties;

  const relationProp = p["invoiceId"];
  const invoiceId =
    relationProp?.type === "relation" && relationProp.relation.length > 0
      ? relationProp.relation[0].id
      : "";

  const quantity = getNumber(p, "quantity");
  const unitPrice = getNumber(p, "unitPrice");

  return {
    id: page.id,
    invoiceId,
    // Notion DB의 항목명 속성명은 "title" (rich_text 타입)
    description: getText(p, "title"),
    quantity,
    unitPrice,
    // Notion의 subtotal이 Rollup/Formula 타입이면 getNumber가 0을 반환하므로 직접 계산
    subtotal: quantity * unitPrice,
  };
}
