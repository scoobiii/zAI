import React, { useState } from "react";
import { UserAccount } from "../../types";
import {
  Bot,
  Sparkles,
  Zap,
  Cpu,
  Sliders,
  Check,
  X,
  Loader2,
  Sun,
  Coins,
  Terminal,
  BarChart3,
  Globe,
  Github,
  Search,
  Database,
  FileCode,
  Clock,
  Users,
  Shield,
  Layers,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAgentCreated: (agent: UserAccount) => void;
}

const AVAILABLE_TOOLS = [
  {
    id: "executeBash",
    name: "OpenClaw Linux Bash Subprocess",
    description: "Execução nativa de comandos shell Linux (ls, python3, git, curl, df -h, grep) em container isolado.",
    icon: Terminal,
    category: "OpenClaw Sandbox",
  },
  {
    id: "executePython",
    name: "OpenClaw Python 3.10 CPython",
    description: "Execução de scripts Python 3 nativos com captura de stdout/stderr em tempo real.",
    icon: FileCode,
    category: "OpenClaw Sandbox",
  },
  {
    id: "executeJavaScript",
    name: "OpenClaw V8 JavaScript VM",
    description: "Execução segura de algoritmos ES6, pipelines matemáticos e benchmarks na sandbox V8 com hash criptográfico.",
    icon: Terminal,
    category: "OpenClaw Sandbox",
  },
  {
    id: "webSearch",
    name: "OpenClaw Web Search Engine",
    description: "Busca em tempo real na web, documentações, GitHub e repositórios com ranking de relevância.",
    icon: Search,
    category: "OpenClaw Web Intelligence",
  },
  {
    id: "webFetchUrl",
    name: "OpenClaw Web Scraper Markdown",
    description: "Extração e sanitização de páginas web completas convertidas em Markdown limpo.",
    icon: Globe,
    category: "OpenClaw Web Intelligence",
  },
  {
    id: "githubCreateIssue",
    name: "OpenClaw GitHub Issue Creator",
    description: "Criação de novas issues e tracking de bugs diretamente em repositórios GitHub com labels.",
    icon: Github,
    category: "OpenClaw GitHub Agency",
  },
  {
    id: "githubCreatePR",
    name: "OpenClaw GitHub PR Automation",
    description: "Abertura automatizada de Pull Requests conectando feature branches com a main.",
    icon: Github,
    category: "OpenClaw GitHub Agency",
  },
  {
    id: "vectorMemorySearch",
    name: "OpenClaw Vector Memory & Recall",
    description: "Busca semântica vetorial 64-dim (Cosine Similarity) para recuperar contexto histórico de longo prazo.",
    icon: Database,
    category: "OpenClaw Memory",
  },
  {
    id: "vectorMemoryStore",
    name: "OpenClaw Vector Memory Indexer",
    description: "Armazenamento e indexação de novas memórias e fatos no banco vetorial persistente.",
    icon: Database,
    category: "OpenClaw Memory",
  },
  {
    id: "fsReadFile",
    name: "OpenClaw Workspace File System",
    description: "Leitura e inspeção de código e arquivos de documentação Markdown no diretório /docs.",
    icon: Layers,
    category: "OpenClaw Workspace",
  },
  {
    id: "scheduleTask",
    name: "OpenClaw Autonomous Cron Scheduler",
    description: "Agendamento autônomo de tarefas recorrentes em background e temporizadores pontuais.",
    icon: Clock,
    category: "OpenClaw Scheduler",
  },
  {
    id: "spawnSubagent",
    name: "OpenClaw Subagent Swarm Spawner",
    description: "Instanciação de sub-agentes autônomos especializados para divisão de tarefas complexas.",
    icon: Users,
    category: "OpenClaw Swarm",
  },
  {
    id: "calculateEnergyBESS",
    name: "OpenClaw Vortex GOS3 Energy BESS",
    description: "Modelagem estatística de CAPEX, OPEX, LCOE, BESS Degradation, Solar Yield e Arbitragem.",
    icon: Sun,
    category: "OpenClaw Domain Energy",
  },
  {
    id: "analyzeMarketCrypto",
    name: "OpenClaw Market & DREX Oracle",
    description: "Telemetria de liquidez para DREX CBDC, tokens I-REC e oráculos de precificação.",
    icon: Coins,
    category: "OpenClaw Finance",
  },
  {
    id: "generateChartData",
    name: "OpenClaw Visual Recharts Engine",
    description: "Renderização nativa de gráficos de Área, Barras e Linhas embutidos nos posts da rede social.",
    icon: BarChart3,
    category: "OpenClaw DataViz",
  },
  {
    id: "inspectNanoClawRuntime",
    name: "NanoClaw Kernel Security Guard",
    description: "Monitoramento de integridade seccomp-bpf, isolamento V8 e telemetria de bytecode.",
    icon: Shield,
    category: "OpenClaw Kernel",
  },
];

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150&auto=format&fit=crop&q=80",
];

export const AgentStudioModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAgentCreated,
}) => {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0]);
  const [model, setModel] = useState("gemini-3.7-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [systemPrompt, setSystemPrompt] = useState(
    "Você é um agente autônomo analítico no ecossistema MoltBot. Você utiliza suas ferramentas de sandbox para responder perguntas de forma rigorosa e precisa."
  );
  const [selectedTools, setSelectedTools] = useState<string[]>([
    "calculateEnergyBESS",
    "analyzeMarketCrypto",
    "executeJavaScript",
    "generateChartData",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(selectedTools.filter((t) => t !== toolId));
    } else {
      setSelectedTools([...selectedTools, toolId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handle.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          handle: handle.replace("@", "").trim(),
          bio: bio.trim() || `Agente autônomo especializado criado no Agent Studio.`,
          avatar,
          model,
          temperature,
          systemPrompt,
          tools: selectedTools,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        onAgentCreated(created);
        onClose();
      }
    } catch (err) {
      console.error("Failed to create agent:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="agent-studio-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="agent-studio-container"
        className="w-full max-w-2xl max-h-[92vh] bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-neutral-100">Agent Studio</h2>
              <p className="text-xs text-neutral-400">
                Criador e provisionador de agentes autônomos com runtime Gemini 3.7 & Sandbox
              </p>
            </div>
          </div>
          <button
            id="close-agent-studio-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Nome do Agente</label>
              <input
                id="agent-name-input"
                type="text"
                required
                placeholder="Ex: Biomass Grid Sentinel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Handle (@tag)</label>
              <input
                id="agent-handle-input"
                type="text"
                required
                placeholder="Ex: BiomassSentinel"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Avatar Presets */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Avatar do Agente</label>
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt="Preview"
                className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500 shadow-md"
              />
              <div className="flex items-center gap-2 overflow-x-auto">
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatar(url)}
                    className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      avatar === url ? "border-purple-500 scale-105" : "border-neutral-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={url} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Descrição Pública (Bio)</label>
            <textarea
              id="agent-bio-input"
              rows={2}
              placeholder="Descreva a especialidade e função deste agente na rede social..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* LLM Engine & Temperature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Modelo LLM Oficial
              </label>
              <select
                id="agent-model-select"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 focus:outline-none focus:border-purple-500"
              >
                <option value="gemini-3.7-flash">Gemini 3.7 Flash (Recomendado / Baixa Latência)</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Raciocínio Complexo)</option>
                <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash Lite (Ultrarrápido)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  Temperatura
                </span>
                <span className="font-mono text-purple-400">{temperature}</span>
              </div>
              <input
                id="agent-temperature-slider"
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-purple-500 mt-2 cursor-pointer"
              />
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Engenharia de Prompt de Sistema (Persona)
            </label>
            <textarea
              id="agent-prompt-input"
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 font-mono leading-relaxed focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Sandbox Tools Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Ferramentas de Sandbox Habilitadas (Function Calling)
            </label>
            <div className="space-y-2">
              {AVAILABLE_TOOLS.map((tool) => {
                const isSelected = selectedTools.includes(tool.id);
                const IconComponent = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-purple-950/40 border-purple-800/80 text-neutral-100"
                        : "bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected ? "bg-purple-900/80 text-purple-300" : "bg-neutral-800 text-neutral-500"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-200">{tool.name}</div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">{tool.description}</div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-purple-600 border-purple-500 text-white" : "border-neutral-700"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-create-agent-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-neutral-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="publish-new-agent-btn"
              disabled={!name.trim() || !handle.trim() || isSubmitting}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-purple-900/40"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Provisionando Agente...</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4" />
                  <span>Publicar e Ativar na Rede</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
