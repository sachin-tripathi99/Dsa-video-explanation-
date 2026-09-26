import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [1, 2, 3, 4];

function except(a: number[]) {
  const n = a.length;
  const out = Array(n).fill(1);
  let p = 1;
  for (let i = 0; i < n; i++) { out[i] = p; p *= a[i]; }
  p = 1;
  for (let i = n - 1; i >= 0; i--) { out[i] *= p; p *= a[i]; }
  return out.map((x) => (Object.is(x, -0) ? 0 : x));
}

function video() {
  const v = new Video('product-except-self', 'Product of Array Except Self');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('For every index, return the product of all the other elements. Do it in linear time, and without using division.');
  v.eq('[2·3·4, 1·3·4, 1·2·4, 1·2·3] = [24, 12, 8, 6]');

  v.chapter('brute', 'Brute force: multiply the others for each index', { cx: 'O(n²)', code: ['for i: out[i] = product of a[j] for j ≠ i'] });
  v.eq('n products of n − 1 numbers', 'warn').say('Multiplying the other elements for every index is n squared. Dividing the total product by a of i would be linear, but division is not allowed, and it breaks on zeros anyway.');

  v.chapter('better', 'Better: prefix and suffix products', { cx: 'O(n) · O(n) extra', code: ['pre[i] = a[0] · … · a[i−1]', 'suf[i] = a[i+1] · … · a[n−1]', 'out[i] = pre[i] · suf[i]'] });
  v.clear();
  const n = A.length;
  const pre = [1];
  for (let i = 1; i < n; i++) pre.push(pre[i - 1] * A[i - 1]);
  const suf = Array(n).fill(1);
  for (let i = n - 2; i >= 0; i--) suf[i] = suf[i + 1] * A[i + 1];
  v.array('a', A, { label: 'nums' });
  v.array('pre', pre, { label: 'product of everything to the left' });
  v.array('suf', suf, { label: 'product of everything to the right' });
  v.line(0, 1, 2).eq('out[i] = left product × right product').say('The product of everything except a of i is the product of everything to its left times everything to its right. Those are prefix and suffix products, each built in one pass.');

  v.chapter('optimal', 'Optimal: fold both passes into the output', { cx: 'O(n) · O(1) extra', code: ['p = 1; for i left→right: out[i] = p; p *= a[i]', 'p = 1; for i right→left: out[i] *= p; p *= a[i]'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const out = v.array('out', A.map(() => null), { label: 'out' });
  const o = Array(n).fill(1);
  let p = 1;
  v.say('We do not need separate arrays. First pass, left to right: write the running left product into out, then multiply in a of i.');
  for (let i = 0; i < n; i++) {
    o[i] = p;
    out.set(i, p).clearTones().tone(i, 'active');
    a.clearTones().toneRange(0, i - 1, 'cmp');
    v.line(0).eq(`out[${i}] = left product ${p}; p = ${p} × ${A[i]} = ${p * A[i]}`);
    p *= A[i];
    v.hold(600);
  }
  p = 1;
  v.say('Second pass, right to left: multiply each slot by the running right product.');
  for (let i = n - 1; i >= 0; i--) {
    o[i] *= p;
    out.set(i, o[i]).clearTones().tone(i, 'ok');
    a.clearTones().toneRange(i + 1, n - 1, 'cmp');
    v.line(1).eq(`out[${i}] × right product ${p} = ${o[i]}; p = ${p} × ${A[i]} = ${p * A[i]}`);
    p *= A[i];
    v.hold(600);
  }
  a.clearTones();
  v.eq(`[${o.join(', ')}] · two passes, no division, O(1) extra`, 'ok').say('Two passes, no division, and apart from the output array, constant extra memory.');
  v.answer(except(A));

  recap(v, [
    { name: 'Multiply the others', time: 'O(n²)', space: 'O(1)' },
    { name: 'Prefix × suffix arrays', time: 'O(n)', space: 'O(n)' },
    { name: 'Two passes into out', time: 'O(n)', space: 'O(1) extra' },
  ], 'Everything except i = left part × right part.', ['“All except self” → prefix and suffix combination'], 'Prefix ideas work for any associative operation: sums, products, maximums.');
  return v.build();
}

const problem: Problem = {
  slug: 'product-of-array-except-self',
  statement: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is the product of all elements of `nums` except `nums[i]`. Run in O(n) **without using division**. The products fit in a 32-bit integer.',
  examples: [{ input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' }, { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' }],
  constraints: ['2 ≤ n ≤ 10⁵', '−30 ≤ nums[i] ≤ 30'],
  hints: ['Product except i = product of the left part × product of the right part.', 'Can the output array hold the left products first?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Multiply the others', idea: 'For each i, multiply all nums[j] with j ≠ i.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Repeats multiplications.' },
    { id: 'better', kind: 'better', name: 'Prefix and suffix arrays', idea: 'pre[i] × suf[i].', time: 'O(n)', space: 'O(n)' },
    { id: 'optimal', kind: 'optimal', name: 'Two passes into the output', idea: 'Left pass writes prefix products into out; right pass multiplies by a running suffix product.', time: 'O(n)', space: 'O(1) extra' },
  ],
  pitfalls: ['Division fails with zeros and is disallowed.'],
  takeaway: '“All except self” = **prefix × suffix**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'productExceptSelf', params: ['int[]'], ret: 'int[]',
    tests: [{ args: [[1, 2, 3, 4]], out: [24, 12, 8, 6] }, { args: [[-1, 1, 0, -3, 3]], out: [0, 0, 9, 0, 0] }, { args: [[0, 0]], out: [0, 0] }],
    gen: (r: Rng) => [r.ints(r.int(2, 9), -4, 4)],
    ref: (a: number[]) => except(a),
  },
};

export default problem;
