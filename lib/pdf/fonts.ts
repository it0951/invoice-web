import "server-only";

import path from "node:path";
import { Font } from "@react-pdf/renderer";

/** NotoSansKR 폰트 등록 여부 플래그 (중복 등록 방지) */
let registered = false;

/**
 * @react-pdf/renderer에 NotoSansKR 한글 폰트를 등록합니다.
 *
 * - 서버사이드 절대 경로 사용 (process.cwd() 기준)
 * - 중복 호출 시 재등록하지 않습니다.
 * - PDF Route Handler에서 `renderToStream` 호출 전에 반드시 먼저 실행해야 합니다.
 *
 * 폰트 파일 위치: `public/fonts/NotoSansKR-Regular.ttf`
 */
export function registerFonts(): void {
  if (registered) return;

  Font.register({
    family: "NotoSansKR",
    src: path.join(process.cwd(), "public/fonts/NotoSansKR-Regular.ttf"),
  });

  registered = true;
}
