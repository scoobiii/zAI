#!/bin/bash
cd ~/zAI
URL="${1:-http://localhost:3000}"

jq -c '.questions | to_entries[]' questions.json | while read -r entry; do
  agent=$(echo "$entry" | jq -r '.key')
  question=$(echo "$entry" | jq -r '.value')
  content="@$agent $question"
  echo "📝 Enviando para $agent..."
  curl -s -X POST "$URL/api/posts" \
    -H "Content-Type: application/json" \
    -d "{\"authorId\":\"user-sobrinho\",\"content\":\"$content\",\"tags\":[\"GOS3\"]}" \
    > /dev/null
  sleep 0.5
done
echo "✅ Perguntas enviadas para $URL"
