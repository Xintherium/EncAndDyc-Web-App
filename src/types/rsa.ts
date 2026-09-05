export type TabId = 'visualizer' | 'how-it-works' | 'mathematics';

export type StageId = 
  | 'keygen' 
  | 'message' 
  | 'encryption' 
  | 'ciphertext' 
  | 'decryption' 
  | 'result';

export interface StageInfo {
  id: StageId;
  stepNumber: number;
  label: string;
  description: string;
}

export interface RSAKeys {
  p: bigint;
  q: bigint;
  n: bigint;
  phi: bigint;
  e: bigint;
  d: bigint;
  publicKey: { e: bigint; n: bigint };
  privateKey: { d: bigint; n: bigint };
}

export interface EncodedChar {
  char: string;
  numericValue: number;
  index: number;
}

export interface CalculationDetail {
  char: string;
  m: bigint;
  e: bigint;
  d: bigint;
  n: bigint;
  c: bigint;
  recoveredM: bigint;
  recoveredChar: string;
  encryptionModularSteps: string[];
  decryptionModularSteps: string[];
}

export type ProcessingState = 'idle' | 'processing' | 'completed';

export interface EncryptCharState {
  index: number;
  char: string;
  m: bigint;
  c: bigint;
  powerCalcStr: string;
  modCalcStr: string;
  state: ProcessingState;
}

export interface DecryptCharState {
  index: number;
  c: bigint;
  m: bigint;
  char: string;
  powerCalcStr: string;
  modCalcStr: string;
  state: ProcessingState;
}

export interface RSAPreset {
  id: string;
  name: string;
  description: string;
  p: number;
  q: number;
  e: number;
  sampleMessage: string;
}
