import React from 'react';
import { RSAKeys, DecryptCharState } from '../../types/rsa';
import { ArrowDown, ArrowRight, Key } from 'lucide-react';

interface DecryptionVisualizerProps {
  keys: RSAKeys;
  charStates: DecryptCharState[];
  activeCharIndex: number;
  onSelectCharIndex: (index: number) => void;
  onCompleteAll: () => void;
}

export const DecryptionVisualizer: React.FC<DecryptionVisualizerProps> = ({
  keys,
  charStates,
  activeCharIndex,
  onSelectCharIndex,
  onCompleteAll,
}) => {
  const activeItem = charStates[activeCharIndex] || charStates[0];
  const d = keys.d;
  const n = keys.n;

  if (!activeItem) {
    return null;
  }

  const c = activeItem.c;
  const m = activeItem.m;
  const char = activeItem.char;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs font-mono">
            05
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
              Step 5: Decryption Recovery Pipeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Applying the recipient's private key (d = {d.toString()}, n = {n.toString()}) using formula{' '}
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">m ≡ cᵈ (mod n)</span>.
            </p>
          </div>
        </div>

        <button
          onClick={onCompleteAll}
          className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline self-start sm:self-auto"
        >
          Fast-Forward All Chars
        </button>
      </div>

      {/* Asymmetry Highlight Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center space-x-2 text-indigo-900 dark:text-indigo-200">
          <div className="p-1.5 rounded-lg bg-indigo-200/50 dark:bg-indigo-900/50 font-bold font-mono">
            ENC
          </div>
          <div>
            <strong>Encryption used PUBLIC KEY:</strong> (e = {keys.e.toString()}, n = {n.toString()})
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center space-x-2 text-emerald-900 dark:text-emerald-200">
          <div className="p-1.5 rounded-lg bg-emerald-200/50 dark:bg-emerald-900/50 font-bold font-mono text-emerald-700 dark:text-emerald-300">
            DEC
          </div>
          <div>
            <strong>Decryption uses PRIVATE KEY:</strong> (d = {d.toString()}, n = {n.toString()})
          </div>
        </div>
      </div>

      {/* Character Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span className="font-semibold">Ciphertext Items (Click to inspect):</span>
          <span>
            {charStates.filter(c => c.state === 'completed').length} / {charStates.length} Decrypted
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
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 ring-2 ring-emerald-500/40 shadow-sm scale-105'
                    : item.state === 'completed'
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-60'
                }`}
              >
                <span className="text-sm font-bold font-mono text-purple-700 dark:text-purple-300">
                  c={item.c.toString()}
                </span>
                <div className="mt-1">
                  {item.state === 'completed' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        '{item.char}'
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">m={item.m.toString()}</span>
                    </div>
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

      {/* Featured Step-by-Step Decryption Transformation */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
              Active Ciphertext: c = {c.toString()} (Position {activeCharIndex + 1})
            </span>
          </div>

          <div className="flex items-center space-x-1 text-xs font-mono text-emerald-600 dark:text-emerald-400">
            <Key className="w-3.5 h-3.5" />
            <span>Private Exponent d = {d.toString()}</span>
          </div>
        </div>

        {/* Step-by-step horizontal transformation cards */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5 items-center">
          {/* 1. Ciphertext Value */}
          <div className="flex flex-col items-center p-3.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 text-center">
            <span className="text-[9px] uppercase font-mono font-semibold text-purple-700 dark:text-purple-400">
              1. Ciphertext
            </span>
            <span className="text-xl font-bold font-mono text-purple-700 dark:text-purple-300 my-1">
              c = {c.toString()}
            </span>
            <span className="text-[10px] font-mono text-purple-600/80 dark:text-purple-400/80">
              Encrypted
            </span>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowRight className="w-4 h-4 hidden md:block" />
            <ArrowDown className="w-4 h-4 md:hidden" />
          </div>

          {/* 2. Raise to power d */}
          <div className="flex flex-col items-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-center">
            <span className="text-[9px] uppercase font-mono font-semibold text-slate-400">
              2. Raise to d
            </span>
            <span className="text-base font-bold font-mono text-slate-900 dark:text-white my-1">
              {c.toString()}<sup>{d.toString()}</sup>
            </span>
            <span className="text-[10px] font-mono text-slate-500 truncate max-w-[100px]">
              Power value
            </span>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowRight className="w-4 h-4 hidden md:block" />
            <ArrowDown className="w-4 h-4 md:hidden" />
          </div>

          {/* 3. Modulo n */}
          <div className="flex flex-col items-center p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-center">
            <span className="text-[9px] uppercase font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              3. Modulo n
            </span>
            <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-300 my-1">
              mod {n.toString()}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              m = {m.toString()}
            </span>
          </div>

          <div className="flex justify-center text-slate-400">
            <ArrowRight className="w-4 h-4 hidden md:block" />
            <ArrowDown className="w-4 h-4 md:hidden" />
          </div>

          {/* 4. Recovered Character */}
          <div className="flex flex-col items-center p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-100/70 dark:bg-emerald-900/40 text-center">
            <span className="text-[9px] uppercase font-mono font-semibold text-emerald-800 dark:text-emerald-300">
              4. Recovered Char
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-100 my-1">
              '{char}'
            </span>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
              Matched!
            </span>
          </div>
        </div>

        {/* Mathematical Detail Card */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Decryption Mathematical Breakdown:</span>
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">Euler's Totient Trapdoor</span>
          </div>

          <div className="font-mono text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
            <div className="flex items-start space-x-2">
              <span className="text-slate-400">•</span>
              <div>
                <strong>Inverse transformation:</strong> m ≡ cᵈ (mod n) ≡ ({activeItem.c.toString()})<sup>{d.toString()}</sup> (mod {n.toString()})
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <span className="text-slate-400">•</span>
              <div>
                <strong>Calculation:</strong> {activeItem.modCalcStr} ={' '}
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {m.toString()}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <span className="text-slate-400">•</span>
              <div>
                <strong>Alphabet lookup:</strong> Number {m.toString()} maps back to letter{' '}
                <strong className="text-emerald-600 dark:text-emerald-400 text-base">'{char}'</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
