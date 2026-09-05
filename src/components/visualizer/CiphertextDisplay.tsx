import React, { useState } from 'react';
import { EncryptCharState, RSAKeys } from '../../types/rsa';
import { Copy, Check, Radio, AlertTriangle, ArrowRight, Lock } from 'lucide-react';

interface CiphertextDisplayProps {
  charStates: EncryptCharState[];
  keys: RSAKeys;
  onProceedToDecryption: () => void;
}

export const CiphertextDisplay: React.FC<CiphertextDisplayProps> = ({
  charStates,
  keys,
  onProceedToDecryption,
}) => {
  const [copied, setCopied] = useState(false);

  const ciphertextArray = charStates.map((s) => s.c.toString());
  const ciphertextString = `[ ${ciphertextArray.join(', ')} ]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(ciphertextString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs font-mono">
            04
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
              Step 4: Ciphertext Payload & Transmission
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The encrypted sequence ready for insecure network transmission.
            </p>
          </div>
        </div>

        <button
          onClick={onProceedToDecryption}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>Go to Decryption</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Plaintext */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-[10px] font-mono uppercase font-semibold text-slate-400 tracking-wider">
              Original Message
            </span>
            <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-widest">
              {charStates.map(s => s.char).join('')}
            </div>
            <span className="text-[11px] text-slate-500 block">
              Human-readable input string
            </span>
          </div>

          {/* 2. Numeric Representation */}
          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <span className="text-[10px] font-mono uppercase font-semibold text-amber-700 dark:text-amber-400 tracking-wider">
              Encoded Numbers (m)
            </span>
            <div className="font-mono text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-300">
              {charStates.map(s => s.m.toString()).join('  ')}
            </div>
            <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 block">
              Alphabet index (A=1 ... Z=26)
            </span>
          </div>

          {/* 3. Encrypted Ciphertext */}
          <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border-2 border-purple-400 dark:border-purple-600 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-semibold text-purple-700 dark:text-purple-300 tracking-wider flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Ciphertext Numbers (c)</span>
              </span>
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-purple-200/50 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 transition-colors"
                title="Copy Ciphertext Array"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="font-mono text-lg sm:text-xl font-bold text-purple-700 dark:text-purple-300 overflow-x-auto">
              {ciphertextString}
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 block font-medium">
              Transmitted safely across public wire
            </span>
          </div>
        </div>

        {/* Transmission Security Concept Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Radio className="w-4 h-4 text-purple-600 animate-pulse" />
            <span>What can an attacker or eavesdropper see on the network?</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs space-y-1">
            <div className="text-slate-500">Public Parameters: <span className="text-slate-900 dark:text-white">e = {keys.e.toString()}, n = {keys.n.toString()}</span></div>
            <div className="text-slate-500">Intercepted Ciphertext: <span className="text-purple-600 dark:text-purple-400 font-bold">{ciphertextString}</span></div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            "This is what can safely be transmitted using the public key." Without private exponent <em>d</em> (which requires factoring <em>n</em> into <em>p</em> and <em>q</em>), an adversary cannot easily determine which message <em>m</em> produced these numbers.
          </p>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>
              <strong>Educational RSA demonstration — NOT secure for real-world encryption.</strong> Because our modulus n = {keys.n.toString()} is small, any desktop computer could factor it in milliseconds. Real RSA uses 2048-bit numbers.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
