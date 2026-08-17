import React, { useState } from "react";
import { DebateSession, Post, UserAccount } from "../../types";
import {
  Swords,
  Bot,
  Play,
  Loader2,
  Sparkles,
  X,
  MessageSquare,
  CheckCircle,
  Plus,
  RefreshCw,
} from "lucide-react";

interface Props {
  agents: UserAccount[];
  debates: DebateSession[];
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: Post) => void;
}

const PRESET_TOPICS = [
  "Transição Energética: Baterias BESS e Despacho Algorítmico vs Operadores Convencionais",
  "DREX e Tokenização RWA: Como a liquidação instantânea T+0 transforma o mercado livre de energia",
  "Autonomia de Agentes de IA: Limites éticos da tomada de decisão em infraestrutura crítica",
  "Otimização de LCOE Solar: Painéis TOPCon vs HJT em climas de alta irradiação",
];

export const DebateArenaModal: React.FC<Props> = ({
  agents,
  debates,
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [selectedDebate, setSelectedDebate] = useState<DebateSession | null>(
    debates[0] || null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([
    agents[0]?.id || "",
    agents[1]?.id || "",
  ]);
  const [rounds, setRounds] = useState(3);
  const [isAdvancing, setIsAdvancing] = useState(false);

  if (!isOpen) return null;

  const handleCreateDebate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim() || selectedAgentIds.length < 2) return;

    try {
      const res = await fetch("/api/debates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: customTopic.trim(),
          participantIds: selectedAgentIds,
          rounds,
        }),
      });

      if (res.ok) {
        const newDebate = await res.json();
        setSelectedDebate(newDebate);
        setIsCreating(false);
      }
    } catch (e) {
      console.error("Failed to create debate:", e);
    }
  };

  const handleAdvanceStep = async () => {
    if (!selectedDebate || isAdvancing) return;

    try {
      setIsAdvancing(true);
      const res = await fetch(`/api/debates/${selectedDebate.id}/step`, {
        method: "POST",
      });

      if (res.ok) {
        const { debate: updatedDebate, post } = await res.json();
        setSelectedDebate(updatedDebate);
        onPostCreated(post);
      }
    } catch (e) {
      console.error("Failed to step debate:", e);
    } finally {
      setIsAdvancing(false);
    }
  };

  const toggleAgent = (agentId: string) => {
    if (selectedAgentIds.includes(agentId)) {
      if (selectedAgentIds.length > 2) {
        setSelectedAgentIds(selectedAgentIds.filter((id) => id !== agentId));
      }
    } else {
      setSelectedAgentIds([...selectedAgentIds, agentId]);
    }
  };

  return (
    <div id="debate-arena-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="debate-arena-container"
        className="w-full max-w-3xl max-h-[92vh] bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-neutral-100 flex items-center gap-2">
                Arena de Debates Autônomos
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/50 text-red-300 border border-red-800/40">
                  Multi-Agent Live
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Coloque múltiplos agentes para debater tópicos, contra-argumentar e publicar dados no feed.
              </p>
            </div>
          </div>
          <button
            id="close-debate-arena-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isCreating ? (
            <form onSubmit={handleCreateDebate} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-200">Novo Tópico de Debate</h3>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-neutral-400 hover:text-neutral-200"
                >
                  Voltar
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Tópico do Debate</label>
                <input
                  id="debate-topic-input"
                  type="text"
                  required
                  placeholder="Ex: Soberania da Rede: BESS vs Geração Distribuída..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-red-500"
                />

                {/* Preset suggestions */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PRESET_TOPICS.map((pt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCustomTopic(pt)}
                      className="text-[10px] px-2 py-1 rounded bg-neutral-900 border border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 text-left"
                    >
                      {pt.slice(0, 50)}...
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  Selecione Agentes Participantes (mínimo 2)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {agents.map((ag) => {
                    const isSelected = selectedAgentIds.includes(ag.id);
                    return (
                      <div
                        key={ag.id}
                        onClick={() => toggleAgent(ag.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-red-950/40 border-red-800/80 text-neutral-100"
                            : "bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={ag.avatar} alt={ag.name} className="w-7 h-7 rounded-lg object-cover" />
                          <div>
                            <div className="text-xs font-semibold text-neutral-200">{ag.name}</div>
                            <div className="text-[10px] text-neutral-500 font-mono">@{ag.handle}</div>
                          </div>
                        </div>
                        {isSelected && <CheckCircle className="w-4 h-4 text-red-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-xs text-neutral-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="submit-create-debate-btn"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold"
                >
                  Iniciar Sessão de Debate
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Debate Session Overview */}
              {selectedDebate && (
                <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/50">
                        Status: {selectedDebate.status === "completed" ? "Concluído" : "Ativo"} (Round {selectedDebate.currentRound + 1}/{selectedDebate.rounds * selectedDebate.participants.length})
                      </span>
                      <h3 className="text-base font-bold text-neutral-100 mt-2 leading-snug">
                        {selectedDebate.topic}
                      </h3>
                    </div>

                    <button
                      id="new-debate-btn"
                      onClick={() => setIsCreating(true)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Novo Tópico</span>
                    </button>
                  </div>

                  {/* Participants Row */}
                  <div>
                    <div className="text-xs font-semibold text-neutral-400 mb-2">Agentes no Debate:</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedDebate.participants.map((ag, i) => (
                        <div
                          key={ag.id || i}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs"
                        >
                          <img src={ag.avatar} alt={ag.name} className="w-5 h-5 rounded-full object-cover" />
                          <span className="font-semibold text-neutral-200">{ag.name}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">@{ag.handle}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advance Step Action Button */}
                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-neutral-400">
                      {selectedDebate.postIds.length} posts gerados na thread social.
                    </span>

                    <button
                      id="advance-debate-round-btn"
                      onClick={handleAdvanceStep}
                      disabled={isAdvancing || selectedDebate.status === "completed"}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-red-900/30"
                    >
                      {isAdvancing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Agente Raciocinando e Argumentando...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Disparar Próximo Turno de Debate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
