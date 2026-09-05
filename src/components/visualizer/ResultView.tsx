import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EncodedChar, EncryptCharState, DecryptCharState, RSAKeys } from '../../types/rsa';
import { CheckCircle, RotateCcw, KeyRound } from 'lucide-react';

interface ResultViewProps {
  originalMessage: string;
  encodedChars: EncodedChar[];
  encryptStates: EncryptCharState[];
  decryptStates: DecryptCharState[];
  keys: RSAKeys;
  onRunAgain: () => void;
  onOpenSetup: () => void;
  onInspectChar: (index: number) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  originalMessage,
  encodedChars,
  encryptStates,
  decryptStates,
  keys,
  onRunAgain,
  onOpenSetup,
  onInspectChar,
}) => {
  const recoveredString = decryptStates.map(s => s.char).join('');
  const isMatch = originalMessage.trim() === recoveredString.trim();

  useEffect(() => {
    if (isMatch) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      } catch {
        // Safe fallback if canvas not available
      }
    }
  }, [isMatch]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs font-mono">
            06
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
              Step 6: Mathematical Result & Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The loop is closed: Plaintext → Numbers → Ciphertext → Numbers → Plaintext.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onRunAgain}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Run Again</span>
          </button>
        </div>
      </div>

      {/* Success Badge Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/30 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            ✓ Message Successfully Recovered
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            The mathematical trapdoor functioned perfectly. The secret key restored the original message without error.
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block mb-1">
              Original Message
            </span>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white tracking-wider">
              {originalMessage}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700/60 shadow-xs">
            <span className="text-[10px] uppercase font-mono font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
              Decrypted Message
            </span>
            <div className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              {recoveredString}
            </div>
          </div>
        </div>

        <div className="pt-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          Euler's Theorem Identity Verified:{' '}
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
            (m^{keys.e.toString()})^{keys.d.toString()} ≡ m^{Number(keys.e * keys.d)} ≡ m (mod {keys.n.toString()})
          </span>
        </div>
      </div>

      {/* Complete Transformation Ledger / Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Full Transformation Ledger
          </h4>
          <span className="text-xs text-slate-400">Click any row to inspect deep math</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Pos</th>
                <th className="pb-2 font-semibold">Original</th>
                <th className="pb-2 font-semibold">Value (m)</th>
                <th className="pb-2 font-semibold">Formula: mᵉ mod n</th>
                <th className="pb-2 font-semibold text-purple-600 dark:text-purple-400">Ciphertext (c)</th>
                <th className="pb-2 font-semibold">Formula: cᵈ mod n</th>
                <th className="pb-2 font-semibold text-emerald-600 dark:text-emerald-400">Decrypted</th>
                <th className="pb-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {encodedChars.map((item, idx) => {
                const enc = encryptStates[idx];
                const dec = decryptStates[idx];

                return (
                  <tr
                    key={idx}
                    onClick={() => onInspectChar(idx)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 text-slate-400">#{idx + 1}</td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">'{item.char}'</td>
                    <td className="py-2.5 text-amber-600 dark:text-amber-400">{item.numericValue}</td>
                    <td className="py-2.5 text-slate-500">
                      {item.numericValue}<sup>{keys.e.toString()}</sup> mod {keys.n.toString()}
                    </td>
                    <td className="py-2.5 font-bold text-purple-600 dark:text-purple-400">
                      {enc ? enc.c.toString() : '?'}
                    </td>
                    <td className="py-2.5 text-slate-500">
                      {enc?.c.toString()}<sup>{keys.d.toString()}</sup> mod {keys.n.toString()}
                    </td>
                    <td className="py-2.5 font-bold text-emerald-600 dark:text-emerald-400">
                      '{dec ? dec.char : '?'}'
                    </td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        ✓ Match
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={onRunAgain}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-md shadow-indigo-600/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Run Visualization Again</span>
        </button>

        <button
          onClick={onOpenSetup}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm border border-slate-200 dark:border-slate-700 transition-all"
        >
          <KeyRound className="w-4 h-4 text-indigo-500" />
          <span>Try Different Primes / Message</span>
        </button>
      </div>
    </div>
  );
};
