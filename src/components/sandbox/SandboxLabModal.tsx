import React, { useState } from "react";
import { InteractiveChartEmbed } from "../feed/InteractiveChartEmbed";
import {
  Terminal,
  Zap,
  Play,
  Loader2,
  X,
  Sun,
  Coins,
  Code2,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Copy,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SandboxLabModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTool, setActiveTool] = useState<"energy" | "crypto" | "js" | "nanoclaw">("energy");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Form states
  const [solarMW, setSolarMW] = useState(30);
  const [bessMWh, setBessMWh] = useState(60);
  const [energyPrice, setEnergyPrice] = useState(50);

  const [assetSymbol, setAssetSymbol] = useState("DREX-ENERGY-REC");
  const [timeframe, setTimeframe] = useState("30D");

  const [nanoCluster, setNanoCluster] = useState("main-v8-isolate");
  const [nanoAction, setNanoAction] = useState<"inspect_kernel" | "verify_bytecode" | "isolate_subtask">("inspect_kernel");

  const [jsCode, setJsCode] = useState(`// Benchmark de Despacho e Arbitragem
const solarMW = 25;
const bessCapacity = 50;
const peakRate = 68; // $/MWh
const offPeakRate = 22; // $/MWh

const arbitrageGainAnnual = bessCapacity * 0.9 * 360 * (peakRate - offPeakRate);
console.log("Arbitrage Anual Estimado: $" + (arbitrageGainAnnual / 1e6).toFixed(2) + "M");
return { arbitrageGainAnnual, roiFactor: 1.42 };`);

  if (!isOpen) return null;

  const handleExecute = async () => {
    try {
      setRunning(true);
      let payload: any = {};

      if (activeTool === "energy") {
        payload = {
          toolName: "calculateEnergyBESS",
          params: { solarCapacityMW: solarMW, bessCapacityMWh: bessMWh, energyPricePerMWh: energyPrice },
        };
      } else if (activeTool === "crypto") {
        payload = {
          toolName: "analyzeMarketCrypto",
          params: { assetSymbol, timeframe },
        };
      } else if (activeTool === "js") {
        payload = {
          toolName: "executeJavaScript",
          params: { code: jsCode },
        };
      } else if (activeTool === "nanoclaw") {
        payload = {
          toolName: "inspectNanoClawRuntime",
          params: { targetCluster: nanoCluster, actionType: nanoAction },
        };
      }

      const res = await fetch("/api/sandbox/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error("Sandbox execution failed:", e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div id="sandbox-lab-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div
        id="sandbox-lab-container"
        className="w-full max-w-3xl max-h-[92vh] bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-neutral-100 flex items-center gap-2">
                Sandbox Runtime & Tools Lab
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/50 text-emerald-300 border border-emerald-800/50">
                  GOS3 V8 Core
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Execute ferramentas de sandbox diretamente e audite o payload de retorno e hash criptográfico.
              </p>
            </div>
          </div>
          <button
            id="close-sandbox-lab-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Selector Bar */}
        <div className="flex border-b border-neutral-800 px-6 text-xs font-medium gap-2 pt-2 bg-neutral-900/30 overflow-x-auto">
          <button
            id="sandbox-tab-energy"
            onClick={() => {
              setActiveTool("energy");
              setResult(null);
            }}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTool === "energy"
                ? "border-emerald-500 text-emerald-400 font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Sun className="w-4 h-4 text-emerald-400" />
            Solar & BESS Calculator
          </button>
          <button
            id="sandbox-tab-crypto"
            onClick={() => {
              setActiveTool("crypto");
              setResult(null);
            }}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTool === "crypto"
                ? "border-sky-500 text-sky-400 font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Coins className="w-4 h-4 text-sky-400" />
            Market & DREX Analyzer
          </button>
          <button
            id="sandbox-tab-js"
            onClick={() => {
              setActiveTool("js");
              setResult(null);
            }}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTool === "js"
                ? "border-purple-500 text-purple-400 font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Code2 className="w-4 h-4 text-purple-400" />
            JavaScript Sandbox VM
          </button>
          <button
            id="sandbox-tab-nanoclaw"
            onClick={() => {
              setActiveTool("nanoclaw");
              setResult(null);
            }}
            className={`pb-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTool === "nanoclaw"
                ? "border-pink-500 text-pink-400 font-semibold"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-pink-400" />
            NanoClaw Kernel Guard
          </button>
        </div>

        {/* Tool Parameters Form & Execution */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTool === "nanoclaw" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-pink-950/30 border border-pink-800/40 text-xs text-pink-200 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-pink-400 shrink-0" />
                <div>
                  <div className="font-bold">Agente Nativo NanoClaw v1.4 Runtime</div>
                  <div className="text-[11px] text-pink-300/80">
                    Inspeção do kernel de micro-isolamento V8, alocação de memória por isolate e integridade de processos de agentes.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Cluster / Isolate Alvo</label>
                  <input
                    type="text"
                    value={nanoCluster}
                    onChange={(e) => setNanoCluster(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Ação de Auditoria</label>
                  <select
                    value={nanoAction}
                    onChange={(e) => setNanoAction(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100"
                  >
                    <option value="inspect_kernel">Inspecionar Kernel & Isolates</option>
                    <option value="verify_bytecode">Validar Bytecode & Assinaturas</option>
                    <option value="isolate_subtask">Confinar Subtarefa Seccomp-BPF</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {activeTool === "energy" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Capacidade Solar (MW)</label>
                  <input
                    type="number"
                    value={solarMW}
                    onChange={(e) => setSolarMW(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">BESS Bateria (MWh)</label>
                  <input
                    type="number"
                    value={bessMWh}
                    onChange={(e) => setBessMWh(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Tarifa Base ($/MWh)</label>
                  <input
                    type="number"
                    value={energyPrice}
                    onChange={(e) => setEnergyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTool === "crypto" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Símbolo / Ticker do Ativo</label>
                <input
                  type="text"
                  value={assetSymbol}
                  onChange={(e) => setAssetSymbol(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Janela Temporal (Timeframe)</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100"
                >
                  <option value="24H">24 Horas</option>
                  <option value="7D">7 Dias</option>
                  <option value="30D">30 Dias</option>
                  <option value="1Y">1 Ano</option>
                </select>
              </div>
            </div>
          )}

          {activeTool === "js" && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Script JavaScript (Isolado no Node VM)
              </label>
              <textarea
                rows={6}
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                className="w-full p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-100 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          {/* Run Action */}
          <div className="flex justify-end">
            <button
              id="execute-sandbox-tool-btn"
              onClick={handleExecute}
              disabled={running}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/30 disabled:opacity-50"
            >
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executando na Sandbox...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Executar Ferramenta</span>
                </>
              )}
            </button>
          </div>

          {/* Result Inspection */}
          {result && (
            <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Retorno da Sandbox ({result.executionTimeMs} ms)
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  Hash: <strong className="text-emerald-300">{result.evidenceHash}</strong>
                </span>
              </div>

              {result.logs && result.logs.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-semibold text-neutral-400 mb-1">Logs de Execução:</div>
                  <pre className="p-2.5 rounded-lg bg-neutral-950 text-xs font-mono text-neutral-300 overflow-x-auto border border-neutral-800">
                    {result.logs.join("\n")}
                  </pre>
                </div>
              )}

              <div>
                <div className="text-[10px] uppercase font-semibold text-neutral-400 mb-1">Payload Estruturado:</div>
                <pre className="p-2.5 rounded-lg bg-neutral-950 text-xs font-mono text-emerald-300 overflow-x-auto border border-neutral-800">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
