# RSA Visualizer — Interactive Mathematics Laboratory

An educational web application created for a mathematics exhibition that visually demonstrates how the **RSA (Rivest–Shamir–Adleman)** public-key encryption and decryption algorithm works, one mathematical step at a time.

---

## 🎯 Educational Mission

The goal of this project is **not** merely to be an RSA calculator.

The application allows a student, teacher, or exhibition visitor to enter any custom message and watch step-by-step how the mathematical pipeline unfolds:

```
MESSAGE → NUMBER → ENCRYPT → CIPHERTEXT → DECRYPT → ORIGINAL MESSAGE
```

Every mathematical transformation is visible, animated, and inspectable.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔬 Core Features & Interactive Stages

1. **Stage 01: Key Generation Pipeline**
   - Sequentially derives $n = p \times q$, Euler's Totient $\phi(n) = (p-1)(q-1)$, public exponent $e$ ($\gcd(e, \phi(n)) = 1$), and private trapdoor exponent $d \equiv e^{-1} \pmod{\phi(n)}$.
   - Visual distinction between Public Key $(e, n)$ and Private Key $(d, n)$.

2. **Stage 02: Message & Numeric Encoding**
   - Direct alphabet-to-number mapping: $A = 1, B = 2, \dots, Z = 26$, $\text{Space} = 27$, plus punctuation.
   - Live check ensuring each numeric message block satisfies the RSA requirement $m < n$.

3. **Stage 03: Encryption Transformation**
   - Animated node-by-node calculation for each character:
     $$c \equiv m^e \pmod n$$
   - Displays intermediate power calculations and modular reductions.

4. **Stage 04: Ciphertext Payload & Transmission**
   - Dedicated panel showing the encrypted numerical stream.
   - Explains asymmetric network transmission: eavesdroppers see only integers $c$.

5. **Stage 05: Decryption Recovery**
   - Animated node-by-node recovery using the private exponent:
     $$m \equiv c^d \pmod n \implies \text{Character}$$
   - Visually emphasizes that only the holder of private key $d$ can reverse the trapdoor.

6. **Stage 06: Result & Verification**
   - Side-by-side verification confirming $m^{(ed)} \equiv m \pmod n$.
   - Interactive transformation ledger and confetti celebration upon successful recovery.

7. **Deep Math Character Inspector**
   - Click any character in the pipeline to open the modal inspector with the complete binary square-and-multiply modular exponentiation trace and algebraic proof.

8. **Educational Theory Tabs**
   - **How RSA Works**: The physical padlock analogy, asymmetric information flow, and why prime factorization is hard.
   - **Mathematics**: Formal definitions for primes, Euler's totient, Bézout's identity, modular arithmetic, and the proof of decryption correctness.

---

## ⚙️ Parameters & Presets

- **Exhibition Standard**: $p = 61, q = 53, e = 17 \implies n = 3233, \phi(n) = 3120, d = 2753$
- **Compact Showcase**: $p = 11, q = 13, e = 7 \implies n = 143, \phi(n) = 120, d = 103$
- **Custom Mode**: Enter any custom prime numbers $p, q$ and coprime exponent $e$ with instant mathematical validation.

---

## ⚠️ Educational Safety Notice

This application uses small 2-digit prime numbers intentionally so that students and viewers can manually verify the calculations by hand or calculator.

> **Real-world RSA** uses prime numbers 1024 to 2048 bits long (hundreds of decimal digits) to make factoring $n$ mathematically impossible with modern computing. This demonstration is designed exclusively for educational mathematics exhibitions and is **NOT** intended for secure production encryption.
