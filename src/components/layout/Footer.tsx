import React from 'react';
import { AlertTriangle, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Important Educational Disclaimer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs sm:text-sm gap-3">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-semibold">Educational RSA demonstration</span> — NOT secure for real-world encryption.
              <span className="opacity-80 block sm:inline sm:ml-1">
                Real RSA uses prime numbers hundreds of digits long (2048–4096 bits) to prevent factorization.
              </span>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-amber-500/20 text-amber-800 dark:text-amber-300">
            TOY KEY DEMO
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 gap-2">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>Mathematics Exhibition & Learning Showcase • Interactive Public-Key Cryptography</span>
          </div>
          <div className="font-mono text-[11px]">
            Euler's Totient Theorem: <span className="text-indigo-600 dark:text-indigo-400">m^(ed) ≡ m (mod n)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
