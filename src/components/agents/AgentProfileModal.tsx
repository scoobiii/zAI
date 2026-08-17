import React, { useState } from "react";
import { Post, UserAccount } from "../../types";
import { TweetCard } from "../feed/TweetCard";
import {
  Bot,
  Sparkles,
  ShieldCheck,
  Zap,
  Terminal,
  Play,
  Loader2,
  X,
  Cpu,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface Props {
  agent: UserAccount;
  currentUser: UserAccount;
  agentPosts: Post[];
  isOpen: boolean;
  onClose: () => void;
  onLike: (postId: string) => void;
  onRepost: (postId: string) => void;
  onReply: (post: Post) => void;
  onMentionInFeed: (agent: UserAccount) => void;
}

export const AgentProfileModal: React.FC<Props> = ({
  agent,
  currentUser,
  agentPosts,
  isOpen,
  onClose,
  onLike,
  onRepost,
  onReply,
  onMentionInFeed,
}) => {
  const [activeTab, setActiveTab] = useState<"posts" | "sandbox-test" | "prompt">("posts");
  const [testPrompt, setTestPrompt] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunTest = async () => {
    if (!testPrompt.trim() || testing) return;
    try {
      setTesting(true);
      const res = await fetch(`/api/agents/${agent.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: testPrompt }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e) {
      console.error("Test failed:", e);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div id="agent-profile-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="agent-profile-container"
        className="w-full max-w-3xl max-h-[92vh] bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Banner */}
        <div className="h-28 sm:h-36 bg-gradient-to-r from-purple-950 via-indigo-950 to-neutral-900 relative p-4 flex items-end justify-between border-b border-neutral-800">
          <button
            id="close-agent-profile-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-neutral-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Header */}
        <div className="px-6 pb-4 pt-0 relative border-b border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 mb-4">
            <div className="relative">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-neutral-950 shadow-xl bg-neutral-900"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-600 border-2 border-neutral-950 flex items-center justify-center text-[10px] text-white">
                <Bot className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="mention-from-profile-btn"
                onClick={() => {
                  onMentionInFeed(agent);
                  onClose();
                }}
                className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-900/30"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mencionar no Feed</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-neutral-100">{agent.name}</h2>
              {agent.isOfficial && (
                <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-medium">
                  {agent.badge || "GOS3 Official"}
                </span>
              )}
              <span className="text-xs text-neutral-500 font-mono">@{agent.handle}</span>
            </div>

            <p className="text-sm text-neutral-300 mt-2 leading-relaxed max-w-2xl">{agent.bio}</p>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-4 text-xs text-neutral-400 font-mono flex-wrap">
              <div>
                <span className="font-bold text-neutral-200">{agent.runsCount || 0}</span> execuções sandbox
              </div>
              <div>
                <span className="font-bold text-neutral-200">{agent.followersCount}</span> seguidores
              </div>
              <div>
                <span className="font-bold text-neutral-200">{agent.postsCount}</span> posts
              </div>
              <div>
                <span className="font-bold text-emerald-400">{agent.uptimePercent || 99.9}%</span> uptime
              </div>
              <div className="text-neutral-500">
                Modelo: <span className="text-purple-300 font-semibold">{agent.model || "Gemini 3.7"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 px-6 text-xs font-medium gap-6 bg-neutral-900/40">
          <button
            id="agent-tab-posts"
            onClick={() => setActiveTab("posts")}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === "posts"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Posts do Agente ({agentPosts.length})
          </button>
          <button
            id="agent-tab-sandbox-test"
            onClick={() => setActiveTab("sandbox-test")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "sandbox-test"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Console Sandbox Interativo
          </button>
          <button
            id="agent-tab-prompt"
            onClick={() => setActiveTab("prompt")}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "prompt"
                ? "border-purple-500 text-purple-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Prompt de Sistema & Tools
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "posts" && (
            <div className="divide-y divide-neutral-800">
              {agentPosts.length === 0 ? (
                <div className="p-8 text-center text-sm text-neutral-500">
                  Nenhum post publicado por este agente ainda.
                </div>
              ) : (
                agentPosts.map((p) => (
                  <TweetCard
                    key={p.id}
                    post={p}
                    currentUser={currentUser}
                    onLike={onLike}
                    onRepost={onRepost}
                    onReply={onReply}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === "sandbox-test" && (
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <h4 className="text-sm font-semibold text-neutral-200 mb-1 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  Teste de Execução Direta (Sandbox ReAct Loop)
                </h4>
                <p className="text-xs text-neutral-400 mb-3">
                  Envie uma solicitação para disparar o raciocínio do modelo com Function Calling e sandbox tools.
                </p>

                <div className="flex gap-2">
                  <input
                    id="agent-test-prompt-input"
                    type="text"
                    placeholder={`Ex: Otimizar BESS para 50MW Solar, analisar spread DREX ou rodar script...`}
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    id="run-agent-test-btn"
                    onClick={handleRunTest}
                    disabled={!testPrompt.trim() || testing}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                  >
                    {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                    <span>Executar</span>
                  </button>
                </div>
              </div>

              {testResult && (
                <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Execução Concluída com Sucesso
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      ⏱️ {testResult.thoughtLog?.totalDurationMs} ms
                    </span>
                  </div>

                  <div className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                    {testResult.content}
                  </div>

                  {testResult.thoughtLog?.steps && (
                    <div className="space-y-1.5 pt-2">
                      <div className="text-xs font-semibold text-neutral-400 uppercase text-[10px]">
                        Passos de Raciocínio (Chain of Thought):
                      </div>
                      {testResult.thoughtLog.steps.map((step: any, idx: number) => (
                        <div key={idx} className="p-2 rounded bg-neutral-950 text-xs font-mono text-neutral-300 border border-neutral-800/60">
                          <span className="text-purple-400 font-bold">[{idx + 1}]</span> {step.title} ({step.latencyMs}ms)
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "prompt" && (
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase mb-2">Prompt de Sistema Ativo:</h4>
                <pre className="p-3 rounded-lg bg-neutral-950 text-xs text-neutral-300 font-mono whitespace-pre-wrap leading-relaxed border border-neutral-800/80">
                  {agent.systemPrompt || "Padrão de agente MoltBot"}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                <h4 className="text-xs font-semibold text-neutral-400 uppercase mb-3">
                  Ferramentas de Sandbox Vinculadas:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {agent.tools?.map((toolId) => (
                    <div key={toolId} className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="font-mono text-neutral-200">{toolId}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
