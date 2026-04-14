#!/bin/bash
# PostToolUse 훅: Edit/Write 도구 사용 후 자동 포맷팅 (Prettier + ESLint)

# stdin에서 JSON 읽기 (한 번만 읽어야 함)
json_input=$(cat)

# 파일 경로 추출
file_path=$(echo "$json_input" | jq -r '.tool_input.file_path // empty' 2>/dev/null)

# 파일 경로가 없으면 종료
if [ -z "$file_path" ]; then
    exit 0
fi

# Prettier 대상 확장자: .ts .tsx .js .jsx .css .json
if echo "$file_path" | grep -qE '\.(ts|tsx|js|jsx|css|json)$'; then
    npx prettier --write "$file_path" 2>/dev/null || true
fi

# ESLint --fix 대상 확장자: .ts .tsx .js .jsx
if echo "$file_path" | grep -qE '\.(ts|tsx|js|jsx)$'; then
    npx eslint --fix "$file_path" 2>/dev/null || true
fi

exit 0
