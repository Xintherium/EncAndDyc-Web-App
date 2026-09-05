import React from 'react';

interface MathCardProps {
  title?: string;
  formula: string;
  calculation?: string;
  result?: string;
  explanation?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  badge?: string;
  badgeColor?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'slate';
  accent?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'slate';
}

export const MathCard: React.FC<MathCardProps> = ({
  title,
  formula,
  calculation,
  result,
  explanation,
  isActive = false,
  isCompleted = false,
  badge,
  badgeColor = 'indigo',
  accent = 'indigo',
}) => {
  const getAccentStyles = () => {
    switch (accent) {
      case 'emerald':
        return 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-950/20';
      case 'amber':
        return 'border-amber-300 dark:border-amber-700/60 bg-amber-50/40 dark:bg-amber-950/20';
      case 'purple':
        return 'border-purple-300 dark:border-purple-700/60 bg-purple-50/40 dark:bg-purple-950/20';
      default:
        return 'border-indigo-300 dark:border-indigo-700/60 bg-indigo-50/40 dark:bg-indigo-950/20';
    }
  };

  const getBadgeStyles = () => {
    switch (badgeColor) {
      case 'emerald':
        return 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'amber':
        return 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-300 p-4 sm:p-5 relative ${
        isActive
          ? `${getAccentStyles()} ring-2 ring-indigo-500/30 shadow-md shadow-indigo-500/10 scale-[1.01]`
          : isCompleted
          ? 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 shadow-sm opacity-90'
          : 'border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 opacity-70'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        {title && (
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </h4>
        )}
        {badge && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${getBadgeStyles()}`}>
            {badge}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white tracking-wide">
          {formula}
        </div>

        {calculation && (
          <div className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300">
            {calculation}
          </div>
        )}

        {result && (
          <div className="text-xs sm:text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400 pt-0.5">
            = {result}
          </div>
        )}
      </div>

      {explanation && (
        <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2">
          {explanation}
        </p>
      )}
    </div>
  );
};
