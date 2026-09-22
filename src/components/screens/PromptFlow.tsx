import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { isPrime, validateAndComputeRSA, modPow } from '../../utils/rsa';
import { validateMessageForRSA } from '../../utils/encoding';
import { RSAKeys, EncodedChar } from '../../types/rsa';
import { ArrowRight, RotateCcw, Check, Sparkles, ChevronDown, Lock, Unlock, ArrowLeft } from 'lucide-react';

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
        setTimeout(() => setKeyGenProgress(1), 350),
        setTimeout(() => setKeyGenProgress(2), 800),
        setTimeout(() => setKeyGenProgress(3), 1250),
        setTimeout(() => setKeyGenProgress(4), 1700),
        setTimeout(() => setStage('keys_ready'), 2150),
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
        }, 550);
        return () => clearTimeout(timer);
      } else {
        const finishTimer = setTimeout(() => {
          setStage('ciphertext_view');
        }, 500);
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
        }, 550);
        return () => clearTimeout(timer);
      } else {
        const finishTimer = setTimeout(() => {
          setStage('recovered');
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.65 },
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
    <div className="relative min-h-screen flex flex-col items-center justify-start p-4 sm:p-8 select-none font-sans z-10">
      {/* Top Header Bar */}
      <header className="w-full max-w-3xl flex items-center justify-between py-4 border-b border-stone-200/80 dark:border-stone-800/80 mb-8 sm:mb-10 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-mono px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 shadow-xs transition-all cursor-pointer"
            title="Return to Hero"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>
          <span className="font-bold text-base sm:text-lg tracking-tight text-stone-900 dark:text-stone-100">
            RSA <span className="text-violet-500 font-serif italic">Alive</span>
          </span>
        </div>

        <button
          onClick={handleRestartNewPrimes}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Session</span>
        </button>
      </header>

      {/* Main Conversational Stream */}
      <main className="w-full max-w-3xl space-y-8 sm:space-y-10 pb-28">
        {/* STEP 1: PROMPT FOR P */}
        <div className="space-y-4 animate-fade-up">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold flex-shrink-0 mt-0.5 border border-violet-200/60 dark:border-violet-800/60 shadow-xs">
              1
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100">
                Let's begin! Choose your first secret prime number <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">p</span>.
              </h2>
              <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400">
                Primes can only be divided by 1 and themselves.
              </p>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="pl-13 flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 mr-1 font-mono">Quick pick:</span>
            {pSuggestions.map(num => (
              <button
                key={num}
                onClick={() => {
                  setPInput(num.toString());
                  handleConfirmP(num);
                }}
                disabled={stage !== 'ask_p'}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-mono transition-all cursor-pointer ${
                  pVal === num && stage !== 'ask_p'
                    ? 'bg-violet-600 dark:bg-violet-500 text-white font-bold shadow-sm'
                    : 'bg-white/80 dark:bg-stone-900/80 hover:bg-violet-50 dark:hover:bg-violet-950 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-800 disabled:opacity-60 shadow-xs'
                }`}
              >
                p = {num}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          {stage === 'ask_p' && (
            <div className="pl-13 pt-1 flex items-center gap-3">
              <input
                type="number"
                value={pInput}
                onChange={e => setPInput(e.target.value)}
                placeholder="Enter prime (e.g. 61)"
                className="w-44 px-4 py-2.5 text-sm sm:text-base font-mono rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-xs"
              />
              <button
                onClick={() => handleConfirmP()}
                disabled={!isPrime(parseInt(pInput, 10))}
                className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-violet-500 dark:hover:bg-violet-400 text-white text-sm font-medium disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
              >
                Confirm p
              </button>
            </div>
          )}

          {/* Confirmed pill */}
          {stage !== 'ask_p' && (
            <div className="pl-13">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/80 text-violet-800 dark:text-violet-200 text-xs sm:text-sm font-mono">
                <Check className="w-4 h-4 text-violet-500" />
                <span>p = {pVal} selected</span>
              </span>
            </div>
          )}
        </div>

        {/* STEP 2: PROMPT FOR Q */}
        {stage !== 'ask_p' && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 flex items-center justify-center text-sm font-mono font-bold flex-shrink-0 mt-0.5 border border-violet-200/60 dark:border-violet-800/60 shadow-xs">
                2
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100">
                  Now choose a second prime number <span className="font-mono text-violet-600 dark:text-violet-400 font-bold">q</span> (different from p).
                </h2>
                <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400">
                  Multiplying p and q together forms your public modulus n.
                </p>
              </div>
            </div>

            {/* Quick suggestions */}
            <div className="pl-13 flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 mr-1 font-mono">Quick pick:</span>
              {qSuggestions.map(num => (
                <button
                  key={num}
                  onClick={() => {
                    setQInput(num.toString());
                    handleConfirmQ(num);
                  }}
                  disabled={stage !== 'ask_q'}
                  className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-mono transition-all cursor-pointer ${
                    qVal === num && stage !== 'ask_q'
                      ? 'bg-violet-600 dark:bg-violet-500 text-white font-bold shadow-sm'
                      : 'bg-white/80 dark:bg-stone-900/80 hover:bg-violet-50 dark:hover:bg-violet-950 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-800 disabled:opacity-60 shadow-xs'
                  }`}
                >
                  q = {num}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            {stage === 'ask_q' && (
              <div className="pl-13 pt-1 flex items-center gap-3">
                <input
                  type="number"
                  value={qInput}
                  onChange={e => setQInput(e.target.value)}
                  placeholder="Enter prime (e.g. 53)"
                  className="w-44 px-4 py-2.5 text-sm sm:text-base font-mono rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 shadow-xs"
                />
                <button
                  onClick={() => handleConfirmQ()}
                  disabled={!isPrime(parseInt(qInput, 10)) || parseInt(qInput, 10) === pVal}
                  className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-violet-500 dark:hover:bg-violet-400 text-white text-sm font-medium disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                >
                  Confirm q
                </button>
              </div>
            )}

            {/* Confirmed pill */}
            {stage !== 'ask_q' && (
              <div className="pl-13">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-800/80 text-violet-800 dark:text-violet-200 text-xs sm:text-sm font-mono">
                  <Check className="w-4 h-4 text-violet-500" />
                  <span>q = {qVal} selected</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: KEY GENERATION ANIMATION / CARDS */}
        {(stage === 'keygen_anim' || stage === 'keys_ready' || stage === 'ask_message' || stage === 'encrypt_anim' || stage === 'ciphertext_view' || stage === 'decrypt_anim' || stage === 'recovered') && (
          <div className="space-y-5 animate-fade-up pl-13">
            {/* Animated Game-like Progress Box */}
            <div className="p-5 sm:p-7 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800/80 shadow-md backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between text-sm sm:text-base font-mono pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span>Forging RSA Mathematical Keys</span>
                </span>
                {stage === 'keygen_anim' ? (
                  <span className="text-violet-600 dark:text-violet-400 animate-pulse font-medium">calculating...</span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                    <Check className="w-4 h-4" /> Ready
                  </span>
                )}
              </div>

              {/* Step checklist */}
              <div className="space-y-3 text-sm sm:text-base font-mono">
                <div className={`flex items-center justify-between ${keyGenProgress >= 1 || stage !== 'keygen_anim' ? 'text-stone-800 dark:text-stone-200' : 'text-stone-300 dark:text-stone-700'}`}>
                  <span>1. Modulus n = p × q = {pVal} × {qVal}</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">{keys ? keys.n.toString() : '...'}</span>
                </div>
                <div className={`flex items-center justify-between ${keyGenProgress >= 2 || stage !== 'keygen_anim' ? 'text-stone-800 dark:text-stone-200' : 'text-stone-300 dark:text-stone-700'}`}>
                  <span>2. Totient φ(n) = ({pVal}-1)({qVal}-1)</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">{keys ? keys.phi.toString() : '...'}</span>
                </div>
                <div className={`flex items-center justify-between ${keyGenProgress >= 3 || stage !== 'keygen_anim' ? 'text-stone-800 dark:text-stone-200' : 'text-stone-300 dark:text-stone-700'}`}>
                  <span>3. Public exponent e (coprime with φ)</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">{keys ? keys.e.toString() : '...'}</span>
                </div>
                <div className={`flex items-center justify-between ${keyGenProgress >= 4 || stage !== 'keygen_anim' ? 'text-stone-800 dark:text-stone-200' : 'text-stone-300 dark:text-stone-700'}`}>
                  <span>4. Private exponent d ≡ e⁻¹ mod φ(n)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{keys ? keys.d.toString() : '...'}</span>
                </div>
              </div>

              {/* Revealed Pastel Keys */}
              {(stage === 'keys_ready' || stage === 'ask_message' || stage === 'encrypt_anim' || stage === 'ciphertext_view' || stage === 'decrypt_anim' || stage === 'recovered') && keys && (
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  <div className="p-4 sm:p-5 rounded-2xl bg-violet-50/80 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-violet-800 dark:text-violet-300 font-mono">
                      <Lock className="w-4 h-4" />
                      <span>PUBLIC KEY (e, n)</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-extrabold text-violet-900 dark:text-violet-100">
                      ({keys.e.toString()}, {keys.n.toString()})
                    </div>
                    <p className="text-xs text-violet-700/80 dark:text-violet-300/80 leading-relaxed">
                      Shared publicly. Anyone uses this to encrypt for you.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                      <Unlock className="w-4 h-4" />
                      <span>PRIVATE KEY (d, n)</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-900 dark:text-emerald-100">
                      ({keys.d.toString()}, {keys.n.toString()})
                    </div>
                    <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80 leading-relaxed">
                      Kept strictly secret! Only this key can decrypt.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {stage === 'keys_ready' && (
              <button
                onClick={() => setStage('ask_message')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-violet-500 dark:hover:bg-violet-400 text-white text-sm sm:text-base font-medium transition-all shadow-md cursor-pointer"
              >
                <span>Write a secret message</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* STEP 4: PROMPT FOR MESSAGE */}
        {(stage === 'ask_message' || stage === 'encrypt_anim' || stage === 'ciphertext_view' || stage === 'decrypt_anim' || stage === 'recovered') && (
          <div className="space-y-4 animate-fade-up">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center text-sm font-mono font-bold flex-shrink-0 mt-0.5 border border-amber-200/60 dark:border-amber-800/60 shadow-xs">
                3
              </div>
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100">
                  What message would you like to encrypt?
                </h2>
                <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400">
                  Letters are mapped into numbers (A=1, B=2 ... Z=26).
                </p>
              </div>
            </div>

            {/* Suggestions */}
            {stage === 'ask_message' && (
              <div className="pl-13 flex flex-wrap items-center gap-2">
                <span className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 mr-1 font-mono">Sample:</span>
                {msgSuggestions.map(word => (
                  <button
                    key={word}
                    onClick={() => {
                      setMessageInput(word);
                      handleConfirmMessage(word);
                    }}
                    className="px-4 py-2 rounded-2xl text-xs sm:text-sm font-mono bg-white/80 dark:bg-stone-900/80 hover:bg-amber-50 dark:hover:bg-amber-950 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-800 transition-all shadow-xs cursor-pointer"
                  >
                    "{word}"
                  </button>
                ))}
              </div>
            )}

            {/* Custom Input */}
            {stage === 'ask_message' && (
              <div className="pl-13 pt-1 flex items-center gap-3">
                <input
                  type="text"
                  maxLength={14}
                  value={messageInput}
                  onChange={e => setMessageInput(e.target.value.toUpperCase())}
                  placeholder="Enter word (e.g. HELLO)"
                  className="w-56 px-4 py-3 text-base sm:text-lg font-mono uppercase font-bold rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xs"
                />
                <button
                  onClick={() => handleConfirmMessage()}
                  disabled={!messageInput.trim()}
                  className="px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white text-sm sm:text-base font-medium disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                >
                  Encrypt Message 🔐
                </button>
              </div>
            )}

            {/* Confirmed message representation */}
            {stage !== 'ask_message' && (
              <div className="pl-13 flex flex-wrap items-center gap-2">
                <span className="text-sm font-mono text-stone-400 dark:text-stone-500">Message:</span>
                {encodedChars.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 text-sm font-mono font-bold"
                  >
                    <span>{item.char}</span>
                    <span className="text-xs font-normal text-amber-600 dark:text-amber-400">({item.numericValue})</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: ENCRYPT ANIMATION */}
        {(stage === 'encrypt_anim' || stage === 'ciphertext_view' || stage === 'decrypt_anim' || stage === 'recovered') && (
          <div className="space-y-4 animate-fade-up pl-13">
            <div className="p-5 sm:p-7 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800/80 shadow-md backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between text-sm sm:text-base font-mono pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Interactive Encryption: c = mᵉ mod n</span>
                </span>
                <span className="text-stone-400 dark:text-stone-500 text-xs sm:text-sm">
                  {Math.min(animCharIndex, encodedChars.length)} / {encodedChars.length} chars
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 dark:bg-amber-500 transition-all duration-300"
                  style={{ width: `${(Math.min(animCharIndex, encodedChars.length) / encodedChars.length) * 100}%` }}
                />
              </div>

              {/* Active token visualization */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                {encodedChars.map((item, idx) => {
                  const isDone = stage !== 'encrypt_anim' || idx < animCharIndex;
                  const isCurrent = stage === 'encrypt_anim' && idx === animCharIndex;
                  const cipherVal = cipherNumbers[idx];

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-50/90 dark:bg-amber-950/60 scale-105 shadow-md'
                          : isDone
                          ? 'border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-800/50'
                          : 'border-dashed border-stone-200 dark:border-stone-800 opacity-40'
                      }`}
                    >
                      <div className="text-lg font-mono font-bold text-stone-900 dark:text-stone-100">
                        {item.char}
                      </div>
                      <div className="text-xs font-mono text-stone-400 dark:text-stone-500">
                        m = {item.numericValue}
                      </div>
                      <div className="text-sm font-mono font-bold text-amber-700 dark:text-amber-400 mt-1.5">
                        {isDone ? `c = ${cipherVal?.toString()}` : isCurrent ? 'calc...' : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {stage === 'ciphertext_view' && (
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-purple-50/90 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 text-purple-900 dark:text-purple-200 animate-fade-in shadow-md">
                <div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-purple-800 dark:text-purple-300">
                    Transmitted Ciphertext Payload:
                  </div>
                  <div className="font-mono text-base sm:text-lg font-bold text-purple-950 dark:text-purple-100 mt-1">
                    [ {cipherNumbers.map(c => c.toString()).join(', ')} ]
                  </div>
                </div>

                <button
                  onClick={handleStartDecryption}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white text-sm font-medium shadow-md transition-all cursor-pointer"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Decrypt with Secret Key (d)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 6: DECRYPT ANIMATION */}
        {(stage === 'decrypt_anim' || stage === 'recovered') && (
          <div className="space-y-4 animate-fade-up pl-13">
            <div className="p-5 sm:p-7 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800/80 shadow-md backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between text-sm sm:text-base font-mono pb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-semibold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-emerald-500" />
                  <span>Interactive Decryption: m = cᵈ mod n</span>
                </span>
                <span className="text-stone-400 dark:text-stone-500 text-xs sm:text-sm">
                  {Math.min(animCharIndex, cipherNumbers.length)} / {cipherNumbers.length} decoded
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 dark:bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(Math.min(animCharIndex, cipherNumbers.length) / cipherNumbers.length) * 100}%` }}
                />
              </div>

              {/* Decrypted tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                {cipherNumbers.map((cVal, idx) => {
                  const isDone = stage === 'recovered' || idx < animCharIndex;
                  const isCurrent = stage === 'decrypt_anim' && idx === animCharIndex;
                  const charRecovered = decryptedChars[idx] || (stage === 'recovered' ? encodedChars[idx]?.char : null);

                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'border-emerald-400 bg-emerald-50/90 dark:bg-emerald-950/60 scale-105 shadow-md'
                          : isDone
                          ? 'border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                          : 'border-dashed border-stone-200 dark:border-stone-800 opacity-40'
                      }`}
                    >
                      <div className="text-xs font-mono text-stone-400 dark:text-stone-500">
                        c = {cVal.toString()}
                      </div>
                      <div className="text-xl font-mono font-bold text-stone-900 dark:text-stone-100 my-1">
                        {isDone && charRecovered ? charRecovered : isCurrent ? '...' : '—'}
                      </div>
                      <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
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
          <div className="space-y-6 animate-fade-up pl-13">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-4 shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-2xl mx-auto shadow-xs">
                🎉
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50">
                Message Successfully Recovered!
              </h3>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                The private key reversed the mathematical trapdoor. The decoded values match the original plaintext with 100% precision.
              </p>

              {/* Side-by-side comparison */}
              <div className="flex items-center justify-center gap-6 pt-2 font-mono text-base sm:text-xl">
                <div className="px-5 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs">
                  <span className="text-xs text-stone-400 block mb-0.5">ORIGINAL</span>
                  <span className="font-bold text-stone-800 dark:text-stone-100">{messageInput}</span>
                </div>
                <span className="text-emerald-500 font-bold text-2xl">≡</span>
                <div className="px-5 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 shadow-xs">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 block mb-0.5">DECRYPTED</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{messageInput}</span>
                </div>
              </div>

              {/* Math inspection toggle */}
              <div className="pt-2">
                <button
                  onClick={() => setShowMathDetail(!showMathDetail)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-mono transition-colors cursor-pointer"
                >
                  <span>{showMathDetail ? 'Hide' : 'Inspect'} Step-by-Step Character Math</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${showMathDetail ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Collapsible Math Detail Drawer */}
            {showMathDetail && keys && (
              <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm font-mono space-y-3 animate-fade-in shadow-md">
                <div className="font-bold text-stone-800 dark:text-stone-200 pb-2 border-b border-stone-100 dark:border-stone-800">
                  Detailed Character Transformation Ledger:
                </div>
                <div className="divide-y divide-stone-100 dark:divide-stone-800 space-y-2">
                  {encodedChars.map((item, idx) => {
                    const c = cipherNumbers[idx];
                    return (
                      <div key={idx} className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-stone-700 dark:text-stone-300">
                        <div>
                          <span className="font-bold text-stone-900 dark:text-stone-100 text-base">'{item.char}'</span> (m={item.numericValue})
                        </div>
                        <div className="text-violet-700 dark:text-violet-400">
                          Encrypt: {item.numericValue}<sup>{keys.e.toString()}</sup> mod {keys.n.toString()} = <strong>{c?.toString()}</strong>
                        </div>
                        <div className="text-emerald-700 dark:text-emerald-400">
                          Decrypt: {c?.toString()}<sup>{keys.d.toString()}</sup> mod {keys.n.toString()} = <strong>{item.numericValue} ('{item.char}')</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={handleRestartNewMessage}
                className="px-6 py-3.5 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-violet-500 dark:hover:bg-violet-400 text-white text-sm sm:text-base font-medium transition-all shadow-md cursor-pointer"
              >
                Encrypt Another Message
              </button>
              <button
                onClick={handleRestartNewPrimes}
                className="px-6 py-3.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm sm:text-base font-medium transition-all shadow-xs cursor-pointer"
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
