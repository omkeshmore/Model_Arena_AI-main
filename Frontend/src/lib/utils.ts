import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(dateStr?: string): string {
  const date = dateStr ? new Date(dateStr) : new Date();
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function getScoreColor(score: number): { text: string; bg: string; border: string; bar: string } {
  if (score >= 90) {
    return {
      text: "text-emerald-500 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      border: "border-emerald-500/30 dark:border-emerald-500/40",
      bar: "bg-emerald-500",
    };
  }
  if (score >= 78) {
    return {
      text: "text-amber-500 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      border: "border-amber-500/30 dark:border-amber-500/40",
      bar: "bg-amber-500",
    };
  }
  return {
    text: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-500/10 dark:bg-rose-500/20",
    border: "border-rose-500/30 dark:border-rose-500/40",
    bar: "bg-rose-500",
  };
}
