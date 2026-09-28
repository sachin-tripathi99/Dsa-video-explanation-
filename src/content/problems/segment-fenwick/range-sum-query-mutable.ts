import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { segTree, segQuery, segUpdate } from '../../segviz';

const A = [2, 5, 1, 4, 9, 3, 6, 8];
const QL = 1, QR = 6, UI = 3, UV = 7;

function video() {
  const v = new Video('range-sum-query-mutable', 'Range Sum Query - Mutable');
  const n = A.length;
  const sum = (a: number[], l: number, r: number) => a.slice(l, r + 1).reduce((x, y) => x + y, 0);
  const B = [...A];
  B[UI] = UV;

  v.chapter('intro', 'The problem');
  const a0 = v.array('a', A, { label: 'nums' });
  v.say('Design a class over an array that supports two operations, mixed in any order: update one element, and return the sum of a range.');
  a0.win(QL, QR, 'win', `sum = ${sum(A, QL, QR)}`);
  v.eq(`sumRange(${QL}, ${QR}) = ${sum(A, QL, QR)}; update(${UI}, ${UV}); sumRange(${QL}, ${QR}) = ${sum(B, QL, QR)}`).hold(1200);

  v.chapter('brute', 'Brute force: keep the plain array', { cx: 'update O(1) · sum O(n)', code: ['update(i, val): a[i] = val', 'sumRange(l, r): add a[l..r]'] });
  v.eq('3 · 10⁴ sums × 3 · 10⁴ elements ≈ 10⁹', 'bad').say('Updates are instant, but every sum walks the range. With thirty thousand calls on thirty thousand elements, that is around a billion additions. Prefix sums would flip it: fast sums, but every update rewrites up to n prefixes.');

  const b = Math.ceil(Math.sqrt(n));
  const nb = Math.ceil(n / b);
  const bs = Array.from({ length: nb }, (_, k) => sum(A, k * b, Math.min(n, k * b + b) - 1));
  v.chapter('better', 'Better: split into √n blocks', { cx: 'update O(1) · sum O(√n)', code: ['b = ceil(√n); block[k] = sum of its b elements', 'update: block[i / b] += val − a[i]; a[i] = val', 'sum: partial blocks element by element,', '     whole blocks from block[]'] });
  v.clear();
  const ba = v.array('a', A, { label: `nums, blocks of ${b}` });
  ba.subs(A.map((_, i) => `B${Math.floor(i / b)}`));
  const bb = v.array('bs', bs, { label: 'block sums' });
  v.line(0).say(`Middle ground: cut the array into blocks of about square root of n, here ${words(b)}, and store each block's sum.`);
  const fullL = Math.ceil(QL / b), fullR = Math.floor((QR + 1) / b) - 1;
  for (let i = QL; i < Math.min(fullL * b, QR + 1); i++) ba.tone(i, 'cmp');
  for (let i = Math.max((fullR + 1) * b, QL); i <= QR; i++) ba.tone(i, 'cmp');
  for (let k = fullL; k <= fullR; k++) { bb.tone(k, 'ok'); ba.toneRange(k * b, k * b + b - 1, 'ok'); }
  v.line(2, 3).eq(`sumRange(${QL}, ${QR}) = loose elements + whole blocks = ${sum(A, QL, QR)}`, 'ok').say(`A sum adds the loose elements at the two ends one by one, in blue, and takes whole blocks from the block sums, in green. At most two partial blocks and about square root of n whole ones: order square root of n.`);
  bb.clearTones().set(Math.floor(UI / b), bs[Math.floor(UI / b)] + UV - A[UI]).tone(Math.floor(UI / b), 'active');
  ba.clearTones().set(UI, UV).tone(UI, 'active');
  v.line(1).eq(`update(${UI}, ${UV}): block ${Math.floor(UI / b)} += ${UV - A[UI]}`).say(`An update changes one element and adjusts its block sum by the difference, ${words(UV - A[UI])}. Constant time. Square root of thirty thousand is under two hundred, so this is already fast, but trees do better.`);

  v.chapter('optimal', 'Optimal: a segment tree', { cx: 'O(log n) each', code: ['build: sum[k] = sum[2k] + sum[2k + 1]', 'sumRange: outside → 0, inside → sum[k],', '          else → left + right', 'update: fix the leaf, then its ancestors'] });
  v.clear();
  const qa = v.array('a', A, { label: 'nums' });
  const S = segTree(v, 'st', A);
  v.layout('col').weight('st', 2.4);
  v.line(0).say('Build a segment tree once in the constructor: every node stores the sum of its range.');
  const r1 = segQuery(v, S, QL, QR, {
    arr: qa,
    lines: { inside: [1], outside: [1], split: [2] },
    hold: 520,
    say: (c, lo, hi, val, first) => {
      if (c === 'split' && lo === 0 && hi === n - 1) return `A query from ${words(QL)} to ${words(QR)}: split nodes that overlap partly, take nodes that fit inside, skip the rest.`;
      if (c === 'inside' && lo !== hi && first) return `A whole node fits inside the range: its sum, ${words(val)}, covers ${words(hi - lo + 1)} elements at once.`;
      return undefined;
    },
  });
  v.eq(`sumRange(${QL}, ${QR}) = ${r1.parts.join(' + ')} = ${r1.total}`, 'ok').hold(900);
  qa.noWin();
  segUpdate(v, S, UI, UV, {
    arr: qa,
    lines: { down: [3], up: [3] },
    hold: 520,
    say: (lo, hi, val, leaf) => {
      if (lo < 0) return `Setting index ${words(UI)} to ${words(UV)} touches only the nodes on the path to that leaf.`;
      if (lo === 0 && hi === n - 1) return `Each ancestor adds its children again, up to the root, now ${words(val)}.`;
      return undefined;
    },
  });
  const r2 = segQuery(v, S, QL, QR, { arr: qa, lines: { inside: [1], outside: [1], split: [2] }, hold: 380 });
  v.eq(`sumRange(${QL}, ${QR}) = ${r2.parts.join(' + ')} = ${r2.total}`, 'ok').say(`The same query now returns ${words(r2.total)}. Both operations visit order log n nodes.`);
  v.answer(r2.total);

  recap(v, [{ name: 'Plain array', time: 'O(1) / O(n)', space: 'O(1)' }, { name: '√n blocks', time: 'O(1) / O(√n)', space: 'O(√n)' }, { name: 'Segment tree', time: 'O(log n) / O(log n)', space: 'O(n)' }], 'Updates plus range sums → segment tree or Fenwick tree.', ['Point update + range query → segment / Fenwick tree'], 'A Fenwick tree works too: add val − old at index i + 1.');
  return v.build();
}

type Op = { ops: string[]; args: unknown[][] };

function ref(ops: string[], args: unknown[][]) {
  let a: number[] = [];
  return ops.map((op, i) => {
    const x = args[i];
    if (op === 'NumArray') { a = [...(x[0] as number[])]; return null; }
    if (op === 'update') { a[x[0] as number] = x[1] as number; return null; }
    return a.slice(x[0] as number, (x[1] as number) + 1).reduce((p, q) => p + q, 0);
  });
}

const problem: Problem = {
  slug: 'range-sum-query-mutable',
  statement: 'Implement `NumArray`:\n\n- `NumArray(int[] nums)` initialises the object.\n- `void update(int index, int val)` sets `nums[index] = val`.\n- `int sumRange(int left, int right)` returns the sum of `nums[left..right]` inclusive.',
  examples: [{ input: '["NumArray","sumRange","update","sumRange"]\n[[[1,3,5]],[0,2],[1,2],[0,2]]', output: '[null,9,null,8]' }],
  constraints: ['1 ≤ n ≤ 3 · 10⁴', '−100 ≤ nums[i], val ≤ 100', 'at most 3 · 10⁴ calls'],
  hints: ['Prefix sums make updates slow.', 'Store sums of ranges of different sizes.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Plain array', idea: 'Assign on update; loop on sumRange.', time: 'O(1) update, O(n) sum', space: 'O(1)', bottleneck: 'Linear sums.' },
    { id: 'better', kind: 'better', name: '√n decomposition', idea: 'Keep block sums; sums add partial ends plus whole blocks.', time: 'O(1) update, O(√n) sum', space: 'O(√n)', bottleneck: '√n per sum.' },
    { id: 'optimal', kind: 'optimal', name: 'Segment tree', idea: 'Each node stores its range sum; query and update walk O(log n) nodes.', time: 'O(log n) each', space: 'O(n)' },
  ],
  takeaway: 'Updates + range sums → **segment tree**.',
  video,
  judge: {
    type: 'design', cls: 'NumArray', ctor: ['int[]'],
    methods: { update: { params: ['int', 'int'], ret: 'void' }, sumRange: { params: ['int', 'int'], ret: 'int' } },
    tests: [
      { ops: ['NumArray', 'sumRange', 'update', 'sumRange'], args: [[[1, 3, 5]], [0, 2], [1, 2], [0, 2]], out: [null, 9, null, 8] },
      { ops: ['NumArray', 'sumRange', 'update', 'sumRange'], args: [[A], [QL, QR], [UI, UV], [QL, QR]], out: [null, 28, null, 31] },
      { ops: ['NumArray', 'update', 'sumRange', 'sumRange'], args: [[[7]], [0, -3], [0, 0], [0, 0]], out: [null, null, -3, -3] },
    ],
    gen: (r: Rng): Op => {
      const a = r.ints(r.int(1, 12), -9, 9);
      const ops = ['NumArray'];
      const args: unknown[][] = [[a]];
      for (let k = 0; k < 20; k++) {
        if (r.int(0, 1)) { ops.push('update'); args.push([r.int(0, a.length - 1), r.int(-9, 9)]); }
        else { const x = r.int(0, a.length - 1); ops.push('sumRange'); args.push([x, r.int(x, a.length - 1)]); }
      }
      return { ops, args };
    },
    ref,
  },
};

export default problem;
