import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Sparkles, Activity, Layers, Bot, Zap, CheckCircle2 } from 'lucide-react';

const EVALUATION_STEPS = [
  { id: 1, text: "Dispatching parallel evaluation packets to Gemini 3 Pro & Claude 3.7 Sonnet...", model: "DUAL STREAM INITIALIZED" },
  { id: 2, text: "Synthesizing high-performance algorithmic implementations & code architecture...", model: "EXECUTING 60FPS TOKEN STREAM" },
  { id: 3, text: "Running quantitative 10-point evaluation diagnostic benchmark matrices...", model: "AI JUDGE CONSENSUS SCORING" },
  { id: 4, text: "Formulating final comparative verdict & recommendation summary...", model: "FINALIZING EVALUATION BENCHMARK" }
];

export const QuantumLoader: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < EVALUATION_STEPS.length - 1 ? prev + 1 : prev));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const currentStep = EVALUATION_STEPS[stepIndex];
  const progressPercent = Math.min(((stepIndex + 1) / EVALUATION_STEPS.length) * 100, 95);

  return (
    <div className="w-full max-w-xl mx-auto my-auto p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#0c0d16]/90 border border-slate-200/80 dark:border-white/[0.12] shadow-2xl backdrop-blur-2xl relative overflow-hidden select-none">
      
      {/* Background Quantum Glow Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-indigo-600/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Center Holographic Synapse Reactor */}
      <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
        
        {/* Outer Counter-Rotating Orbital Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30 dark:border-indigo-400/40"
        />

        {/* Inner Fast-Rotating Pulsing Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-blue-500/50 dark:border-blue-400/60 border-t-transparent border-r-transparent"
        />

        {/* Core Glowing Orb */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/40 border border-white/20 relative z-10">
          <Zap className="w-7 h-7 text-white fill-white/20 animate-pulse" />
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20 text-[10px] font-mono font-extrabold uppercase tracking-wider mb-3">
          <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
          <span>{currentStep.model}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Simultaneous Frontier Execution
        </h3>

        {/* Animated Step Text */}
        <div className="min-h-[40px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-mono font-medium max-w-md mx-auto leading-relaxed"
            >
              {currentStep.text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Dual Model Connection Telemetry Badges */}
      <div className="grid grid-cols-2 gap-2.5 mb-6 relative z-10">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans truncate">Gemini 3 Pro</span>
          </div>
          <span className="text-[10px] font-mono text-blue-500 font-bold">STREAMING</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans truncate">Claude 3.7</span>
          </div>
          <span className="text-[10px] font-mono text-purple-500 font-bold">STREAMING</span>
        </div>
      </div>

      {/* Precision Progress Track Beam */}
      <div className="relative z-10">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold mb-1.5">
          <span>AI JUDGE SYNTHESIS</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-white/5 shadow-inner">
          <motion.div
            initial={{ width: "10%" }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 h-full rounded-full shadow-[0_0_12px_rgba(59,130,246,0.5)]"
          />
        </div>
      </div>

    </div>
  );
};
