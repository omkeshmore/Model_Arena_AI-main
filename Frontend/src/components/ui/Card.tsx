import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  highlight?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  highlight = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white dark:bg-[#11131c]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-xl transition-all duration-300 relative overflow-hidden backdrop-blur-md",
        highlight && "border-blue-500/60 dark:border-blue-500/50 shadow-md shadow-blue-500/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
