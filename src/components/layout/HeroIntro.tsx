import React from 'react';
import { ArrowRight, Lock, Key, Unlock, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroIntroProps {
  onExplore: () => void;
  onLoadExample: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({ onExplore, onLoadExample }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-50/50 via-slate-50/20 to-transparent dark:from-indigo-950/20 dark:via-slate-900/10 dark:to-transparent border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 mb-8">
      <div className="max-w-4xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100/70 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Mathematics Exhibition</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          RSA turns mathematics into a way of communicating securely without sharing a secret key.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          In symmetric ciphers, both parties need the exact same secret password. RSA solved this historic dilemma:
          one key to lock (Public), and a mathematically paired key to unlock (Private).
        </p>

        {/* Pipeline Diagram */}
        <div className="py-2 overflow-x-auto">
          <div className="inline-flex items-center justify-center space-x-2 sm:space-x-3 text-xs font-mono py-2 px-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-slate-700 dark:text-slate-300">
              MESSAGE
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-2 py-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 rounded border border-amber-200/40 dark:border-amber-800/40">
              NUMBER
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200/40 dark:border-indigo-800/40 flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>ENCRYPT (mᵉ mod n)</span>
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-2 py-1 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 rounded border border-purple-200/40 dark:border-purple-800/40 font-semibold">
              CIPHERTEXT
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200/40 dark:border-emerald-800/40 flex items-center space-x-1">
              <Unlock className="w-3 h-3" />
              <span>DECRYPT (cᵈ mod n)</span>
            </span>
            <span className="text-slate-400">→</span>
            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-semibold text-slate-700 dark:text-slate-300">
              ORIGINAL MESSAGE
            </span>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onExplore}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm sm:text-base shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Explore RSA Visualizer</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLoadExample}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-sm sm:text-base border border-slate-200 dark:border-slate-700 transition-all"
          >
            <Key className="w-4 h-4 text-indigo-500" />
            <span>Load "HELLO" Example</span>
          </button>
        </div>
      </div>
    </div>
  );
};
