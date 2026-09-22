import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { isPrime, validateAndComputeRSA, modPow } from '../../utils/rsa';
import { validateMessageForRSA } from '../../utils/encoding';
import { RSAKeys, EncodedChar } from '../../types/rsa';
import { ArrowRight, RotateCcw, Check, Sparkles, ChevronDown, Lock, Unlock } from 'lucide-react';

interface Props {
  onBackToHome: () => void;
}

type Stage =
  | 'ask_p'
  | 'ask_q'
  | 'keygen_anim'
  | 'keys_ready'
  | 'ask_message'
  | 'encrypt_anim'
  | 'ciphertext_view'
  | 'decrypt_anim'
  | 'recovered';

export const PromptFlow: React.FC<Props> = ({ onBackToHome }) => {
  const [stage, setStage] = useState<Stage>('ask_p');

  // Primes & Keys
  const [pInput, setPInput] = useState<string>('61');
  const [qInput, setQInput] = useState<string>('53');
  const [pVal, setPVal] = useState<number>(61);
  const [qVal, setQVal] = useState<number>(53);
  const [keys, setKeys] = useState<RSAKeys | null>(null);

  // Message & Encryption
  const [messageInput, setMessageInput] = useState<string>('HELLO');
  const [encodedChars, setEncodedChars] = useState<EncodedChar[]>([]);
  const [cipherNumbers, setCipherNumbers] = useState<bigint[]>([]);
  const [decryptedChars, setDecryptedChars] = useState<string[]>([]);

  // Animation States
  const [keyGenProgress, setKeyGenProgress] = useState<number>(0);
  const [animCharIndex, setAnimCharIndex] = useState<number>(0);
  const [showMathDetail, setShowMathDetail] = useState<boolean>(false);

  // Auto-scroll ref
  const flowEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    flowEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [stage, keyGenProgress, animCharIndex]);

  // Handle P submission
  const handleConfirmP = (val?: number) => {
    const p = val ?? parseInt(pInput, 10);
    if (!isPrime(p)) return;
    setPVal(p);
    setStage('ask_q');
  };

  // Handle Q submission
  const handleConfirmQ = (val?: number) => {
    const q = val ?? parseInt(qInput, 10);
    if (!isPrime(q) || q === pVal) return;
    setQVal(q);

    // Compute RSA
    const res = validateAndComputeRSA(pVal, q, 17);
    if (res.valid && res.keys) {
      setKeys(res.keys);
      setStage('keygen_anim');
      setKeyGenProgress(0);
    }
  };

  // Key generation animated loader
  useEffect(() => {
    if (stage === 'keygen_anim') {
      const timers = [
        setTimeout(() => setKeyGenProgress(1), 300),
        setTimeout(() => setKeyGenProgress(2), 700),
        setTimeout(() => setKeyGenProgress(3), 1100),
        setTimeout(() => setKeyGenProgress(4), 1500),
        setTimeout(() => setStage('keys_ready'), 1900),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [stage]);

  // Handle Message submission
  const handleConfirmMessage = (text?: string) => {
    const msg = (text ?? messageInput).toUpperCase().trim();
    if (!msg || !keys) return;

    const val = validateMessageForRSA(msg, keys.n);
    if (!val.valid) return;

    setEncodedChars(val.encoded);
    setMessageInput(msg);

    // Prepare cipher calculations
    const ciphers = val.encoded.map(item => modPow(BigInt(item.numericValue), keys.e, keys.n));
    setCipherNumbers(ciphers);

    setStage('encrypt_anim');
    setAnimCharIndex(0);
  };

  // Encryption animated loader
  useEffect(() => {
    if (stage === 'encrypt_anim' && encodedChars.length > 0) {
      if (animCharIndex < encodedChars.length) {
        const timer = setTimeout(() => {
          setAnimCharIndex(prev => prev + 1);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        const finishTimer = setTimeout(() => {
          setStage('ciphertext_view');
        }, 400);
        return () => clearTimeout(finishTimer);
      }
    }
  }, [stage, animCharIndex, encodedChars.length]);

  // Handle Decryption Start
  const handleStartDecryption = () => {
    setStage('decrypt_anim');
    setAnimCharIndex(0);
    setDecryptedChars([]);
  };

  // Decryption animated loader
  useEffect(() => {
    if (stage === 'decrypt_anim' && cipherNumbers.length > 0 && keys) {
      if (animCharIndex < cipherNumbers.length) {
        const timer = setTimeout(() => {
          const origChar = encodedChars[animCharIndex]?.char ?? '?';
          setDecryptedChars(prev => [...prev, origChar]);
          setAnimCharIndex(prev => prev + 1);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        const finishTimer = setTimeout(() => {
          setStage('recovered');
          try {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#a78bfa', '#34d399', '#fbbf24', '#f472b6'],
            });
          } catch {
            // fallback
          }
        }, 400);
        return () => clearTimeout(finishTimer);
      }
    }
  }, [stage, animCharIndex, cipherNumbers.length, keys, encodedChars]);

  // Restart handlers
  const handleRestartNewPrimes = () => {
    setStage('ask_p');
    setPInput('61');
    setQInput('53');
    setKeys(null);
    setEncodedChars([]);
    setCipherNumbers([]);
    setDecryptedChars([]);
  };

  const handleRestartNewMessage = () => {
    setStage('ask_message');
    setEncodedChars([]);
    setCipherNumbers([]);
    setDecryptedChars([]);
  };

  // Preset prime suggestions
  const pSuggestions = [61, 17, 11, 43, 31];
  const qSuggestions = [53, 23, 13, 59, 41].filter(q => q !== pVal);
  const msgSuggestions = ['HELLO', 'SECRET', 'MATH', 'PEACE', 'EXPLORE'];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col items-center justify-start p-4 sm:p-6 select-none font-sans">
      {/* Background Soft Pastel Ambient Blurs */}
      <div className="fixed -top-12 -left-12 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="fixed bottom-0 -right-12 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

      {/* Minimal Top Header - No navigation clutter */}
      <header className="w-full max-w-xl flex items-center justify-between py-4 border-b border-stone-200/60 mb-6 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHome}
            className="text-xs font-mono px-2.5 py-1 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 transition-colors cursor-pointer"
            title="Return to Hero"
          >
            ← Home
          </button>
          <span className="font-bold text-sm tracking-tight text-stone-800">
            RSA <span className="text-violet-500 font-serif italic">Alive</span>
          </span>
        </div>

        <button
          onClick={handleRestartNewPrimes}
          className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </header>

      {/* Main Conversational Stream */}
      <main className="w-full max-w-xl space-y-6 pb-20 z-10">
        {/* STEP 1: PROMPT FOR P */}
        <div className="space-y-3 animate-fade-up">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <p className="text-sm sm:text-base font-medium text-stone-800">
                Let's begin! Choose your first secret prime number <span className="font-mono text-violet-600 font-bold">p</span>.
              </p>
              <p className="text-xs text-stone-400">
                Primes can only be divided by 1 and themselves.
              </p>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="pl-9 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-stone-400 mr-1">Quick pick:</span>
            {pSuggestions.map(num => (
              <button
                key={num}
                onClick={() => {
                  setPInput(num.toString());
                  handleConfirmP(num);
                }}
                disabled={stage !== 'ask_p'}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  pVal === num && stage !== 'ask_p'
                    ? 'bg-violet-500 text-white font-bold shadow-xs'
                    : 'bg-stone-100 hover:bg-violet-100 text-stone-700 border border-stone-200/80 disabled:opacity-60'
                }`}
              >
                p = {num}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          {stage === 'ask_p' && (
            <div className="pl-9 pt-1 flex items-center gap-2">
              <input
                type="number"
                value={pInput}
                onChange={e => setPInput(e.target.value)}
                placeholder="Enter prime (e.g. 61)"
                className="w-36 px-3 py-1.5 text-xs font-mono rounded-xl bg-white border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <button
                onClick={() => handleConfirmP()}
                disabled={!isPrime(parseInt(pInput, 10))}
                className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                Confirm p
              </button>
            </div>
          )}

          {/* Confirmed pill */}
          {stage !== 'ask_p' && (
            <div className="pl-9">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-50 border border-violet-200 text-violet-800 text-xs font-mono">
                <Check className="w-3.5 h-3.5 text-violet-500" />
                <span>p = {pVal} selected</span>
              </span>
            </div>
          )}
        </div>

        {/* STEP 2: PROMPT FOR Q */}
        {stage !== 'ask_p' && (
          <div className="space-y-3 animate-fade-up">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-medium text-stone-800">
                  Now choose a second prime number <span className="font-mono text-violet-600 font-bold">q</span> (different from p).
                </p>
                <p className="text-xs text-stone-400">
                  Multiplying p and q together forms your public modulus n.
                </p>
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="pl-9 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-stone-400 mr-1">Quick pick:</span>
              {qSuggestions.map(num => (
                <button
                  key={num}
                  onClick={() => {
                    setQInput(num.toString());
                    handleConfirmQ(num);
                  }}
                  disabled={stage !== 'ask_q'}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    qVal === num && stage !== 'ask_q'
                      ? 'bg-violet-500 text-white font-bold shadow-xs'
                      : 'bg-stone-100 hover:bg-violet-100 text-stone-700 border border-stone-200/80 disabled:opacity-60'
                  }`}
                >
                  q = {num}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            {stage === 'ask_q' && (
              <div className="pl-9 pt-1 flex items-center gap-2">
                <input
                  type="number"
                  value={qInput}
                  onChange={e => setQInput(e.target.value)}
                  placeholder="Enter prime (e.g. 53)"
                  className="w-36 px-3 py-1.5 text-xs font-mono rounded-xl bg-white border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
                <button
                  onClick={() => handleConfirmQ()}
                  disabled={!isPrime(parseInt(qInput, 10)) || parseInt(qInput, 10) === pVal}
                  className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Confirm q
                </button>
              </div>
            )}

            {/* Confirmed pill */}
            {stage !== 'ask_q' && (
              <div className="pl-9">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-50 border border-violet-200 text-violet-800 text-xs font-mono">
                  <Check className="w-3.5 h-3.5 text-violet-500" />
                  <span>q = {qVal} selected</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: KEY GENERATION ANIMATION / CARDS */}
        {(stage === 'keygen_anim' || stage === 'keys_ready' || stage === 'ask_message' || stage === 'encrypt_anim' || stage === 'ciphertext_view' || stage === 'decrypt_anim' || stage === 'recovered') && (
          <div className="space-y-4 animate-fade-up pl-9">
            {/* Animated Game-like Progress Box */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  <span>Forging RSA Mathematical Keys</span>
                </span>
                {stage === 'keygen_anim' ? (
                  <span className="text-violet-600 animate-pulse">calculating...</span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Ready
                  </span>
                )}
              </div>

              {/* Step checklist */}
              <div className="space-y-2 text-xs font-mono">
                <div className={`flex items-center justify-between ${keyGenProgress >= 1 || stage !== 'keygen_anim' ? 'text-stone-800' : 'text-stone-300'}`}>
                  <span>1. Modulus n = p × q = {pVal} × {qVal}</span>
                  <span className="font-bold text-violet-600">{keys ? keys.n.toString() : '...'}</span>
                </div>
                <div className={`flex items-center justify-between ${keyGenProgress >= 2 || stage !== 'keygen_anim' ? 'text-stone-800' : 'text-stone-300'}`}>
                  <span>2. Totient φ(n) = ({pVal}-1)({qVal}-1)</span>
                  <span className="font-bold text-violet-600">{keys ? keys.phi.toString() : '...'}</span>
                </div>
                <div className={`flex items-center justify-between ${keyGenProgress >= 3 || stage !== 'keygen_anim' ? 'text-stone-800' : 'text-stone-300'}`}>
                  <span>3. Public exponent e (coprime with φ)</span>
                  <span className="font-bold text-violet-600">{keys ? keys.e.toString() : '...'}</span>
                </div>
                <div className={`flex items-center justify-between ${keyGenProgress >= 4 || stage !== 'keygen_anim' ? 'text-stone-800' : 'text-stone-300'}`}>
                  <span>4. Private exponent d ≡ e⁻¹ mod φ(n)</span>
                  <span className="font-bold text-emerald-600">{keys ? keys.d.toString() : '...'}</span>
                </div>
              </div>

              {/* Revealed Pastel Keys */}
              {(stage === 'keys_ready' || stage === 'ask_message' || stage === 'encrypt_anim' || stage === 'ciphertext_view' || stage === 'decrypt_anim' || stage === 'recovered') && keys && (
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                  <div className="p-3 rounded-xl bg-violet-50/70 border border-violet-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-violet-800 font-mono">
                      <Lock className="w-3.5 h-3.5" />
                      <span>PUBLIC KEY (e, n)</span>
                    </div>
                    <div className="text-base font-mono font-bold text-violet-900">
                      ({keys.e.toString()}, {keys.n.toString()})
                    </div>
                    <p className="text-[10px] text-violet-700/80">
                      Shared publicly. Anyone uses this to encrypt.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 font-mono">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>PRIVATE KEY (d, n)</span>
                    </div>
                    <div className="text-base font-mono font-bold text-emerald-900">
                      ({keys.d.toString()}, {keys.n.toString()})
                    </div>
                    <p className="text-[10px] text-emerald-700/80">
                      Kept secret! Only this key can decrypt.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {stage === 'keys_ready' && (
              <button
                onClick={() => setStage('ask_message')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-all cursor-pointer"
              >
                <span>Write a secret message</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* STEP 4: PROMPT FOR MESSAGE */}
        {(stage === 'ask_message' || stage === 'encrypt_anim' || stage === 'ciphertext_view' || stage === 'decrypt_anim' || stage === 'recovered') && (
          <div className="space-y-3 animate-fade-up">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <p className="text-sm sm:text-base font-medium text-stone-800">
                  What message would you like to encrypt?
                </p>
                <p className="text-xs text-stone-400">
                  Letters are mapped into numbers (A=1, B=2 ... Z=26).
                </p>
              </div>
            </div>

            {/* Suggestions */}
            {stage === 'ask_message' && (
              <div className="pl-9 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-stone-400 mr-1">Sample:</span>
                {msgSuggestions.map(word => (
                  <button
                    key={word}
                    onClick={() => {
                      setMessageInput(word);
                      handleConfirmMessage(word);
                    }}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-stone-100 hover:bg-amber-100 text-stone-700 border border-stone-200/80 transition-colors cursor-pointer"
                  >
                    "{word}"
                  </button>
                ))}
              </div>
            )}

            {/* Custom Input */}
            {stage === 'ask_message' && (
              <div className="pl-9 pt-1 flex items-center gap-2">
                <input
                  type="text"
                  maxLength={12}
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value.toUpperCase())}
                  placeholder="Enter word (e.g. HELLO)"
                  className="w-48 px-3 py-1.5 text-xs font-mono uppercase font-bold rounded-xl bg-white border border-stone-200 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <button
                  onClick={() => handleConfirmMessage()}
                  disabled={!messageInput.trim()}
                  className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  Encrypt Message 🔐
                </button>
              </div>
            )}

            {/* Confirmed message representation */}
            {stage !== 'ask_message' && (
              <div className="pl-9 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-mono text-stone-400">Message:</span>
                {encodedChars.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold"
                  >
                    <span>{item.char}</span>
                    <span className="text-[10px] font-normal text-amber-600">({item.numericValue})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: ENCRYPT ANIMATION */}
        {(stage === 'encrypt_anim' || stage === 'ciphertext_view' || stage === 'decrypt_anim' || stage === 'recovered') && (
          <div className="space-y-3 animate-fade-up pl-9">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Interactive Encryption Process: c = mᵉ mod n</span>
                </span>
                <span className="text-stone-400">
                  {Math.min(animCharIndex, encodedChars.length)} / {encodedChars.length} chars
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${(Math.min(animCharIndex, encodedChars.length) / encodedChars.length) * 100}%` }}
                />
              </div>

              {/* Active token visualization */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
                {encodedChars.map((item, idx) => {
                  const isDone = stage !== 'encrypt_anim' || idx < animCharIndex;
                  const isCurrent = stage === 'encrypt_anim' && idx === animCharIndex;
                  const cipherVal = cipherNumbers[idx];

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-50/80 scale-105 shadow-xs'
                          : isDone
                          ? 'border-stone-200 bg-stone-50/60'
                          : 'border-dashed border-stone-200 opacity-40'
                      }`}
                    >
                      <div className="text-sm font-mono font-bold text-stone-800">
                        {item.char}
                      </div>
                      <div className="text-[10px] font-mono text-stone-400">
                        m = {item.numericValue}
                      </div>
                      <div className="text-xs font-mono font-bold text-amber-700 mt-1">
                        {isDone ? `c = ${cipherVal?.toString()}` : isCurrent ? 'calc...' : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {stage === 'ciphertext_view' && (
              <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 animate-fade-in">
                <div>
                  <div className="text-xs font-mono font-bold text-purple-800">
                    Transmitted Ciphertext:
                  </div>
                  <div className="font-mono text-sm font-bold text-purple-950 mt-0.5">
                    [ {cipherNumbers.map(c => c.toString()).join(', ')} ]
                  </div>
                </div>

                <button
                  onClick={handleStartDecryption}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Decrypt with Secret Key (d)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: DECRYPT ANIMATION */}
        {(stage === 'decrypt_anim' || stage === 'recovered') && (
          <div className="space-y-3 animate-fade-up pl-9">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                  <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Interactive Decryption Process: m = cᵈ mod n</span>
                </span>
                <span className="text-stone-400">
                  {Math.min(animCharIndex, cipherNumbers.length)} / {cipherNumbers.length} decoded
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${(Math.min(animCharIndex, cipherNumbers.length) / cipherNumbers.length) * 100}%` }}
                />
              </div>

              {/* Decrypted tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
                {cipherNumbers.map((cVal, idx) => {
                  const isDone = stage === 'recovered' || idx < animCharIndex;
                  const isCurrent = stage === 'decrypt_anim' && idx === animCharIndex;
                  const charRecovered = decryptedChars[idx] || (stage === 'recovered' ? encodedChars[idx]?.char : null);

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'border-emerald-400 bg-emerald-50/80 scale-105 shadow-xs'
                          : isDone
                          ? 'border-emerald-200 bg-emerald-50/40 text-emerald-900'
                          : 'border-dashed border-stone-200 opacity-40'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-stone-400">
                        c = {cVal.toString()}
                      </div>
                      <div className="text-sm font-mono font-bold text-stone-800 my-0.5">
                        {isDone && charRecovered ? charRecovered : isCurrent ? '...' : '—'}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-600 font-semibold">
                        {isDone ? '✓ recovered' : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: VICTORY & RECOVERED SCREEN */}
        {stage === 'recovered' && (
          <div className="space-y-4 animate-fade-up pl-9">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 text-xl mx-auto">
                🎉
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                Message Successfully Recovered!
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                The private key unlocked the trapdoor mathematical permutation. The decoded numbers match the original input perfectly.
              </p>

              {/* Side-by-side comparison */}
              <div className="flex items-center justify-center gap-4 pt-1 font-mono text-sm">
                <div className="px-3 py-1.5 rounded-lg bg-white border border-stone-200">
                  <span className="text-[10px] text-stone-400 block">ORIGINAL</span>
                  <span className="font-bold text-stone-800">{messageInput}</span>
                </div>
                <span className="text-emerald-500 font-bold">≡</span>
                <div className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200">
                  <span className="text-[10px] text-emerald-600 block">DECRYPTED</span>
                  <span className="font-bold text-emerald-700">{messageInput}</span>
                </div>
              </div>

              {/* Math inspection toggle */}
              <div className="pt-2">
                <button
                  onClick={() => setShowMathDetail(!showMathDetail)}
                  className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 font-mono transition-colors cursor-pointer"
                >
                  <span>{showMathDetail ? 'Hide' : 'Inspect'} Step-by-Step Math</span>
                  <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${showMathDetail ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Collapsible Math Detail Drawer */}
            {showMathDetail && keys && (
              <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs font-mono space-y-3 animate-fade-in">
                <div className="font-bold text-stone-700">Detailed Character Mathematics:</div>
                <div className="divide-y divide-stone-100 space-y-2">
                  {encodedChars.map((item, idx) => {
                    const c = cipherNumbers[idx];
                    return (
                      <div key={idx} className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-stone-600">
                        <div>
                          <span className="font-bold text-stone-900">'{item.char}'</span> (m={item.numericValue})
                        </div>
                        <div className="text-violet-600">
                          Encrypt: {item.numericValue}<sup>{keys.e.toString()}</sup> mod {keys.n.toString()} = <strong>{c?.toString()}</strong>
                        </div>
                        <div className="text-emerald-600">
                          Decrypt: {c?.toString()}<sup>{keys.d.toString()}</sup> mod {keys.n.toString()} = <strong>{item.numericValue} ('{item.char}')</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestartNewMessage}
                className="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Encrypt Another Message
              </button>
              <button
                onClick={handleRestartNewPrimes}
                className="px-5 py-2.5 rounded-full bg-white border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Choose New Primes
              </button>
            </div>
          </div>
        )}

        <div ref={flowEndRef} />
      </main>
    </div>
  );
};
