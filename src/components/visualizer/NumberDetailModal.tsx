import React from 'react';
import { RSAKeys } from '../../types/rsa';
import { X, Lock, Unlock, Sparkles } from 'lucide-react';
import { getModularExponentiationSteps } from '../../utils/rsa';

interface NumberDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  charIndex: number;
  char: string;
  m: bigint;
  c: bigint;
  keys: RSAKeys;
}

export const NumberDetailModal: React.FC<NumberDetailModalProps> = ({
  isOpen,
  onClose,
  charIndex,
  char,
  m,
  c,
  keys,
}) => {
  if (!isOpen) return null;

  const encSteps = getModularExponentiationSteps(m, keys.e, keys.n);
  const decSteps = getModularExponentiationSteps(c, keys.d, keys.n);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-mono font-bold text-lg">
              {char}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Deep Math Inspector: '{char}' (Position #{charIndex + 1})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed step-by-step arithmetic from message to ciphertext and back.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* High-level Node Flow */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Transformation Pipeline:
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs sm:text-sm">
            <div className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Symbol</div>
              <div className="font-bold text-base text-slate-900 dark:text-white">'{char}'</div>
            </div>
            <span className="text-slate-400">→</span>
            <div className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-center">
              <div className="text-[10px] text-amber-600 uppercase">Number m</div>
              <div className="font-bold text-base text-amber-700 dark:text-amber-300">{m.toString()}</div>
            </div>
            <span className="text-slate-400">→</span>
            <div className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-center">
              <div className="text-[10px] text-indigo-600 uppercase">Encrypt mᵉ mod n</div>
              <div className="font-bold text-base text-indigo-700 dark:text-indigo-300">c = {c.toString()}</div>
            </div>
            <span className="text-slate-400">→</span>
            <div className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center">
              <div className="text-[10px] text-emerald-600 uppercase">Decrypt cᵈ mod n</div>
              <div className="font-bold text-base text-emerald-700 dark:text-emerald-300">m = {m.toString()}</div>
            </div>
            <span className="text-slate-400">→</span>
            <div className="px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Recovered</div>
              <div className="font-bold text-base text-emerald-600 dark:text-emerald-400">'{char}'</div>
            </div>
          </div>
        </div>

        {/* Two Columns: Encryption vs Decryption Step Trace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Encryption Math */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 text-sm font-semibold">
              <Lock className="w-4 h-4" />
              <span>Encryption: c ≡ {m.toString()}<sup>{keys.e.toString()}</sup> mod {keys.n.toString()}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-500 font-semibold mb-1">
                Square-and-Multiply Exponentiation:
              </div>
              <div className="space-y-1 text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto pr-1">
                {encSteps.map((s, idx) => (
                  <div key={idx} className="border-b border-slate-100 dark:border-slate-800/80 pb-1">
                    {s}
                  </div>
                ))}
              </div>
              <div className="pt-2 font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                Ciphertext Output c = {c.toString()}
              </div>
            </div>
          </div>

          {/* Decryption Math */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
              <Unlock className="w-4 h-4" />
              <span>Decryption: m ≡ {c.toString()}<sup>{keys.d.toString()}</sup> mod {keys.n.toString()}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-500 font-semibold mb-1">
                Square-and-Multiply Exponentiation:
              </div>
              <div className="space-y-1 text-slate-700 dark:text-slate-300 max-h-48 overflow-y-auto pr-1">
                {decSteps.slice(0, 10).map((s, idx) => (
                  <div key={idx} className="border-b border-slate-100 dark:border-slate-800/80 pb-1">
                    {s}
                  </div>
                ))}
                {decSteps.length > 10 && (
                  <div className="text-slate-400 italic">
                    ... +{decSteps.length - 10} more repeated squaring steps ...
                  </div>
                )}
              </div>
              <div className="pt-2 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                Recovered m = {m.toString()} ⟹ '{char}'
              </div>
            </div>
          </div>
        </div>

        {/* Why it works mathematical box */}
        <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/50 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 leading-relaxed">
          <div className="font-semibold text-slate-900 dark:text-white flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Mathematical Proof of Recovery:</span>
          </div>
          <p>
            By definition of the modular inverse, <em>e × d ≡ 1 (mod φ(n))</em>, meaning <em>e × d = k × φ(n) + 1</em> for some integer <em>k</em>.
          </p>
          <p className="font-mono text-indigo-700 dark:text-indigo-300">
            cᵈ ≡ (mᵉ)ᵈ ≡ m^(e·d) ≡ m^(k·φ(n) + 1) ≡ (m^φ(n))^k × m ≡ 1^k × m ≡ m (mod n)
          </p>
          <p>
            Because Euler's Totient Theorem guarantees <em>m^φ(n) ≡ 1 (mod n)</em> when <em>gcd(m, n) = 1</em>!
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
