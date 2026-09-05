import { EncodedChar } from '../types/rsa';

export interface CharEncodingInfo {
  char: string;
  code: number;
  description: string;
}

export const ENCODING_MAP: Record<string, number> = {
  'A': 1,  'B': 2,  'C': 3,  'D': 4,  'E': 5,
  'F': 6,  'G': 7,  'H': 8,  'I': 9,  'J': 10,
  'K': 11, 'L': 12, 'M': 13, 'N': 14, 'O': 15,
  'P': 16, 'Q': 17, 'R': 18, 'S': 19, 'T': 20,
  'U': 21, 'V': 22, 'W': 23, 'X': 24, 'Y': 25,
  'Z': 26,
  ' ': 27, // Space
  '.': 28, // Period
  '!': 29, // Exclamation mark
  '?': 30  // Question mark
};

export const DECODING_MAP: Record<number, string> = Object.entries(ENCODING_MAP).reduce(
  (acc, [char, code]) => {
    acc[code] = char;
    return acc;
  },
  {} as Record<number, string>
);

/**
 * Checks if a character is supported by our educational encoding scheme.
 */
export function isCharSupported(char: string): boolean {
  const upper = char.toUpperCase();
  return upper in ENCODING_MAP;
}

/**
 * Converts a character to its educational number (1-30).
 * Case insensitive (auto-converts lowercase to uppercase).
 */
export function encodeChar(char: string): number | null {
  const upper = char.toUpperCase();
  return ENCODING_MAP[upper] ?? null;
}

/**
 * Converts a number back to its character.
 */
export function decodeNumber(num: number): string {
  return DECODING_MAP[num] ?? '';
}

/**
 * Encodes an entire text message into EncodedChar items.
 */
export function encodeMessage(text: string): { encoded: EncodedChar[]; unsupportedChars: string[] } {
  const encoded: EncodedChar[] = [];
  const unsupportedChars: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const rawChar = text[i];
    const upper = rawChar.toUpperCase();
    const val = encodeChar(upper);

    if (val !== null) {
      encoded.push({
        char: upper === ' ' ? '␣' : upper,
        numericValue: val,
        index: i,
      });
    } else {
      unsupportedChars.push(rawChar);
    }
  }

  return { encoded, unsupportedChars };
}

/**
 * Validates whether message is valid and all numbers are strictly less than modulus n (m < n).
 */
export function validateMessageForRSA(
  text: string, 
  modulus: bigint
): { valid: boolean; error?: string; encoded: EncodedChar[] } {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Please enter a message to encrypt.', encoded: [] };
  }

  if (text.length > 20) {
    return { 
      valid: false, 
      error: 'For smooth animation and exhibition demonstration, please keep messages under 20 characters.', 
      encoded: [] 
    };
  }

  const { encoded, unsupportedChars } = encodeMessage(text);
  if (unsupportedChars.length > 0) {
    const unique = Array.from(new Set(unsupportedChars)).join(', ');
    return {
      valid: false,
      error: `Unsupported characters found: [ ${unique} ]. Please use standard letters A-Z, spaces, or basic punctuation (. ! ?).`,
      encoded: []
    };
  }

  // Check RSA requirement: m < n
  for (const item of encoded) {
    if (BigInt(item.numericValue) >= modulus) {
      return {
        valid: false,
        error: `Message number ${item.numericValue} ('${item.char}') is greater than or equal to modulus n = ${modulus}. In RSA, each message block m must satisfy m < n. Please choose larger primes or different characters.`,
        encoded: []
      };
    }
  }

  return { valid: true, encoded };
}
