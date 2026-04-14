<#
.SYNOPSIS
    Claude Code Hooks - SubagentStop Windows 알림 스크립트
.DESCRIPTION
    서브에이전트 작업 완료 시 Windows Toast 알림을 표시합니다.
    WinRT API 실패 시 WScript.Shell.Popup으로 폴백합니다.
#>
param()

# ── UTF-8 인코딩 강제 설정 ────────────────────────────────────────
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding             = [System.Text.Encoding]::UTF8

# ── stdin JSON 읽기 ───────────────────────────────────────────────
$rawInput = [Console]::In.ReadToEnd()
$data = $null
if ($rawInput) {
    try { $data = $rawInput | ConvertFrom-Json } catch {}
}

# ── 프로젝트 이름 ─────────────────────────────────────────────────
$projectName = if ($env:CLAUDE_PROJECT_DIR) {
    Split-Path -Leaf $env:CLAUDE_PROJECT_DIR
} else { "Claude Code" }

# ── UTF-8 바이트로 한글 문자열 구성 (파일 인코딩 무관) ─────────────
$utf8 = [System.Text.Encoding]::UTF8
$titleText = $utf8.GetString([byte[]](
    0x43,0x6C,0x61,0x75,0x64,0x65,0x20,0x43,0x6F,0x64,0x65,0x20,0x2D,0x20,
    0xEC,0x84,0x9C,0xEB,0xB8,0x8C,0xEC,0x97,0x90,0xEC,0xA0,0x84,0xED,0x8A,
    0xB8,0x20,0xEC,0x99,0x84,0xEB,0xA3,0x8C
))  # "Claude Code - 서브에이전트 완료"

$bodyText = $utf8.GetString([byte[]](
    0xEC,0x84,0x9C,0xEB,0xB8,0x8C,0xEC,0x97,0x90,0xEC,0xA0,0x84,0xED,0x8A,
    0xB8,0x20,0xEC,0x9E,0x91,0xEC,0x97,0x85,0xEC,0x9D,0xB4,0x20,0xEC,0x99,
    0x84,0xEB,0xA3,0x8C,0xEB,0x90,0x98,0xEC,0x97,0x88,0xEC,0x8A,0xB5,0xEB,
    0x8B,0x88,0xEB,0x8B,0xA4,0x2E
))  # "서브에이전트 작업이 완료되었습니다."

$projectLabel = $utf8.GetString([byte[]](
    0xED,0x94,0x84,0xEB,0xA1,0x9C,0xEC,0xA0,0x9D,0xED,0x8A,0xB8,0x3A,0x20
)) + $projectName  # "프로젝트: <name>"

# ── Windows Toast 알림 (WinRT API) ────────────────────────────────
$toastShown = $false
try {
    $null = [Windows.UI.Notifications.ToastNotificationManager,
             Windows.UI.Notifications, ContentType=WindowsRuntime]
    $null = [Windows.Data.Xml.Dom.XmlDocument,
             Windows.Data.Xml.Dom.XmlDocument, ContentType=WindowsRuntime]

    $xmlStr = "<toast duration='short'><visual><binding template='ToastGeneric'>" +
              "<text>" + [System.Security.SecurityElement]::Escape($titleText) + "</text>" +
              "<text>" + [System.Security.SecurityElement]::Escape($bodyText) + "</text>" +
              "<text>" + [System.Security.SecurityElement]::Escape($projectLabel) + "</text>" +
              "</binding></visual></toast>"

    $toastXml = New-Object Windows.Data.Xml.Dom.XmlDocument
    $toastXml.LoadXml($xmlStr)
    $toast   = [Windows.UI.Notifications.ToastNotification]::new($toastXml)
    $appId   = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show($toast)
    $toastShown = $true
} catch {}

# ── Fallback: WScript.Shell Popup (비동기 별도 프로세스) ─────────
if (-not $toastShown) {
    try {
        $msg = $bodyText + "`n" + $projectLabel
        Start-Process -WindowStyle Hidden powershell.exe -ArgumentList @(
            '-NonInteractive', '-Command',
            "(New-Object -ComObject WScript.Shell).Popup('$msg', 5, '$titleText', 0x40)"
        )
    } catch {
        Write-Error "Windows 알림 실패: $_"
    }
}

exit 0
