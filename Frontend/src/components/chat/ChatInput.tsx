import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, Database, Zap, RefreshCw, ArrowUp, Command } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  onSendMessage: (prompt: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

const SAMPLE_PROMPTS = [
  { 
    icon: Code2, 
    label: 'Async Python Retry', 
    query: 'Write an asynchronous Python function using asyncio and aiohttp to concurrently fetch JSON payloads from a list of 20 API URLs with automatic exponential backoff retry and concurrency limit of 5.' 
  },
  { 
    icon: Database, 
    label: 'Keyset Pagination', 
    query: 'Compare index usage and query optimization for paginating through 10,000,000 records in PostgreSQL: Offset/Limit vs Cursor-Based (Keyset) Pagination.' 
  },
  { 
    icon: Zap, 
    label: '60FPS React Canvas', 
    query: 'How should a Senior React Architect implement high-frequency real-time WebSocket data subscriptions (1,000 ticks/sec) in a financial candlestick dashboard without triggering React re-render freezes?' 
  }
];

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false, isStreaming = false }) => {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [prompt]);

  const handleSend = () => {
    if (!prompt.trim() || disabled || isStreaming) return;
    onSendMessage(prompt.trim());
    setPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto px-3 sm:px-6 py-3">
      {/* Studio-Grade Glassmorphic Console Container */}
      <div 
        className={cn(
          "relative rounded-2xl border transition-all duration-300 shadow-xl",
          "bg-white/95 dark:bg-[#11131e]/95 backdrop-blur-2xl",
          "border-slate-200/90 dark:border-white/[0.1] hover:border-slate-300 dark:hover:border-white/20",
          "focus-within:border-blue-500/70 dark:focus-within:border-blue-400/80 focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:ring-blue-500/20 focus-within:shadow-2xl",
          isStreaming && "opacity-85 pointer-events-none"
        )}
      >
        <div className="p-3 sm:p-4 flex flex-col gap-3">
          
          {/* Main Clean Input Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isStreaming}
            placeholder={
              isStreaming
                ? "Dual AI engines evaluating algorithmic consensus..."
                : "Ask ModelArena AI to benchmark code, algorithms, or architecture..."
            }
            className="w-full resize-none bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 dark:placeholder:text-slate-500 focus:outline-none min-h-[42px] max-h-[160px] overflow-y-auto leading-relaxed font-sans font-medium scrollbar-thin"
          />

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
            
            {/* Left: Clean Quick Prompt Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
              {SAMPLE_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={{ scale: 1.02, y: -0.5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setPrompt(item.query);
                      if (textareaRef.current) textareaRef.current.focus();
                    }}
                    disabled={disabled || isStreaming}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-slate-100/80 dark:bg-white/[0.05] hover:bg-blue-50 dark:hover:bg-white/[0.1] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white border border-slate-200/60 dark:border-white/[0.08] transition-all shrink-0 cursor-pointer disabled:opacity-40 select-none"
                  >
                    <Icon className="w-3 h-3 text-blue-500 shrink-0" />
                    <span>{item.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Right: Premium Launch Button */}
            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                type="button"
                whileHover={{ scale: !prompt.trim() || isStreaming ? 1 : 1.05 }}
                whileTap={{ scale: !prompt.trim() || isStreaming ? 1 : 0.95 }}
                onClick={handleSend}
                disabled={!prompt.trim() || disabled || isStreaming}
                className={cn(
                  "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer select-none shadow-md",
                  prompt.trim() && !disabled && !isStreaming
                    ? "bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 border border-white/20"
                    : "bg-slate-100 dark:bg-white/[0.06] text-slate-400 dark:text-slate-500 border border-slate-200/80 dark:border-white/[0.06] cursor-not-allowed shadow-none opacity-60"
                )}
                title={prompt.trim() ? "Execute AI Evaluation (Enter)" : "Type a prompt to evaluate"}
              >
                {isStreaming ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <ArrowUp className={cn(
                    "w-4 h-4 stroke-[2.5] transition-transform duration-200",
                    prompt.trim() ? "text-white group-hover:translate-y-[-1px]" : "text-slate-400 dark:text-slate-500"
                  )} />
                )}
              </motion.button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
