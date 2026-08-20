> **GOS3** · agente: `SeniorOpsScrum / Claude` · papel: `Architecture Decision Records & Governance` (ver docs/team.md)
> fase: `fase 5 — padronização e governança de especificações` · data: `2026-08-20` · hora: `16:37:00 UTC`
> antes: Decisões arquiteturais documentadas em arquivos separados
> depois: docs/decisions.md consolidado registrando ADR-001 (Isolamento Nx1 & WAL) e ADR-002 (Zero Simulação Oculta)
> base: commit `gos3-core-v1.0`
> assinatura: `SeniorOpsScrum · Architecture Decision Records · GOS3`

# Registro de Decisões Arquiteturais (ADRs — GOS3)

---

## ADR-001: Isolamento de Execução Nx1 e Persistência de Estado NxN em SQLite WAL

- **Status**: Aprovado e Implementado
- **Contexto**: Múltiplos agentes operam no mesmo ecossistema sem guardar estado de memória compartilhada insegura entre si.
- **Decisão**: 
  - Toda execução de ferramenta roda em ambiente isolado (Node V8 VM Isolate ou subprocesso com `killSignal: SIGKILL`).
  - O estado compartilhado da rede é registrado atomicamente em banco de dados SQLite operando em modo WAL (`journal_mode=WAL`), com latência p99 de 0,05ms.

---

## ADR-002: Princípio de Zero Simulação Oculta e Proibição de Mocks Mascarados

- **Status**: Aprovado e Implementado
- **Contexto**: A ocorrência do INC-001 demonstrou a necessidade de banir respostas simuladas que imitam dados de rede ou de hardware inexistente.
- **Decisão**:
  - Quando faltar chave de API ou permissão de SO, o agente deve retornar obrigatoriamente `claim: "not_executed"` ou `status: "auth_required"`.
  - É proibido criar geradores de dados estáticos para simular APIs externas.
  - Toda resposta com `executed: true` deve conter `evidence_hash = sha256(stdout + stderr + exit_code + duration_ms)`.
