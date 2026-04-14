<#
.SYNOPSIS
    Claude Code Stop Hook - Slack 모바일 알림 전송

.DESCRIPTION
    Claude Code의 Stop(작업 완료) 이벤트 발생 시
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

# ── Stop 이벤트 무한루프 방지 ─────────────────────────────────────
# stop_hook_active = true 이면 훅이 이미 실행 중이므로 즉시 종료
if ($data -and $data.stop_hook_active -eq $true) {
    exit 0
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

$messageText = ":white_check_mark: *Claude Code - 작업 완료*`n작업이 완료되었습니다. 결과를 확인해주세요.`n프로젝트: *$projectName*"
$iconEmoji   = ":white_check_mark:"

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
