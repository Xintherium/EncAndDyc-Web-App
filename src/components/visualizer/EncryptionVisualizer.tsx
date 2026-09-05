import React from 'react';
import { RSAKeys, EncryptCharState } from '../../types/rsa';
import { ArrowDown, ArrowRight, Lock } from 'lucide-react';

interface EncryptionVisualizerProps {
  keys: RSAKeys;
  charStates: EncryptCharState[];
  activeCharIndex: number;
  onSelectCharIndex: (index: number) => void;
  onCompleteAll: () => void;
}

export const EncryptionVisualizer: React.FC<EncryptionVisualizerProps> = ({
  keys,
  charStates,
  activeCharIndex,
  onSelectCharIndex,
  onCompleteAll,
}) => {
  const activeItem = charStates[activeCharIndex] || charStates[0];
  const e = keys.e;
  const n = keys.n;

  if (!activeItem) {
    return null;
  }

  const m = activeItem.m;
  const c = activeItem.c;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs font-mono">
            03
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
              Step 3: Encryption Transformation Pipeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Applying the public key (e = {e.toString()}, n = {n.toString()}) using formula{' '}
              <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">c ≡ mᵉ (mod n)</span>.
            </p>
          </div>
        </div>

        <button
          onClick={onCompleteAll}
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline self-start sm:self-auto"
        >
          Fast-Forward All Chars
        </button>
      </div>

      {/* Character Carousel / Progress Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span className="font-semibold">Message Characters (Click to inspect):</span>
          <span>
            {charStates.filter(c => c.state === 'completed').length} / {charStates.length} Encrypted
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {charStates.map((item, idx) => {
            const isActive = idx === activeCharIndex;
            return (
              <button
                key={idx}
                onClick={() => onSelectCharIndex(idx)}
                className={`flex flex-col items-center p-2.5 rounded-xl border transition-all min-w-[64px] sm:min-w-[72px] relative ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 ring-2 ring-indigo-500/40 shadow-sm scale-105'
                    : item.state === 'completed'
                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60'
                }`}
              >
                <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {item.char}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  m={item.m.toString()}
                </span>
                <div className="mt-1">
                  {item.state === 'completed' ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      c={item.c.toString()}
                    </span>
                  ) : item.state === 'processing' ? (
                    <span className="text-[9px] font-mono text-amber-500 animate-pulse font-semibold">
                      calc...
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-slate-400">
                      idle
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Step-by-Step Transformation Flow */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
              Active Character: '{activeItem.char}' (Position {activeCharIndex + 1})
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              m = {m.toString()}
            </span>
          </div>

          <div className="flex items-center space-x-1 text-xs font-mono text-indigo-600 dark:text-indigo-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Public Exponent e = {e.toString()}</span>
          </div>
        </div>

        {/* Animated Card Nodes Connected by Arrows */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {/* Node 1: Original Character */}
          <div className="flex flex-col items-center p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-center">
            <span className="text-[10px] uppercase font-mono font-semibold text-slate-400">
              1. Plaintext Symbol
            </span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white my-1">
              {activeItem.char}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Input Symbol
            </span>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowRight className="w-5 h-5 hidden md:block" />
            <ArrowDown className="w-5 h-5 md:hidden" />
          </div>

          {/* Node 2: Numeric Value m */}
          <div className="flex flex-col items-center p-4 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/50 dark:bg-amber-950/30 text-center">
            <span className="text-[10px] uppercase font-mono font-semibold text-amber-700 dark:text-amber-400">
              2. Number Encoding
            </span>
            <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-300 my-1">
              m = {m.toString()}
            </span>
            <span className="text-xs font-mono text-amber-700/70 dark:text-amber-400/70">
              m &lt; n ({n.toString()})
            </span>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowRight className="w-5 h-5 hidden md:block" />
            <ArrowDown className="w-5 h-5 md:hidden" />
          </div>

          {/* Node 3: Modular Exponentiation */}
          <div className="flex flex-col items-center p-4 rounded-xl border-2 border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 text-center">
            <span className="text-[10px] uppercase font-mono font-semibold text-indigo-700 dark:text-indigo-300">
              3. Ciphertext Formula
            </span>
            <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 my-1">
              c ≡ {m.toString()}<sup>{e.toString()}</sup> mod {n.toString()}
            </span>
            <span className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
              = {c.toString()}
            </span>
          </div>
        </div>

        {/* Detailed Modular Exponentiation Steps Display */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Mathematical Transformation Breakdown:</span>
            <span className="font-mono text-[11px] text-slate-400">Modulo Arithmetic</span>
          </div>

          <div className="font-mono text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
            <div className="flex items-start space-x-2">
              <span className="text-slate-400">•</span>
              <div>
                <strong>Raise to power:</strong> {m.toString()}<sup>{e.toString()}</sup> = {activeItem.powerCalcStr}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <span className="text-slate-400">•</span>
              <div>
                <strong>Reduce modulo {n.toString()}:</strong> {activeItem.modCalcStr} ={' '}
                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                  {c.toString()}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
            Because <em>e</em> is public, anyone can perform this calculation. But only the holder of <em>d</em> can reverse it.
          </p>
        </div>
      </div>
    </div>
  );
};
