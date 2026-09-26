import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const X = [1, 3, 8];
const Y = [2, 7, 9, 10];

function median(a: number[], b: number[]) {
  const m = [...a, ...b].sort((x, y) => x - y);
  const n = m.length;
  return n % 2 ? m[(n - 1) / 2] : (m[n / 2 - 1] + m[n / 2]) / 2;
}

function video() {
  const v = new Video('median-two-sorted', 'Median of Two Sorted Arrays');
  v.chapter('intro', 'The problem');
  v.array('x', X, { label: 'nums1' });
  v.array('y', Y, { label: 'nums2' });
  v.say('Two sorted arrays. Return the median of all their numbers together, in log time.');
  v.eq(`merged: [${[...X, ...Y].sort((a, b) => a - b).join(', ')}] → median ${median(X, Y)}`);

  v.chapter('brute', 'Brute force: merge', { cx: 'O(m + n)', code: ['merge the two sorted arrays (two pointers)', 'return the middle element(s)'] });
  v.eq('merging is linear; we only need the middle', 'warn').say('Merging with two pointers and taking the middle is linear. We could even stop halfway. But the problem asks for log time.');

  v.chapter('optimal', 'Optimal: binary search a partition of the smaller array', { cx: 'O(log min(m, n))', code: ['half = (m + n + 1) / 2; binary search i in [0, m] (m = smaller length)', 'j = half − i   # left part takes i from x and j from y', 'valid if x[i−1] <= y[j] and y[j−1] <= x[i]', 'x[i−1] > y[j] → i too big: hi = i − 1; else lo = i + 1', 'median from max(left maxes) and min(right mins)'] });
  v.clear();
  const xa = v.array('x', X, { label: 'nums1 (smaller): cut after i elements' });
  const ya = v.array('y', Y, { label: 'nums2: cut after j = half − i elements' });
  const m = X.length;
  const n = Y.length;
  const half = Math.floor((m + n + 1) / 2);
  v.say(`The median splits all ${words(m + n)} numbers into a left half and a right half, where everything on the left is at most everything on the right. The left half has ${words(half)} numbers. If we take i of them from the first array, we must take ${words(half)} minus i from the second. So we only need to choose i, and we can binary search it.`);
  let lo = 0;
  let hi = m;
  let ans = 0;
  let k = 0;
  const INF = Infinity;
  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2);
    const j = half - i;
    const xl = i > 0 ? X[i - 1] : -INF;
    const xr = i < m ? X[i] : INF;
    const yl = j > 0 ? Y[j - 1] : -INF;
    const yr = j < n ? Y[j] : INF;
    xa.clearTones().toneRange(0, i - 1, 'win').toneRange(i, m - 1, 'dim');
    ya.clearTones().toneRange(0, j - 1, 'win').toneRange(j, n - 1, 'dim');
    xa.noPtr().ptr('cut', i < m ? i : null);
    ya.noPtr().ptr('cut', j < n ? j : null);
    const f = (v2: number) => (v2 === INF ? '+∞' : v2 === -INF ? '−∞' : String(v2));
    if (xl <= yr && yl <= xr) {
      ans = (m + n) % 2 ? Math.max(xl, yl) : (Math.max(xl, yl) + Math.min(xr, yr)) / 2;
      v.line(2, 4).eq(`i = ${i}, j = ${j}: ${f(xl)} ≤ ${f(yr)} and ${f(yl)} ≤ ${f(xr)} ✓ → median = max(${f(xl)}, ${f(yl)}) = ${ans}`, 'ok');
      v.say(`With i equal to ${words(i)} and j equal to ${words(j)}, the largest on the left, ${f(Math.max(xl, yl))}, is no bigger than the smallest on the right. A valid split. The total is odd, so the median is the largest left value: ${ans}.`);
      break;
    }
    if (xl > yr) {
      v.line(3).eq(`i = ${i}, j = ${j}: x[i−1] = ${f(xl)} > y[j] = ${f(yr)} → take fewer from nums1: hi = ${i - 1}`, 'bad');
      v.say(k === 0 ? `Try i equal to ${words(i)}, so j is ${words(j)}. But ${f(xl)} from the first array is bigger than ${f(yr)} on the right of the second. We took too many from the first array. Move i left.` : `Still ${f(xl)} is bigger than ${f(yr)}. Move i left.`);
      hi = i - 1;
    } else {
      v.line(3).eq(`i = ${i}, j = ${j}: y[j−1] = ${f(yl)} > x[i] = ${f(xr)} → take more from nums1: lo = ${i + 1}`, 'bad');
      v.say(k === 0 ? `Try i equal to ${words(i)}, so j is ${words(j)}. But ${f(yl)} from the second array is bigger than ${f(xr)} on the right of the first. We took too few from the first array. Move i right.` : `${f(yl)} is still bigger than ${f(xr)}. Move i right.`);
      lo = i + 1;
    }
    k++;
  }
  xa.noPtr();
  ya.noPtr();
  v.answer(median(X, Y));
  v.eq('binary search over the smaller array: O(log min(m, n))', 'ok');

  recap(v, [{ name: 'Merge', time: 'O(m + n)', space: 'O(m + n) or O(1)' }, { name: 'Binary search the partition', time: 'O(log min(m, n))', space: 'O(1)' }], 'Choose how many elements the smaller array contributes to the left half.', ['k-th element / median of two sorted arrays → binary search a partition'], 'The hardest classic binary search: you are not searching for a value, but for a split point that satisfies two inequalities.');
  return v.build();
}

const problem: Problem = {
  slug: 'median-of-two-sorted-arrays',
  statement: 'Given two sorted arrays `nums1` and `nums2` of size `m` and `n`, return the median of the two sorted arrays. The overall run time complexity should be O(log (m + n)).',
  examples: [{ input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000' }, { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', why: '(2 + 3) / 2' }],
  constraints: ['0 ≤ m, n ≤ 1000', '1 ≤ m + n ≤ 2000', '−10⁶ ≤ values ≤ 10⁶'],
  hints: ['The median splits all numbers into two equal halves.', 'Choose i from the smaller array; then j is forced.', 'A split is valid when both cross-comparisons hold.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Merge', idea: 'Two-pointer merge, then read the middle.', time: 'O(m + n)', space: 'O(m + n)', bottleneck: 'Linear.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search the partition', idea: 'Binary search i in the smaller array; j = half − i; valid when x[i−1] ≤ y[j] and y[j−1] ≤ x[i]; use ±∞ at the edges.', time: 'O(log min(m, n))', space: 'O(1)' },
  ],
  pitfalls: ['Binary search the **smaller** array so j stays in range.', 'Use ±∞ sentinels for empty sides.', 'Even total: average of max(left) and min(right).'],
  takeaway: 'Search the **split point**, not a value.',
  video,
  videoArgs: [X, Y],
  judge: {
    type: 'fn', fn: 'findMedianSortedArrays', params: ['int[]', 'int[]'], ret: 'double', cmp: 'float',
    tests: [{ args: [[1, 3], [2]], out: 2 }, { args: [[1, 2], [3, 4]], out: 2.5 }, { args: [[], [1]], out: 1 }, { args: [[2], []], out: 2 }],
    gen: (r: Rng) => { let a = r.ints(r.int(0, 6), -9, 9).sort((x, y) => x - y); const b = r.ints(r.int(a.length ? 0 : 1, 6), -9, 9).sort((x, y) => x - y); return [a, b]; },
    ref: (a: number[], b: number[]) => median(a, b),
  },
};

export default problem;
