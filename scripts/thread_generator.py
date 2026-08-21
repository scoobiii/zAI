#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GOS3 · Força todos os agentes a usarem todas as suas skills
Gera thread pública com evidências de execução.
"""

import json
import time
import urllib.request
import urllib.error
from datetime import datetime
from typing import Dict, List, Any

BASE_URL = "http://localhost:3000"

def get_agents():
    with urllib.request.urlopen(f"{BASE_URL}/api/agents") as resp:
        return json.loads(resp.read().decode())

def post_message(content: str, author_id: str = "user-sobrinho") -> Dict:
    data = json.dumps({"authorId": author_id, "content": content, "tags": ["GOS3", "Skill-Force"]}).encode()
    req = urllib.request.Request(f"{BASE_URL}/api/posts", data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def get_thread(thread_root_id: str) -> List[Dict]:
    with urllib.request.urlopen(f"{BASE_URL}/api/posts?threadRootId={thread_root_id}") as resp:
        return json.loads(resp.read().decode())

def wait_for_response(thread_root_id: str, agent_handle: str, timeout: int = 45) -> Dict:
    start = time.time()
    while time.time() - start < timeout:
        thread = get_thread(thread_root_id)
        for post in thread:
            if post.get("author", {}).get("handle") == agent_handle:
                return post
        time.sleep(1.5)
    raise TimeoutError(f"Agente {agent_handle} não respondeu em {timeout}s")

def skill_prompt(agent: Dict, skill: str) -> str:
    """Gera uma pergunta específica para forçar o uso da skill."""
    prompts = {
        "calculateEnergyBESS": f"@{agent['handle']} execute calculateEnergyBESS com 30MW Solar e 60MWh BESS.",
        "analyzeMarketCrypto": f"@{agent['handle']} execute analyzeMarketCrypto para DREX/USDC.",
        "executeJavaScript": f"@{agent['handle']} execute JavaScript para Fibonacci até 100.",
        "executePythonSim": f"@{agent['handle']} execute Python para otimizar f(x)=x^2+3x+5.",
        "generateChartData": f"@{agent['handle']} gere um gráfico de barras com dados aleatórios.",
        "vectorMemorySearch": f"@{agent['handle']} busque na memória vetorial por 'GOS3'.",
        "webFetchUrl": f"@{agent['handle']} busque https://stackoverflow.com/questions/482910.",
        "executeBash": f"@{agent['handle']} execute Bash 'ls -la'.",
        "inspectNanoClawRuntime": f"@{agent['handle']} inspecione o runtime NanoClaw.",
        "validate_contract": f"@{agent['handle']} valide o contrato v0.1.",
        # Fallback genérico
        "default": f"@{agent['handle']} use a skill {skill}."
    }
    return prompts.get(skill, prompts["default"])

def main():
    print("🚀 Forçando todos os agentes a usarem todas as skills...")
    agents = [a for a in get_agents() if a.get("isAgent")]
    print(f"📋 {len(agents)} agentes encontrados.\n")

    all_responses = []
    root_id = None

    for agent in agents:
        handle = agent["handle"]
        tools = agent.get("tools", [])
        if not tools:
            print(f"⚠️  {handle} não tem skills declaradas. Pulando.")
            continue

        print(f"🧠 {handle} - Skills: {', '.join(tools)}")

        for skill in tools:
            prompt = skill_prompt(agent, skill)
            print(f"  📝 Perguntando: {prompt[:60]}...")
            post = post_message(prompt)
            if not root_id:
                root_id = post["id"]

            try:
                response = wait_for_response(root_id, handle, timeout=60)
                evidence = response.get("thoughtLog", {}).get("evidenceHash", "N/A")
                latency = response.get("thoughtLog", {}).get("totalDurationMs", 0)
                content = response.get("content", "")
                all_responses.append({
                    "agent": handle,
                    "skill": skill,
                    "content": content,
                    "evidence": evidence,
                    "latency": latency,
                    "timestamp": response.get("createdAt", "")
                })
                print(f"    ✅ {skill} → {latency}ms")
            except TimeoutError:
                print(f"    ❌ {skill} → timeout")
                all_responses.append({
                    "agent": handle,
                    "skill": skill,
                    "content": "❌ Timeout",
                    "evidence": "N/A",
                    "latency": -1,
                    "timestamp": ""
                })

    # Gera thread no formato X
    output = []
    output.append("🧵 **GOS3 Skill-Force Thread – Todos os Agentes em Ação**")
    output.append(f"_Gerado em {datetime.now().isoformat()}_\n")
    output.append(f"🔗 **Referência local:** `{BASE_URL}`\n")

    for r in all_responses:
        status = "✅" if r["evidence"] != "N/A" else "⚠️"
        output.append(f"**{status} @{r['agent']}** (Skill: `{r['skill']}`)")
        output.append(f"*Resposta:* {r['content'][:200]}...")
        output.append(f"*Evidência:* `{r['evidence'][:16] if r['evidence'] != 'N/A' else 'N/A'}...`")
        output.append(f"*Latência:* {r['latency']}ms")
        output.append("")

    import os
    os.makedirs("output", exist_ok=True)
    with open("output/thread_all_skills.md", "w", encoding="utf-8") as f:
        f.write("\n".join(output))

    print("\n✅ Thread gerada em output/thread_all_skills.md")
    print("📋 Copie e cole no X (Twitter)")

if __name__ == "__main__":
    main()
