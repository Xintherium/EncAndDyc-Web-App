import React, { useState } from 'react';
import { EncodedChar } from '../../types/rsa';
import { ENCODING_MAP } from '../../utils/encoding';
import { ArrowDown, HelpCircle } from 'lucide-react';

interface MessageEncoderProps {
  message: string;
  onMessageChange: (newMessage: string) => void;
  encodedChars: EncodedChar[];
  modulus: bigint;
  onSelectCharIndex?: (index: number) => void;
  selectedIndex?: number | null;
}

export const MessageEncoder: React.FC<MessageEncoderProps> = ({
  message,
  onMessageChange,
  encodedChars,
  modulus,
  onSelectCharIndex,
  selectedIndex,
}) => {
  const [showTable, setShowTable] = useState(false);

  const sampleMessages = ['HELLO', 'MATH', 'SECRET', 'RSA LAB'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs font-mono">
            02
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
              Step 2: Message & Numeric Encoding
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              RSA operates exclusively on numbers. Each character is mapped to a positive integer <em>m &lt; n</em>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowTable(!showTable)}
          className="flex items-center space-x-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showTable ? 'Hide Encoding Table' : 'View Encoding Standard'}</span>
        </button>
      </div>

      {/* Input controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Enter Demonstration Message (Letters A–Z, Space):
          </label>
          {/* Quick presets */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs text-slate-400 mr-1">Quick:</span>
            {sampleMessages.map((sample) => (
              <button
                key={sample}
                onClick={() => onMessageChange(sample)}
                className="px-2 py-1 text-xs font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value.toUpperCase().slice(0, 16))}
            placeholder="HELLO"
            maxLength={16}
            className="w-full text-xl sm:text-2xl font-mono tracking-widest font-bold px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
          />
          <div className="absolute right-3 top-4 text-xs font-mono text-slate-400">
            {message.length}/16 chars
          </div>
        </div>

        {/* Collapsible Encoding Table */}
        {showTable && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2 animate-slide-up">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Official Educational Alphabet Encoding Standard:
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 gap-1.5 font-mono text-[11px]">
              {Object.entries(ENCODING_MAP).map(([ch, code]) => (
                <div
                  key={ch}
                  className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center"
                >
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {ch === ' ' ? '␣' : ch}
                  </span>
                  <span className="text-slate-400 mx-1">=</span>
                  <span className="text-slate-700 dark:text-slate-200">{code}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Each character corresponds to an integer <em>m</em>. In RSA, it is a strict mathematical requirement that <em>m &lt; n</em> ({modulus.toString()}).
            </p>
          </div>
        )}
      </div>

      {/* Character-to-Number Cards Flow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
          <span>Character → Number Mapping Pipeline:</span>
          <span>Click any card to inspect</span>
        </div>

        <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center">
          {encodedChars.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const isTooLarge = BigInt(item.numericValue) >= modulus;

            return (
              <div
                key={idx}
                onClick={() => onSelectCharIndex && onSelectCharIndex(idx)}
                className={`cursor-pointer group flex flex-col items-center p-3 rounded-xl border transition-all duration-200 min-w-[70px] sm:min-w-[85px] relative ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 ring-2 ring-amber-500/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white group-hover:scale-110 transition-transform">
                  {item.char}
                </div>

                <div className="my-1 text-slate-300 dark:text-slate-600">
                  <ArrowDown className="w-3 h-3" />
                </div>

                <div
                  className={`text-sm sm:text-base font-mono font-bold ${
                    isTooLarge
                      ? 'text-red-500'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  m = {item.numericValue}
                </div>

                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  pos {idx + 1}
                </span>

                {isTooLarge && (
                  <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 bg-red-500 text-white rounded text-[8px] font-bold">
                    m ≥ n
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
