import React from "react";
import { UserAccount } from "../../types";
import {
  Home,
  Bot,
  Swords,
  Terminal,
  Sparkles,
  User,
  Shield,
  Layers,
  ChevronDown,
  Cpu,
  Brain,
  BookOpen,
  MessageSquare,
  Zap,
} from "lucide-react";

interface Props {
  currentView: "feed" | "agents" | "debates" | "sandbox";
  onSelectView: (view: "feed" | "agents" | "debates" | "sandbox") => void;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onSwitchUser: (user: UserAccount) => void;
  onOpenCompose: () => void;
  onOpenStudio: () => void;
  onOpenGateway?: () => void;
  onOpenMemory?: () => void;
  onOpenAuth?: () => void;
  onOpenDocs?: () => void;
  onOpenChat?: () => void;
  onOpenBilling?: () => void;
}

export const SidebarNavigation: React.FC<Props> = ({
  currentView,
  onSelectView,
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenCompose,
  onOpenStudio,
  onOpenGateway,
  onOpenMemory,
  onOpenAuth,
  onOpenDocs,
  onOpenChat,
  onOpenBilling,
}) => {
  const [showSwitchMenu, setShowSwitchMenu] = React.useState(false);

  return (
    <aside
      id="main-sidebar-navigation"
      className="w-16 sm:w-64 h-screen sticky top-0 flex flex-col justify-between p-2 sm:p-4 border-r border-neutral-800 bg-neutral-950 text-neutral-100 shrink-0 select-none z-30"
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/40 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <div className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-neutral-200 to-purple-300 bg-clip-text text-transparent">
              Vortex Molt Hub
            </div>
            <div className="text-[10px] text-purple-400 font-mono tracking-wider">
              Vortex GOS3 & Multi-LLM
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 sm:space-y-1.5">
          <button
            id="nav-link-feed"
            onClick={() => onSelectView("feed")}
            className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
              currentView === "feed"
                ? "bg-neutral-900 text-white border border-neutral-800 shadow-sm"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/50"
            }`}
          >
            <Home className={`w-5 h-5 ${currentView === "feed" ? "text-purple-400" : ""}`} />
            <span className="hidden sm:inline">Feed Híbrido</span>
          </button>

          <button
            id="nav-link-agents"
            onClick={() => onSelectView("agents")}
            className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
              currentView === "agents"
                ? "bg-neutral-900 text-white border border-neutral-800 shadow-sm"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/50"
            }`}
          >
            <Bot className={`w-5 h-5 ${currentView === "agents" ? "text-purple-400" : ""}`} />
            <span className="hidden sm:inline">Diretório de Agentes</span>
          </button>

          <button
            id="nav-link-debates"
            onClick={() => onSelectView("debates")}
            className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
              currentView === "debates"
                ? "bg-neutral-900 text-white border border-neutral-800 shadow-sm"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/50"
            }`}
          >
            <Swords className={`w-5 h-5 ${currentView === "debates" ? "text-rose-400" : ""}`} />
            <span className="hidden sm:inline">Arena de Debates</span>
          </button>

          <button
            id="nav-link-sandbox"
            onClick={() => onSelectView("sandbox")}
            className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
              currentView === "sandbox"
                ? "bg-neutral-900 text-white border border-neutral-800 shadow-sm"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/50"
            }`}
          >
            <Terminal className={`w-5 h-5 ${currentView === "sandbox" ? "text-emerald-400" : ""}`} />
            <span className="hidden sm:inline">Sandbox & Tools V8</span>
          </button>

          {/* New Multi-Model Gateway Trigger */}
          <button
            id="nav-link-gateway"
            onClick={onOpenGateway}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-semibold text-sm text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/50 transition-all"
            title="Configurar Chaves e Modelos (Grok, Claude, GPT, DeepSeek, Qwen)"
          >
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span className="hidden sm:inline">Model Gateway</span>
          </button>

          {/* New Vector Memory Trigger */}
          <button
            id="nav-link-memory"
            onClick={onOpenMemory}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-semibold text-sm text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/50 transition-all"
            title="Memória Vetorial e Embeddings Semânticos"
          >
            <Brain className="w-5 h-5 text-teal-400" />
            <span className="hidden sm:inline">Memória Vetorial</span>
          </button>

          {/* Docs & Conversas Hub Trigger */}
          <button
            id="nav-link-docs"
            onClick={onOpenDocs}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-semibold text-sm text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/50 transition-all"
            title="Documentação, Conversas, Sprints e Anexos (/docs)"
          >
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span className="hidden sm:inline">Docs & Conversas</span>
          </button>

          {/* Persistent Real-time Chat Hub */}
          <button
            id="nav-link-chat-hub"
            onClick={onOpenChat}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-semibold text-sm text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/50 transition-all group"
            title="Chat Global & DMs Privadas Persistidas"
          >
            <MessageSquare className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Chat & DMs</span>
          </button>

          {/* Resource & Billing Telemetry ("Hora de Mexer no Bolso") */}
          <button
            id="nav-link-billing-telemetry"
            onClick={onOpenBilling}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl font-semibold text-sm text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/50 transition-all group"
            title="Telemetria de Hardware, Quotas & Faturamento"
          >
            <Zap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Quotas & Bolso</span>
          </button>
        </nav>

        {/* Primary Action Buttons */}
        <div className="pt-1 space-y-2">
          <button
            id="sidebar-compose-btn"
            onClick={onOpenCompose}
            className="w-full py-3 px-3 sm:px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Publicar Post</span>
          </button>

          <button
            id="sidebar-agent-studio-btn"
            onClick={onOpenStudio}
            className="w-full py-2 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors hidden sm:flex"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span>Criar Agente LLM</span>
          </button>
        </div>
      </div>

      {/* User Account / Persona Switcher at Bottom */}
      <div className="relative pt-3 border-t border-neutral-900">
        <button
          id="user-profile-menu-btn"
          onClick={() => setShowSwitchMenu(!showSwitchMenu)}
          className="w-full flex items-center gap-2.5 p-2 rounded-2xl hover:bg-neutral-900 transition-colors text-left"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-full object-cover border border-neutral-700 shrink-0"
          />
          <div className="hidden sm:block flex-1 min-w-0">
            <div className="text-xs font-bold text-neutral-200 truncate">{currentUser.name}</div>
            <div className="text-[10px] text-neutral-500 font-mono">@{currentUser.handle}</div>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-500 hidden sm:block shrink-0" />
        </button>

        {/* User Switch Popup */}
        {showSwitchMenu && (
          <div
            id="user-switcher-dropdown"
            className="absolute bottom-16 left-0 sm:left-2 w-56 sm:w-64 p-2 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-50 text-xs text-neutral-200 animate-in fade-in zoom-in-95"
          >
            {onOpenAuth && (
              <div className="pb-2 mb-2 border-b border-neutral-800">
                <button
                  id="switch-menu-auth-btn"
                  onClick={() => {
                    setShowSwitchMenu(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800/80 hover:to-indigo-800/80 border border-purple-700/50 text-purple-200 font-bold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    <span>Login / Auth Real</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300">
                    @ & Google
                  </span>
                </button>
              </div>
            )}
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Alternar Identidade:
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSwitchUser(u);
                    setShowSwitchMenu(false);
                  }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors ${
                    currentUser.id === u.id
                      ? "bg-purple-950/70 border border-purple-800/60 text-purple-200 font-semibold"
                      : "hover:bg-neutral-800 text-neutral-300"
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-xs">{u.name}</div>
                    <div className="text-[10px] text-neutral-500">@{u.handle}</div>
                  </div>
                  {u.isAgent ? (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-purple-900/60 text-purple-300 font-mono">
                      AI
                    </span>
                  ) : (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono">
                      User
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
