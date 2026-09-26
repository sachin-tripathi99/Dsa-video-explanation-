import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [1, 3, 4, 6, 8, 9, 11, 14];
const K = 4;
const X = 7;
function fkc(a: number[], k: number, x: number) { let lo = 0, hi = a.length - k; while (lo < hi) { const m = (lo + hi) >> 1; if (x - a[m] > a[m + k] - x) lo = m + 1; else hi = m; } return a.slice(lo, lo + k); }

function video() {
  const v = new Video('find-k-closest-elements', 'Find K Closest Elements');
  v.chapter('intro', 'The problem');
  const a0 = v.array('a', A, { label: `sorted arr, k = ${K}, x = ${X}` });
  const ans = fkc(A, K, X);
  a0.win(A.indexOf(ans[0]), A.indexOf(ans[0]) + K - 1, 'ok');
  v.say(`The array is sorted. Return the ${words(K)} elements closest to ${words(X)}, in ascending order. On a tie in distance, the smaller element wins.`);
  v.eq(`answer: [${ans.join(', ')}]`).say('Because the array is sorted, the answer is always a contiguous window of length k. We only need to find where it starts.');

  v.chapter('brute', 'Brute force: sort by distance', { cx: 'O(n log n)', code: ['sort by (|a − x|, a)', 'take k, sort ascending'] });
  v.eq('ignores that the input is sorted', 'warn').say('Sorting by distance works, and a heap of size k gives n log k, but both ignore that the array is already sorted.');

  v.chapter('better', 'Better: shrink the window from both ends', { cx: 'O(n − k)', code: ['l = 0, r = n − 1', 'while r − l + 1 > k:', '  if x − a[l] > a[r] − x: l += 1   # left is farther', '  else: r -= 1'] });
  v.clear();
  const b = v.array('a', A, { label: 'arr' });
  let l = 0, r = A.length - 1;
  v.say('Start with the whole array and remove the farther end until k elements remain. On a tie, remove the right end, since the smaller element wins.');
  while (r - l + 1 > K) {
    b.clearTones().noWin().win(l, r, 'win').ptrs({ l, r });
    const dl = X - A[l], dr = A[r] - X;
    if (dl > dr) { v.line(2).eq(`|${A[l]} − ${X}| = ${dl} > |${A[r]} − ${X}| = ${dr} → drop left`); l++; }
    else { v.line(3).eq(`|${A[l]} − ${X}| = ${dl} ≤ |${A[r]} − ${X}| = ${dr} → drop right`); r--; }
    v.hold(800);
  }
  b.noWin().win(l, r, 'ok').ptrs({ l, r });
  v.eq(`[${A.slice(l, r + 1).join(', ')}]`, 'ok').say('Linear in n minus k. But we can locate the window start directly with binary search.');

  v.chapter('optimal', 'Optimal: binary search the window start', { cx: 'O(log(n − k) + k)', code: ['lo = 0, hi = n − k', 'while lo < hi:', '  m = (lo + hi) // 2', '  if x − a[m] > a[m + k] − x: lo = m + 1   # window should move right', '  else: hi = m', 'return a[lo .. lo + k − 1]'] });
  v.clear();
  const c = v.array('a', A, { label: 'arr' });
  let lo = 0, hi = A.length - K;
  v.say(`The window starts somewhere from zero to n minus k. Compare a window starting at m with the one starting at m plus one. They differ in just two elements: a of m, which only the first contains, and a of m plus k, which only the second contains. If a of m is farther from x than a of m plus k, the window should move right. Otherwise it should not.`);
  let told = false;
  while (lo < hi) {
    const m = (lo + hi) >> 1;
    c.clearTones().noWin().ptrs({ lo, hi, m }).tone(m, 'cmp').tone(m + K, 'cmp').win(m, m + K - 1, 'win');
    const dl = X - A[m], dr = A[m + K] - X;
    if (dl > dr) {
      v.line(3).eq(`${X} − ${A[m]} = ${dl} > ${A[m + K]} − ${X} = ${dr} → start later: lo = ${m + 1}`);
      if (!told) { v.say(`At m equals ${words(m)}: ${words(A[m])} is ${words(dl)} away from ${words(X)}, while ${words(A[m + K])} is only ${words(dr)} away. Sliding right swaps a far element for a closer one. So the start is after m.`); told = true; } else v.hold(900);
      lo = m + 1;
    } else {
      v.line(4).eq(`${X} − ${A[m]} = ${dl} ≤ ${A[m + K]} − ${X} = ${dr} → start at m or earlier: hi = ${m}`);
      if (!told) { v.say(`At m equals ${words(m)}: ${words(A[m])} is no farther than ${words(A[m + K])}, so moving right does not help. The start is m or earlier.`); told = true; } else v.hold(900);
      hi = m;
    }
  }
  c.clearTones().noPtr().noWin().win(lo, lo + K - 1, 'ok');
  v.line(5).eq(`start = ${lo} → [${A.slice(lo, lo + K).join(', ')}]`, 'ok').say(`The window starts at index ${words(lo)}. Note that the comparison uses signed differences, x minus a of m, not absolute values: that keeps it correct even when x lies outside the window.`);
  v.answer(fkc(A, K, X));

  recap(v, [{ name: 'Sort by distance', time: 'O(n log n)', space: 'O(n)' }, { name: 'Shrink from both ends', time: 'O(n − k)', space: 'O(1)' }, { name: 'Binary search the start', time: 'O(log(n − k) + k)', space: 'O(1)' }], 'Answer is a window; binary search its start comparing a[m] with a[m + k].', ['Sorted array + k closest → binary search a window start'], 'When the answer is a window of fixed size, search for where it starts.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-k-closest-elements',
  statement: 'Given a sorted integer array `arr`, two integers `k` and `x`, return the `k` closest integers to `x` in the array, sorted in ascending order. `a` is closer than `b` if `|a − x| < |b − x|`, or `|a − x| == |b − x|` and `a < b`.',
  examples: [{ input: 'arr = [1,2,3,4,5], k = 4, x = 3', output: '[1,2,3,4]' }, { input: 'arr = [1,1,2,3,4,5], k = 4, x = -1', output: '[1,1,2,3]' }],
  constraints: ['1 ≤ k ≤ n ≤ 10⁴', 'arr sorted ascending', '−10⁴ ≤ arr[i], x ≤ 10⁴'],
  hints: ['The answer is a contiguous window.', 'Binary search the window start over [0, n − k].'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort by distance', idea: 'Sort by (|a − x|, a), take k, sort ascending.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Ignores sortedness.' },
    { id: 'better', kind: 'better', name: 'Shrink from both ends', idea: 'Drop the farther end until k remain.', time: 'O(n − k)', space: 'O(1)', bottleneck: 'Linear.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search start', idea: 'lo=0, hi=n−k; if x − a[m] > a[m+k] − x then lo=m+1 else hi=m.', time: 'O(log(n − k) + k)', space: 'O(1)' },
  ],
  pitfalls: ['Use signed differences in the binary search condition.'],
  takeaway: 'Binary search the **start of a fixed-size window**.',
  video,
  videoArgs: [A, K, X],
  judge: {
    type: 'fn', fn: 'findClosestElements', params: ['int[]', 'int', 'int'], ret: 'List<Integer>',
    tests: [{ args: [[1, 2, 3, 4, 5], 4, 3], out: [1, 2, 3, 4] }, { args: [[1, 1, 2, 3, 4, 5], 4, -1], out: [1, 1, 2, 3] }, { args: [A, K, X], out: [4, 6, 8, 9] }, { args: [[1, 5, 10], 1, 20], out: [10] }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 10), -8, 8).sort((x, y) => x - y); return [a, r.int(1, a.length), r.int(-10, 10)]; },
    ref: (a: number[], k: number, x: number) => fkc(a, k, x),
  },
};

export default problem;
