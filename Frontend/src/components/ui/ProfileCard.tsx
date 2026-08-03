import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Cpu, 
  Sparkles, 
  Award, 
  X, 
  Layers, 
  CheckCircle2,
  Activity,
  Zap,
  Server,
  Bot
} from 'lucide-react';

interface ArchitectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Precision SVG icons for GitHub & LinkedIn
const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const ProfileCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const rX = ((mouseY / height) - 0.5) * -14;
    const rY = ((mouseX / width) - 0.5) * 14;

    setRotateX(rX);
    setRotateY(rY);

    setGlare({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.22,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="select-none w-full max-w-[340px] mx-auto" style={{ perspective: '1200px' }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative rounded-[28px] p-px bg-gradient-to-b from-blue-400/50 via-indigo-500/40 to-purple-600/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] group cursor-pointer"
      >
        {/* Deep ambient sapphire glow */}
        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-purple-600/25 rounded-3xl blur-2xl pointer-events-none group-hover:from-blue-500/40 group-hover:to-purple-500/40 transition-all duration-700" />

        {/* Core Card Chassis - Spacious & Uncluttered Layout */}
        <div className="relative rounded-[27px] bg-[#090b14] text-white overflow-hidden border border-white/15 flex flex-col justify-between h-[450px]">
          
          {/* Cyber Grid texture */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none z-0"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Clean Acrylic Sheen */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30 rounded-[27px]"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.3) 0%, rgba(59,130,246,0.15) 50%, transparent 85%)`,
              mixBlendMode: 'overlay'
            }}
          />

          {/* Top Status Indicators */}
          <div className="flex items-center justify-between p-4 z-20 font-mono text-[11px] absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md shadow-inner font-extrabold tracking-wider uppercase text-[9px]">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>AI Systems</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-extrabold bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-0.5" />
              <span>Active Engine</span>
            </span>
          </div>

          {/* High-Resolution Photographic Display */}
          <div className="relative w-full h-[80%] overflow-hidden z-10">
            <img
              src="/Developer.png"
              alt="Omkesh More - AI Systems Engineer"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter contrast-[1.05] saturate-[1.1]"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
              }}
            />
            {/* Smooth dark fade at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#090b14] via-[#090b14]/85 to-transparent pointer-events-none" />
          </div>

          {/* Clean & Sharp Identity Section (Uncluttered) */}
          <div className="flex flex-col px-5 -mt-20 z-20 text-left relative">
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans drop-shadow-lg">
                Omkesh More
              </h3>
              <span className="p-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm" title="AI Systems Engineer">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
              </span>
            </div>
            <p className="text-[11px] font-mono font-extrabold text-blue-300 uppercase tracking-wider mt-0.5 drop-shadow">
              AI Systems Engineer
            </p>

            {/* 3 Core High-Impact Skill Badges */}
            <div className="flex items-center gap-2 mt-3 font-mono text-[9.5px]">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/15 flex items-center gap-1.5 text-slate-200 font-semibold shadow-inner">
                <Bot className="w-3 h-3 text-amber-400 shrink-0" />
                <span>AI Systems</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/15 flex items-center gap-1.5 text-slate-200 font-semibold shadow-inner">
                <Server className="w-3 h-3 text-blue-400 shrink-0" />
                <span>Full Stack</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/15 flex items-center gap-1.5 text-slate-200 font-semibold shadow-inner">
                <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                <span>LLM Infra</span>
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="p-4 pt-3 z-20 mt-auto bg-[#090b14]/90 backdrop-blur-md border-t border-white/[0.07]">
            <a
              href="mailto:omkeshmore007@gmail.com"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group/btn cursor-pointer hover:scale-[1.02] active:scale-[0.98] border border-white/10"
            >
              <Mail className="w-4 h-4 text-amber-300 shrink-0 stroke-[2.5]" />
              <span>Contact Architect</span>
            </a>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;

// Principal Architecture & Telemetry Modal (Clean & Uncluttered)
export const ArchitectModal: React.FC<ArchitectModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none overflow-hidden">
      <div 
        className="relative w-full max-w-5xl rounded-3xl bg-[#0b0e1a]/95 border border-white/15 shadow-2xl p-5 sm:p-7 text-slate-200 flex flex-col justify-between max-h-[94vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 border border-white/15">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-sans tracking-tight">
                AI Systems Engineer & Creator of ModelArena PRO
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Production AI Systems • Full Stack Engineering • LLM Infrastructure
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer border border-transparent hover:border-white/10"
            title="Close architectural specification"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1 min-h-0 overflow-hidden">
          
          {/* Left Column: Profile Card & Direct Links */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center shrink-0">
            <ProfileCard />
            
            <div className="flex items-center justify-center gap-3 mt-3.5 w-full max-w-[340px]">
              <button
                onClick={() => window.open('https://github.com/omkeshmore', '_blank')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.07] hover:bg-white/15 border border-white/15 text-white font-extrabold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 group/gh"
                title="Explore Verified GitHub Profile"
              >
                <GithubIcon className="w-4 h-4 text-slate-300 group-hover/gh:text-white transition-colors" />
                <span>GitHub</span>
              </button>
              <button
                onClick={() => window.open('https://www.linkedin.com/in/omkesh-more', '_blank')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 text-white font-extrabold text-xs transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 group/li"
                title="Connect on Verified LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4 text-blue-400 group-hover/li:text-blue-300 transition-colors" />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Right Column: Engineering Philosophy & Sharp Expertise Cards */}
          <div className="lg:col-span-7 space-y-4 text-left flex flex-col justify-between h-full py-1">
            
            {/* Main Manifesto - Concise & Sharp */}
            <div className="p-4 rounded-2xl bg-[#111526] border border-white/15 shadow-md space-y-1.5 relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-2 font-sans uppercase tracking-wider">
                <Cpu className="w-4 h-4 text-blue-400 shrink-0 animate-pulse" />
                <span>Engineering Philosophy</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Specializing in production-ready intelligent systems, scalable backend architecture, and modern full-stack development. Focused on transforming advanced LLM capabilities into reliable, high-performance software.
              </p>
            </div>

            {/* 4 Clean Expertise Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
              
              {/* Card 1 */}
              <div className="p-3.5 rounded-xl bg-[#101322] border border-white/[0.09] shadow-sm hover:border-blue-500/40 transition-all group/box">
                <span className="inline-flex items-center gap-1.5 p-1 px-2.5 rounded-lg bg-blue-500/10 text-blue-400 mb-1.5 font-black text-[10.5px] font-mono border border-blue-500/20">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                  LLM Systems
                </span>
                <h4 className="text-xs font-black text-white group-hover/box:text-blue-300 transition-colors">AI Orchestration</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-normal">
                  Building autonomous agent workflows, prompt engineering, structured reasoning, and evaluation pipelines.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-3.5 rounded-xl bg-[#101322] border border-white/[0.09] shadow-sm hover:border-amber-500/40 transition-all group/box">
                <span className="inline-flex items-center gap-1.5 p-1 px-2.5 rounded-lg bg-amber-500/10 text-amber-400 mb-1.5 font-black text-[10.5px] font-mono border border-amber-500/20">
                  <Server className="w-3.5 h-3.5 text-amber-400" />
                  Backend Engineering
                </span>
                <h4 className="text-xs font-black text-white group-hover/box:text-amber-300 transition-colors">Scalable Infrastructure</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-normal">
                  Engineering secure APIs, real-time communication, database architecture, and production cloud services.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-3.5 rounded-xl bg-[#101322] border border-white/[0.09] shadow-sm hover:border-purple-500/40 transition-all group/box">
                <span className="inline-flex items-center gap-1.5 p-1 px-2.5 rounded-lg bg-purple-500/10 text-purple-400 mb-1.5 font-black text-[10.5px] font-mono border border-purple-500/20">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  Frontend Engineering
                </span>
                <h4 className="text-xs font-black text-white group-hover/box:text-purple-300 transition-colors">Interactive Experiences</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-normal">
                  Developing high-performance React interfaces with modern UI architecture, smooth motion, and rich UX.
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-3.5 rounded-xl bg-[#101322] border border-white/[0.09] shadow-sm hover:border-emerald-500/40 transition-all group/box">
                <span className="inline-flex items-center gap-1.5 p-1 px-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 mb-1.5 font-black text-[10.5px] font-mono border border-emerald-500/20">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  Flagship Platform
                </span>
                <h4 className="text-xs font-black text-white group-hover/box:text-emerald-300 transition-colors">ModelArena PRO</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-normal">
                  Multi-model evaluation platform featuring AI consensus judging, real-time analytics, and evaluation pipelines.
                </p>
              </div>

            </div>

            {/* Footer Specifications */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-t border-white/10 font-mono shrink-0">
              <span className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px]">
                <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>ModelArena PRO</span>
              </span>
              <span className="font-extrabold text-white flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Designed & Engineered by Omkesh More
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
