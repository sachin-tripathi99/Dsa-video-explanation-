import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [2, 3, -2, 4, -1];

function prod(a: number[]) {
  let hi = a[0], lo = a[0], best = a[0];
  for (let i = 1; i < a.length; i++) {
    const x = a[i];
    const c = [x, hi * x, lo * x];
    hi = Math.max(...c);
    lo = Math.min(...c);
    best = Math.max(best, hi);
  }
  return best === 0 ? 0 : best;
}

function video() {
  const v = new Video('maximum-product-subarray', 'Maximum Product Subarray');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Now find the contiguous subarray with the largest product.');
  v.eq('2 × 3 × (−2) × 4 × (−1) = 48: two negatives cancel', 'ok').say('Here the whole array wins: forty-eight. The two negative numbers cancel. That is what makes products tricky: a very negative product can become the largest after one more negative number.');

  v.chapter('brute', 'Brute force: every subarray', { cx: 'O(n²)', code: ['for i: p = 1', '  for j from i: p *= a[j]; best = max(best, p)'] });
  v.eq('n² products', 'warn').say('A running product from every start is n squared.');

  v.chapter('optimal', 'Optimal: track the max AND the min ending here', { cx: 'O(n) · O(1)', code: ['hi = lo = best = a[0]', 'for x in a[1:]:', '  candidates = (x, hi·x, lo·x)', '  hi, lo = max(candidates), min(candidates)', '  best = max(best, hi)'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const vars = v.vars('v', { hi: A[0], lo: A[0], best: A[0] });
  let hi = A[0];
  let lo = A[0];
  let best = A[0];
  v.line(0).say('Plain Kadane keeps only the largest product ending here. That fails, because the smallest product, a big negative, might become the largest after the next negative. So keep both: hi, the largest product ending here, and lo, the smallest.');
  for (let i = 1; i < A.length; i++) {
    const x = A[i];
    const c = [x, hi * x, lo * x];
    const nhi = Math.max(...c);
    const nlo = Math.min(...c);
    a.clearTones().tone(i, x < 0 ? 'bad' : 'active');
    v.line(2, 3).eq(`x = ${x}: candidates ${x}, ${hi}·${x} = ${hi * x}, ${lo}·${x} = ${lo * x} → hi ${nhi}, lo ${nlo}`, x < 0 ? 'warn' : undefined);
    hi = nhi;
    lo = nlo;
    best = Math.max(best, hi);
    vars.set({ hi, lo, best });
    if (i === 2) v.say(`Minus two flips everything. The old largest, six, becomes minus twelve, now the smallest. hi becomes minus two, lo becomes minus twelve.`);
    else if (i === 4) v.say(`Minus one flips again. lo was minus forty-eight, and minus forty-eight times minus one is forty-eight, the new largest. Without tracking lo we would have missed it.`);
    else v.hold(800);
  }
  a.clearTones();
  v.eq(`best = ${best}`, 'ok');
  v.answer(prod(A));

  recap(v, [{ name: 'Every subarray', time: 'O(n²)', space: 'O(1)' }, { name: 'Track max and min ending here', time: 'O(n)', space: 'O(1)' }], 'A negative number swaps the roles of max and min.', ['Products with negatives → carry both extremes'], 'When an operation can flip order, carry both the best and the worst.');
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-product-subarray',
  statement: 'Given an integer array `nums`, find a contiguous non-empty subarray that has the largest product, and return the product. The answer fits in a 32-bit integer.',
  examples: [{ input: 'nums = [2,3,-2,4]', output: '6' }, { input: 'nums = [-2,0,-1]', output: '0' }],
  constraints: ['1 ≤ n ≤ 2 · 10⁴', '−10 ≤ nums[i] ≤ 10'],
  hints: ['A negative times a negative is positive.', 'Keep the largest and the smallest product ending at each index.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every subarray', idea: 'Running product from each start.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Max and min ending here', idea: 'hi, lo = max/min of (x, hi·x, lo·x); best = max(best, hi).', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Compute the new hi and lo from the OLD values (use temporaries).', 'Zeros reset both to 0; the candidate x itself restarts the run.'],
  takeaway: 'Negatives flip order: carry **both the max and the min**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'maxProduct', params: ['int[]'], ret: 'int',
    tests: [{ args: [[2, 3, -2, 4]], out: 6 }, { args: [[-2, 0, -1]], out: 0 }, { args: [[-2]], out: -2 }, { args: [[-2, 3, -4]], out: 24 }],
    gen: (r: Rng) => [r.ints(r.int(1, 10), -4, 4)],
    ref: (a: number[]) => prod(a),
  },
};

export default problem;
