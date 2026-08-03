import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Check, Copy, Cpu, Trophy, Terminal, Zap, Play } from 'lucide-react';

interface SolutionCardProps {
  modelName: string;
  markdownContent: string;
  solutionNumber: 1 | 2;
  score?: number;
  isWinner?: boolean;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({
  modelName,
  markdownContent,
  solutionNumber,
  score,
  isWinner = false,
}) => {
  const { theme } = useTheme();
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Gemini / ChatGPT Streaming Typing Animation State
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!markdownContent) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    // Start smooth token streaming typing animation
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const length = markdownContent.length;
    // Calculate optimal chunk sizing for smooth 30FPS streaming
    const chunkSize = Math.max(6, Math.floor(length / 50));

    const interval = setInterval(() => {
      currentIndex += chunkSize + Math.floor(Math.random() * 4);
      if (currentIndex >= length) {
        setDisplayedText(markdownContent);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedText(markdownContent.slice(0, currentIndex));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [markdownContent]);

  const handleSkipAnimation = () => {
    setDisplayedText(markdownContent);
    setIsTyping(false);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Helper to accurately format score out of 10 (e.g. 92 -> 9.2)
  const getFormattedScore = (val?: number) => {
    if (val === undefined) return '0';
    const num = Number(val);
    const out10 = num > 10 ? num / 10 : num;
    return out10.toFixed(1).replace(/\.0$/, '');
  };

  const formattedScore = getFormattedScore(score);
  const numericScore = Number(formattedScore);

  return (
    <Card
      highlight={isWinner}
      className={`h-full flex flex-col transition-all duration-300 border ${
        isWinner
          ? 'border-blue-500/50 dark:border-blue-500/50 shadow-lg shadow-blue-500/5 bg-white dark:bg-[#12141f]'
          : 'border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#11131c]'
      }`}
    >
      {/* Header Banner */}
      <div className="px-6 py-4 border-b border-slate-200/80 dark:border-white/[0.07] bg-slate-50/80 dark:bg-white/[0.02] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-sm ${
              solutionNumber === 1 
                ? 'bg-gradient-to-br from-blue-600 to-cyan-500' 
                : 'bg-gradient-to-br from-indigo-600 to-purple-600'
            }`}
          >
            <Cpu className="w-4.5 h-4.5 text-white stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight truncate font-sans">
                {modelName}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                Sol {solutionNumber}
              </span>
              {isWinner && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-2xs">
                  <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500" />
                  <span>Winner</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isTyping && (
            <button
              type="button"
              onClick={handleSkipAnimation}
              className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-600 dark:text-blue-400 text-[11px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer border border-blue-500/30 shadow-xs"
              title="Skip streaming typing animation"
            >
              <Play className="w-3 h-3 text-blue-500 fill-blue-500" />
              <span>Instant Output</span>
            </button>
          )}

          {score !== undefined && (
            <div className="text-right px-3.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <span className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-400 block tracking-wider font-mono">Score</span>
              <span className={`text-base font-black font-mono ${numericScore >= 9.0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {formattedScore}<span className="text-xs font-normal text-slate-400 dark:text-slate-500">/10</span>
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopyAll}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-slate-200 transition-colors cursor-pointer border border-slate-200/60 dark:border-transparent"
            title="Copy entire solution markdown"
          >
            {copiedAll ? <Check className="w-4 h-4 text-emerald-500 stroke-[3]" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Scrollable Markdown Content Area with Gemini/ChatGPT Streaming Cursor */}
      <div className="p-6 overflow-y-auto flex-1 markdown-body scrollbar-thin relative">
        {isTyping && displayedText.length < 30 && (
          <div className="flex items-center gap-2 mb-3 text-xs text-blue-500 font-mono font-bold animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            <span>Streaming architectural solution tokens...</span>
          </div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              const codeId = Math.random().toString(36).substring(2, 9);

              if (!inline && match) {
                return (
                  <div className="my-5 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/15 bg-slate-50 dark:bg-[#0c0d12] shadow-sm dark:shadow-2xl transition-colors duration-200">
                    {/* Terminal Top Bar */}
                    <div className="px-4 py-2.5 bg-slate-100/90 dark:bg-[#08090d] border-b border-slate-200 dark:border-white/10 flex items-center justify-between font-mono text-xs">
                      <span className="flex items-center gap-2 font-black text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500/90 inline-block shadow-xs shadow-blue-500" />
                        <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{match[1]}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(codeString, match[1] + '-' + codeString.substring(0, 8))}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/20 text-[11px] font-bold text-slate-700 dark:text-white transition-all cursor-pointer shadow-2xs border border-slate-200/80 dark:border-white/5"
                      >
                        {copiedCodeId === match[1] + '-' + codeString.substring(0, 8) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                            <span>Copy code</span>
                          </>
                        )}
                      </button>
                    </div>
                    {/* Syntax Highlighted Viewport */}
                    <div className="overflow-x-auto max-h-[420px] text-xs sm:text-[13px] font-mono leading-relaxed scrollbar-thin">
                      <SyntaxHighlighter
                        style={theme === 'dark' ? (vscDarkPlus as any) : (vs as any)}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          padding: '1.5rem',
                          background: 'transparent',
                          fontSize: '0.875rem',
                          lineHeight: '1.6',
                        }}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                );
              }

              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-blue-50/80 text-blue-700 border border-blue-200/60 dark:bg-white/10 dark:text-blue-300 dark:border-white/5 font-mono text-xs font-bold"
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {displayedText}
        </ReactMarkdown>

        {/* Real-time ChatGPT / Gemini Blinking Token Cursor */}
        {isTyping && (
          <span className="inline-block w-2.5 h-4 ml-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-xs animate-[pulse_0.7s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-sm shadow-blue-500 align-middle" />
        )}
      </div>
    </Card>
  );
};
