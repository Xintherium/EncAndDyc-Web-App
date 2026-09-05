import React, { useState, useEffect } from 'react';
import { RSAKeys } from '../../types/rsa';
import { MathCard } from '../common/MathCard';
import { Lock, Unlock } from 'lucide-react';

interface KeyGenVisualizerProps {
  keys: RSAKeys;
  autoAnimate?: boolean;
}

export const KeyGenVisualizer: React.FC<KeyGenVisualizerProps> = ({ keys, autoAnimate = true }) => {
  // Reveal steps sequentially: 0 = primes, 1 = n, 2 = phi, 3 = e, 4 = d, 5 = keys summary
  const [revealedStep, setRevealedStep] = useState<number>(autoAnimate ? 0 : 5);

  useEffect(() => {
    if (!autoAnimate) {
      setRevealedStep(5);
      return;
    }
    setRevealedStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let step = 1; step <= 5; step++) {
      timers.push(
        setTimeout(() => {
          setRevealedStep(step);
        }, step * 600)
      );
    }
    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [keys, autoAnimate]);

  const p = keys.p;
  const q = keys.q;
  const n = keys.n;
  const phi = keys.phi;
  const e = keys.e;
  const d = keys.d;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Step Header Banner */}
      <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs font-mono">
            01
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
              Step 1: Key Generation Pipeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deriving the mathematical trapdoor function that separates public encryption from private decryption.
            </p>
          </div>
        </div>

        <button
          onClick={() => setRevealedStep(5)}
          className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline self-start sm:self-auto"
        >
          Skip Animation
        </button>
      </div>

      {/* Sequential Calculation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Prime selection */}
        <div className="transition-all duration-500">
          <MathCard
            title="1. Choose Two Primes"
            formula="p, q ∈ Primes"
            calculation={`p = ${p},  q = ${q}`}
            explanation="Two distinct prime numbers form the secret foundation of the system. In real RSA, these are huge (hundreds of digits)."
            isActive={revealedStep === 0}
            isCompleted={revealedStep > 0}
            badge="Foundation"
            badgeColor="indigo"
          />
        </div>

        {/* Card 2: Compute n */}
        <div
          className={`transition-all duration-500 ${
            revealedStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2 pointer-events-none'
          }`}
        >
          <MathCard
            title="2. Compute Public Modulus"
            formula="n = p × q"
            calculation={`${p} × ${q}`}
            result={`${n}`}
            explanation="n is the modulus for both encryption and decryption. It is published publicly. Factoring n back into p and q is computationally hard for large numbers."
            isActive={revealedStep === 1}
            isCompleted={revealedStep > 1}
            badge="Public Modulus"
            badgeColor="indigo"
          />
        </div>

        {/* Card 3: Euler's Totient phi(n) */}
        <div
          className={`transition-all duration-500 ${
            revealedStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2 pointer-events-none'
          }`}
        >
          <MathCard
            title="3. Euler's Totient Function"
            formula="φ(n) = (p − 1) × (q − 1)"
            calculation={`(${p} − 1) × (${q} − 1) = ${p - 1n} × ${q - 1n}`}
            result={`${phi}`}
            explanation="φ(n) counts integers from 1 to n coprime to n. Keeping φ(n) strictly secret is the key to creating the private decryption key."
            isActive={revealedStep === 2}
            isCompleted={revealedStep > 2}
            badge="Secret Totient"
            badgeColor="purple"
            accent="purple"
          />
        </div>

        {/* Card 4: Choose Public Exponent e */}
        <div
          className={`transition-all duration-500 ${
            revealedStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2 pointer-events-none'
          }`}
        >
          <MathCard
            title="4. Public Exponent e"
            formula="gcd(e, φ(n)) = 1,  1 < e < φ(n)"
            calculation={`gcd(${e}, ${phi}) = 1`}
            result={`e = ${e}`}
            explanation="e must share no common factors with φ(n) (coprime). This guarantees that a unique modular inverse exists."
            isActive={revealedStep === 3}
            isCompleted={revealedStep > 3}
            badge="Public Exponent"
            badgeColor="indigo"
          />
        </div>

        {/* Card 5: Calculate Private Exponent d */}
        <div
          className={`transition-all duration-500 md:col-span-2 ${
            revealedStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-2 pointer-events-none'
          }`}
        >
          <MathCard
            title="5. Calculate Private Exponent d (Trapdoor Key)"
            formula="d ≡ e⁻¹ (mod φ(n))  ⟹  (d × e) mod φ(n) = 1"
            calculation={`(${d} × ${e}) = ${d * e} ≡ 1 (mod ${phi})`}
            result={`d = ${d}`}
            explanation="Using the Extended Euclidean Algorithm, we find d. When raised to power d, the ciphertext undoes the power e modulo n thanks to Euler's Totient Theorem!"
            isActive={revealedStep === 4}
            isCompleted={revealedStep > 4}
            badge="Private Trapdoor"
            badgeColor="emerald"
            accent="emerald"
          />
        </div>
      </div>

      {/* Resulting Key Pairs Showcase */}
      {revealedStep >= 5 && (
        <div className="pt-2 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Public Key */}
            <div className="p-5 rounded-xl border-2 border-indigo-500/40 bg-indigo-50/40 dark:bg-indigo-950/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
                  <Lock className="w-4 h-4" />
                  <span>PUBLIC KEY (Anyone can know)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200">
                  (e, n)
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-200/60 dark:border-indigo-800/60 font-mono text-center">
                <div className="text-xl sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  ({e.toString()}, {n.toString()})
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  e = {e.toString()} (Exponent) • n = {n.toString()} (Modulus)
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Shared openly with the entire world. Anyone wishing to send an encrypted message to the owner computes:
                <code className="ml-1 font-mono text-indigo-600 dark:text-indigo-400">c = mᵉ mod n</code>.
              </p>
            </div>

            {/* Private Key */}
            <div className="p-5 rounded-xl border-2 border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                  <Unlock className="w-4 h-4" />
                  <span>PRIVATE KEY (Strictly Confidential)</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                  (d, n)
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60 font-mono text-center">
                <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ({d.toString()}, {n.toString()})
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  d = {d.toString()} (Secret Exponent) • n = {n.toString()} (Modulus)
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Kept secret by the recipient only. Even though everyone knows <em>e</em> and <em>n</em>, nobody can compute <em>d</em> without knowing the secret primes <em>p</em> and <em>q</em>!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
