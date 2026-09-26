import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { answerSearch } from '../../bsviz';

const A = [1, 2, 5, 9];
const T = 6;
const total = (a: number[], d: number) => a.reduce((s, x) => s + Math.ceil(x / d), 0);
const solve = (a: number[], t: number) => { let lo = 1, hi = Math.max(...a); while (lo < hi) { const m = (lo + hi) >> 1; if (total(a, m) <= t) hi = m; else lo = m + 1; } return lo; };

function video() {
  const v = new Video('smallest-divisor', 'Find the Smallest Divisor Given a Threshold');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `threshold = ${T}` });
  v.say(`Choose a positive divisor d. Divide every number by d, rounding up, and add the results. Find the smallest d whose sum is at most ${words(T)}.`);

  v.chapter('brute', 'Brute force: try d = 1, 2, 3, …', { cx: 'O(n · max)', code: ['for d in 1..max(a): if Σ ceil(a / d) <= threshold: return d'] });
  v.eq('a bigger divisor gives a smaller sum → monotonic', 'ok').say('As d grows, every rounded quotient can only shrink, so the sum only shrinks. Scanning d upward works but is slow; the monotonic sum invites binary search.');

  v.chapter('optimal', 'Optimal: binary search d', { cx: 'O(n log max)', code: ['lo, hi = 1, max(a)', 'if Σ ceil(a / mid) <= threshold: hi = mid', 'else: lo = mid + 1'] });
  v.clear();
  const a = v.array('a', A, { label: `threshold = ${T}` });
  const ans = answerSearch(v, {
    lo: 1, hi: Math.max(...A), name: 'd', lines: { ok: [1], bad: [2] },
    check: (d) => { a.subs(A.map((x) => `⌈${x}/${d}⌉=${Math.ceil(x / d)}`)); const s = total(A, d); return { ok: s <= T, info: `sum ${s} ${s <= T ? '≤' : '>'} ${T}` }; },
    firstSay: (d, ok) => `Try d equal to ${words(d)}. The rounded quotients add up to ${words(total(A, d))}, ${ok ? 'within the threshold, so try a smaller divisor.' : 'over the threshold, so we need a bigger divisor.'}`,
  });
  a.subs(A.map((x) => `⌈${x}/${ans}⌉=${Math.ceil(x / ans)}`));
  v.eq(`smallest divisor = ${ans}`, 'ok').say(`The smallest divisor that works is ${words(ans)}.`);
  v.answer(ans);

  recap(v, [{ name: 'Try every divisor', time: 'O(n · max)', space: 'O(1)' }, { name: 'Binary search on d', time: 'O(n log max)', space: 'O(1)' }], 'Larger d → smaller sum: monotonic.', ['Smallest parameter meeting a threshold → binary search on the answer'], 'Same skeleton as Koko: a monotonic sum of rounded divisions.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-the-smallest-divisor-given-a-threshold',
  statement: 'Given an array of integers `nums` and an integer `threshold`, choose a positive integer divisor, divide all the array by it (rounding each result up), and sum them. Find the smallest divisor such that this sum is less than or equal to `threshold`.',
  examples: [{ input: 'nums = [1,2,5,9], threshold = 6', output: '5' }, { input: 'nums = [44,22,33,11,1], threshold = 5', output: '44' }],
  constraints: ['1 ≤ n ≤ 5 · 10⁴', '1 ≤ nums[i] ≤ 10⁶', 'n ≤ threshold ≤ 10⁶'],
  hints: ['How does the sum change as the divisor grows?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every divisor', idea: 'From d = 1 upward.', time: 'O(n · max)', space: 'O(1)', bottleneck: 'Up to 10⁶ divisors.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search on d', idea: 'First d in [1, max] with Σ ceil(a / d) ≤ threshold.', time: 'O(n log max)', space: 'O(1)' },
  ],
  takeaway: 'Monotonic sum → **first feasible divisor**.',
  video,
  videoArgs: [A, T],
  judge: {
    type: 'fn', fn: 'smallestDivisor', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[1, 2, 5, 9], 6], out: 5 }, { args: [[44, 22, 33, 11, 1], 5], out: 44 }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 6), 1, 40); return [a, r.int(a.length, a.length * 5)]; },
    ref: (a: number[], t: number) => solve(a, t),
  },
};

export default problem;
