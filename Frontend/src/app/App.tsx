import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/layout/Sidebar';
import { ChatInput } from '../components/chat/ChatInput';
import { ComparisonMessageView } from '../components/chat/ComparisonMessageView';
import { GhostCursor } from '../components/ui/GhostCursor';
import { QuantumLoader } from '../components/ui/QuantumLoader';
import { LoginView } from '../components/auth/LoginView';
import { RegisterView } from '../components/auth/RegisterView';
import { ArchitectModal } from '../components/ui/ProfileCard';
import api from '../lib/api';
import { ComparisonObject } from '../types';
import { 
  Menu, 
  Sparkles, 
  Layers, 
  ShieldAlert,
  Terminal,
  Scale,
  Zap,
  CheckCircle2,
  Activity
} from 'lucide-react';

export const App: React.FC = () => {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const [comparisons, setComparisons] = useState<ComparisonObject[]>(() => {
    const saved = localStorage.getItem('modelarena_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [activeId, setActiveId] = useState<string | null>(() => {
    return comparisons.length > 0 ? comparisons[0].id : null;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isArchitectOpen, setIsArchitectOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('modelarena_history', JSON.stringify(comparisons));
  }, [comparisons]);

  const handleSendMessage = async (prompt: string) => {
    setIsStreaming(true);
    try {
      const res = await api.post('/invoke', { prompt });
      const data = res.data?.data;
      
      if (!data) {
        throw new Error("No comparison results received from server.");
      }

      const newComp: ComparisonObject = {
        id: 'comp_' + Math.random().toString(36).substring(2, 10),
        problem: data.problem || prompt,
        solution_1: data.solution_1 || 'No response generated from Solution 1 engine.',
        solution_2: data.solution_2 || 'No response generated from Solution 2 engine.',
        solution_1_model: data.solution_1_model || 'Mistral Medium (Latest)',
        solution_2_model: data.solution_2_model || 'Cohere Command-A (2025)',
        judge: {
          solution_1_score: data.judge?.solution_1_score ?? 0,
          solution_2_score: data.judge?.solution_2_score ?? 0,
          solution_1_reasoning: data.judge?.solution_1_reasoning || 'No diagnostic reasoning generated.',
          solution_2_reasoning: data.judge?.solution_2_reasoning || 'No diagnostic reasoning generated.',
          winner: data.judge?.winner || 'tie',
        },
        createdAt: new Date().toISOString(),
      };

      setComparisons((prev) => [newComp, ...prev]);
      setActiveId(newComp.id);
    } catch (err: any) {
      console.error("AI Benchmark Execution Error:", err);
      alert(err.response?.data?.message || err.message || "Failed to invoke AI comparison models. Ensure backend is online.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewComparison = () => {
    setActiveId(null);
  };

  const handleClearAll = () => {
    if (window.confirm('Remove all previous comparison benchmarks from workspace?')) {
      setComparisons([]);
      setActiveId(null);
    }
  };

  const activeComparison = comparisons.find((c) => c.id === activeId);

  // Unauthenticated screen routing
  if (!user) {
    return authView === 'login' ? (
      <>
        <GhostCursor />
        <LoginView onSwitchToRegister={() => setAuthView('register')} />
      </>
    ) : (
      <>
        <GhostCursor />
        <RegisterView onSwitchToLogin={() => setAuthView('login')} />
      </>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f4f6fb] dark:bg-[#0a0b10] font-sans relative select-none">
      <GhostCursor />
      {/* Subtle Ambient Background Mesh */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/[0.04] via-transparent to-indigo-500/[0.03] pointer-events-none" />

      {/* Fixed Sidebar Console */}
      <Sidebar
        comparisons={comparisons}
        activeId={activeId}
        onSelect={(id) => setActiveId(id)}
        onNewComparison={handleNewComparison}
        onClearAll={handleClearAll}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace Column */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden bg-white/40 dark:bg-white/[0.01] z-10">
        
        {/* Sleek Glassmorphic Header */}
        <header className="h-15 shrink-0 border-b border-slate-200/80 dark:border-white/[0.07] bg-white/80 dark:bg-[#0d0e14]/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 z-20">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-slate-200/80 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 lg:hidden transition-all cursor-pointer"
              title="Toggle history sidebar"
            >
              <Menu className="w-5 h-5 stroke-[2.2]" />
            </button>
            <div className="flex items-center gap-2.5 truncate">
              <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight truncate font-sans">
                {activeComparison ? "Frontier AI Benchmark Battle" : "ModelArena AI Workspace Studio"}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-mono font-bold bg-blue-500/10 text-blue-600 dark:bg-white/10 dark:text-blue-300 border border-blue-500/20 shadow-2xs">
                <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                <span>Dual Engine Online</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs font-mono text-slate-500 dark:text-slate-400 font-semibold">
            <span className="hidden md:inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Gemini Flash AI Judge Online</span>
            </span>
            <button
              onClick={() => setIsArchitectOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition-all font-sans font-black text-xs cursor-pointer group hover:scale-105 active:scale-95"
              title="View Principal Architect Profile Card & Telemetry"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
              <span>Architect & Core</span>
            </button>
          </div>
        </header>

        {/* Center: Independently Scrollable Workspace Viewport */}
        <div className={`flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-2 relative scrollbar-thin select-text flex flex-col ${activeComparison ? 'justify-start' : 'justify-center'}`}>
          {isStreaming ? (
            <QuantumLoader />
          ) : activeComparison ? (
            <ComparisonMessageView comparison={activeComparison} />
          ) : (
            <div className="max-w-4xl mx-auto text-center my-auto py-2 px-4 w-full">
              {/* Illuminated Hero Badge */}
              <div className="inline-flex items-center justify-center p-1 rounded-2xl bg-gradient-to-b from-blue-500/20 to-transparent mb-4 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
                  <Layers className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-blue-100 dark:to-white bg-clip-text text-transparent">
                Side-by-Side LLM Comparison Arena
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6 leading-relaxed font-sans font-medium">
                Enter any challenging software design prompt, algorithmic complexity test, or SQL query below. Witness live 50/50 comparison outputs with quantitative AI Judge diagnostic scores.
              </p>

              {/* Developer & Systems Attribution Chip */}
              <div className="mb-7 flex items-center justify-center">
                <button
                  onClick={() => setIsArchitectOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-white/80 dark:bg-white/[0.05] hover:bg-white dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/10 shadow-sm transition-all text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer group"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Engine Architecture & Built by <strong className="font-extrabold text-blue-600 dark:text-blue-400">Omkesh More</strong></span>
                  <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </button>
              </div>

              {/* Ultra-Sharp Architectural Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
                <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#11131c]/90 border border-slate-200/80 dark:border-white/[0.07] shadow-sm dark:shadow-lg hover:border-blue-500/40 hover:shadow-blue-500/5 transition-all group">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <Terminal className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Dual 50/50 Cards</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-normal">Side-by-side execution with GitHub flavored markdown and terminal highlighting.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#11131c]/90 border border-slate-200/80 dark:border-white/[0.07] shadow-sm dark:shadow-lg hover:border-amber-500/40 hover:shadow-amber-500/5 transition-all group">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <Scale className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Automated AI Judge</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-normal">Quantitative grading out of 100 with runtime memory and Big-O complexity analysis.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#11131c]/90 border border-slate-200/80 dark:border-white/[0.07] shadow-sm dark:shadow-lg hover:border-emerald-500/40 hover:shadow-emerald-500/5 transition-all group">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <ShieldAlert className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">Instant Benchmarks</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-normal">Select a rapid sample prompt or execute custom multi-model stress tests instantly.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Docked AI Studio Console Input */}
        <div className="shrink-0 bg-gradient-to-t from-[#f4f6fb] via-[#f4f6fb] to-transparent dark:from-[#0a0b10] dark:via-[#0a0b10] dark:to-transparent z-20">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={false}
            isStreaming={isStreaming}
          />
        </div>
      </main>

      {/* Principal Architect Profile Card & Creator Telemetry Modal */}
      <ArchitectModal isOpen={isArchitectOpen} onClose={() => setIsArchitectOpen(false)} />
    </div>
  );
};
