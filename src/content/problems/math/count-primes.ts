import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';

const N = 30;

function video() {
  const v = new Video('count-primes', 'Count Primes');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'Count the primes strictly less than n', lines: ['n = 10 → 2, 3, 5, 7 → 4', 'n can be up to 5,000,000'] });
  v.say('Count how many prime numbers are strictly less than n. For ten, that is two, three, five and seven: four. And n can be five million.');

  v.chapter('brute', 'Brute force: test each number', { cx: 'O(n√n)', code: ['count = 0', 'for x in 2..n-1:', '  if no d in 2..√x divides x:', '    count += 1'] });
  v.clear();
  const tb = v.table('t', ['x', 'divisors tried (up to √x)', 'prime?'], []);
  for (const x of [7, 9, 29]) {
    const tried: string[] = [];
    let prime = true;
    for (let d = 2; d * d <= x; d++) {
      tried.push(String(d));
      if (x % d === 0) {
        prime = false;
        break;
      }
    }
    tb.addRow([String(x), tried.join(', ') || '(none)', prime ? 'yes' : 'no']);
    tb.clearTones().tone(tb.p.rows.length - 1, prime ? 'ok' : 'bad');
    if (x === 7) v.say('Test each number by trying divisors up to its square root. Seven: two does not divide it, and three squared is already more than seven. Prime.');
    else if (x === 9) v.say('Nine: three divides it. Not prime.');
    else v.hold(900);
  }
  v.eq('~5M numbers × up to ~2,200 divisions each', 'bad');
  v.say('That is about n times square root of n work. For five million, billions of divisions. We are re-deriving the same facts over and over.');

  v.chapter('optimal', 'Optimal: Sieve of Eratosthenes', { cx: 'O(n log log n)', code: ['isPrime[0..n-1] = true; isPrime[0], isPrime[1] = false', 'for p = 2 while p*p < n:', '  if isPrime[p]:', '    for m = p*p; m < n; m += p: isPrime[m] = false', 'return count of true'] });
  v.clear();
  const cols = 10;
  const g = v.grid('g', Array.from({ length: N / cols }, (_, r) => Array.from({ length: cols }, (_, c) => r * cols + c)), { label: `numbers 0 … ${N - 1}` });
  const at = (k: number): [number, number] => [Math.floor(k / cols), k % cols];
  g.tone(...at(0), 'dim').tone(...at(1), 'dim');
  v.line(0).say('Instead, cross out composites. Mark zero and one as not prime, and assume everything else is.');
  const isP = Array(N).fill(true);
  isP[0] = isP[1] = false;
  for (let p = 2; p * p < N; p++) {
    if (!isP[p]) continue;
    g.tone(...at(p), 'ok');
    const crossed: number[] = [];
    for (let m = p * p; m < N; m += p) {
      if (isP[m]) crossed.push(m);
      isP[m] = false;
      g.tone(...at(m), 'dim');
    }
    v.line(3).eq(`${p} is prime → cross out ${crossed.join(', ')}`, 'ok');
    if (p === 2) v.say('Two survives, so it is prime. Cross out four, six, eight and every other multiple of two.');
    else if (p === 3) v.say('Three survives. Cross out its multiples from nine on.');
    else v.say('Five survives. Twenty-five is its only new multiple under thirty. Six squared is thirty-six, past thirty, so we can stop.');
  }
  for (let k = 2; k < N; k++) if (isP[k]) g.tone(...at(k), 'ok');
  const count = isP.filter(Boolean).length;
  v.line(4).eq(`${count} primes below ${N}`, 'ok').note('each number is crossed out a few times at most');
  v.say(`Everything left standing is prime: ${words(count)} primes below thirty. Each composite gets crossed out only a handful of times, so the sieve is n log log n, practically linear.`);
  v.answer(count);

  recap(v, [{ name: 'Trial division for each number', time: 'O(n√n)', space: 'O(1)' }, { name: 'Sieve of Eratosthenes', time: 'O(n log log n)', space: 'O(n)' }], 'Testing each number repeats work. The sieve shares it: every prime crosses out its multiples once.', ['Many primality questions up to n → sieve', 'Start crossing at p², stop when p² ≥ n'], 'Whenever you need primes for a whole range, reach for the sieve.');
  return v.build();
}

const problem: Problem = {
  slug: 'count-primes',
  statement: 'Given an integer `n`, return the number of prime numbers that are **strictly less than** `n`.',
  examples: [
    { input: 'n = 10', output: '4', why: '2, 3, 5 and 7.' },
    { input: 'n = 0', output: '0' },
    { input: 'n = 1', output: '0' },
  ],
  constraints: ['0 ≤ n ≤ 5 · 10⁶'],
  hints: ['Testing each number up to √x works but is slow for n = 5 million.', 'Instead of testing numbers, cross out multiples of each prime you find.', 'Start crossing out at p × p; smaller multiples were already handled.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Trial division', idea: 'For every x from 2 to n − 1, try divisors up to √x.', time: 'O(n√n)', space: 'O(1)', bottleneck: 'Billions of divisions for n = 5 × 10⁶, repeating the same facts.' },
    {
      id: 'optimal', kind: 'optimal', name: 'Sieve of Eratosthenes',
      idea: 'Keep a boolean array. For each p that is still marked prime, mark p², p² + p, … as composite. Count what remains.',
      steps: ['If `n < 3` return 0', 'Mark 0 and 1 as not prime', 'For `p` while `p * p < n`: if prime, cross out `p*p, p*p+p, …`', 'Count the remaining `true` entries'],
      time: 'O(n log log n)', space: 'O(n)',
    },
  ],
  pitfalls: ['"Strictly less than n": do not count n itself.', 'Using `i * i` in 32-bit when i can be large; the loop condition `p * p < n` is safe since p ≤ √n.'],
  takeaway: 'Need primality for **every** number up to n? Use the **sieve**, not repeated trial division.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'countPrimes', params: ['int'], ret: 'int',
    tests: [{ args: [10], out: 4 }, { args: [0], out: 0 }, { args: [1], out: 0 }, { args: [2], out: 0 }, { args: [3], out: 1 }, { args: [100], out: 25 }, { args: [5000000], out: 348513, big: true }],
    gen: (r) => [r.int(0, 2000)],
    ref: (n: number) => { let c = 0; for (let x = 2; x < n; x++) { let p = true; for (let d = 2; d * d <= x; d++) if (x % d === 0) { p = false; break; } if (p) c++; } return c; },
  },
};

export default problem;
