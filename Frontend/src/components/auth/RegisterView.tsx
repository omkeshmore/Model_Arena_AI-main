import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Lightfall } from '../ui/Lightfall';
import { Layers, Lock, Mail, User, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

interface RegisterViewProps {
  onSwitchToLogin: () => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please input your full legal or display handle.');
      return;
    }
    if (!email.includes('@')) {
      setError('A valid workplace email address is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password entries do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
    } catch (err: any) {
      setError(err.message || 'Registration failure.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f4f6fb] dark:bg-[#0a0b10] px-4 py-8 relative overflow-hidden">
      {/* Animated Cascading Lightfall Background */}
      <Lightfall />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] pointer-events-none z-0" />

      <Card className="w-full max-w-md p-8 sm:p-9 border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#11131c]/95 shadow-2xl rounded-3xl relative z-10 backdrop-blur-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-3.5 shadow-xl shadow-blue-500/25">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Deploy Evaluator Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Access enterprise model comparison & automated scoring telemetry
          </p>
        </div>

        {error && (
          <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-bold text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Full Handle / Legal Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            icon={<User className="w-4 h-4 text-slate-400" />}
            placeholder="Omkesh More"
          />
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
            label="Create Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            placeholder="Min 8 characters"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            icon={<Lock className="w-4 h-4 text-slate-400" />}
            placeholder="Re-type password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center mt-3 font-black h-12 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 cursor-pointer rounded-xl"
            isLoading={isLoading}
          >
            <span>Create Account & Continue</span>
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>Already registered?</span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Zero Training Guarantee & Enterprise Isolation
          </span>
        </div>
      </Card>
    </div>
  );
};
