#!/usr/bin/env python3
import json, urllib.request, time, os

BASE = "http://localhost:3000"
QUESTIONS = json.load(open("questions.json"))["questions"]
agents = {a["handle"]: a for a in json.loads(urllib.request.urlopen(f"{BASE}/api/agents").read()) if a.get("isAgent")}

responses = []
for handle, q in QUESTIONS.items():
    if handle not in agents: continue
    thread = json.loads(urllib.request.urlopen(f"{BASE}/api/posts?limit=200").read())
    for p in thread:
        if p.get("author", {}).get("handle") == handle and q.lower() in p.get("content", "").lower():
            responses.append({
                "agent": handle,
                "question": q,
                "answer": p.get("content"),
                "evidence": p.get("thoughtLog", {}).get("evidenceHash", "N/A"),
                "latency": p.get("thoughtLog", {}).get("totalDurationMs", 0)
            })
            break

os.makedirs("output", exist_ok=True)
with open("output/thread_answers.md", "w") as f:
    f.write("🧵 **Thread GOS3 – Agentes em Ação**\n\n")
    for r in responses:
        f.write(f"**✅ @{r['agent']}**\n")
        f.write(f"*Pergunta:* {r['question']}\n")
        f.write(f"*Resposta:* {r['answer'][:300]}...\n")
        f.write(f"*Evidência:* `{r['evidence'][:16]}...`\n")
        f.write(f"*Latência:* {r['latency']}ms\n\n")
    print(f"✅ Thread gerada em output/thread_answers.md com {len(responses)} respostas.")
