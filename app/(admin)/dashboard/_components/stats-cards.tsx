"use client";

import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { FileText, Share2, Eye, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { InvoiceStats } from "@/lib/dal/stats";

/** /api/stats 엔드포인트에서 통계 데이터를 조회 */
async function fetchStats(): Promise<InvoiceStats> {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error("통계 조회 실패");
  return res.json();
}

/** 통계 카드 한 항목의 데이터 구조 */
interface StatCardItem {
  title: string;
  value: number;
  icon: LucideIcon;
}

/** 로딩 상태일 때 표시할 스켈레톤 카드 4개 */
function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * 대시보드 통계 카드 컴포넌트
 *
 * TanStack Query를 통해 /api/stats를 호출하고
 * 총 견적서 수, 활성 공유 수, 총 조회수, 만료 공유 수를 카드로 표시
 */
export function StatsCards() {
  const { data, isLoading } = useQuery<InvoiceStats>({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return <StatsCardsSkeleton />;
  }

  const cards: StatCardItem[] = [
    { title: "총 견적서", value: data?.total ?? 0, icon: FileText },
    { title: "공유 중", value: data?.activeShares ?? 0, icon: Share2 },
    { title: "총 조회수", value: data?.totalViews ?? 0, icon: Eye },
    { title: "만료됨", value: data?.expiredShares ?? 0, icon: Clock },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              {/* 아이콘: LucideIcon 타입으로 명시 */}
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
