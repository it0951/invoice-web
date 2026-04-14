<#
.SYNOPSIS
    Claude Code Notification Hook - Slack 모바일 알림 전송

.DESCRIPTION
    Claude Code의 Notification(권한 요청) 이벤트 발생 시
    Slack Incoming Webhook으로 모바일 알림을 전송합니다.

    SLACK_WEBHOOK_URL은 프로젝트 루트의 .env.local 파일에서 읽습니다.
#>

# ── UTF-8 인코딩 강제 설정 ────────────────────────────────────────
# PowerShell 기본 인코딩(CP949)으로 한글이 깨지는 문제 방지
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding             = [System.Text.Encoding]::UTF8

# ── stdin JSON 읽기 ───────────────────────────────────────────────
$rawInput = [Console]::In.ReadToEnd()
$data = $null
if ($rawInput) {
    try {
        $data = $rawInput | ConvertFrom-Json
    } catch {
        # JSON 파싱 실패 시 무시하고 계속 진행
    }
}

# ── SLACK_WEBHOOK_URL 로드 ────────────────────────────────────────
# 1순위: 시스템 환경변수
$webhookUrl = $env:SLACK_WEBHOOK_URL

# 2순위: 프로젝트 루트 .env.local 파일
if (-not $webhookUrl) {
    $projectDir = $env:CLAUDE_PROJECT_DIR
    if ($projectDir) {
        $envFile = Join-Path $projectDir ".env.local"
        if (Test-Path $envFile) {
            Get-Content $envFile | ForEach-Object {
                if ($_ -match '^SLACK_WEBHOOK_URL=(.+)$') {
                    $webhookUrl = $matches[1].Trim()
                }
            }
        }
    }
}

# Webhook URL이 없거나 플레이스홀더이면 조용히 종료
if (-not $webhookUrl -or $webhookUrl -like "*YOUR/WEBHOOK*") {
    exit 0
}

# ── Slack 메시지 구성 ─────────────────────────────────────────────
$projectName = if ($env:CLAUDE_PROJECT_DIR) {
    Split-Path -Leaf $env:CLAUDE_PROJECT_DIR
} else {
    "Claude Code"
}

# jq로 파싱된 stdin의 message 필드 추출 (없으면 빈 문자열)
$notifyMessage = if ($data -and $data.message) { $data.message } else { "" }

$messageText = ":bell: *Claude Code - 권한 요청*`n권한 승인을 기다리고 있습니다.`n프로젝트: *$projectName*"
if ($notifyMessage) {
    $messageText += "`n> $notifyMessage"
}
$iconEmoji   = ":bell:"

# ── Slack Webhook POST ────────────────────────────────────────────
$payload = @{
    channel    = "#claude-code"
    username   = "Claude Code"
    text       = $messageText
    icon_emoji = $iconEmoji
} | ConvertTo-Json

# 한글 깨짐 방지: 문자열을 UTF-8 바이트 배열로 변환 후 전송
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($payload)

try {
    Invoke-WebRequest -Uri $webhookUrl `
        -Method POST `
        -ContentType "application/json; charset=utf-8" `
        -Body $bodyBytes | Out-Null
} catch {
    # 알림 실패가 Claude 작업을 방해하지 않도록 에러를 무시
    Write-Error "Slack 알림 전송 실패: $_"
}

exit 0
