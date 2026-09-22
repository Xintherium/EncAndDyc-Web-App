import React from 'react';

interface Props {
  onStart: () => void;
}

export const HeroScreen: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col items-center justify-center p-6 select-none">
      {/* Decorative Pastel Bubbles */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-48 h-48 bg-amber-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="relative max-w-md w-full text-center space-y-8 animate-fade-in z-10">
        {/* Minimal Pastel Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100/80 border border-violet-200/60 text-violet-700 text-xs font-mono font-medium">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span>interactive mathematics laboratory</span>
        </div>

        {/* Minimal Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 font-sans">
            RSA <span className="text-violet-500 font-serif italic font-normal">Alive</span>
          </h1>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
            An interactive, living journey through public-key encryption. No complex dashboards — just step-by-step discovery.
          </p>
        </div>

        {/* Interactive mini preview pills */}
        <div className="flex items-center justify-center gap-2 text-xs font-mono py-2">
          <span className="px-3 py-1 rounded-lg bg-stone-100 text-stone-600 border border-stone-200">
            p & q
          </span>
          <span className="text-stone-300">→</span>
          <span className="px-3 py-1 rounded-lg bg-violet-100 text-violet-700 border border-violet-200">
            keys
          </span>
          <span className="text-stone-300">→</span>
          <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-700 border border-amber-200">
            encrypt
          </span>
          <span className="text-stone-300">→</span>
          <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200">
            decrypt
          </span>
        </div>

        {/* Big Start Button */}
        <div className="pt-2">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-stone-900/10 cursor-pointer"
          >
            Start Exploring →
          </button>
        </div>

        {/* Educational safety notice */}
        <p className="text-[11px] text-stone-400 font-mono tracking-tight pt-4">
          uses small educational primes for transparency · pure in-browser math
        </p>
      </div>
    </div>
  );
};
