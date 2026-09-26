import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [5, -3, 5];

function circ(a: number[]) {
  let hi = a[0], lo = a[0], bh = a[0], bl = a[0], total = a[0];
  for (let i = 1; i < a.length; i++) {
    const x = a[i];
    hi = Math.max(x, hi + x); bh = Math.max(bh, hi);
    lo = Math.min(x, lo + x); bl = Math.min(bl, lo);
    total += x;
  }
  return bh < 0 ? bh : Math.max(bh, total - bl);
}

function video() {
  const v = new Video('max-circular-subarray', 'Maximum Sum Circular Subarray');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'circular: the end connects back to the start' });
  v.say('The array is circular: after the last element comes the first again. Find the largest sum of a non-empty subarray, where a subarray may wrap around the end, but may use each element at most once.');
  v.eq('5 + 5 wrapping around = 10 (skipping −3)', 'ok');

  v.chapter('brute', 'Brute force: every start, every length', { cx: 'O(n²)', code: ['for start: s = 0', '  for len in 1..n: s += a[(start + len − 1) % n]; best = max(best, s)'] });
  v.eq('n starts × n lengths', 'warn').say('Trying each start and each length, with indices taken modulo n, is n squared.');

  v.chapter('optimal', 'Optimal: max subarray, or total minus min subarray', { cx: 'O(n)', code: ['bestMax = Kadane max; bestMin = Kadane min; total = sum', 'if bestMax < 0: return bestMax        # all negative', 'return max(bestMax, total − bestMin)'] });
  v.clear();
  const a = v.array('a', A, { label: 'two cases' });
  let hi = A[0];
  let lo = A[0];
  let bh = A[0];
  let bl = A[0];
  let total = A[0];
  for (let i = 1; i < A.length; i++) { hi = Math.max(A[i], hi + A[i]); bh = Math.max(bh, hi); lo = Math.min(A[i], lo + A[i]); bl = Math.min(bl, lo); total += A[i]; }
  a.toneRange(0, A.length - 1, 'ok');
  v.eq(`case 1, no wrap: ordinary Kadane → ${bh}`).say(`There are only two cases. Case one: the best subarray does not wrap. That is ordinary Kadane: ${bh}.`);
  a.clearTones().tone(0, 'ok').tone(2, 'ok').tone(1, 'dim');
  v.eq(`case 2, wraps: total − (minimum middle part) = ${total} − (${bl}) = ${total - bl}`, 'ok').say(`Case two: it wraps around. Then what it leaves out is a contiguous piece in the middle. To make the kept part as large as possible, leave out the smallest possible middle piece. So the answer is the total, ${total}, minus the minimum subarray, minus three: ${total - bl}.`);
  v.eq(`answer = max(${bh}, ${total - bl}) = ${circ(A)}`, 'ok').say(`Take the better of the two: ${circ(A)}. One catch: if every number is negative, the minimum subarray is the whole array and total minus it is zero, which would mean an empty subarray. In that case return the ordinary Kadane answer.`);
  v.answer(circ(A));

  recap(v, [{ name: 'Every start and length', time: 'O(n²)', space: 'O(1)' }, { name: 'max(Kadane max, total − Kadane min)', time: 'O(n)', space: 'O(1)' }], 'A wrapping subarray is the complement of a middle subarray.', ['Circular array → split into “no wrap” and “wrap = total − middle” cases'], 'Circular problems often become: solve the straight case, and solve the complement.');
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-sum-circular-subarray',
  statement: 'Given a **circular** integer array `nums`, return the maximum possible sum of a non-empty subarray. A subarray may wrap around the end, but may include each element at most once.',
  examples: [{ input: 'nums = [1,-2,3,-2]', output: '3' }, { input: 'nums = [5,-3,5]', output: '10' }, { input: 'nums = [-3,-2,-3]', output: '-2' }],
  constraints: ['1 ≤ n ≤ 3 · 10⁴', '−3 · 10⁴ ≤ nums[i] ≤ 3 · 10⁴'],
  hints: ['If the answer wraps around, what does it leave out?', 'Handle the all-negative case separately.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every start and length', idea: 'Running sums from each start over up to n elements, modulo n.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Kadane max and min', idea: 'Answer = max(maxSub, total − minSub), or maxSub if all numbers are negative.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['All-negative arrays: total − minSub = 0 corresponds to an empty subarray; return maxSub instead.'],
  takeaway: 'Wrap-around answer = **total − the worst middle part**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'maxSubarraySumCircular', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, -2, 3, -2]], out: 3 }, { args: [[5, -3, 5]], out: 10 }, { args: [[-3, -2, -3]], out: -2 }],
    gen: (r: Rng) => [r.ints(r.int(1, 10), -9, 9)],
    ref: (a: number[]) => circ(a),
  },
};

export default problem;
