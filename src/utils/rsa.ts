import { RSAKeys } from '../types/rsa';

/**
 * Computes the Greatest Common Divisor of two BigInts using Euclid's algorithm.
 */
export function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

/**
 * Extended Euclidean Algorithm.
 * Returns { gcd, x, y } such that a*x + b*y = gcd(a, b).
 */
export function extendedGCD(a: bigint, b: bigint): { gcd: bigint; x: bigint; y: bigint } {
  if (b === 0n) {
    return { gcd: a, x: 1n, y: 0n };
  }
  const { gcd: g, x: x1, y: y1 } = extendedGCD(b, a % b);
  const x = y1;
  const y = x1 - (a / b) * y1;
  return { gcd: g, x, y };
}

/**
 * Computes modular multiplicative inverse of e modulo phi:
 * d * e ≡ 1 (mod phi)
 * Returns null if inverse does not exist.
 */
export function modInverse(e: bigint, phi: bigint): bigint | null {
  const { gcd: g, x } = extendedGCD(e, phi);
  if (g !== 1n) {
    return null; // Inverse does not exist (not coprime)
  }
  // Ensure d is positive
  const d = ((x % phi) + phi) % phi;
  return d;
}

/**
 * Efficient modular exponentiation: (base^exponent) % modulus
 * Uses right-to-left binary method (Square and Multiply).
 */
export function modPow(base: bigint, exponent: bigint, modulus: bigint): bigint {
  if (modulus === 1n) return 0n;
  let result = 1n;
  let b = base % modulus;
  let exp = exponent;

  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * b) % modulus;
    }
    exp = exp / 2n;
    b = (b * b) % modulus;
  }
  return result;
}

/**
 * Primality test for educational numbers.
 */
export function isPrime(n: bigint | number): boolean {
  const num = BigInt(n);
  if (num <= 1n) return false;
  if (num <= 3n) return true;
  if (num % 2n === 0n || num % 3n === 0n) return false;

  for (let i = 5n; i * i <= num; i += 6n) {
    if (num % i === 0n || num % (i + 2n) === 0n) {
      return false;
    }
  }
  return true;
}

/**
 * Generate step-by-step modular exponentiation trace for educational display.
 */
export function getModularExponentiationSteps(base: bigint, exponent: bigint, modulus: bigint): string[] {
  const steps: string[] = [];
  
  if (exponent <= 4n) {
    // For very small exponents, show direct power
    const rawVal = base ** exponent;
    steps.push(`${base}^${exponent} = ${rawVal}`);
    steps.push(`${rawVal} mod ${modulus} = ${rawVal % modulus}`);
    return steps;
  }

  // Educational breakdown: show square-and-multiply or incremental breakdown
  const bin = exponent.toString(2);
  steps.push(`Binary expansion of exponent ${exponent} = ${bin}₂`);

  let current = 1n;
  for (let i = 0; i < bin.length; i++) {
    const bit = bin[i];
    const prev = current;
    current = (current * current) % modulus;
    
    if (bit === '1') {
      const beforeMultiply = current;
      current = (current * base) % modulus;
      steps.push(
        `Bit 1 (step ${i + 1}): (${prev}² = ${prev * prev} mod ${modulus} = ${beforeMultiply}) × ${base} = ${beforeMultiply * base} mod ${modulus} = ${current}`
      );
    } else {
      steps.push(
        `Bit 0 (step ${i + 1}): ${prev}² = ${prev * prev} mod ${modulus} = ${current}`
      );
    }
  }

  steps.push(`Final result: ${base}^${exponent} mod ${modulus} = ${current}`);
  return steps;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  keys?: RSAKeys;
}

/**
 * Validates RSA parameters (p, q, e) and computes keys.
 */
export function validateAndComputeRSA(pNum: number, qNum: number, eNum: number): ValidationResult {
  const p = BigInt(pNum);
  const q = BigInt(qNum);
  const e = BigInt(eNum);

  if (p <= 1n || !isPrime(p)) {
    return { valid: false, error: `p (${p}) must be a prime number greater than 1.` };
  }

  if (q <= 1n || !isPrime(q)) {
    return { valid: false, error: `q (${q}) must be a prime number greater than 1.` };
  }

  if (p === q) {
    return { valid: false, error: 'p and q must be distinct prime numbers (p ≠ q).' };
  }

  const n = p * q;
  const phi = (p - 1n) * (q - 1n);

  if (e <= 1n) {
    return { valid: false, error: `e (${e}) must be greater than 1.` };
  }

  if (e >= phi) {
    return { valid: false, error: `e (${e}) must be strictly less than φ(n) = ${phi}.` };
  }

  const g = gcd(e, phi);
  if (g !== 1n) {
    return { 
      valid: false, 
      error: `e (${e}) and φ(n) (${phi}) must be coprime. Their gcd is ${g} ≠ 1.` 
    };
  }

  const d = modInverse(e, phi);
  if (d === null) {
    return { valid: false, error: `Could not find modular inverse for e = ${e} mod φ(n) = ${phi}.` };
  }

  return {
    valid: true,
    keys: {
      p,
      q,
      n,
      phi,
      e,
      d,
      publicKey: { e, n },
      privateKey: { d, n }
    }
  };
}

/**
 * Find list of valid public exponents e for given phi(n).
 */
export function getSuggestedExponents(phi: bigint, count = 6): bigint[] {
  const commonCandidates = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 65537n];
  const valid: bigint[] = [];

  for (const cand of commonCandidates) {
    if (cand < phi && gcd(cand, phi) === 1n) {
      valid.push(cand);
      if (valid.length >= count) break;
    }
  }

  if (valid.length === 0) {
    // Search sequentially
    for (let c = 3n; c < phi; c += 2n) {
      if (gcd(c, phi) === 1n) {
        valid.push(c);
        if (valid.length >= count) break;
      }
    }
  }

  return valid;
}
