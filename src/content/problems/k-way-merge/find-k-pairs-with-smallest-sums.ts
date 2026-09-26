import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [1, 7, 11];
const B = [2, 4, 6];
const K = 4;
function kp(a: number[], b: number[], k: number) { const all: number[][] = []; for (const x of a) for (const y of b) all.push([x, y]); return all.sort((p, q) => p[0] + p[1] - q[0] - q[1] || p[0] - q[0] || p[1] - q[1]).slice(0, k); }

function video() {
  const v = new Video('k-pairs-smallest-sums', 'Find K Pairs with Smallest Sums');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums1 (sorted)' });
  v.array('b', B, { label: 'nums2 (sorted)' });
  v.say(`Both arrays are sorted. Pick one number from each to form a pair. Return the ${words(K)} pairs with the smallest sums.`);
  v.eq(`answer: ${kp(A, B, K).map((p) => `(${p})`).join(' ')}`);

  v.chapter('brute', 'Brute force: every pair', { cx: 'O(mn log(mn))', code: ['form all m × n pairs', 'sort by sum', 'take k'] });
  v.eq('m × n pairs, even when k is tiny', 'bad').say('Forming every pair and sorting costs m times n log of m times n, even when k is small.');

  v.chapter('optimal', 'Optimal: each row of the sum grid is a sorted list', { cx: 'O(k log k)', code: ['row i = nums1[i] + nums2[j], sorted', 'push (i, 0) for i < min(k, m)', 'k times: pop (i, j) → output', '  push (i, j + 1)'] });
  v.clear();
  const grid = A.map((x) => B.map((y) => x + y));
  const g = v.grid('g', grid, { label: 'sum grid: row i = nums1[i] + each nums2[j]', rowHead: A.map(String), colHead: B.map(String) });
  const h = v.heap('h', { label: 'min-heap of frontier sums', min: true, treeOnly: true });
  v.weight('g', 1.6).weight('h', 1.1);
  const pq: [number, number, number][] = [];
  const push = (i: number, j: number) => { pq.push([grid[i][j], i, j]); pq.sort((p, q) => p[0] - q[0] || p[1] - q[1]); h.push(grid[i][j]); g.tone(i, j, 'cmp'); };
  for (let i = 0; i < Math.min(K, A.length); i++) push(i, 0);
  v.line(1).eq(`heap = first column {${grid.map((r) => r[0]).join(', ')}}`).say('Picture every sum in a grid: row i pairs nums1 of i with each nums2 of j. Each row is sorted, so this is a k-way merge of the rows. Seed the heap with the first column: each row’s smallest pair.');
  const out: string[] = [];
  let told = 0;
  for (let t = 0; t < K && pq.length; t++) {
    const [s, i, j] = pq.shift()!;
    h.pop();
    g.tone(i, j, 'ok');
    out.push(`(${A[i]},${B[j]})`);
    let pushed = '';
    if (j + 1 < B.length) { push(i, j + 1); pushed = ` · push (${A[i]},${B[j + 1]}) = ${grid[i][j + 1]}`; }
    v.line(2, 3).counter(`pairs: ${out.length}/${K}`).eq(`pop (${A[i]},${B[j]}) sum ${s}${pushed}`, 'ok');
    if (told === 0) { v.say(`The smallest sum is ${words(s)}: the pair ${words(A[i])}, ${words(B[j])}. Its right neighbour in the same row, ${words(A[i])} with ${words(B[j + 1])}, becomes that row’s next candidate.`); told++; }
    else if (told === 1 && i !== 0) { v.say(`Now row ${words(i)} wins: ${words(A[i])} plus ${words(B[j])} is ${words(s)}.`); told++; }
    else v.hold(700);
  }
  v.eq(out.join(' '), 'ok').say(`We popped exactly ${words(K)} times. The heap never holds more than k entries, so this is k log k, no matter how long the arrays are.`);
  v.answer(kp(A, B, K));

  recap(v, [{ name: 'All pairs + sort', time: 'O(mn log(mn))', space: 'O(mn)' }, { name: 'Heap over grid rows', time: 'O(k log k)', space: 'O(k)' }], 'Rows (i, 0), (i, 1), … are sorted; merge them with a heap.', ['Pairs from two sorted arrays → k-way merge on the sum grid'], 'Recognise the hidden sorted lists, then merge.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-k-pairs-with-smallest-sums',
  statement: 'You are given two integer arrays `nums1` and `nums2` sorted in non-decreasing order and an integer `k`. A pair `(u, v)` has one element from each array. Return the `k` pairs with the smallest sums (any order among equal sums).',
  examples: [{ input: 'nums1 = [1,7,11], nums2 = [2,4,6], k = 3', output: '[[1,2],[1,4],[1,6]]' }, { input: 'nums1 = [1,1,2], nums2 = [1,2,3], k = 2', output: '[[1,1],[1,1]]' }],
  constraints: ['1 ≤ m, n ≤ 10⁵', 'k ≤ m · n (up to 10⁴)'],
  hints: ['For a fixed i, pairs (i, 0), (i, 1), … are sorted by sum.', 'Merge those rows with a heap.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All pairs', idea: 'Generate all pairs, sort by sum, take k.', time: 'O(mn log(mn))', space: 'O(mn)', bottleneck: 'mn can be 10¹⁰.' },
    { id: 'optimal', kind: 'optimal', name: 'Heap k-way merge', idea: 'Seed (i, 0) for i < min(k, m); pop k times, pushing (i, j + 1).', time: 'O(k log k)', space: 'O(k)' },
  ],
  takeaway: 'Hidden sorted rows → **k-way merge**.',
  video,
  videoArgs: [A, B, K],
  judge: {
    type: 'fn', fn: 'kSmallestPairs', params: ['int[]', 'int[]', 'int'], ret: 'List<List<Integer>>', cmp: { checker: 'kSmallestPairs' },
    tests: [{ args: [[1, 7, 11], [2, 4, 6], 3], out: [[1, 2], [1, 4], [1, 6]] }, { args: [[1, 1, 2], [1, 2, 3], 2], out: [[1, 1], [1, 1]] }, { args: [A, B, K], out: kp(A, B, K) }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 5), -5, 8).sort((x, y) => x - y), b = r.ints(r.int(1, 5), -5, 8).sort((x, y) => x - y); return [a, b, r.int(1, a.length * b.length)]; },
    ref: (a: number[], b: number[], k: number) => kp(a, b, k),
  },
};

export default problem;
