import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [-2, 0, 3, -5, 2, -1];
const Q: [number, number][] = [[0, 2], [2, 5], [0, 5]];

function video() {
  const v = new Video('range-sum-immutable', 'Range Sum Query - Immutable');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums (never changes)' });
  v.say('Build a class that is given an array once, and then answers many queries: the sum of the elements from index left to index right. The array never changes.');

  v.chapter('brute', 'Brute force: add up the range on every query', { cx: 'O(n) per query', code: ['sumRange(l, r): return a[l] + … + a[r]'] });
  v.eq('10⁴ queries × 10⁴ elements = 10⁸ additions', 'warn').say('Adding the range on each call costs up to n per query. With many queries, that adds up.');

  v.chapter('optimal', 'Optimal: precompute prefix sums', { cx: 'O(n) build · O(1) query', code: ['constructor: P[0] = 0; P[i + 1] = P[i] + a[i]', 'sumRange(l, r): return P[r + 1] − P[l]'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const P = [0];
  A.forEach((x, i) => P.push(P[i] + x));
  const p = v.array('P', P, { label: 'P (built once in the constructor)' });
  v.line(0).say('Since the array never changes, do the work once in the constructor: build the prefix sums.');
  Q.forEach(([l, r], k) => {
    const s = P[r + 1] - P[l];
    a.clearTones().win(l, r, 'win', `sum ${s}`);
    p.clearTones().tone(r + 1, 'ok').tone(l, 'bad');
    v.line(1).eq(`sumRange(${l}, ${r}) = P[${r + 1}] − P[${l}] = ${P[r + 1]} − ${P[l]} = ${s}`, 'ok');
    if (k === 0) v.say(`Sum range zero to two is P of three minus P of zero: ${s}.`);
    else v.hold(1000);
  });
  a.noWin();
  v.say('Each query is now a single subtraction. That is the whole point: preprocessing turns an O of n query into O of one.');

  recap(v, [{ name: 'Sum on each query', time: 'O(n) per query', space: 'O(1)' }, { name: 'Prefix sums', time: 'O(n) build, O(1) query', space: 'O(n)' }], 'Static array + many range sums → prefix sums.', ['Immutable data + repeated queries → precompute'], 'When data never changes and queries repeat, precompute once and answer instantly.');
  return v.build();
}

const problem: Problem = {
  slug: 'range-sum-query-immutable',
  statement: 'Implement `NumArray`:\n\n- `NumArray(int[] nums)` initialises the object with `nums`.\n- `int sumRange(int left, int right)` returns the sum of `nums[left..right]` inclusive.\n\nThe array never changes, and there can be up to 10⁴ calls to `sumRange`.',
  examples: [{ input: '["NumArray","sumRange","sumRange","sumRange"]\n[[[-2,0,3,-5,2,-1]],[0,2],[2,5],[0,5]]', output: '[null,1,-1,-3]' }],
  constraints: ['1 ≤ n ≤ 10⁴', '−10⁵ ≤ nums[i] ≤ 10⁵', 'at most 10⁴ calls'],
  hints: ['Do the work once in the constructor.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sum on each query', idea: 'Loop from left to right on every call.', time: 'O(n) per query', space: 'O(1)', bottleneck: 'Repeats additions across queries.' },
    { id: 'optimal', kind: 'optimal', name: 'Prefix sums', idea: 'Build P in the constructor; answer P[r+1] − P[l].', time: 'O(n) build, O(1) query', space: 'O(n)' },
  ],
  takeaway: 'Static data + repeated range sums → **prefix sums**.',
  video,
  judge: {
    type: 'design', cls: 'NumArray', ctor: ['int[]'],
    methods: { sumRange: { params: ['int', 'int'], ret: 'int' } },
    tests: [{ ops: ['NumArray', 'sumRange', 'sumRange', 'sumRange'], args: [[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]], out: [null, 1, -1, -3] }],
    gen: (r: Rng) => {
      const a = r.ints(r.int(1, 10), -9, 9);
      const ops = ['NumArray'];
      const args: unknown[][] = [[a]];
      for (let k = 0; k < 12; k++) { const x = r.int(0, a.length - 1); const y = r.int(x, a.length - 1); ops.push('sumRange'); args.push([x, y]); }
      return { ops, args };
    },
    ref: (ops, args) => { const a = args[0][0] as number[]; return ops.map((op, i) => (op === 'NumArray' ? null : a.slice(args[i][0] as number, (args[i][1] as number) + 1).reduce((x, y) => x + y, 0))); },
  },
};

export default problem;
