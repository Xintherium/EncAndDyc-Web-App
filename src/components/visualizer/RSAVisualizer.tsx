import React, { useState, useEffect, useCallback } from 'react';
import {
  RSAKeys,
  StageId,
  EncodedChar,
  EncryptCharState,
  DecryptCharState,
} from '../../types/rsa';
import { validateAndComputeRSA, modPow } from '../../utils/rsa';
import { validateMessageForRSA } from '../../utils/encoding';
import { RSA_PRESETS } from '../../utils/presets';
import { StepIndicator } from './StepIndicator';
import { AnimationControls } from './AnimationControls';
import { SetupPanel } from './SetupPanel';
import { KeyGenVisualizer } from './KeyGenVisualizer';
import { MessageEncoder } from './MessageEncoder';
import { EncryptionVisualizer } from './EncryptionVisualizer';
import { CiphertextDisplay } from './CiphertextDisplay';
import { DecryptionVisualizer } from './DecryptionVisualizer';
import { ResultView } from './ResultView';
import { NumberDetailModal } from './NumberDetailModal';

export const RSAVisualizer: React.FC = () => {
  // Preset defaults: p=61, q=53, e=17, message="HELLO"
  const defaultPreset = RSA_PRESETS[0];

  const [message, setMessage] = useState<string>(defaultPreset.sampleMessage);

  // RSA Computed Keys
  const [keys, setKeys] = useState<RSAKeys>(() => {
    const res = validateAndComputeRSA(defaultPreset.p, defaultPreset.q, defaultPreset.e);
    if (res.valid && res.keys) return res.keys;
    throw new Error('Failed to initialize default RSA keys');
  });

  // Current Stage
  const [currentStage, setCurrentStage] = useState<StageId>('keygen');

  // Animation Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0); // 0.5, 1.0, 2.0

  // Active Character Index for per-char animations
  const [activeEncCharIndex, setActiveEncCharIndex] = useState<number>(0);
  const [activeDecCharIndex, setActiveDecCharIndex] = useState<number>(0);

  // Inspector Modal State
  const [inspectIndex, setInspectIndex] = useState<number | null>(null);

  // Encoded Chars derived from message
  const [encodedChars, setEncodedChars] = useState<EncodedChar[]>(() => {
    const val = validateMessageForRSA(defaultPreset.sampleMessage, keys.n);
    return val.encoded;
  });

  // Per-character Encryption States
  const [encryptStates, setEncryptStates] = useState<EncryptCharState[]>([]);
  // Per-character Decryption States
  const [decryptStates, setDecryptStates] = useState<DecryptCharState[]>([]);

  // Setup panel collapsible toggle
  const [showSetup, setShowSetup] = useState<boolean>(false);

  // Recompute character states whenever encodedChars or keys change
  const buildCharStates = useCallback((chars: EncodedChar[], currentKeys: RSAKeys) => {
    const encList: EncryptCharState[] = chars.map((item, idx) => {
      const m = BigInt(item.numericValue);
      const c = modPow(m, currentKeys.e, currentKeys.n);
      
      let powerCalcStr = '';
      if (currentKeys.e <= 4n) {
        powerCalcStr = (m ** currentKeys.e).toString();
      } else {
        powerCalcStr = `${m}^${currentKeys.e} (large power)`;
      }

      return {
        index: idx,
        char: item.char,
        m,
        c,
        powerCalcStr,
        modCalcStr: `${m}^${currentKeys.e} mod ${currentKeys.n}`,
        state: 'idle',
      };
    });

    const decList: DecryptCharState[] = chars.map((item, idx) => {
      const m = BigInt(item.numericValue);
      const c = modPow(m, currentKeys.e, currentKeys.n);
      return {
        index: idx,
        c,
        m,
        char: item.char,
        powerCalcStr: `${c}^${currentKeys.d} (large power)`,
        modCalcStr: `${c}^${currentKeys.d} mod ${currentKeys.n}`,
        state: 'idle',
      };
    });

    setEncryptStates(encList);
    setDecryptStates(decList);
    setActiveEncCharIndex(0);
    setActiveDecCharIndex(0);
  }, []);

  // Initialize or re-initialize on key/message change
  useEffect(() => {
    const val = validateMessageForRSA(message, keys.n);
    if (val.valid) {
      setEncodedChars(val.encoded);
      buildCharStates(val.encoded, keys);
    }
  }, [message, keys, buildCharStates]);

  // Apply new parameters
  const handleApplyParameters = (newP: number, newQ: number, newE: number) => {
    const res = validateAndComputeRSA(newP, newQ, newE);
    if (res.valid && res.keys) {
      setKeys(res.keys);
      setIsPlaying(false);
      setCurrentStage('keygen');
      buildCharStates(encodedChars, res.keys);
    }
  };

  const handleMessageChange = (newMsg: string) => {
    setMessage(newMsg);
    setIsPlaying(false);
  };

  // Helper: fast-forward all encryption
  const completeAllEncryption = () => {
    setEncryptStates(prev => prev.map(item => ({ ...item, state: 'completed' })));
    setActiveEncCharIndex(encryptStates.length - 1);
  };

  // Helper: fast-forward all decryption
  const completeAllDecryption = () => {
    setDecryptStates(prev => prev.map(item => ({ ...item, state: 'completed' })));
    setActiveDecCharIndex(decryptStates.length - 1);
  };

  // Playback Loop Ticker
  useEffect(() => {
    if (!isPlaying) return;

    // Base interval adjusted by speed
    const baseDelay = 1200 / speed;

    const timer = setTimeout(() => {
      if (currentStage === 'keygen') {
        setCurrentStage('message');
      } else if (currentStage === 'message') {
        setCurrentStage('encryption');
        setActiveEncCharIndex(0);
        setEncryptStates(prev =>
          prev.map((item, i) => ({ ...item, state: i === 0 ? 'processing' : 'idle' }))
        );
      } else if (currentStage === 'encryption') {
        // Step through characters
        setEncryptStates(prev => {
          const next = [...prev];
          if (next[activeEncCharIndex]) {
            next[activeEncCharIndex].state = 'completed';
          }
          if (activeEncCharIndex + 1 < next.length) {
            next[activeEncCharIndex + 1].state = 'processing';
          }
          return next;
        });

        if (activeEncCharIndex + 1 < encryptStates.length) {
          setActiveEncCharIndex(prev => prev + 1);
        } else {
          // Encryption finished for all chars -> proceed to ciphertext
          setCurrentStage('ciphertext');
        }
      } else if (currentStage === 'ciphertext') {
        setCurrentStage('decryption');
        setActiveDecCharIndex(0);
        setDecryptStates(prev =>
          prev.map((item, i) => ({ ...item, state: i === 0 ? 'processing' : 'idle' }))
        );
      } else if (currentStage === 'decryption') {
        // Step through characters
        setDecryptStates(prev => {
          const next = [...prev];
          if (next[activeDecCharIndex]) {
            next[activeDecCharIndex].state = 'completed';
          }
          if (activeDecCharIndex + 1 < next.length) {
            next[activeDecCharIndex + 1].state = 'processing';
          }
          return next;
        });

        if (activeDecCharIndex + 1 < decryptStates.length) {
          setActiveDecCharIndex(prev => prev + 1);
        } else {
          // Decryption finished -> proceed to result
          setCurrentStage('result');
          setIsPlaying(false);
        }
      } else if (currentStage === 'result') {
        setIsPlaying(false);
      }
    }, baseDelay);

    return () => clearTimeout(timer);
  }, [
    isPlaying,
    currentStage,
    activeEncCharIndex,
    activeDecCharIndex,
    encryptStates.length,
    decryptStates.length,
    speed,
  ]);

  // Next Button Click Handler
  const handleNext = () => {
    if (currentStage === 'keygen') {
      setCurrentStage('message');
    } else if (currentStage === 'message') {
      setCurrentStage('encryption');
      setActiveEncCharIndex(0);
    } else if (currentStage === 'encryption') {
      if (activeEncCharIndex + 1 < encryptStates.length) {
        setEncryptStates(prev => {
          const next = [...prev];
          if (next[activeEncCharIndex]) next[activeEncCharIndex].state = 'completed';
          if (next[activeEncCharIndex + 1]) next[activeEncCharIndex + 1].state = 'completed';
          return next;
        });
        setActiveEncCharIndex(prev => prev + 1);
      } else {
        completeAllEncryption();
        setCurrentStage('ciphertext');
      }
    } else if (currentStage === 'ciphertext') {
      setCurrentStage('decryption');
      setActiveDecCharIndex(0);
    } else if (currentStage === 'decryption') {
      if (activeDecCharIndex + 1 < decryptStates.length) {
        setDecryptStates(prev => {
          const next = [...prev];
          if (next[activeDecCharIndex]) next[activeDecCharIndex].state = 'completed';
          if (next[activeDecCharIndex + 1]) next[activeDecCharIndex + 1].state = 'completed';
          return next;
        });
        setActiveDecCharIndex(prev => prev + 1);
      } else {
        completeAllDecryption();
        setCurrentStage('result');
      }
    }
  };

  // Back Button Click Handler
  const handlePrev = () => {
    if (currentStage === 'result') {
      setCurrentStage('decryption');
    } else if (currentStage === 'decryption') {
      if (activeDecCharIndex > 0) {
        setActiveDecCharIndex(prev => prev - 1);
      } else {
        setCurrentStage('ciphertext');
      }
    } else if (currentStage === 'ciphertext') {
      setCurrentStage('encryption');
    } else if (currentStage === 'encryption') {
      if (activeEncCharIndex > 0) {
        setActiveEncCharIndex(prev => prev - 1);
      } else {
        setCurrentStage('message');
      }
    } else if (currentStage === 'message') {
      setCurrentStage('keygen');
    }
  };

  // Restart Handler
  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStage('keygen');
    setActiveEncCharIndex(0);
    setActiveDecCharIndex(0);
    buildCharStates(encodedChars, keys);
  };

  const handleStageSelect = (stage: StageId) => {
    setIsPlaying(false);
    setCurrentStage(stage);
    if (stage === 'encryption' || stage === 'ciphertext' || stage === 'decryption' || stage === 'result') {
      // Auto-complete preceding steps if skipping ahead
      setEncryptStates(prev => prev.map(s => ({ ...s, state: 'completed' })));
    }
    if (stage === 'decryption' || stage === 'result') {
      setDecryptStates(prev => prev.map(s => ({ ...s, state: 'completed' })));
    }
  };

  // Active inspect item
  const inspectCharState = inspectIndex !== null ? encryptStates[inspectIndex] : null;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar: Step Indicator */}
      <StepIndicator currentStage={currentStage} onSelectStage={handleStageSelect} />

      {/* Animation Playback and Speed Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <AnimationControls
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onNext={handleNext}
          onPrev={handlePrev}
          onRestart={handleRestart}
          speed={speed}
          onSpeedChange={setSpeed}
          canGoNext={currentStage !== 'result'}
          canGoPrev={currentStage !== 'keygen'}
        />

        <button
          onClick={() => setShowSetup(!showSetup)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors text-center"
        >
          {showSetup ? 'Hide RSA Setup Panel' : '⚙ RSA Setup & Primes'}
        </button>
      </div>

      {/* Collapsible Setup Panel */}
      {showSetup && (
        <div className="animate-slide-up">
          <SetupPanel keys={keys} onApplyParameters={handleApplyParameters} />
        </div>
      )}

      {/* Main Stage View */}
      <main className="min-h-[420px]">
        {currentStage === 'keygen' && (
          <KeyGenVisualizer keys={keys} autoAnimate={!isPlaying} />
        )}

        {currentStage === 'message' && (
          <MessageEncoder
            message={message}
            onMessageChange={handleMessageChange}
            encodedChars={encodedChars}
            modulus={keys.n}
            selectedIndex={inspectIndex}
            onSelectCharIndex={(idx) => setInspectIndex(idx)}
          />
        )}

        {currentStage === 'encryption' && (
          <EncryptionVisualizer
            keys={keys}
            charStates={encryptStates}
            activeCharIndex={activeEncCharIndex}
            onSelectCharIndex={(idx) => setActiveEncCharIndex(idx)}
            onCompleteAll={completeAllEncryption}
          />
        )}

        {currentStage === 'ciphertext' && (
          <CiphertextDisplay
            charStates={encryptStates}
            keys={keys}
            onProceedToDecryption={() => {
              setCurrentStage('decryption');
              setActiveDecCharIndex(0);
            }}
          />
        )}

        {currentStage === 'decryption' && (
          <DecryptionVisualizer
            keys={keys}
            charStates={decryptStates}
            activeCharIndex={activeDecCharIndex}
            onSelectCharIndex={(idx) => setActiveDecCharIndex(idx)}
            onCompleteAll={completeAllDecryption}
          />
        )}

        {currentStage === 'result' && (
          <ResultView
            originalMessage={message}
            encodedChars={encodedChars}
            encryptStates={encryptStates}
            decryptStates={decryptStates}
            keys={keys}
            onRunAgain={handleRestart}
            onOpenSetup={() => setShowSetup(true)}
            onInspectChar={(idx) => setInspectIndex(idx)}
          />
        )}
      </main>

      {/* Deep Dive Number Modal */}
      {inspectCharState && (
        <NumberDetailModal
          isOpen={inspectIndex !== null}
          onClose={() => setInspectIndex(null)}
          charIndex={inspectIndex!}
          char={inspectCharState.char}
          m={inspectCharState.m}
          c={inspectCharState.c}
          keys={keys}
        />
      )}
    </div>
  );
};
