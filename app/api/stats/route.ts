import { NextResponse } from "next/server";

import { auth } from "@/lib/auth/config";
import { getInvoiceStats } from "@/lib/dal/stats";

/**
 * GET /api/stats
 * 관리자 대시보드 통계 위젯용 견적서 통계 조회 (Auth.js 세션 필수)
 */
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "인증이 필요합니다" }, { status: 401 });
  }

  try {
    const stats = await getInvoiceStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("[GET /api/stats]", error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
