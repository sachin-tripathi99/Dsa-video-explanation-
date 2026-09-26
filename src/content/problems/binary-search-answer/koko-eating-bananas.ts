import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { answerSearch } from '../../bsviz';

const P = [3, 6, 7, 11];
const H = 8;
const hours = (p: number[], k: number) => p.reduce((s, x) => s + Math.ceil(x / k), 0);
const solve = (p: number[], h: number) => { let lo = 1, hi = Math.max(...p); while (lo < hi) { const m = (lo + hi) >> 1; if (hours(p, m) <= h) hi = m; else lo = m + 1; } return lo; };

function video() {
  const v = new Video('koko-eating-bananas', 'Koko Eating Bananas');
  v.chapter('intro', 'The problem');
  v.array('p', P, { label: `banana piles · guards return in h = ${H} hours` });
  v.say(`Koko eats bananas at a fixed speed of k per hour. Each hour she picks one pile and eats k bananas from it; if the pile has fewer, she finishes it and waits for the next hour. What is the slowest speed that finishes all piles within ${words(H)} hours?`);
  v.eq('hours at speed k = Σ ceil(pile / k)');

  v.chapter('brute', 'Brute force: try k = 1, 2, 3, …', { cx: 'O(n · max pile)', code: ['for k in 1..max(piles):', '  if hours(k) <= h: return k'] });
  v.eq('up to 10⁹ speeds × n piles', 'bad').say('Trying every speed from one upward works, but the largest pile can hold a billion bananas.');

  v.chapter('optimal', 'Optimal: binary search the speed', { cx: 'O(n log max)', code: ['lo, hi = 1, max(piles)', 'while lo < hi: mid = (lo + hi) / 2', '  if hours(mid) <= h: hi = mid     # fast enough: try slower', '  else: lo = mid + 1', 'return lo'] });
  v.clear();
  const a = v.array('p', P, { label: `piles · h = ${H}` });
  v.say(`If speed k is fast enough, any faster speed is too. So binary search between one and the largest pile, ${words(Math.max(...P))}, since eating faster than the largest pile never helps.`);
  const ans = answerSearch(v, {
    lo: 1, hi: Math.max(...P), name: 'k', lines: { ok: [2], bad: [3] },
    check: (k) => { const h = hours(P, k); a.subs(P.map((x) => `${Math.ceil(x / k)}h`)); return { ok: h <= H, info: `${P.map((x) => Math.ceil(x / k)).join('+')} = ${h} h ${h <= H ? '≤' : '>'} ${H}` }; },
    firstSay: (k, ok) => `Try speed ${words(k)}. Under each pile is how many hours it takes: pile divided by speed, rounded up. The total is ${words(hours(P, k))} hours, ${ok ? `within ${words(H)}. So ${words(k)} works; try slower.` : `too many. Speed up.`}`,
  });
  a.subs(P.map((x) => `${Math.ceil(x / ans)}h`));
  v.line(4).eq(`slowest speed = ${ans} (${hours(P, ans)} hours)`, 'ok').say(`The slowest speed that works is ${words(ans)} bananas per hour.`);
  v.answer(ans);

  recap(v, [{ name: 'Try every speed', time: 'O(n · max)', space: 'O(1)' }, { name: 'Binary search the speed', time: 'O(n log max)', space: 'O(1)' }], 'Speed is monotonic: faster never hurts.', ['“Minimum rate that finishes in time” → binary search on the answer'], 'Find the answer by asking “is this speed enough?”, then halving.');
  return v.build();
}

const problem: Problem = {
  slug: 'koko-eating-bananas',
  statement: 'Koko has `n` piles of bananas; `piles[i]` bananas are in pile `i`. The guards return in `h` hours. Each hour she chooses a pile and eats `k` bananas from it (or the whole pile if it has fewer). Return the minimum integer `k` such that she can eat all the bananas within `h` hours.',
  examples: [{ input: 'piles = [3,6,7,11], h = 8', output: '4' }, { input: 'piles = [30,11,23,4,20], h = 5', output: '30' }, { input: 'piles = [30,11,23,4,20], h = 6', output: '23' }],
  constraints: ['1 ≤ n ≤ 10⁴', 'n ≤ h ≤ 10⁹', '1 ≤ piles[i] ≤ 10⁹'],
  hints: ['Hours needed at speed k = Σ ceil(pile / k).', 'If k works, does k + 1 work?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every speed', idea: 'Increase k from 1 until hours(k) ≤ h.', time: 'O(n · max)', space: 'O(1)', bottleneck: 'max can be 10⁹.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search on k', idea: 'First k in [1, max(piles)] with Σ ceil(p / k) ≤ h.', time: 'O(n log max)', space: 'O(1)' },
  ],
  pitfalls: ['Sum of hours can exceed 32 bits: use 64-bit.', 'ceil without floats: (p + k − 1) / k.'],
  takeaway: 'Minimum speed → **first feasible k**.',
  video,
  videoArgs: [P, H],
  judge: {
    type: 'fn', fn: 'minEatingSpeed', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[3, 6, 7, 11], 8], out: 4 }, { args: [[30, 11, 23, 4, 20], 5], out: 30 }, { args: [[30, 11, 23, 4, 20], 6], out: 23 }, { args: [[1000000000], 2], out: 500000000, big: true }],
    gen: (r: Rng) => { const p = r.ints(r.int(1, 6), 1, 30); return [p, r.int(p.length, p.length * 4)]; },
    ref: (p: number[], h: number) => solve(p, h),
  },
};

export default problem;
