#!/bin/bash
# PostToolUse 훅: Bash 명령어 실행 기록 로깅

# stdin에서 JSON 읽기 (한 번만 읽어야 함)
json_input=$(cat)

# 명령어와 설명 추출
command=$(echo "$json_input" | jq -r '.tool_input.command // "unknown"' 2>/dev/null)
description=$(echo "$json_input" | jq -r '.tool_input.description // "No description"' 2>/dev/null)
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

# log 폴더 생성 (없으면 자동 생성)
mkdir -p log

# log/bash-log.txt에 기록
echo "[$timestamp] $command | $description" >> log/bash-log.txt

exit 0
