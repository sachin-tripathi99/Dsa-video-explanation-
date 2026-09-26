import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [1, 12, -5, -6, 50, 3];
const K = 4;

function best(a: number[], k: number) {
  let s = 0;
  for (let i = 0; i < k; i++) s += a[i];
  let b = s;
  for (let r = k; r < a.length; r++) { s += a[r] - a[r - k]; b = Math.max(b, s); }
  return b / k;
}

function video() {
  const v = new Video('max-average-subarray', 'Maximum Average Subarray I');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `k = ${K}` });
  v.say('Find the contiguous subarray of length exactly k with the largest average, and return that average.');
  v.eq('largest average = largest sum / k: we only need the largest sum', 'ok').say('Every window has the same length, so the largest average is simply the largest sum divided by k. Work with sums.');

  v.chapter('brute', 'Brute force: sum every window from scratch', { cx: 'O(n · k)', code: ['for i in 0..n−k:', '  s = sum(a[i .. i+k−1])', '  best = max(best, s)'] });
  v.eq(`${A.length - K + 1} windows × ${K} additions each`, 'warn').say('Summing each window from scratch repeats almost all the work of the previous window. With n and k both large, that is n times k.');

  v.chapter('optimal', 'Optimal: slide a fixed window', { cx: 'O(n)', code: ['s = sum(a[0 .. k−1]); best = s', 'for r in k..n−1:', '  s += a[r] − a[r − k]', '  best = max(best, s)', 'return best / k'] });
  v.clear();
  const a = v.array('a', A, { label: `k = ${K}` });
  let s = A.slice(0, K).reduce((x, y) => x + y, 0);
  let b = s;
  a.win(0, K - 1, 'win', `sum ${s}`);
  v.line(0).counter(`best sum: ${b}`).say(`Compute the first window once: one plus twelve minus five minus six is ${s}.`);
  for (let r = K; r < A.length; r++) {
    s += A[r] - A[r - K];
    const nb = s > b;
    b = Math.max(b, s);
    a.clearTones().tone(r, 'ok').tone(r - K, 'bad').win(r - K + 1, r, 'win', `sum ${s}`);
    v.line(2, 3).counter(`best sum: ${b}`).eq(`+ ${A[r]} − ${A[r - K]} = ${s}${nb ? ' ← new best' : ''}`, nb ? 'ok' : undefined);
    if (r === K) v.say(`Slide: fifty comes in, one goes out. The sum jumps to ${s}.`);
    else v.hold(700);
  }
  a.clearTones().noWin();
  v.line(4).eq(`${b} / ${K} = ${b / K}`, 'ok').say(`The best sum is ${b}, so the best average is ${b} divided by four: ${b / K}.`);
  v.answer(best(A, K));

  recap(v, [{ name: 'Sum each window', time: 'O(n · k)', space: 'O(1)' }, { name: 'Sliding window', time: 'O(n)', space: 'O(1)' }], 'Consecutive windows share k − 1 elements: add one, remove one.', ['Fixed-length contiguous window → running sum'], 'For fixed-size windows, keep a running total. One element enters, one leaves.');
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-average-subarray-i',
  statement: 'Given an integer array `nums` of `n` elements and an integer `k`, find a contiguous subarray of length `k` that has the maximum average value and return this value. Answers within 10⁻⁵ are accepted.',
  examples: [{ input: 'nums = [1,12,-5,-6,50,3], k = 4', output: '12.75', why: '(12 − 5 − 6 + 50) / 4 = 51 / 4' }, { input: 'nums = [5], k = 1', output: '5.0' }],
  constraints: ['1 ≤ k ≤ n ≤ 10⁵', '−10⁴ ≤ nums[i] ≤ 10⁴'],
  hints: ['All windows have the same length, so compare sums.', 'How does the sum change when the window moves one step?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sum each window', idea: 'For every start, add up k elements.', time: 'O(n · k)', space: 'O(1)', bottleneck: 'Recomputes overlapping sums.' },
    { id: 'optimal', kind: 'optimal', name: 'Sliding window', idea: 'Keep a running sum: add nums[r], subtract nums[r − k]; track the max; divide by k at the end.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Fixed-size window: **one in, one out**.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'findMaxAverage', params: ['int[]', 'int'], ret: 'double', cmp: 'float',
    tests: [{ args: [[1, 12, -5, -6, 50, 3], 4], out: 12.75 }, { args: [[5], 1], out: 5 }, { args: [[-1, -2, -3], 2], out: -1.5 }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 12), -20, 20); return [a, r.int(1, a.length)]; },
    ref: (a: number[], k: number) => best(a, k),
  },
};

export default problem;
