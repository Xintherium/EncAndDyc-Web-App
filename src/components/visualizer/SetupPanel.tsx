import React, { useState } from 'react';
import { RSAKeys, RSAPreset } from '../../types/rsa';
import { RSA_PRESETS, EDUCATIONAL_PRIMES } from '../../utils/presets';
import { isPrime, gcd, getSuggestedExponents } from '../../utils/rsa';
import { Sliders, CheckCircle2, XCircle, Info } from 'lucide-react';

interface SetupPanelProps {
  keys: RSAKeys;
  onApplyParameters: (p: number, q: number, e: number) => void;
  error?: string;
}

export const SetupPanel: React.FC<SetupPanelProps> = ({
  keys,
  onApplyParameters,
  error: externalError,
}) => {
  const [mode, setMode] = useState<'beginner' | 'custom'>('beginner');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(RSA_PRESETS[0].id);

  // Custom mode form state
  const [customP, setCustomP] = useState<number>(Number(keys.p));
  const [customQ, setCustomQ] = useState<number>(Number(keys.q));
  const [customE, setCustomE] = useState<number>(Number(keys.e));
  const [localError, setLocalError] = useState<string | null>(null);

  // Live validation calculations for custom inputs
  const pIsPrime = isPrime(customP);
  const qIsPrime = isPrime(customQ);
  const distinctPrimes = customP !== customQ;
  const tempPhi = pIsPrime && qIsPrime && distinctPrimes ? BigInt(customP - 1) * BigInt(customQ - 1) : null;
  const eCoprime = tempPhi ? customE > 1 && BigInt(customE) < tempPhi && gcd(BigInt(customE), tempPhi) === 1n : false;

  const handleSelectPreset = (preset: RSAPreset) => {
    setSelectedPresetId(preset.id);
    setCustomP(preset.p);
    setCustomQ(preset.q);
    setCustomE(preset.e);
    setLocalError(null);
    onApplyParameters(preset.p, preset.q, preset.e);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pIsPrime) {
      setLocalError(`p = ${customP} is not prime. Please select a prime number.`);
      return;
    }
    if (!qIsPrime) {
      setLocalError(`q = ${customQ} is not prime. Please select a prime number.`);
      return;
    }
    if (!distinctPrimes) {
      setLocalError('p and q must be distinct primes.');
      return;
    }
    if (!eCoprime) {
      setLocalError(`e = ${customE} must be greater than 1 and coprime to φ(n) = ${tempPhi}.`);
      return;
    }
    setLocalError(null);
    onApplyParameters(customP, customQ, customE);
  };

  const suggestedExponents = tempPhi ? getSuggestedExponents(tempPhi, 5) : [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm mb-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              RSA Setup & Prime Parameters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure the prime numbers (p, q) and public exponent (e) for the laboratory.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setMode('beginner')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              mode === 'beginner'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Presets (Beginner)
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              mode === 'custom'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Custom Primes
          </button>
        </div>
      </div>

      {/* Preset Mode */}
      {mode === 'beginner' && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RSA_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              const nVal = preset.p * preset.q;
              const phiVal = (preset.p - 1) * (preset.q - 1);

              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/20'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                    {preset.description}
                  </p>

                  <div className="mt-auto pt-2 border-t border-slate-200/60 dark:border-slate-700/60 w-full font-mono text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                    <div className="flex justify-between">
                      <span>p={preset.p}, q={preset.q}</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">n={nVal}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>φ(n)={phiVal}</span>
                      <span>e={preset.e}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Mode */}
      {mode === 'custom' && (
        <form onSubmit={handleApplyCustom} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Prime p input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  Prime 1 (p)
                </label>
                <span className="flex items-center space-x-1 text-[11px] font-mono">
                  {pIsPrime ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" /> Prime
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <XCircle className="w-3 h-3 mr-0.5" /> Not prime
                    </span>
                  )}
                </span>
              </div>
              <input
                type="number"
                min="3"
                max="997"
                value={customP}
                onChange={(e) => setCustomP(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="text-[10px] text-slate-400">
                Suggestions: {EDUCATIONAL_PRIMES.slice(8, 14).join(', ')}
              </div>
            </div>

            {/* Prime q input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  Prime 2 (q)
                </label>
                <span className="flex items-center space-x-1 text-[11px] font-mono">
                  {qIsPrime && distinctPrimes ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" /> Prime
                    </span>
                  ) : !distinctPrimes ? (
                    <span className="text-red-500 flex items-center">
                      <XCircle className="w-3 h-3 mr-0.5" /> Must differ from p
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <XCircle className="w-3 h-3 mr-0.5" /> Not prime
                    </span>
                  )}
                </span>
              </div>
              <input
                type="number"
                min="3"
                max="997"
                value={customQ}
                onChange={(e) => setCustomQ(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="text-[10px] text-slate-400">
                Suggestions: {EDUCATIONAL_PRIMES.slice(10, 16).join(', ')}
              </div>
            </div>

            {/* Public exponent e input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                  Public Exponent (e)
                </label>
                <span className="flex items-center space-x-1 text-[11px] font-mono">
                  {eCoprime ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-0.5" /> Coprime with φ
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <XCircle className="w-3 h-3 mr-0.5" /> Invalid e
                    </span>
                  )}
                </span>
              </div>
              <input
                type="number"
                min="3"
                value={customE}
                onChange={(e) => setCustomE(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {suggestedExponents.length > 0 && (
                <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                  <span>Valid e:</span>
                  {suggestedExponents.map((cand) => (
                    <button
                      type="button"
                      key={cand.toString()}
                      onClick={() => setCustomE(Number(cand))}
                      className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 hover:text-indigo-600 font-mono"
                    >
                      {cand.toString()}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs font-mono text-slate-500">
              Computed: n = {pIsPrime && qIsPrime ? customP * customQ : '?'} | φ(n) ={' '}
              {tempPhi ? tempPhi.toString() : '?'}
            </div>
            <button
              type="submit"
              disabled={!pIsPrime || !qIsPrime || !distinctPrimes || !eCoprime}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-sm disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Apply Custom Parameters
            </button>
          </div>
        </form>
      )}

      {/* Error message */}
      {(localError || externalError) && (
        <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>{localError || externalError}</span>
        </div>
      )}

      {/* Educational Notice */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-start space-x-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Why small primes?</strong> In real-world security (e.g. HTTPS/SSL), <em>p</em> and <em>q</em> are 1024-bit primes with hundreds of digits so that multiplying them produces an un-factorable 2048-bit modulus <em>n</em>. Here, we use small 2-digit primes so you can inspect every mathematical step transparently.
        </span>
      </div>
    </div>
  );
};
