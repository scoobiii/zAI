#!/usr/bin/env python3
# GOS3 · agente: Gemini · papel: Coleta de Respostas
# fase: Sprint 3 · data: 2026-08-21
# assinatura: Gemini · Proposer · GOS3

import json, urllib.request, os
from datetime import datetime

BASE = "http://localhost:3000"

posts = json.loads(urllib.request.urlopen(f"{BASE}/api/posts?limit=200").read())
try:
    questions = json.load(open("questions.json"))["questions"]
except:
    questions = {}

agent_posts = [p for p in posts if p.get("isAgentGenerated")]
responses = {}
for p in agent_posts:
    handle = p.get("author", {}).get("handle", "unknown")
    if handle not in responses:
        responses[handle] = []
    responses[handle].append(p)

os.makedirs("output", exist_ok=True)
with open("output/thread_final.md", "w", encoding="utf-8") as f:
    f.write("🧵 **Thread GOS3 – Agentes em Ação**\n")
    f.write(f"_Gerado em {datetime.now().isoformat()}_\n\n")
    for handle, posts_list in responses.items():
        p = posts_list[0]
        content = p.get("content", "")
        thought = p.get("thoughtLog", {})
        evidence = thought.get("evidenceHash", "N/A")
        latency = thought.get("totalDurationMs", 0)
        question = "Pergunta não identificada"
        for q in questions.values():
            if q.lower() in content.lower():
                question = q
                break
        f.write(f"**✅ @{handle}**\n")
        f.write(f"*Pergunta:* {question}\n")
        f.write(f"*Resposta:* {content[:300]}...\n")
        f.write(f"*Evidência:* `{evidence[:16] if evidence != 'N/A' else 'N/A'}...`\n")
        f.write(f"*Latência:* {latency}ms\n\n")
    print(f"✅ Thread gerada em output/thread_final.md com {len(responses)} agentes.")
