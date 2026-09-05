import { RSAPreset } from '../types/rsa';

export const RSA_PRESETS: RSAPreset[] = [
  {
    id: 'standard-61-53',
    name: 'Exhibition Standard (p=61, q=53)',
    description: 'The textbook example used across computer science curriculums. n = 3233, e = 17.',
    p: 61,
    q: 53,
    e: 17,
    sampleMessage: 'HELLO'
  },
  {
    id: 'mini-11-13',
    name: 'Compact Showcase (p=11, q=13)',
    description: 'Very small primes with n = 143, e = 7. Easy to compute by hand.',
    p: 11,
    q: 13,
    e: 7,
    sampleMessage: 'MATH'
  },
  {
    id: 'balanced-17-23',
    name: 'Fast Verification (p=17, q=23)',
    description: 'Mid-sized primes with n = 391, e = 5.',
    p: 17,
    q: 23,
    e: 5,
    sampleMessage: 'SECRET'
  },
  {
    id: 'extended-43-59',
    name: 'Extended Range (p=43, q=59)',
    description: 'Produces a large modulus n = 2537, e = 13. Good for multi-character sentences.',
    p: 43,
    q: 59,
    e: 13,
    sampleMessage: 'KEY'
  }
];

export const EDUCATIONAL_PRIMES = [
  7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
];
