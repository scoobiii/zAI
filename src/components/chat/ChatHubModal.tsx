import React, { useState, useEffect, useRef } from "react";
import { UserAccount, ChatMessage, ChatConversation, SystemHardwareTelemetry, UserQuotaUsage } from "../../types";
import {
  MessageSquare,
  Lock,
  Globe,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldCheck,
  Zap,
  Terminal,
  Server,
  Layers,
  Database,
  Cpu,
  RefreshCw,
  X,
  ChevronRight,
  HardDrive,
  Users,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onOpenBilling?: () => void;
}

export const ChatHubModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onOpenBilling,
}) => {
  const [activeTab, setActiveTab] = useState<"global" | "private" | "architecture">("global");
  
  // Global Chat State
  const [globalMessages, setGlobalMessages] = useState<ChatMessage[]>([]);
  const [globalInput, setGlobalInput] = useState("");
  const [isSendingGlobal, setIsSendingGlobal] = useState(false);
  
  // Private DM State
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<UserAccount | null>(null);
  const [privateMessages, setPrivateMessages] = useState<ChatMessage[]>([]);
  const [privateInput, setPrivateInput] = useState("");
  const [isSendingPrivate, setIsSendingPrivate] = useState(false);
  
  // Telemetry & Hardware
  const [telemetry, setTelemetry] = useState<SystemHardwareTelemetry | null>(null);
  const [quota, setQuota] = useState<UserQuotaUsage | null>(null);
  
  // Scale Architecture Simulator State
  const [simUsersScale, setSimUsersScale] = useState<1000 | 10000000>(1000);

  const globalEndRef = useRef<HTMLDivElement>(null);
  const privateEndRef = useRef<HTMLDivElement>(null);

  // Fetch Global Messages
  const fetchGlobal = async () => {
    try {
      const res = await fetch("/api/chat/global");
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setGlobalMessages(data.messages);
      }
    } catch (e) {
      console.error("Erro ao carregar chat global", e);
    }
  };

  // Fetch Conversations & Private Messages
  const fetchConversations = async () => {
    try {
      const res = await fetch(`/api/chat/conversations?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
        if (!selectedRecipient && data.conversations.length > 0) {
          const other = data.conversations[0].participants.find((p: UserAccount) => p.id !== currentUser.id);
          if (other) setSelectedRecipient(other);
        }
      }
    } catch (e) {
      console.error("Erro ao carregar conversas privadas", e);
    }
  };

  const fetchPrivateMessages = async (recipientId: string) => {
    try {
      const res = await fetch(`/api/chat/private?userA=${currentUser.id}&userB=${recipientId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        setPrivateMessages(data.messages);
      }
    } catch (e) {
      console.error("Erro ao carregar mensagens privadas", e);
    }
  };

  // Fetch Telemetry & Quota
  const fetchTelemetryAndQuota = async () => {
    try {
      const [resTel, resQ] = await Promise.all([
        fetch("/api/telemetry/hardware"),
        fetch(`/api/telemetry/quota?userId=${currentUser.id}`),
      ]);
      const dataTel = await resTel.json();
      const dataQ = await resQ.json();
      if (dataTel.success) setTelemetry(dataTel.telemetry);
      if (dataQ.success) setQuota(dataQ.quota);
    } catch (e) {
      console.error("Erro ao carregar telemetria", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchGlobal();
      fetchConversations();
      fetchTelemetryAndQuota();
      const interval = setInterval(() => {
        if (activeTab === "global") fetchGlobal();
        if (activeTab === "private" && selectedRecipient) fetchPrivateMessages(selectedRecipient.id);
        fetchTelemetryAndQuota();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen, activeTab, selectedRecipient]);

  useEffect(() => {
    if (selectedRecipient) {
      fetchPrivateMessages(selectedRecipient.id);
    }
  }, [selectedRecipient]);

  useEffect(() => {
    globalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [globalMessages]);

  useEffect(() => {
    privateEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [privateMessages]);

  const handleSendGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalInput.trim() || isSendingGlobal) return;
    setIsSendingGlobal(true);
    try {
      const res = await fetch("/api/chat/global", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          content: globalInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setGlobalMessages(prev => [...prev, data.message]);
        setGlobalInput("");
      }
    } catch (e) {
      console.error("Erro ao enviar mensagem global", e);
    } finally {
      setIsSendingGlobal(false);
    }
  };

  const handleSendPrivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateInput.trim() || !selectedRecipient || isSendingPrivate) return;
    setIsSendingPrivate(true);
    try {
      const res = await fetch("/api/chat/private", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: selectedRecipient.id,
          content: privateInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setPrivateMessages(prev => [...prev, data.message]);
        setPrivateInput("");
        fetchConversations();
      }
    } catch (e) {
      console.error("Erro ao enviar DM", e);
    } finally {
      setIsSendingPrivate(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="chat-hub-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md"
    >
      <div
        id="chat-hub-modal-container"
        className="w-full max-w-5xl h-[92vh] max-h-[850px] bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-100 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Top Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
                <span>Vortex Chat & Scalable Persistence</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40 font-mono">
                  Real-Time Engine
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Persistência de canal global, DMs privadas seguras e telemetria de 1k a 10M de usuários.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenBilling && (
              <button
                id="chat-hub-open-billing-btn"
                onClick={onOpenBilling}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-700/50 text-purple-200 text-xs font-semibold transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Quotas & Bolso</span>
              </button>
            )}
            <button
              id="close-chat-hub-btn"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Live Resource Bar */}
        {telemetry && (
          <div className="px-4 py-2 bg-neutral-900/40 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-neutral-400 shrink-0">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hardware Free:</span>
              </span>
              <span className="text-sky-300">
                CPU: <strong className="text-neutral-100">{telemetry.cpuUsagePercent}%</strong>
              </span>
              <span className="text-purple-300">
                RAM: <strong className="text-neutral-100">{telemetry.ramUsedMB}MB / {telemetry.ramTotalMB}MB</strong>
              </span>
              <span className="text-teal-300">
                V8 Heap: <strong className="text-neutral-100">{telemetry.v8HeapUsedMB}MB</strong>
              </span>
              <span className="text-amber-300">
                Storage: <strong className="text-neutral-100">{telemetry.storageUsedMB}MB</strong>
              </span>
            </div>

            {quota && (
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Plano:</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                  quota.tier === "enterprise"
                    ? "bg-purple-950 text-purple-300 border border-purple-800"
                    : quota.tier === "pro"
                    ? "bg-indigo-950 text-indigo-300 border border-indigo-800"
                    : "bg-neutral-800 text-neutral-300"
                }`}>
                  {quota.tier}
                </span>
                <span className="text-neutral-500">
                  Quota: <span className={quota.warningThresholdReached ? "text-amber-400 font-bold" : "text-emerald-400"}>{quota.llmTokensPercent}%</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 text-xs font-bold shrink-0">
          <button
            id="tab-chat-global"
            onClick={() => setActiveTab("global")}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors border-b-2 ${
              activeTab === "global"
                ? "border-purple-500 text-purple-400 bg-purple-950/20"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Chat Global Persistido</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300 font-mono">
              {globalMessages.length} msgs
            </span>
          </button>

          <button
            id="tab-chat-private"
            onClick={() => setActiveTab("private")}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors border-b-2 ${
              activeTab === "private"
                ? "border-purple-500 text-purple-400 bg-purple-950/20"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>DMs Privadas (1-on-1 com Bots/Devs)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300 font-mono">
              {conversations.length}
            </span>
          </button>

          <button
            id="tab-chat-architecture"
            onClick={() => setActiveTab("architecture")}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-colors border-b-2 ${
              activeTab === "architecture"
                ? "border-purple-500 text-purple-400 bg-purple-950/20"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Estimativa de Escala (1k a 10MM)</span>
          </button>
        </div>

        {/* Tab Content 1: GLOBAL CHAT */}
        {activeTab === "global" && (
          <div className="flex-1 flex flex-col min-h-0 bg-neutral-950">
            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
              {globalMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 text-xs py-10">
                  <Globe className="w-10 h-10 mb-2 opacity-30 text-purple-400" />
                  <p className="font-semibold text-neutral-400">Nenhuma mensagem ainda no chat global.</p>
                  <p className="text-[11px]">Seja o primeiro a enviar uma mensagem para humanos e agentes!</p>
                </div>
              ) : (
                globalMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-2xl border transition-all text-xs ${
                      msg.senderId === currentUser.id
                        ? "bg-purple-950/30 border-purple-800/40 ml-4 sm:ml-12"
                        : msg.isAgentGenerated
                        ? "bg-neutral-900/60 border-neutral-800 mr-4 sm:mr-12"
                        : "bg-neutral-900/40 border-neutral-800/80 mr-4 sm:mr-12"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={msg.sender.avatar}
                          alt={msg.sender.name}
                          className="w-5 h-5 rounded-full object-cover border border-neutral-700"
                        />
                        <span className="font-bold text-neutral-200">{msg.sender.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">@{msg.sender.handle}</span>
                        {msg.sender.isAgent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-300 font-mono">
                            BOT
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>

                    {/* Thought log badge if generated by Agent */}
                    {msg.thoughtLog && (
                      <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                        <span className="flex items-center gap-1 text-purple-400">
                          <Sparkles className="w-3 h-3" />
                          <span>{msg.thoughtLog.model} ({msg.thoughtLog.steps?.length || 1} steps)</span>
                        </span>
                        <span className="text-neutral-500">{msg.thoughtLog.evidenceHash?.slice(0, 14)}...</span>
                      </div>
                    )}

                    {/* Code execution artifact if present */}
                    {msg.codeArtifact && (
                      <div className="mt-2 p-2 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-neutral-400 text-[10px]">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Terminal className="w-3 h-3" />
                            <span>{msg.codeArtifact.executedByTool || "Sandbox VM"}</span>
                          </span>
                          <span>{msg.codeArtifact.executionTimeMs || 1}ms</span>
                        </div>
                        <pre className="text-emerald-300/90 overflow-x-auto p-1 text-[10px] bg-black/40 rounded">
                          {msg.codeArtifact.code}
                        </pre>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={globalEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendGlobal}
              className="p-3 border-t border-neutral-800 bg-neutral-900/60 flex items-center gap-2 shrink-0"
            >
              <input
                id="chat-global-input"
                type="text"
                value={globalInput}
                onChange={(e) => setGlobalInput(e.target.value)}
                placeholder="Escreva no canal global (mencione @StackOverflow, @OpenClaw, @ClaudeOpus)..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-xs text-neutral-100 placeholder-neutral-500"
              />
              <button
                id="chat-global-send-btn"
                type="submit"
                disabled={!globalInput.trim() || isSendingGlobal}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab Content 2: PRIVATE DIRECT MESSAGES */}
        {activeTab === "private" && (
          <div className="flex-1 flex min-h-0 bg-neutral-950">
            {/* Conversation List Sidebar */}
            <div className="w-48 sm:w-64 border-r border-neutral-800 bg-neutral-900/40 flex flex-col shrink-0">
              <div className="p-3 border-b border-neutral-800 text-xs font-bold text-neutral-300 flex items-center justify-between">
                <span>DMs & Bots</span>
                <span className="text-[10px] text-purple-400 font-mono">1-on-1</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {allUsers
                  .filter((u) => u.id !== currentUser.id)
                  .map((u) => {
                    const isSelected = selectedRecipient?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        id={`dm-user-select-${u.handle}`}
                        onClick={() => setSelectedRecipient(u)}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors text-xs ${
                          isSelected
                            ? "bg-purple-950/70 border border-purple-700/50 text-purple-200 font-semibold"
                            : "hover:bg-neutral-800/60 text-neutral-300"
                        }`}
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover border border-neutral-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-xs font-bold">{u.name}</div>
                          <div className="text-[10px] text-neutral-500 truncate">@{u.handle}</div>
                        </div>
                        {u.isAgent ? (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-purple-900/60 text-purple-300 font-mono shrink-0">
                            AI
                          </span>
                        ) : (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-900/60 text-emerald-300 font-mono shrink-0">
                            User
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Conversation Active Window */}
            <div className="flex-1 flex flex-col min-h-0 bg-neutral-950">
              {selectedRecipient ? (
                <>
                  {/* DM Header */}
                  <div className="p-3 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={selectedRecipient.avatar}
                        alt={selectedRecipient.name}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                      />
                      <div>
                        <div className="font-bold text-xs text-neutral-100 flex items-center gap-1.5">
                          <span>{selectedRecipient.name}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">@{selectedRecipient.handle}</span>
                        </div>
                        <div className="text-[10px] text-purple-400 font-mono">
                          {selectedRecipient.isAgent ? `Modelo: ${selectedRecipient.model || "Gemini 3.7 Flash"}` : "Desenvolvedor Verificado"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Canal Privado Criptografado</span>
                    </div>
                  </div>

                  {/* Private Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                    {privateMessages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 text-xs py-10">
                        <Lock className="w-8 h-8 mb-2 opacity-30 text-purple-400" />
                        <p className="font-semibold text-neutral-400">Inicie uma conversa privada com @{selectedRecipient.handle}</p>
                        <p className="text-[11px]">As mensagens são persistidas e respondidas em tempo real pelo agente.</p>
                      </div>
                    ) : (
                      privateMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-2xl border transition-all text-xs ${
                            msg.senderId === currentUser.id
                              ? "bg-purple-950/40 border-purple-800/50 ml-6 sm:ml-16"
                              : "bg-neutral-900/60 border-neutral-800 mr-6 sm:mr-16"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-neutral-200">{msg.sender.name}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        </div>
                      ))
                    )}
                    <div ref={privateEndRef} />
                  </div>

                  {/* DM Input Bar */}
                  <form
                    onSubmit={handleSendPrivate}
                    className="p-3 border-t border-neutral-800 bg-neutral-900/60 flex items-center gap-2 shrink-0"
                  >
                    <input
                      id="chat-dm-input"
                      type="text"
                      value={privateInput}
                      onChange={(e) => setPrivateInput(e.target.value)}
                      placeholder={`Mensagem privada para @${selectedRecipient.handle}...`}
                      className="flex-1 px-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 focus:border-purple-500 outline-none text-xs text-neutral-100 placeholder-neutral-500"
                    />
                    <button
                      id="chat-dm-send-btn"
                      type="submit"
                      disabled={!privateInput.trim() || isSendingPrivate}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar DM</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-neutral-500">
                  Selecione um contato ao lado para abrir a conversa.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content 3: SCALABLE ARCHITECTURE ESTIMATOR (1k vs 10MM Users) */}
        {activeTab === "architecture" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-neutral-950 text-xs">
            {/* Scale Selector */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div>
                <h3 className="font-bold text-sm text-neutral-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>Dimensionamento de Infraestrutura & Persistência</span>
                </h3>
                <p className="text-neutral-400 text-xs mt-0.5">
                  Cálculo de persistência para mensageria global, DMs, vetores semânticos e execuções no sandbox.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
                <button
                  id="scale-btn-1k"
                  onClick={() => setSimUsersScale(1000)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    simUsersScale === 1000
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  1.000 Usuários (Pequeno Porte)
                </button>
                <button
                  id="scale-btn-10m"
                  onClick={() => setSimUsersScale(10000000)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    simUsersScale === 10000000
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  10.000.000 Usuários (Escala Global)
                </button>
              </div>
            </div>

            {/* Architecture Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-sky-400" />
                    <span>Armazenamento (SSD/DB)</span>
                  </span>
                </div>
                <div className="text-xl font-extrabold text-neutral-100 font-mono">
                  {simUsersScale === 1000 ? "4.2 GB / mês" : "42.0 TB / mês"}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {simUsersScale === 1000 ? "~4KB por mensagem + metadados" : "Particionamento Sharded (Firestore / Spanner / S3)"}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-purple-400" />
                    <span>Memória RAM do Cluster</span>
                  </span>
                </div>
                <div className="text-xl font-extrabold text-neutral-100 font-mono">
                  {simUsersScale === 1000 ? "4 GB a 8 GB" : "128 GB (Redis Cluster)"}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {simUsersScale === 1000 ? "Suportado pelo container Free atual" : "Pub/Sub Distribuído + Cache de Presença"}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>CPU / Sandboxes VM</span>
                  </span>
                </div>
                <div className="text-xl font-extrabold text-neutral-100 font-mono">
                  {simUsersScale === 1000 ? "2 a 4 vCPUs" : "32 a 64 vCPUs Auto-scale"}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {simUsersScale === 1000 ? "Execução local V8 / gVisor" : "Containers efêmeros com fila assíncrona"}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Mensagens Diárias</span>
                  </span>
                </div>
                <div className="text-xl font-extrabold text-neutral-100 font-mono">
                  {simUsersScale === 1000 ? "25.000 msgs/dia" : "250.000.000 msgs/dia"}
                </div>
                <div className="text-[11px] text-neutral-500">
                  {simUsersScale === 1000 ? "Throughput: ~10 req/s" : "Throughput: ~15.000 req/s pico"}
                </div>
              </div>
            </div>

            {/* Detailed Storage Strategy Breakdown */}
            <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
              <h4 className="font-bold text-neutral-100 flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <span>Estratégia de Persistência Híbrida (Free vs. Produção Comercial)</span>
              </h4>

              <div className="space-y-3 text-neutral-300">
                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-neutral-200">Camada de Alta Frequência (Memória & Buffer)</div>
                    <p className="text-neutral-400 text-[11px]">
                      No modo Free atual, o Node.js v20 mantém as últimas 2.000 mensagens e telemetria na RAM do container. Em escala comercial, utiliza-se <strong>Redis / DragonflyDB</strong> para entrega sub-milissegundo de chats e digitação em tempo real.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-950 text-purple-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-neutral-200">Camada de Persistência Durável (Banco de Dados)</div>
                    <p className="text-neutral-400 text-[11px]">
                      Mensagens e threads são gravadas com assinatura criptográfica SHA-256 no banco estruturado (Firestore / Cloud SQL / PostgreSQL com pgvector), permitindo busca semântica em tempo real nas DMs e posts.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-sky-950 text-sky-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-neutral-200">Armazenamento Frio & Arquivos (DocsHub / S3)</div>
                    <p className="text-neutral-400 text-[11px]">
                      Logs de raciocínio extensos, gráficos Recharts e snippets de código acima de 30 dias são arquivados em Object Storage de baixo custo (S3 / GCS com custo &lt; $0.015/GB/mês).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
