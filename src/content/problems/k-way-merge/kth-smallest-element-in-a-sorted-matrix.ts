import type { Problem, Rng } from '../../types';
import { Video, recap, words, ordinal } from '../../helpers';

const M = [[1, 5, 9], [10, 11, 13], [12, 13, 15]];
const K = 8;
function kth(m: number[][], k: number) { return m.flat().sort((a, b) => a - b)[k - 1]; }

function video() {
  const v = new Video('kth-smallest-sorted-matrix', 'Kth Smallest Element in a Sorted Matrix');
  const n = M.length;
  v.chapter('intro', 'The problem');
  v.grid('g', M, { label: 'rows and columns sorted ascending' });
  v.say(`Every row and every column is sorted. Find the ${ordinal(K)} smallest element, counting duplicates.`);
  v.eq(`answer: ${kth(M, K)}`);

  v.chapter('brute', 'Brute force: flatten and sort', { cx: 'O(n² log n)', code: ['all = every element', 'sort all', 'return all[k − 1]'] });
  v.eq('ignores all the sortedness', 'warn').say('Put all n squared elements in a list and sort it. Simple, but it uses none of the structure.');

  v.chapter('better', 'Better: k-way merge of the rows', { cx: 'O(k log n)', code: ['push (row r, col 0) for every row', 'repeat k − 1 times:', '  pop the smallest (r, c); push (r, c + 1)', 'answer = heap top'] });
  v.clear();
  const g = v.grid('g', M, { label: 'each row is a sorted list' });
  const h = v.heap('h', { label: 'min-heap of row heads', min: true, treeOnly: true });
  const pq: [number, number, number][] = [];
  const push = (r: number, c: number) => { pq.push([M[r][c], r, c]); pq.sort((a, b) => a[0] - b[0] || a[1] - b[1]); h.push(M[r][c]); g.tone(r, c, 'cmp'); };
  for (let r = 0; r < n; r++) push(r, 0);
  v.line(0).eq(`heap = first column {${M.map((row) => row[0]).join(', ')}}`).say('The rows are sorted lists, so this is a k-way merge. Seed a min-heap with the first element of every row. Popping the heap gives the elements in increasing order. The kth pop is the answer.');
  for (let t = 1; t < K; t++) {
    const [x, r, c] = pq.shift()!;
    h.pop();
    g.tone(r, c, 'dim');
    let pushed = '';
    if (c + 1 < n) { push(r, c + 1); pushed = ` · push ${M[r][c + 1]}`; }
    v.line(2).counter(`popped ${t}`).eq(`pop #${t}: ${x}${pushed}`);
    if (t === 1) v.say(`Pop number one is ${words(x)}. Push its right neighbour, ${words(M[r][c + 1])}, from the same row.`); else v.hold(650);
  }
  g.tone(pq[0][1], pq[0][2], 'ok');
  v.line(3).eq(`after ${K - 1} pops, the top is the ${K}th smallest: ${pq[0][0]}`, 'ok').say(`After ${words(K - 1)} pops, the top of the heap is the ${ordinal(K)} smallest: ${words(pq[0][0])}. This costs k log n, which can still be n squared log n when k is large.`);

  v.chapter('optimal', 'Optimal: binary search on the value', { cx: 'O(n log(max − min))', code: ['lo = min, hi = max', 'while lo < hi: mid = (lo + hi) // 2', '  count = # elements ≤ mid   (staircase, O(n))', '  if count ≥ k: hi = mid else lo = mid + 1'] });
  v.clear();
  const g2 = v.grid('g', M, { label: 'count elements ≤ mid with a staircase walk' });
  let lo = M[0][0], hi = M[n - 1][n - 1];
  v.say('Instead of searching positions, search values. For a guess mid, count how many elements are at most mid. If the count is at least k, the answer is mid or smaller; otherwise it is larger. That is binary search on the answer.');
  let first = true;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    g2.clearTones();
    let r = n - 1, c = 0, cnt = 0;
    while (r >= 0 && c < n) {
      if (M[r][c] <= mid) { cnt += r + 1; for (let q = 0; q <= r; q++) g2.tone(q, c, 'ok'); c++; }
      else { g2.tone(r, c, 'bad'); r--; }
    }
    v.line(1, 2).counter(`lo ${lo} · hi ${hi}`).eq(`mid = ${mid}: ${cnt} elements ≤ ${mid} → ${cnt >= K ? `≥ ${K}, hi = ${mid}` : `< ${K}, lo = ${mid + 1}`}`, cnt >= K ? 'ok' : 'warn');
    if (first) { v.say(`Count with a staircase: start at the bottom-left corner. If the value is at most mid, the whole column above it is too, so add row plus one and step right. Otherwise step up. For mid equals ${words(mid)}, that finds ${words(cnt)} elements, in linear time.`); first = false; }
    else v.hold(1000);
    if (cnt >= K) hi = mid; else lo = mid + 1;
    v.line(3).hold(400);
  }
  g2.clearTones();
  M.forEach((row, r) => row.forEach((x, c) => { if (x === lo) g2.tone(r, c, 'ok'); }));
  v.eq(`lo = hi = ${lo}`, 'ok').say(`The search closes on ${words(lo)}. Because we always keep the smallest value with count at least k, the result is guaranteed to be an element of the matrix.`);
  v.answer(kth(M, K));

  recap(v, [{ name: 'Flatten + sort', time: 'O(n² log n)', space: 'O(n²)' }, { name: 'Heap of row heads', time: 'O(k log n)', space: 'O(n)' }, { name: 'Binary search on value', time: 'O(n log(max − min))', space: 'O(1)' }], 'Rows are sorted lists (heap), or count ≤ mid with a staircase (binary search).', ['k-th smallest in sorted rows → heap of heads or binary search on value'], 'Counting “how many ≤ x” turns a selection problem into a binary search.');
  return v.build();
}

const problem: Problem = {
  slug: 'kth-smallest-element-in-a-sorted-matrix',
  statement: 'Given an `n × n` matrix where each row and column is sorted in ascending order, return the `k`th smallest element in the matrix (in sorted order, not the k-th distinct).',
  examples: [{ input: 'matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8', output: '13' }, { input: 'matrix = [[-5]], k = 1', output: '-5' }],
  constraints: ['1 ≤ n ≤ 300', '−10⁹ ≤ matrix[i][j] ≤ 10⁹', '1 ≤ k ≤ n²'],
  hints: ['Rows are sorted lists: k-way merge.', 'Or binary search the value, counting elements ≤ mid.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Flatten + sort', idea: 'Sort all elements, index k − 1.', time: 'O(n² log n)', space: 'O(n²)', bottleneck: 'Ignores structure.' },
    { id: 'better', kind: 'better', name: 'Heap of row heads', idea: 'Pop k − 1 times, pushing the right neighbour.', time: 'O(k log n)', space: 'O(n)', bottleneck: 'k can be n².' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search on value', idea: 'Count elements ≤ mid with a staircase walk from the bottom-left.', time: 'O(n log(max − min))', space: 'O(1)' },
  ],
  pitfalls: ['Compute mid without overflow: lo + (hi − lo) / 2 with negatives uses floor division.'],
  takeaway: '**Binary search on the value** + counting.',
  video,
  videoArgs: [M, K],
  judge: {
    type: 'fn', fn: 'kthSmallest', params: ['int[][]', 'int'], ret: 'int',
    tests: [{ args: [M, K], out: 13 }, { args: [[[-5]], 1], out: -5 }, { args: [[[1, 2], [1, 3]], 2], out: 1 }, { args: [[[-1000000000, 5], [7, 1000000000]], 4], out: 1000000000 }],
    gen: (r: Rng) => { const n = r.int(1, 4); const m: number[][] = []; for (let i = 0; i < n; i++) { m.push([]); for (let j = 0; j < n; j++) { const base = Math.max(i ? m[i - 1][j] : -6, j ? m[i][j - 1] : -6); m[i].push(base + r.int(0, 3)); } } return [m, r.int(1, n * n)]; },
    ref: (m: number[][], k: number) => kth(m, k),
  },
};

export default problem;
