import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const HeroScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 select-none transition-colors duration-500 z-10">
      <div className="max-w-2xl w-full text-center space-y-10 sm:space-y-12 animate-fade-in">
        {/* Pastel Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-100/80 dark:bg-violet-950/60 border border-violet-200/80 dark:border-violet-800/60 text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-mono font-medium shadow-xs">
          <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
          <span>Interactive Mathematics Laboratory</span>
        </div>

        {/* Large Prominent Hero Title */}
        <div className="space-y-5">
          <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 font-sans leading-none">
            RSA <span className="text-violet-500 dark:text-violet-400 font-serif italic font-normal">Alive</span>
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-lg sm:text-2xl leading-relaxed max-w-xl mx-auto font-light">
            A living, prompt-driven journey through public-key cryptography. Watch mathematics become a digital lock.
          </p>
        </div>

        {/* Big Pipeline Preview Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-sm sm:text-base font-mono py-2">
          <span className="px-4 py-2 rounded-xl bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-800 shadow-xs">
            primes p, q
          </span>
          <span className="text-stone-300 dark:text-stone-600 font-bold">→</span>
          <span className="px-4 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800 shadow-xs">
            keys (e, d, n)
          </span>
          <span className="text-stone-300 dark:text-stone-600 font-bold">→</span>
          <span className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 shadow-xs">
            encrypt mᵉ
          </span>
          <span className="text-stone-300 dark:text-stone-600 font-bold">→</span>
          <span className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 shadow-xs">
            decrypt cᵈ
          </span>
        </div>

        {/* Large Prominent Start Button */}
        <div className="pt-2">
          <button
            onClick={onStart}
            className="group inline-flex items-center justify-center gap-3 px-10 sm:px-12 py-4 sm:py-5 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-violet-500 dark:hover:bg-violet-400 text-white font-medium text-base sm:text-lg tracking-wide transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 shadow-lg shadow-stone-900/15 dark:shadow-violet-500/20 cursor-pointer"
          >
            <span>Start Exploration</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Subtle Educational Disclaimer */}
        <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 font-mono tracking-tight pt-4">
          demonstration with small primes · 100% in-browser exact BigInt mathematics
        </p>
      </div>
    </div>
  );
};
