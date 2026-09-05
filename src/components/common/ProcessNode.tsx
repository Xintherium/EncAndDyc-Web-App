import React from 'react';
import { ProcessingState } from '../../types/rsa';
import { Check, Loader2 } from 'lucide-react';

interface ProcessNodeProps {
  label: string;
  sublabel?: string;
  value: string | number | bigint;
  state?: ProcessingState;
  onClick?: () => void;
  isHighlighted?: boolean;
  color?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'slate';
  size?: 'sm' | 'md' | 'lg';
}

export const ProcessNode: React.FC<ProcessNodeProps> = ({
  label,
  sublabel,
  value,
  state = 'idle',
  onClick,
  isHighlighted = false,
  color = 'indigo',
  size = 'md',
}) => {
  const getColorClasses = () => {
    if (state === 'processing') {
      return 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 ring-2 ring-amber-400/40 animate-pulse';
    }
    if (state === 'completed') {
      switch (color) {
        case 'emerald':
          return 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100';
        case 'purple':
          return 'border-purple-300 dark:border-purple-700 bg-purple-50/70 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100';
        case 'amber':
          return 'border-amber-300 dark:border-amber-700 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100';
        default:
          return 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/70 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-100';
      }
    }
    // idle
    return 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2.5 py-1.5 min-w-[70px]';
      case 'lg':
        return 'px-4 py-3 min-w-[120px]';
      default:
        return 'px-3 py-2 min-w-[90px]';
    }
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative rounded-xl border flex flex-col items-center justify-center transition-all duration-200 select-none ${
        onClick ? 'cursor-pointer hover:shadow-md hover:scale-105 active:scale-95' : ''
      } ${getColorClasses()} ${getSizeClasses()} ${
        isHighlighted ? 'ring-2 ring-indigo-500 shadow-md' : 'shadow-xs'
      }`}
    >
      {/* State badge */}
      {state === 'processing' && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center animate-spin">
          <Loader2 className="w-2.5 h-2.5" />
        </span>
      )}
      {state === 'completed' && (
        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
          <Check className="w-2.5 h-2.5" />
        </span>
      )}

      <span className="text-[10px] uppercase font-mono font-medium tracking-wider opacity-70">
        {label}
      </span>
      <span className="font-mono font-bold text-sm sm:text-base tracking-tight my-0.5">
        {String(value)}
      </span>
      {sublabel && (
        <span className="text-[10px] font-mono opacity-60">
          {sublabel}
        </span>
      )}
    </div>
  );
};
