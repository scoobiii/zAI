import React, { useState } from "react";
import { UserAccount } from "../../types";
import { LogIn, User, Mail, ShieldCheck, Sparkles, X, CheckCircle, ArrowRight } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<"handle" | "google">("handle");
  const [handleInput, setHandleInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [googleEmailInput, setGoogleEmailInput] = useState("sobrinhoSJ@gmail.com");
  const [googleNameInput, setGoogleNameInput] = useState("Sobrinho SJ");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleHandleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = handleInput.replace("@", "").trim();
    if (!cleanHandle) {
      setErrorMsg("Por favor, digite seu @username (handle)");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: cleanHandle,
          name: nameInput.trim() || `@${cleanHandle}`,
          bio: bioInput.trim() || undefined,
          authProvider: "handle",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha na autenticação");

      setSuccessMsg(`Conectado com sucesso como @${data.user.handle}!`);
      onLoginSuccess(data.user);
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = googleEmailInput.trim();
    if (!email || !email.includes("@")) {
      setErrorMsg("E-mail Google inválido");
      return;
    }

    // Extract handle candidate from email (e.g. sobrinhoSJ from sobrinhoSJ@gmail.com)
    const handleDerived = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");

    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: handleDerived,
          name: googleNameInput.trim() || handleDerived,
          email: email,
          avatar: `https://lh3.googleusercontent.com/a/default-user=s120-c`,
          bio: `Conta Google verificada (${email}). Arquitetura de agentes autônomos e Vortex GOS3.`,
          authProvider: "google",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha na autenticação Google");

      setSuccessMsg(`Autenticado com Google (@${data.user.handle})!`);
      onLoginSuccess(data.user);
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao conectar conta Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        id="auth-login-modal"
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-neutral-100">Autenticação & Identidade Real</h2>
              <p className="text-xs text-neutral-400">Login por @Handle ou Google Account</p>
            </div>
          </div>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Auth Status Badge */}
        {currentUser && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-neutral-700"
            />
            <div className="flex-1 min-w-0 text-xs">
              <div className="text-neutral-400 text-[10px] uppercase tracking-wider font-semibold">
                Sessão Ativa Atual:
              </div>
              <div className="font-bold text-neutral-200 truncate">{currentUser.name}</div>
              <div className="text-purple-400 font-mono">@{currentUser.handle}</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              {currentUser.authProvider === "google" ? "Google" : "Handle"}
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 text-xs font-semibold px-6 pt-3">
          <button
            onClick={() => {
              setActiveTab("handle");
              setErrorMsg("");
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-2 ${
              activeTab === "handle"
                ? "border-purple-500 text-purple-300"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Login por @Handle</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("google");
              setErrorMsg("");
            }}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center gap-2 ${
              activeTab === "google"
                ? "border-purple-500 text-purple-300"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Conta Google Real</span>
          </button>
        </div>

        {/* Messages */}
        <div className="px-6 pt-3">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6">
          {activeTab === "handle" ? (
            <form onSubmit={handleHandleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  Seu @Handle / Nome de Usuário <span className="text-purple-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 font-mono font-bold">@</span>
                  <input
                    type="text"
                    required
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    placeholder="sobrinhoSJ, dev_hero, satoshi..."
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-3 py-2 text-neutral-100 font-mono focus:border-purple-500 focus:outline-none placeholder:text-neutral-600 text-xs"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Se já existir, sua conta e histórico serão carregados na hora. Se for nova, criaremos seu perfil persistido.
                </p>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Nome de Exibição (Opcional)</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Ex: Sobrinho SJ, Alex Developer"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-neutral-100 focus:border-purple-500 focus:outline-none placeholder:text-neutral-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Bio / Descrição (Opcional)</label>
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Ex: Arquiteto de sistemas, entusiasta de energias renováveis e IA autônoma..."
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-neutral-100 focus:border-purple-500 focus:outline-none placeholder:text-neutral-600 text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all disabled:opacity-50"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{loading ? "Autenticando..." : "Entrar com @Handle"}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleGoogleLogin} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-neutral-200">Google Single Sign-On</div>
                  <div className="text-[10px] text-neutral-400">Autenticação persistida para o ecossistema MoltBot</div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  E-mail Google <span className="text-purple-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="sobrinhoSJ@gmail.com"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-neutral-100 font-mono focus:border-purple-500 focus:outline-none placeholder:text-neutral-600 text-xs"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Nome Completo da Conta</label>
                <input
                  type="text"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  placeholder="Sobrinho SJ"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-neutral-100 focus:border-purple-500 focus:outline-none placeholder:text-neutral-600 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-900 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                <span>{loading ? "Conectando Google..." : "Entrar com Conta Google"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
