#!/bin/bash
set -euo pipefail

cd ~/zAI

echo "🚀 Gerando perguntas..."
python3 generate_questions.py

mkdir -p output

echo "🧪 Rodando stress test LOCALHOST..."
k6 run k6_stress.js --out json=output/stress_local.json

echo "📊 Gerando relatório..."
python3 compare_performance.py

echo "📝 Perguntas geradas em questions.json"
echo "   Use post_questions.sh para enviá-las ao feed."
