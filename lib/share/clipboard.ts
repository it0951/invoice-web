/**
 * 텍스트를 클립보드에 복사한다.
 * navigator.clipboard API 우선 사용, HTTP 환경 fallback 포함.
 * @returns 복사 성공 여부
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // HTTPS가 아닌 환경(로컬 IP 등)에서 fallback
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.focus();
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
}
