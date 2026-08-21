#!/bin/sh
cd ~/zAI || exit 1
python3 generate_questions.py
sh post_questions.sh
echo "⏳ Aguardando 35s..."
sleep 35
python3 collect_responses.py
echo ""
echo "📋 THREAD FINAL:"
cat output/thread_final.md
