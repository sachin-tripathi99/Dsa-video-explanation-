import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [2, -5, 1, -4, 3, -2];

function absSum(a: number[]) {
  let hi = 0, lo = 0, bh = 0, bl = 0;
  for (const x of a) { hi = Math.max(x, hi + x); lo = Math.min(x, lo + x); bh = Math.max(bh, hi); bl = Math.min(bl, lo); }
  return Math.max(bh, -bl);
}

function video() {
  const v = new Video('maximum-absolute-sum', 'Maximum Absolute Sum of Any Subarray');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('The absolute sum of a subarray is the absolute value of its sum. Find the largest absolute sum over all subarrays, including the empty one.');
  v.eq('|−5 + 1 − 4| = 8', 'ok').say('The best is a very negative stretch: minus five, one, minus four sums to minus eight, absolute value eight.');

  v.chapter('brute', 'Brute force: every subarray', { cx: 'O(n²)', code: ['for i: s = 0', '  for j from i: s += a[j]; best = max(best, |s|)'] });
  v.eq('n² subarrays', 'warn').say('Running sums from every start: n squared.');

  v.chapter('optimal', 'Optimal: Kadane for the max and for the min', { cx: 'O(n)', code: ['hi = max(x, hi + x); lo = min(x, lo + x)', 'bestHi = max(bestHi, hi); bestLo = min(bestLo, lo)', 'answer = max(bestHi, −bestLo)'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const vars = v.vars('v', { hi: 0, lo: 0, bestHi: 0, bestLo: 0 });
  let hi = 0;
  let lo = 0;
  let bh = 0;
  let bl = 0;
  v.say('The largest absolute value is either the largest sum or the negative of the smallest sum. Run Kadane twice in the same loop: once for the maximum and once, with min instead of max, for the minimum.');
  A.forEach((x, i) => {
    hi = Math.max(x, hi + x);
    lo = Math.min(x, lo + x);
    bh = Math.max(bh, hi);
    bl = Math.min(bl, lo);
    a.clearTones().tone(i, 'active');
    vars.set({ hi, lo, bestHi: bh, bestLo: bl });
    v.line(0, 1).eq(`x = ${x}: hi ${hi}, lo ${lo}`);
    if (i === 3) v.say(`After minus four, the smallest sum ending here is ${lo}: minus five, one, minus four.`);
    else v.hold(650);
  });
  a.clearTones();
  const ans = absSum(A);
  v.line(2).eq(`max(${bh}, −(${bl})) = ${ans}`, 'ok').say(`The best maximum is ${bh}, the best minimum is minus ${-bl}. The answer is ${ans}.`);
  v.answer(ans);

  recap(v, [{ name: 'Every subarray', time: 'O(n²)', space: 'O(1)' }, { name: 'Max and min Kadane', time: 'O(n)', space: 'O(1)' }], '|sum| is maximised by the largest or the most negative sum.', ['Absolute value of a sum → consider both extremes'], 'Absolute values split into two ordinary problems: the maximum and the minimum.');
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-absolute-sum-of-any-subarray',
  statement: 'Given an integer array `nums`, return the maximum absolute sum of any (possibly empty) subarray. The absolute sum of `[a_l, …, a_r]` is `|a_l + … + a_r|`.',
  examples: [{ input: 'nums = [1,-3,2,3,-4]', output: '5' }, { input: 'nums = [2,-5,1,-4,3,-2]', output: '8' }],
  constraints: ['1 ≤ n ≤ 10⁵', '−10⁴ ≤ nums[i] ≤ 10⁴'],
  hints: ['|s| is large when s is very large or very small.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every subarray', idea: 'Running sum from each start; track max |s|.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Kadane twice', idea: 'Track max-ending-here and min-ending-here; answer max(bestMax, −bestMin).', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Absolute value → solve for **max and min**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'maxAbsoluteSum', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, -3, 2, 3, -4]], out: 5 }, { args: [[2, -5, 1, -4, 3, -2]], out: 8 }, { args: [[-1]], out: 1 }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), -9, 9)],
    ref: (a: number[]) => absSum(a),
  },
};

export default problem;
