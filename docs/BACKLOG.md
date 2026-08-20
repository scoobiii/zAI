> **GOS3** · agente: `GPT / Claude` · papel: `Maintainer / Engineering Agent` (ver docs/team.md)
> fase: `fase 5 — padronização e governança de especificações` · data: `2026-08-20` · hora: `14:07:00 UTC`
> antes: Backlog cobria até o Sprint 2 com pendências de tipo e validação
> depois: Backlog atualizado com Sprints 1 a 4 100% concluídos (Benchmark 25/25, Anti-Fabricação, WAL e GOS3 v1.0)
> base: commit `gos3-core-v1.0`
> assinatura: `GOS3 Maintainer · Engineering Agent · GOS3`

# BACKLOG — Vortex / GOS3 (v1.0.0 Oficial)

## Fase Atual
**GOS3 v1.0 Core Release** — Governança e Auditoria Completa

---

## Sprint 1 — Runtime Reference (Grok) — [CONCLUÍDO]
- [x] Criar `specs/invocation-contract.md` v0.1
- [x] Entregar adaptador Grok (`src/agents/grok/`)
- [x] Campo `executed: true/false` obrigatório
- [x] Testes de conformidade básicos (19/19 passed em Node v20.20.2)
- [x] Documentar handoff do adaptador
- [x] Marcar Grok oficialmente no board

---

## Sprint 2 — Generalização e Hardening de Subprocessos — [CONCLUÍDO]
- [x] Infra mínima para rodar TypeScript: `package.json` + `tsconfig.json` na raiz
- [x] **#ISSUE-sandbox-subprocesses-fix**: Correção de shadowing em `process` e implementação de `killSignal: "SIGKILL"` explícito
- [x] **#ISSUE-no-mock-fallback**: Ausência de chave reporta `claim: "not_executed"` sem gerar mocks
- [x] **#ISSUE-fechar-brecha-tipo**: Validação estrita de contratos de entrada e saída
- [x] **#ISSUE-verificar-executed**: Teste que prova que `executed: true` corresponde a computação real com hash SHA-256 e side-effect comprovado
- [x] **#ISSUE-extrair-template**: Template base de agentes autônomos
- [x] **#ISSUE-onboarding-doc**: Diretrizes de plug-in de novos modelos

---

## Sprint 3 — Persistência WAL e Cluster Load Balancer — [CONCLUÍDO]
- [x] Inserções atômicas SQLite WAL para `chat_global` e `nx1_records` (`src/server/persistence.ts`)
- [x] Cluster Load Balancer multi-worker na porta 3000 (`server-cluster.ts`)
- [x] Suíte de testes de estresse (5.000 ops com vazão de 29.500 ops/s)
- [x] Dockerfile multi-stage Alpine (<150MB) com non-root user e dumb-init
- [x] Runbook determinístico para Termux/Proot Alpine (`docs/RUNBOOK.md`)

---

## Sprint 4 — Suíte de Benchmark Determinístico GOS3 (100% Cobertura) — [CONCLUÍDO]
- [x] Auditoria e mitigação do defeito INC-001 (eliminação de qualquer retorno simulado)
- [x] Implementação da suíte de teste das **25 ferramentas de agente** (`scripts/benchmark_agent_tools.ts`)
- [x] Validação de 100% das ferramentas com hashes SHA-256 de prova (`evidenceHash`)
- [x] Integração da aba "Agent Tools Benchmark (100% Cobertura)" no `SandboxLabModal.tsx`
- [x] RAG e Memória Vetorial Semântica (`src/server/vectorMemory.ts`) com busca por cosseno L2
- [x] Endpoint unificado `/api/sandbox/execute?toolName=runBenchmark`

---

## Próximos Passos & Evolução (GOS3 v1.1 Roadmap)
- [ ] Orquestração descentralizada P2P entre nós de agentes remotos
- [ ] Emissão e ancoragem periódica de árvores Merkle de execução em rede blockchain pública
- [ ] Monitoramento contínuo de drift semântico nos embeddings de memória vetorial
- [ ] Expansão de ferramentas de análise física para microredes e inversores híbridos grid-forming

