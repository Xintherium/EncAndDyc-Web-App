import React from 'react';
import { Sigma, Sparkles } from 'lucide-react';

export const Mathematics: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Sigma className="w-3.5 h-3.5" />
          <span>Formal Mathematical Foundations</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          The Mathematics of RSA
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Every equation in RSA is rooted in classical number theory, modular arithmetic, and Euler's Totient Theorem (1736).
        </p>
      </div>

      {/* Equations Grid */}
      <div className="space-y-6">
        {/* 1. Public Modulus */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
              Equation 1: The Public Modulus
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Semi-Prime
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white text-center">
            n = p × q
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Plain-English explanation:</strong> Choose two large prime numbers <em>p</em> and <em>q</em> and multiply them together. The result <em>n</em> is called the <strong>modulus</strong>. It sets the numerical boundary for all calculations. While <em>n</em> is shared publicly, <em>p</em> and <em>q</em> must be destroyed or kept strictly secret.
          </p>
        </div>

        {/* 2. Euler's Totient */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono">
              Equation 2: Euler's Totient Function
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Coprime Count
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white text-center">
            φ(n) = (p − 1) × (q − 1)
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Plain-English explanation:</strong> Euler's phi function counts how many positive integers up to <em>n</em> share no common divisor with <em>n</em> (other than 1). Because <em>p</em> and <em>q</em> are prime, every multiple of <em>p</em> and <em>q</em> is easily accounted for, giving the exact formula <em>φ(n) = (p − 1)(q − 1)</em>.
          </p>
        </div>

        {/* 3. Public Exponent Coprimality */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
              Equation 3: Coprime Public Exponent
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              gcd = 1
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white text-center">
            gcd(e, φ(n)) = 1, &nbsp; where 1 &lt; e &lt; φ(n)
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Plain-English explanation:</strong> Choose an integer <em>e</em> that shares no common factor with <em>φ(n)</em>. In real-world systems, <em>e = 65537</em> (which is $2^{16} + 1$) is almost universally chosen because its binary form (10000000000000001) makes modular exponentiation fast while maintaining security.
          </p>
        </div>

        {/* 4. Modular Multiplicative Inverse */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
              Equation 4: The Secret Decryption Exponent
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Bézout's Identity
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-lg sm:text-xl font-mono font-bold text-slate-900 dark:text-white text-center">
            d ≡ e⁻¹ (mod φ(n)) &nbsp; ⟺ &nbsp; (d × e) ≡ 1 (mod φ(n))
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Plain-English explanation:</strong> Using the <strong>Extended Euclidean Algorithm</strong>, we compute the unique integer <em>d</em> such that when multiplied by <em>e</em> and divided by <em>φ(n)</em>, the remainder is exactly 1. Without knowing <em>φ(n)</em>, finding <em>d</em> from <em>e</em> and <em>n</em> is as hard as factoring <em>n</em>!
          </p>
        </div>

        {/* 5. Encryption Formula */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-mono">
              Equation 5: Encryption
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Public Key (e, n)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-lg sm:text-xl font-mono font-bold text-indigo-600 dark:text-indigo-400 text-center">
            c ≡ mᵉ (mod n)
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Plain-English explanation:</strong> Take the message number <em>m</em> (where <em>m &lt; n</em>), raise it to the public exponent <em>e</em>, and take the remainder after division by <em>n</em>. The resulting remainder <em>c</em> is the ciphertext.
          </p>
        </div>

        {/* 6. Decryption Formula */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
              Equation 6: Decryption
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Private Key (d, n)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-lg sm:text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400 text-center">
            m ≡ cᵈ (mod n)
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Plain-English explanation:</strong> Take the ciphertext number <em>c</em>, raise it to the secret private exponent <em>d</em>, and take the remainder after division by <em>n</em>. Mathematically, the result is guaranteed to be the exact original message number <em>m</em>.
          </p>
        </div>

        {/* Mathematical Proof Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/60 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Why Does Decryption Invert Encryption? (The Proof)</span>
          </h3>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
            <p>1. By construction of <em>d</em>, we know: <span className="font-bold text-indigo-600 dark:text-indigo-400">e × d ≡ 1 (mod φ(n))</span></p>
            <p>2. Therefore, <span className="font-bold text-indigo-600 dark:text-indigo-400">e × d = k × φ(n) + 1</span> for some integer <em>k</em>.</p>
            <p>3. When decrypting: <span className="font-bold">cᵈ ≡ (mᵉ)ᵈ ≡ m^(e·d) (mod n)</span></p>
            <p>4. Substituting gives: <span className="font-bold">m^(k·φ(n) + 1) = (m^φ(n))^k × m (mod n)</span></p>
            <p>5. By <strong>Euler's Totient Theorem</strong>: if gcd(m, n) = 1, then <span className="font-bold text-indigo-600 dark:text-indigo-400">m^φ(n) ≡ 1 (mod n)</span></p>
            <p>6. Thus: <span className="font-bold text-emerald-600 dark:text-emerald-400">1^k × m ≡ 1 × m ≡ m (mod n)  ∎</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};
