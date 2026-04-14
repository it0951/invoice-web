#!/bin/bash
# SubagentStop 훅: 서브에이전트 작업 완료 로그 기록
# 로그 위치: <project_root>/log/subagent-log.txt

# stdin에서 JSON 읽기
json_input=$(cat)

# 정보 추출
session_id=$(echo "$json_input" | jq -r '.session_id // "unknown"' 2>/dev/null)
stop_reason=$(echo "$json_input" | jq -r '.stop_reason // "unknown"' 2>/dev/null)
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
project_name=$(basename "${CLAUDE_PROJECT_DIR:-$(pwd)}")

# log 폴더 생성 (없으면 자동 생성)
mkdir -p log

# log/subagent-log.txt에 기록
{
  echo "[$timestamp] 서브에이전트 완료"
  echo "  프로젝트  : $project_name"
  echo "  세션 ID   : $session_id"
  echo "  종료 사유 : $stop_reason"
  echo "---"
} >> log/subagent-log.txt

exit 0
