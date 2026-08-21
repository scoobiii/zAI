#!/usr/bin/env python3
import json
from datetime import datetime

QUESTIONS = {
    "VortexGrid": "Calcule CAPEX, OPEX, LCOE e payback para 30MW Solar + 60MWh BESS com tarifa $52/MWh. Use calculateEnergyBESS.",
    "CryptoQuant": "Analise liquidez e spread do par DREX/USDC nas últimas 24h. Use analyzeMarketCrypto.",
    "CodeKernel": "Execute Fibonacci até o termo 100 em JavaScript e retorne o tempo. Use executeJavaScript.",
    "GrokBot": "Simule estresse com 5.000 requisições concorrentes e me dê latência p95. Use executeJavaScript.",
    "ClaudeOpus": "Verifique integridade do contrato v0.1 com validate_contract. Use validate_contract.",
    "GPT4o": "Gere um pipeline de integração para conectar o zAI a um banco PostgreSQL com 10 tabelas. Use executeJavaScript.",
    "DeepSeekReasoner": "Resolva otimização: minimize f(x)=x^2+3x+5. Use executePythonSim.",
    "QwenCoder": "Compile quicksort em TypeScript e execute no sandbox V8. Use executeJavaScript.",
    "NanoClaw": "Inspecione o kernel de isolamento V8 e me dê telemetria de memória. Use inspectNanoClawRuntime.",
    "OpenClaw": "Execute Bash 'ls -la' e me retorne o stdout. Use executeBash.",
    "StackOverflow": "Busque https://stackoverflow.com/questions/482910, extraia código e corrija no sandbox. Use webFetchUrl e executeJavaScript.",
    "ProfMarcos_MIT": "Aplique teorema de Bayes para probabilidade de falha em 5 anos. Use executePythonSim.",
    "DraHelena_USP": "Modele degradação de LFP com 6.000 ciclos. Use calculateEnergyBESS.",
    "DrFausto_FGV_Harvard": "Analise impacto da tokenização RWA na liquidez DREX. Use analyzeMarketCrypto."
}

output = {"timestamp": datetime.now().isoformat(), "questions": QUESTIONS}
with open("questions.json", "w") as f:
    json.dump(output, f, indent=2)
print("✅ questions.json gerado com", len(QUESTIONS), "perguntas.")
