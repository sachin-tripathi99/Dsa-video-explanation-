import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const X = 40;

function video() {
  const v = new Video('sqrtx', 'Sqrt(x)');
  v.chapter('intro', 'The problem');
  v.text('q', { title: `x = ${X}`, lines: [`√${X} ≈ ${Math.sqrt(X).toFixed(3)} → rounded down: ${Math.floor(Math.sqrt(X))}`, 'no built-in pow or sqrt allowed'], shown: 2 });
  v.say(`Return the square root of x rounded down to an integer, without any built-in square root or power function.`);

  v.chapter('brute', 'Brute force: try k = 1, 2, 3, …', { cx: 'O(√x)', code: ['k = 0', 'while (k + 1)² <= x: k += 1', 'return k'] });
  v.eq('√(2³¹) ≈ 46,341 steps in the worst case', 'warn').say('Count upward until the next square is too big. That takes square root of x steps, fine but not great.');

  v.chapter('optimal', 'Optimal: binary search on the answer', { cx: 'O(log x)', code: ['find the LAST k with k² <= x', 'lo, hi = 0, x', 'while lo < hi:', '  mid = lo + (hi − lo + 1) / 2   # round up!', '  if mid² <= x: lo = mid else: hi = mid − 1', 'return lo'] });
  v.clear();
  const cand = Array.from({ length: 11 }, (_, i) => i);
  const a = v.array('k', cand, { label: 'candidate answers k (k² shown below)' });
  a.subs(cand.map((k) => `${k * k}`));
  v.say(`The answer is the largest k with k squared at most ${X}. As k grows, k squared only grows, so “k squared at most x” is true, true, true, then false forever. Binary search finds the last true.`);
  let lo = 0;
  let hi = 10;
  let step = 0;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo + 1) / 2);
    const ok = mid * mid <= X;
    a.clearTones().noPtr().ptrs({ lo, mid, hi });
    for (let i = 0; i < cand.length; i++) if (i < lo || i > hi) a.tone(i, 'out');
    a.tone(mid, ok ? 'ok' : 'bad');
    v.line(3, 4).eq(`mid ${mid}: ${mid}² = ${mid * mid} ${ok ? `≤ ${X} → lo = ${mid}` : `> ${X} → hi = ${mid - 1}`}`);
    if (step === 0) v.say(`We search for the last true, so mid is rounded up. Otherwise, with lo and hi next to each other, mid would equal lo and lo equals mid would loop forever. Mid ${mid}: ${mid} squared is ${mid * mid}, ${ok ? 'still fine, so lo moves up to mid' : 'too big, so hi moves below mid'}.`);
    else v.hold(800);
    step++;
    if (ok) lo = mid;
    else hi = mid - 1;
  }
  a.clearTones().noPtr().ptr('ans', lo).tone(lo, 'ok');
  v.line(5).eq(`⌊√${X}⌋ = ${lo}`, 'ok').say(`The answer is ${lo}: ${lo} squared is ${lo * lo}, and ${lo + 1} squared, ${(lo + 1) * (lo + 1)}, is too big. In code, compute mid times mid in sixty-four bits, or compare mid with x divided by mid, because mid squared can overflow.`);
  v.answer(lo);

  recap(v, [{ name: 'Count upward', time: 'O(√x)', space: 'O(1)' }, { name: 'Binary search on k', time: 'O(log x)', space: 'O(1)' }], 'Last k with k² ≤ x; round mid up when lo = mid.', ['Monotonic condition on a number range → binary search the answer', 'Last true → mid rounds up'], 'You can binary search over answers, not just over array indices, as long as the condition is monotonic.');
  return v.build();
}

const problem: Problem = {
  slug: 'sqrtx',
  statement: 'Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer. You must not use any built-in exponent function or operator (such as `pow(x, 0.5)` or `x ** 0.5`).',
  examples: [{ input: 'x = 4', output: '2' }, { input: 'x = 8', output: '2', why: '√8 = 2.828…, rounded down.' }],
  constraints: ['0 ≤ x ≤ 2³¹ − 1'],
  hints: ['The answer k is the largest integer with k² ≤ x.', 'k² ≤ x is monotonic in k.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count upward', idea: 'Increase k while (k+1)² ≤ x.', time: 'O(√x)', space: 'O(1)', bottleneck: 'About 46,000 steps for the largest x.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search on the answer', idea: 'Find the last k in [0, x] with k² ≤ x, using 64-bit products and a rounded-up mid.', time: 'O(log x)', space: 'O(1)' },
  ],
  pitfalls: ['`mid * mid` overflows 32 bits: use long, or compare `mid <= x / mid`.', 'With `lo = mid`, round mid up or the loop never ends.'],
  takeaway: 'Binary search works on **answer ranges**, not just arrays.',
  video,
  videoArgs: [X],
  judge: {
    type: 'fn', fn: 'mySqrt', params: ['int'], ret: 'int',
    tests: [{ args: [4], out: 2 }, { args: [8], out: 2 }, { args: [0], out: 0 }, { args: [1], out: 1 }, { args: [2147483647], out: 46340 }, { args: [2147395600], out: 46340 }],
    gen: (r: Rng) => [r.chance(0.5) ? r.int(0, 200) : r.int(0, 2147483647)],
    ref: (x: number) => Math.floor(Math.sqrt(x)),
  },
};

export default problem;
