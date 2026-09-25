import type { Lesson } from '../../types';
import { Video } from '../../helpers';

function video() {
  const v = new Video('math-essentials', 'Digits, GCD, primes and modulo');
  v.chapter('digits', 'Taking numbers apart', { code: ['while x > 0:', '  digit = x % 10', '  x = x / 10   (integer division)'] });
  const dg = v.array('digits', [], { label: 'digits collected (last digit first)' });
  const vars = v.vars('v', { x: 4721 });
  v.say('Many interview problems play with the digits of a number. Two operations do all the work: x mod ten gives the last digit, and x divided by ten, rounded down, removes it.');
  let x = 4721;
  let rev = 0;
  while (x > 0) {
    const d = x % 10;
    x = Math.floor(x / 10);
    rev = rev * 10 + d;
    dg.push(d).clearTones().tone(dg.length - 1, 'active');
    vars.set({ x, digit: d, reversed: rev });
    v.line(1, 2).eq(`digit = ${d}, x → ${x}`);
    if (dg.length === 1) v.say('Four seven two one mod ten is one. Divide by ten: four seven two.');
    else v.hold(800);
  }
  v.eq('reversed = reversed × 10 + digit → 1274', 'ok');
  v.say('Build the reversed number as we go: multiply by ten and add the digit. Four seven two one reversed is one two seven four. This is the core of Palindrome Number and Reverse Integer.');

  v.chapter('gcd', "Euclid's GCD", { code: ['gcd(a, b):', '  while b != 0:', '    a, b = b, a % b', '  return a'] });
  v.clear();
  const tb = v.table('g', ['a', 'b', 'a % b'], []);
  v.say('The greatest common divisor is the largest number that divides both. Euclid noticed that gcd of a and b equals gcd of b and a mod b.');
  let a = 48;
  let b = 18;
  while (b !== 0) {
    tb.addRow([String(a), String(b), String(a % b)]);
    tb.clearTones().tone(tb.p.rows.length - 1, 'active');
    v.line(2).eq(`gcd(${a}, ${b}) = gcd(${b}, ${a % b})`);
    [a, b] = [b, a % b];
    v.hold(1000);
  }
  tb.addRow([String(a), '0', '']);
  tb.clearTones().tone(tb.p.rows.length - 1, 'ok');
  v.line(3).eq(`gcd(48, 18) = ${a}`, 'ok').note('O(log(min(a, b))) steps');
  v.say('Forty-eight and eighteen become eighteen and twelve, then twelve and six, then six and zero. The answer is six. The numbers shrink fast, so this takes only logarithmic steps. And the least common multiple is a times b divided by the gcd.');

  v.chapter('sieve', 'Sieve of Eratosthenes', { code: ['isPrime[2..n] = true', 'for p = 2 while p*p <= n:', '  if isPrime[p]:', '    for m = p*p; m <= n; m += p:', '      isPrime[m] = false'] });
  v.clear();
  const N = 50;
  const cols = 10;
  const rows = Math.ceil(N / cols);
  const g = v.grid('s', Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_, c) => { const k = r * cols + c + 1; return k <= N ? k : null; })), { label: 'numbers 1 to 50' });
  const at = (k: number): [number, number] => [Math.floor((k - 1) / cols), (k - 1) % cols];
  g.tone(...at(1), 'dim');
  v.say('To find every prime up to n, testing each number separately is slow. The sieve crosses out multiples instead. Start by assuming everything from two up is prime.');
  const prime = Array(N + 1).fill(true);
  prime[0] = prime[1] = false;
  for (let p = 2; p * p <= N; p++) {
    if (!prime[p]) continue;
    g.tone(...at(p), 'ok');
    v.line(2).eq(`${p} is prime → cross out ${p * p}, ${p * p + p}, …`, 'ok');
    if (p === 2) v.say('Two is prime. Cross out every multiple of two, starting from four.');
    else if (p === 3) v.say('Three is still standing, so it is prime. Cross out its multiples, starting from nine, because six was already crossed out by two.');
    else v.hold(600);
    for (let m = p * p; m <= N; m += p) {
      if (prime[m]) {
        prime[m] = false;
        g.tone(...at(m), 'dim');
      }
    }
    v.line(4).hold(900);
  }
  for (let k = 2; k <= N; k++) if (prime[k]) g.tone(...at(k), 'ok');
  const count = prime.filter(Boolean).length;
  v.eq(`${count} primes up to 50`, 'ok').note('O(n log log n): nearly linear');
  v.say(`Once p squared passes fifty we can stop: whatever is left is prime. ${count} primes. The sieve runs in n log log n time, which is almost linear.`);

  v.chapter('mod', 'Overflow and modulo');
  v.clear();
  v.table('ov', ['Type', 'Range', 'Overflows after'], [
    ['32-bit int', '−2,147,483,648 … 2,147,483,647', 'about 2.1 × 10⁹'],
    ['64-bit long', '≈ ±9.2 × 10¹⁸', 'about 9.2 × 10¹⁸'],
  ]);
  v.say('Integers have limits. A thirty-two bit int overflows just past two billion and silently wraps around to a negative number in Java and C plus plus. Python integers never overflow, but interviewers still expect you to know this.');
  v.clear();
  v.text('m', { title: 'Answer modulo 1,000,000,007', lines: ['(a + b) mod m = ((a mod m) + (b mod m)) mod m', '(a × b) mod m = ((a mod m) × (b mod m)) mod m, using 64-bit for the product', 'Take mod after every step so numbers never grow', 'Subtraction: (a − b + m) mod m keeps it non-negative'], shown: 4 });
  v.say('When answers are huge, problems ask for them modulo a big prime, usually ten to the nine plus seven. You can take the mod after every addition and multiplication. Just do products in sixty-four bit, and add m before taking mod after a subtraction.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'Math toolkit', lines: ['`x % 10` last digit, `x / 10` drop it', 'gcd(a, b) = gcd(b, a % b); lcm = a / gcd × b', 'Sieve: cross out multiples from p², stop at √n', 'Know int limits; use long for products', 'Mod after every step; (a − b + m) % m for subtraction'] });
  v.say('Digits, gcd, the sieve, and modular arithmetic. These small tools show up inside much bigger problems, so keep them handy.');
  return v.build();
}

const body = String.raw`
## Digits

\`x % 10\` is the last digit; \`x / 10\` (integer division) drops it. Loop until \`x == 0\` to visit every digit from right to left.

\`\`\`java
int digitSum(int x) {
    int sum = 0;
    while (x > 0) { sum += x % 10; x /= 10; }
    return sum;
}
int reverse(int x) {            // ignoring overflow here
    int rev = 0;
    while (x != 0) { rev = rev * 10 + x % 10; x /= 10; }
    return rev;
}
\`\`\`

\`\`\`python
def digit_sum(x):
    s = 0
    while x > 0:
        s += x % 10
        x //= 10
    return s
\`\`\`

\`\`\`cpp
int digitSum(int x) {
    int sum = 0;
    while (x > 0) { sum += x % 10; x /= 10; }
    return sum;
}
\`\`\`

> Careful with negatives: in Java and C++, \`-7 % 10 == -7\`; in Python, \`-7 % 10 == 3\`. Handle the sign separately.

## GCD and LCM

Euclid's algorithm: **gcd(a, b) = gcd(b, a mod b)**, and gcd(a, 0) = a. It takes O(log min(a, b)) steps.

\`\`\`java
int gcd(int a, int b) {
    while (b != 0) { int t = a % b; a = b; b = t; }
    return a;
}
long lcm(long a, long b) { return a / gcd((int) a, (int) b) * b; }  // divide first to avoid overflow
\`\`\`

\`\`\`python
from math import gcd          # built in
def lcm(a, b):
    return a // gcd(a, b) * b
\`\`\`

\`\`\`cpp
int g = std::gcd(a, b);       // C++17 <numeric>
long long l = std::lcm((long long)a, (long long)b);
\`\`\`

## Primes

- **Test one number:** try divisors up to √n. If none divides it, it's prime. O(√n).
- **All primes up to n:** the **Sieve of Eratosthenes**. For each prime p, cross out p², p² + p, … Stop when p² > n. O(n log log n) time, O(n) space.

\`\`\`java
boolean[] sieve(int n) {
    boolean[] composite = new boolean[n + 1];
    for (int p = 2; (long) p * p <= n; p++)
        if (!composite[p])
            for (int m = p * p; m <= n; m += p) composite[m] = true;
    return composite;           // i >= 2 and !composite[i] → prime
}
\`\`\`

\`\`\`python
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0:2] = [False, False]
    p = 2
    while p * p <= n:
        if is_prime[p]:
            for m in range(p * p, n + 1, p):
                is_prime[m] = False
        p += 1
    return is_prime
\`\`\`

\`\`\`cpp
vector<bool> sieve(int n) {
    vector<bool> isPrime(n + 1, true);
    isPrime[0] = false; if (n >= 1) isPrime[1] = false;
    for (long long p = 2; p * p <= n; p++)
        if (isPrime[p])
            for (long long m = p * p; m <= n; m += p) isPrime[m] = false;
    return isPrime;
}
\`\`\`

## Overflow

| Type | Max |
|---|---|
| 32-bit \`int\` | 2,147,483,647 (≈ 2.1 × 10⁹) |
| 64-bit \`long\` / \`long long\` | ≈ 9.2 × 10¹⁸ |

In Java and C++ an int silently wraps around on overflow. Watch for: products of two ints (\`a * b\`), sums of many values, \`Math.abs(Integer.MIN_VALUE)\`, and \`(lo + hi) / 2\` in binary search (use \`lo + (hi - lo) / 2\`). Python ints never overflow.

## Modular arithmetic

When the answer is huge, problems ask for it **mod 10⁹ + 7**.

- \`(a + b) % m = ((a % m) + (b % m)) % m\`
- \`(a * b) % m = ((a % m) * (b % m)) % m\`, computing the product in 64 bits
- \`(a - b) % m\` → use \`((a - b) % m + m) % m\` to stay non-negative
- Division needs a modular inverse (for prime m: \`b^(m-2) mod m\` via fast power)

## Useful facts

- Sum 1 + 2 + … + n = n(n + 1) / 2.
- A number has at most about 2√n divisors; iterate \`d\` up to √n and add both \`d\` and \`n / d\`.
- Trailing zeros of n! = number of factors of 5 in 1…n.
`;

const lesson: Lesson = {
  slug: 'math-essentials',
  video,
  body,
  quiz: [
    { q: 'What does `x % 10` give you?', options: ['The first digit', 'The last digit', 'x divided by 10', 'The number of digits'], answer: 1, why: 'The remainder after dividing by 10 is the ones digit.' },
    { q: 'gcd(84, 36) using Euclid: 84 % 36 = 12, then 36 % 12 = 0. Answer?', options: ['6', '12', '36', '4'], answer: 1, why: 'When the remainder hits 0, the other number is the gcd.' },
    { q: 'In the sieve, why start crossing out at p²?', options: ['It is a coincidence', 'Smaller multiples of p have a smaller prime factor and were already crossed out', 'p² is always prime', 'To save memory'], answer: 1, why: 'k·p for k < p was crossed out when processing the prime factors of k.' },
    { q: 'Which is safe for computing (a × b) mod 10⁹+7 with a, b < 10⁹+7 in Java?', options: ['`(a * b) % MOD` with int a, b', '`(long) a * b % MOD`', '`a % MOD * b`', '`(a + b) % MOD`'], answer: 1, why: 'The product can reach 10¹⁸, which only fits in 64 bits.' },
  ],
};

export default lesson;
