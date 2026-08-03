import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Lightfall } from '../ui/Lightfall';
import { Layers, Lock, Mail, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!email.includes('@')) {
        throw new Error('Please input a valid business email.');
      }
      if (password.length < 6) {
        throw new Error('Password must exceed 6 characters.');
      }
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Authentication error.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fb] dark:bg-[#0a0b10] px-4 py-8 relative overflow-hidden">
      {/* Animated Cascading Lightfall Background */}
      <Lightfall />

      {/* Ambient background lighting mesh */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] pointer-events-none z-0" />

      <Card className="w-full max-w-md p-8 sm:p-9 border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#11131c]/95 shadow-2xl rounded-3xl relative z-10 backdrop-blur-2xl">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-xl shadow-blue-500/25">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            ModelArena AI Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
            Production-grade side-by-side LLM eval & automated scoring
          </p>
        </div>

        {error && (
          <div className="p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <div className="p-3.5 mb-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-300 flex items-center justify-between font-mono">
          <span className="flex items-center gap-2 font-bold">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0 animate-pulse" />
            Enterprise Model Evaluation Studio
          </span>
          <span className="text-[10px] uppercase font-black bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md">Secure Login</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Workplace Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={<Mail className="w-4 h-4 text-slate-400" />}
            placeholder="name@company.ai"
          />
          <Input
            label="Password Authentication"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            placeholder="••••••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center gap-2.5 mt-4 font-black h-12 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 cursor-pointer rounded-xl"
            isLoading={isLoading}
          >
            <span>Launch Evaluation Arena</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="mt-7 pt-6 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>Don't have workspace access?</span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Request account</span>
            <span>&rarr;</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            SOC2 Type II Protected & • Enterprise Model Isolations
          </span>
        </div>
      </Card>
    </div>
  );
};
