import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ComparisonObject } from '../../types';
import { Avatar } from '../ui/Avatar';
import { 
  MessageSquare, 
  Plus, 
  Sun, 
  Moon, 
  LogOut, 
  Layers, 
  ChevronRight, 
  Trash2, 
  X,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  comparisons: ComparisonObject[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewComparison: () => void;
  onClearAll?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  comparisons,
  activeId,
  onSelect,
  onNewComparison,
  onClearAll,
  isOpen,
  onClose,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Fixed Sidebar Console Layout */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-72 h-full bg-[#f8fafc]/95 dark:bg-[#0d0e14]/95 border-r border-slate-200 dark:border-white/[0.07] flex flex-col justify-between overflow-hidden shrink-0 transition-all duration-300 ease-in-out backdrop-blur-2xl ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:w-72'
        }`}
      >
        {/* Top Header: Brand & New Battle Button */}
        <div className="p-4 border-b border-slate-200 dark:border-white/[0.07] shrink-0 bg-white/50 dark:bg-white/[0.02]">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold shadow-lg shadow-blue-500/25">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
                  ModelArena <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-black uppercase border border-blue-500/30">PRO</span>
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                  SaaS Evaluation Engine
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 lg:hidden cursor-pointer"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onNewComparison();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-md dark:shadow-white/10 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Comparison Battle</span>
          </motion.button>
        </div>

        {/* Center: Scrollable Battles History */}
        <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-1.5 scrollbar-thin">
          <div className="px-2 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Recent Evaluations
            </span>
            {comparisons.length > 0 && onClearAll && (
              <button
                onClick={onClearAll}
                className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors inline-flex items-center gap-1 cursor-pointer text-[11px] font-medium"
                title="Clear workspace history"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {comparisons.length === 0 ? (
            <div className="text-center py-12 px-4 text-xs text-slate-400 dark:text-slate-500">
              <div className="w-10 h-10 rounded-xl bg-slate-200/60 dark:bg-white/5 flex items-center justify-center mx-auto mb-2.5">
                <MessageSquare className="w-5 h-5 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-600 dark:text-slate-400">No battle history yet</p>
              <p className="mt-1 text-[11px] leading-relaxed">Submit an algorithmic challenge in the input console below to generate dual AI benchmarks.</p>
            </div>
          ) : (
            comparisons.map((item) => {
              const isSelected = item.id === activeId;
              const title = item.problem.length > 38 ? item.problem.substring(0, 38) + '...' : item.problem;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer text-xs font-medium ${
                    isSelected
                      ? 'bg-blue-500/10 text-blue-600 dark:bg-white/10 dark:text-white font-bold border border-blue-500/30 dark:border-white/20 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate leading-relaxed">{title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-opacity ${isSelected ? 'opacity-100 text-blue-500 dark:text-white' : 'opacity-0 group-hover:opacity-50'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Bottom Footer: Sleek Segmented Dual-Pill Glass Switch & User Profile */}
        <div className="p-3.5 border-t border-slate-200 dark:border-white/[0.07] bg-white/70 dark:bg-[#11131c]/80 shrink-0 space-y-2.5 backdrop-blur-md">
          
          {/* Creative Compact Segmented Dual-Pill Glass Theme Switch */}
          <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-[#07080e] border border-slate-300/80 dark:border-white/10 relative flex items-center shadow-inner select-none font-mono text-xs">
            {/* Sliding Glass Capsule Glider */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl shadow-md border backdrop-blur-md ${
                theme === 'dark'
                  ? 'left-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-blue-400/40 text-white shadow-blue-500/30'
                  : 'left-[calc(50%+2px)] bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 border-amber-300/60 text-slate-950 shadow-amber-500/30'
              }`}
            />

            {/* Dark Mode Button Segment */}
            <button
              type="button"
              onClick={(e) => theme !== 'dark' && toggleTheme(e)}
              className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 z-10 font-bold transition-all cursor-pointer ${
                theme === 'dark' ? 'text-white font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'fill-blue-100/30 text-white' : ''}`} />
              <span className="text-[11px] tracking-tight font-sans">Dark</span>
            </button>

            {/* Light Mode Button Segment */}
            <button
              type="button"
              onClick={(e) => theme !== 'light' && toggleTheme(e)}
              className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1.5 z-10 font-bold transition-all cursor-pointer ${
                theme === 'light' ? 'text-slate-950 font-extrabold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'fill-amber-950/20 text-slate-950' : ''}`} />
              <span className="text-[11px] tracking-tight font-sans">Light</span>
            </button>
          </div>

          {/* User Profile & Logout */}
          {user && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#161824] border border-slate-200/80 dark:border-white/[0.08] shadow-sm flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={user.name} src={user.avatar} size="sm" online={true} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate font-sans">
                      {user.name}
                    </p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Eval License" />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate font-mono">
                    {user.email || 'Principal Architect'}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 cursor-pointer"
                title="Log out of account"
              >
                <LogOut className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
