import React from 'react';
import { Lock, Key, ArrowDown, Server, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Core Concepts & Intuition</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          How RSA Works: The Asymmetric Revolution
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Before 1977, communicating secretly required both people to first meet in secret and exchange a shared password. RSA solved this with a mathematical padlock.
        </p>
      </div>

      {/* The Physical Padlock Analogy */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Lock className="w-5 h-5 text-indigo-600" />
          <span>The Physical Padlock Analogy</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm">
              Open Padlocks (Public Key)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Bob leaves unlocked open padlocks with his name in public boxes everywhere. Anyone can take one of Bob's open padlocks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm">
              Snapping It Shut (Encryption)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Alice puts her secret letter in a box and snaps Bob's padlock shut. Anyone can snap a padlock shut without a key!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div className="font-semibold text-slate-900 dark:text-white text-sm">
              The Only Key (Private Key)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Alice mails the locked box. Even Alice cannot reopen it! Only Bob holds the unique physical key that opens his padlocks.
            </p>
          </div>
        </div>
      </div>

      {/* Information Flow Diagram */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Server className="w-5 h-5 text-indigo-600" />
          <span>The RSA Asymmetric Information Flow</span>
        </h3>

        {/* Visual Flow Tree */}
        <div className="flex flex-col items-center space-y-3 font-mono text-xs sm:text-sm">
          {/* KeyGen */}
          <div className="w-full max-w-md p-3.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50/70 dark:bg-indigo-950/40 text-center">
            <span className="font-bold text-indigo-900 dark:text-indigo-200">1. KEY GENERATION</span>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Bob generates primes p, q ⟹ n = p × q, φ(n) = (p−1)(q−1)
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-400" />

          {/* Fork into Public vs Private */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 text-center">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                PUBLIC KEY: (e, n)
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 block">
                Published in directories, websites, DNS
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 text-center">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                PRIVATE KEY: (d, n)
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 block">
                Kept strictly in Bob's secure hardware
              </span>
            </div>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-400" />

          {/* Encryption */}
          <div className="w-full max-w-md p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-center">
            <span className="font-bold text-slate-900 dark:text-white">2. ENCRYPTION (Alice)</span>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              c ≡ mᵉ (mod n)
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
              Anyone on earth can compute this using Bob's public key (e, n)
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-400" />

          {/* Transmission */}
          <div className="w-full max-w-md p-3.5 rounded-xl border-2 border-purple-400 dark:border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 text-center">
            <span className="font-bold text-purple-700 dark:text-purple-300">3. CIPHERTEXT TRANSMISSION (c)</span>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 block mt-0.5">
              Sent across insecure Internet routers and Wi-Fi
            </span>
          </div>

          <ArrowDown className="w-4 h-4 text-slate-400" />

          {/* Decryption */}
          <div className="w-full max-w-md p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-center">
            <span className="font-bold text-emerald-800 dark:text-emerald-200">4. DECRYPTION (Bob)</span>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              m ≡ cᵈ (mod n)
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block mt-0.5">
              Only Bob can compute this because only Bob knows d!
            </span>
          </div>
        </div>
      </div>

      {/* The One-Way Trapdoor Function */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Key className="w-5 h-5 text-indigo-600" />
          <span>The Mathematical Trapdoor</span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          A <strong>one-way function</strong> is an operation that is easy to calculate in one direction, but extremely difficult to invert unless you have a piece of special information called the <strong>trapdoor</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
              Easy Direction: Multiplication
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
              61 × 53 = 3233
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Multiplying two primes takes microseconds even if each has 300 digits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="font-semibold text-xs text-slate-900 dark:text-white mb-1">
              Hard Direction: Prime Factorization
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
              Factor 3233 ⟹ ? × ?
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              If <em>n</em> is 2048 bits (617 decimal digits), the fastest supercomputers would take trillions of years to factor it!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
