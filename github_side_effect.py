#!/usr/bin/env python3
# GOS3 · agente: Gemini · papel: Proposer / Side-effect Engine
# fase: Sprint 3 - Side-effects Reais · data: 2026-08-21
# assinatura: Gemini · Proposer · GOS3

import requests, hashlib, os
from datetime import datetime

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = "scoobiii/vortex"

def github_star_receipt():
    if not GITHUB_TOKEN:
        return {
            "service": "github", "action": "starRepo", "target": REPO,
            "status": "auth_required", "http_status": 401, "latency_ms": 0,
            "timestamp": datetime.now().isoformat(),
            "evidence_hash": hashlib.sha256(f"{REPO}:auth_required".encode()).hexdigest()[:16],
            "error": "GITHUB_TOKEN não configurado"
        }
    start = datetime.now()
    headers = {"Authorization": f"Bearer {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}
    try:
        r = requests.put(f"https://api.github.com/user/starred/{REPO}", headers=headers, timeout=10)
        dur = int((datetime.now() - start).total_seconds() * 1000)
        ok = r.status_code in (204, 200)
        return {
            "service": "github", "action": "starRepo", "target": REPO,
            "status": "success" if ok else "error",
            "http_status": r.status_code, "latency_ms": dur,
            "timestamp": datetime.now().isoformat(),
            "evidence_hash": hashlib.sha256(f"{REPO}{r.status_code}{dur}".encode()).hexdigest()[:16],
            "error": r.text if not ok else None
        }
    except Exception as e:
        return {
            "service": "github", "action": "starRepo", "target": REPO,
            "status": "error", "http_status": 500,
            "latency_ms": int((datetime.now() - start).total_seconds() * 1000),
            "timestamp": datetime.now().isoformat(),
            "evidence_hash": hashlib.sha256(f"{REPO}:exception".encode()).hexdigest()[:16],
            "error": str(e)
        }

if __name__ == "__main__":
    import json
    print(json.dumps(github_star_receipt(), indent=2))
