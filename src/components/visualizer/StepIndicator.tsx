import React from 'react';
import { StageId, StageInfo } from '../../types/rsa';
import { Check, ChevronRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStage: StageId;
  onSelectStage: (stage: StageId) => void;
}

export const STAGES: StageInfo[] = [
  { id: 'keygen', stepNumber: 1, label: 'Key Generation', description: 'p, q → n, φ(n), e, d' },
  { id: 'message', stepNumber: 2, label: 'Message', description: 'Chars → Numbers (m)' },
  { id: 'encryption', stepNumber: 3, label: 'Encryption', description: 'c = mᵉ mod n' },
  { id: 'ciphertext', stepNumber: 4, label: 'Ciphertext', description: 'Transmitted Numbers' },
  { id: 'decryption', stepNumber: 5, label: 'Decryption', description: 'm = cᵈ mod n' },
  { id: 'result', stepNumber: 6, label: 'Result', description: 'Numbers → Original Chars' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStage, onSelectStage }) => {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {STAGES.map((stage, idx) => {
          const isCurrent = stage.id === currentStage;
          const isPassed = idx < currentIndex;

          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`flex flex-col items-start text-left p-2.5 sm:p-3 rounded-xl transition-all duration-200 border relative group ${
                isCurrent
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm ring-1 ring-indigo-500/20'
                  : isPassed
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 hover:border-emerald-300'
                  : 'border-slate-200/70 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-mono font-bold ${
                    isCurrent
                      ? 'bg-indigo-600 text-white'
                      : isPassed
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {isPassed ? <Check className="w-3 h-3" /> : `0${stage.stepNumber}`}
                </span>

                <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  {idx < STAGES.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 hidden lg:block" />
                  )}
                </span>
              </div>

              <span
                className={`text-xs font-semibold tracking-tight ${
                  isCurrent
                    ? 'text-indigo-950 dark:text-indigo-200'
                    : isPassed
                    ? 'text-slate-900 dark:text-slate-200'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {stage.label}
              </span>

              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate w-full mt-0.5">
                {stage.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
