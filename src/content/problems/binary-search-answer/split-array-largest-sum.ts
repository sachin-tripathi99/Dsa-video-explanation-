import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { answerSearch } from '../../bsviz';

const A = [7, 2, 5, 10, 8];
const K = 2;
function parts(a: number[], cap: number) { let p = 1, s = 0; for (const x of a) { if (s + x > cap) { p++; s = 0; } s += x; } return p; }
function groups(a: number[], cap: number) { const g: number[] = []; let p = 0, s = 0; for (const x of a) { if (s + x > cap) { p++; s = 0; } s += x; g.push(p); } return g; }
const solve = (a: number[], k: number) => { let lo = Math.max(...a), hi = a.reduce((x, y) => x + y, 0); while (lo < hi) { const m = (lo + hi) >> 1; if (parts(a, m) <= k) hi = m; else lo = m + 1; } return lo; };

function video() {
  const v = new Video('split-array-largest-sum', 'Split Array Largest Sum');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `split into k = ${K} non-empty contiguous parts` });
  v.say(`Split the array into ${words(K)} contiguous, non-empty parts so that the largest part sum is as small as possible. Return that smallest possible largest sum.`);
  v.eq('[7, 2, 5] | [10, 8] → max(14, 18) = 18', 'ok');

  v.chapter('brute', 'Brute force: try every set of cut positions', { cx: 'O(C(n−1, k−1) · n)', code: ['choose k − 1 cut points among n − 1 gaps', 'compute the largest part; keep the minimum'] });
  v.eq('combinations explode', 'bad').say('Trying every way to place the cuts is a combinatorial explosion.');

  v.chapter('better', 'Better: dynamic programming', { cx: 'O(k · n²)', code: ['dp[j][i] = best largest-sum splitting the first i numbers into j parts', 'dp[j][i] = min over p of max(dp[j−1][p], sum(p..i−1))'] });
  v.eq('polynomial, but k · n² is 10⁸ for n = 1000, k = 50', 'warn').say('Dynamic programming over prefixes and part counts is polynomial, k times n squared, but still heavy.');

  v.chapter('optimal', 'Optimal: binary search the largest sum', { cx: 'O(n log Σ)', code: ['lo, hi = max(a), sum(a)', 'parts(cap): greedy, start a new part when adding would exceed cap', 'if parts(mid) <= k: hi = mid       # cap achievable', 'else: lo = mid + 1'] });
  v.clear();
  const a = v.array('a', A, { label: 'colour = part' });
  const tones = ['ok', 'active', 'warn', 'cmp', 'pivot', 'path'] as const;
  const paint = (cap: number) => { const g = groups(A, cap); a.clearTones(); g.forEach((p, i) => a.tone(i, tones[p % tones.length])); a.subs(g.map((p) => `part ${p + 1}`)); };
  v.say(`Flip the question: can every part have a sum of at most some cap? A greedy pass answers it: keep adding numbers to the current part until the next one would exceed the cap, then start a new part. If that uses at most ${words(K)} parts, the cap is achievable. A larger cap never needs more parts, so binary search the cap.`);
  const ans = answerSearch(v, {
    lo: Math.max(...A), hi: A.reduce((x, y) => x + y, 0), name: 'cap', lines: { ok: [2], bad: [3] },
    check: (cap) => { paint(cap); const p = parts(A, cap); return { ok: p <= K, info: `${p} part${p === 1 ? '' : 's'} ${p <= K ? '≤' : '>'} ${K}` }; },
    firstSay: (cap, ok) => `Try a cap of ${words(cap)}. Greedy packing gives ${words(parts(A, cap))} parts, shown by colour. ${ok ? 'Within the limit, so a smaller cap might work.' : 'Too many parts, so the cap must be larger.'}`,
  });
  paint(ans);
  v.eq(`smallest largest sum = ${ans}`, 'ok').say(`The smallest cap that works is ${words(ans)}: seven, two, five, then ten, eight. This is the classic “minimise the maximum” problem.`);
  v.answer(ans);

  recap(v, [{ name: 'Every cut combination', time: 'exponential', space: 'O(k)' }, { name: 'Dynamic programming', time: 'O(k · n²)', space: 'O(k · n)' }, { name: 'Binary search + greedy', time: 'O(n log Σ)', space: 'O(1)' }], 'Minimise the maximum → binary search the cap, check greedily.', ['“Minimise the largest part / maximise the smallest gap” → binary search on the answer'], 'Minimise the maximum is the signature phrase for binary search on the answer.');
  return v.build();
}

const problem: Problem = {
  slug: 'split-array-largest-sum',
  statement: 'Given an integer array `nums` and an integer `k`, split `nums` into `k` non-empty contiguous subarrays such that the largest sum of any subarray is minimised. Return the minimised largest sum.',
  examples: [{ input: 'nums = [7,2,5,10,8], k = 2', output: '18' }, { input: 'nums = [1,2,3,4,5], k = 2', output: '9' }],
  constraints: ['1 ≤ n ≤ 1000', '0 ≤ nums[i] ≤ 10⁶', '1 ≤ k ≤ min(50, n)'],
  hints: ['Guess the answer. Can you check a guess greedily?', 'Is “achievable with cap X” monotonic in X?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every cut combination', idea: 'Place k − 1 cuts in every possible way (recursively), keeping the best largest sum.', time: 'O(C(n−1, k−1) · n)', space: 'O(k)', bottleneck: 'Exponentially many splits.' },
    { id: 'better', kind: 'better', name: 'Dynamic programming', idea: 'dp[j][i] = min over p of max(dp[j−1][p], sum(p..i−1)).', time: 'O(k · n²)', space: 'O(k · n)' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search + greedy', idea: 'Binary search cap in [max, sum]; feasible if greedy packing uses ≤ k parts.', time: 'O(n log Σ)', space: 'O(1)' },
  ],
  pitfalls: ['Greedy using fewer than k parts is fine: any part with 2+ elements can be split further without raising the maximum.'],
  takeaway: '**Minimise the maximum** = binary search the cap + greedy feasibility.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'splitArray', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[7, 2, 5, 10, 8], 2], out: 18 }, { args: [[1, 2, 3, 4, 5], 2], out: 9 }, { args: [[1, 4, 4], 3], out: 4 }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 8), 0, 12); return [a, r.int(1, Math.min(4, a.length))]; },
    ref: (a: number[], k: number) => solve(a, k),
  },
};

export default problem;
