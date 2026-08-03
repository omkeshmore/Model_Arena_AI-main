import React from 'react';
import { ComparisonObject } from '../../types';
import { SolutionCard } from './SolutionCard';
import { JudgeRecommendationCard } from './JudgeRecommendationCard';
import { Card } from '../ui/Card';
import { User, Clock, Sparkles } from 'lucide-react';

interface ComparisonMessageViewProps {
  comparison: ComparisonObject;
}

export const ComparisonMessageView: React.FC<ComparisonMessageViewProps> = ({ comparison }) => {
  return (
    <div className="w-full max-w-[1550px] mx-auto space-y-6 pb-6">
      {/* 1. User Prompt Header Console */}
      <Card className="p-6 bg-white dark:bg-[#11131c] border border-slate-200/80 dark:border-white/[0.08] shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shrink-0 shadow-lg shadow-blue-500/20">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2 font-sans">
                Evaluator Benchmark Challenge
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wide border border-blue-500/30">
                  Verified Prompt
                </span>
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-400 font-mono flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {new Date(comparison.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161824] border border-slate-200/70 dark:border-white/10 text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-sans font-semibold shadow-2xs">
              {comparison.problem}
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Side-by-Side 50/50 Solution Evaluation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <SolutionCard
          modelName={comparison.solution_1_model}
          markdownContent={comparison.solution_1}
          solutionNumber={1}
          score={comparison.judge?.solution_1_score}
          isWinner={comparison.judge?.winner === 'solution_1'}
        />
        <SolutionCard
          modelName={comparison.solution_2_model}
          markdownContent={comparison.solution_2}
          solutionNumber={2}
          score={comparison.judge?.solution_2_score}
          isWinner={comparison.judge?.winner === 'solution_2'}
        />
      </div>

      {/* 3. Automated AI Judge Recommendation Card */}
      {comparison.judge && (
        <JudgeRecommendationCard
          judge={comparison.judge}
          solution1Model={comparison.solution_1_model}
          solution2Model={comparison.solution_2_model}
        />
      )}
    </div>
  );
};
