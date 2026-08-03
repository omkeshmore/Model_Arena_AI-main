import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { JudgeRecommendation } from '../../types';
import { Card } from '../ui/Card';
import { Trophy, Scale, ChevronDown, ChevronUp, CheckCircle2, Sparkles, Zap } from 'lucide-react';

interface JudgeRecommendationCardProps {
  judge: JudgeRecommendation;
  solution1Model: string;
  solution2Model: string;
}

export const JudgeRecommendationCard: React.FC<JudgeRecommendationCardProps> = ({
  judge,
  solution1Model,
  solution2Model,
}) => {
  const [expanded, setExpanded] = useState(true);

  // Smooth typing effect for technical diagnostic reasoning
  const [displayedReasoning1, setDisplayedReasoning1] = useState('');
  const [displayedReasoning2, setDisplayedReasoning2] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsTyping(true);
    setDisplayedReasoning1('');
    setDisplayedReasoning2('');

    const len1 = judge.solution_1_reasoning?.length || 0;
    const len2 = judge.solution_2_reasoning?.length || 0;
    const maxLen = Math.max(len1, len2);
    let curr = 0;
    const step = Math.max(3, Math.floor(maxLen / 60));

    const interval = setInterval(() => {
      curr += step;
      if (curr >= maxLen) {
        setDisplayedReasoning1(judge.solution_1_reasoning || '');
        setDisplayedReasoning2(judge.solution_2_reasoning || '');
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedReasoning1((judge.solution_1_reasoning || '').slice(0, curr));
        setDisplayedReasoning2((judge.solution_2_reasoning || '').slice(0, curr));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [judge]);

  const winnerModel =
    judge.winner === 'solution_1'
      ? solution1Model
      : judge.winner === 'solution_2'
      ? solution2Model
      : 'Tie: Equal Architectural Resilience';

  // Helper to calculate score out of 10 and equivalent progress percentage (out of 100%)
  const parseScore = (rawScore: number | undefined) => {
    if (rawScore === undefined) return { scoreOut10: '0.0', percentage: 0, num: 0 };
    const num = Number(rawScore);
    const out10 = num > 10 ? num / 10 : num;
    const perc = num > 10 ? num : Math.min(100, out10 * 10);
    return {
      scoreOut10: out10.toFixed(1).replace(/\.0$/, ''),
      percentage: perc,
      num: out10
    };
  };

  const sol1 = parseScore(judge.solution_1_score);
  const sol2 = parseScore(judge.solution_2_score);

  return (
    <div className="mt-6 w-full">
      <Card className="overflow-hidden border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#11131c] shadow-md dark:shadow-xl">
        {/* Diagnostic Top Banner */}
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/[0.07] bg-slate-50/80 dark:bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
              <Scale className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                  Automated AI Judge Analysis
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-xs">
                  <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Winner: {winnerModel}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                Comparative algorithmic diagnostic across runtime efficiency, Big-O metrics, and production type safety.
              </p>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="px-4 py-2 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300/80 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs border border-slate-300/50 dark:border-transparent"
          >
            <span>{expanded ? 'Hide Diagnostics' : 'Show Diagnostics'}</span>
            {expanded ? <ChevronUp className="w-4 h-4 stroke-[2.5]" /> : <ChevronDown className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </div>

        {/* Numerical Score Visual Bars out of 10 */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-[#0e1017]">
          {/* Sol 1 Score */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151722] border border-slate-200/80 dark:border-white/[0.08] shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-md bg-blue-500 inline-block shadow-sm shadow-blue-500/50" />
                {solution1Model}
              </span>
              <span className="text-xl font-black font-mono text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-xl">
                {sol1.scoreOut10}<span className="text-xs font-normal text-slate-400">/10</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sol1.percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  sol1.num >= 9.0 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-blue-600 to-indigo-500'
                }`}
              />
            </div>
          </div>

          {/* Sol 2 Score */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151722] border border-slate-200/80 dark:border-white/[0.08] shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-md bg-indigo-500 inline-block shadow-sm shadow-indigo-500/50" />
                {solution2Model}
              </span>
              <span className="text-xl font-black font-mono text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-xl">
                {sol2.scoreOut10}<span className="text-xs font-normal text-slate-400">/10</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-white/10 h-2.5 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${sol2.percentage}%` }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  sol2.num >= 9.0 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Expanded Analytical Reasoning with Typing Stream */}
        {expanded && (
          <div className="p-6 border-t border-slate-200/80 dark:border-white/[0.07] bg-white dark:bg-[#11131c] grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                {solution1Model} &mdash; Technical Diagnostic
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4.5 bg-slate-50 dark:bg-[#161824] rounded-2xl border border-slate-200/70 dark:border-white/10 font-sans font-medium min-h-[90px] relative">
                {displayedReasoning1}
                {isTyping && <span className="inline-block w-1.5 h-3.5 ml-1 bg-blue-500 animate-pulse rounded-2xs align-middle" />}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                {solution2Model} &mdash; Technical Diagnostic
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4.5 bg-slate-50 dark:bg-[#161824] rounded-2xl border border-slate-200/70 dark:border-white/10 font-sans font-medium min-h-[90px] relative">
                {displayedReasoning2}
                {isTyping && <span className="inline-block w-1.5 h-3.5 ml-1 bg-indigo-500 animate-pulse rounded-2xs align-middle" />}
              </p>
            </div>
          </div>
        )}

        <div className="px-6 py-3 bg-slate-100/80 dark:bg-[#0a0b10] border-t border-slate-200/80 dark:border-white/[0.07] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            Consensus verification via automated 3-stage LLM evaluation logic (Scored out of 10).
          </span>
          <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            AI Judge: Google Gemini Flash (Structured Evaluation)
          </span>
        </div>
      </Card>
    </div>
  );
};
