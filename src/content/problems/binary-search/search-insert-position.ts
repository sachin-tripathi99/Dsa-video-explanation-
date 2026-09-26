import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { bsShow } from '../../bsviz';

const A = [1, 3, 5, 6, 8, 10];
const T = 7;
const lower = (a: number[], t: number) => { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] >= t) hi = m; else lo = m + 1; } return lo; };

function video() {
  const v = new Video('search-insert-position', 'Search Insert Position');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `sorted, distinct · target = ${T}` });
  v.say(`Return the index of the target if it is present. If not, return the index where it would be inserted to keep the array sorted. In log n time.`);
  v.eq(`${T} is missing; it belongs between 6 and 8 → index ${lower(A, T)}`);

  v.chapter('brute', 'Brute force: first element ≥ target', { cx: 'O(n)', code: ['for i: if a[i] >= target: return i', 'return n'] });
  v.eq('linear scan', 'warn').say('Scanning for the first element at least as big as the target answers both cases, in linear time.');

  v.chapter('optimal', 'Optimal: lower bound', { cx: 'O(log n)', code: ['lo, hi = 0, n', 'while lo < hi:', '  mid = lo + (hi − lo) / 2', '  if a[mid] >= target: hi = mid', '  else: lo = mid + 1', 'return lo'] });
  v.clear();
  const a = v.array('a', A, { label: `target = ${T}` });
  a.subs(A.map((x) => (x >= T ? 'T' : 'F')));
  v.say(`Both cases are the same question: the first index whose value is at least the target. That is the boundary template. Note hi starts at n, because the answer may be one past the end.`);
  let lo = 0;
  let hi = A.length;
  let k = 0;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const ok = A[mid] >= T;
    bsShow(a, lo, Math.min(hi, A.length - 1), mid, ok ? 'ok' : 'bad');
    v.line(3, 4).eq(`a[${mid}] = ${A[mid]} ${ok ? `≥ ${T} → hi = ${mid}` : `< ${T} → lo = ${mid + 1}`}`);
    if (k === 0) v.say(`Mid is ${words(mid)}, value ${words(A[mid])}. ${ok ? 'That is at least the target, so the answer is here or to the left. Keep mid: hi equals mid.' : 'That is smaller than the target, so the answer is to the right: lo is mid plus one.'}`);
    else v.hold(800);
    k++;
    if (ok) hi = mid;
    else lo = mid + 1;
  }
  bsShow(a, lo, lo, lo < A.length ? lo : undefined, 'ok');
  a.noPtr().ptr('ans', lo);
  v.line(5).eq(`answer = ${lo}`, 'ok').say(`lo and hi meet at ${words(lo)}. Seven would be inserted at index ${words(lo)}, just before eight.`);
  v.answer(lower(A, T));

  recap(v, [{ name: 'Linear scan', time: 'O(n)', space: 'O(1)' }, { name: 'Lower bound', time: 'O(log n)', space: 'O(1)' }], 'Insert position = first index with a[i] ≥ target.', ['“Where would it go?” → lower bound'], 'Search insert position is lower bound: the boundary template with hi starting at n.');
  return v.build();
}

const problem: Problem = {
  slug: 'search-insert-position',
  statement: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with O(log n) runtime.',
  examples: [{ input: 'nums = [1,3,5,6], target = 5', output: '2' }, { input: 'nums = [1,3,5,6], target = 2', output: '1' }, { input: 'nums = [1,3,5,6], target = 7', output: '4' }],
  constraints: ['1 ≤ n ≤ 10⁴', 'distinct, sorted ascending'],
  hints: ['Found or not, you want the first index with nums[i] ≥ target.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Linear scan', idea: 'Return the first i with nums[i] ≥ target, or n.', time: 'O(n)', space: 'O(1)', bottleneck: 'Linear.' },
    { id: 'optimal', kind: 'optimal', name: 'Lower bound', idea: 'Boundary binary search on nums[i] ≥ target with hi = n.', time: 'O(log n)', space: 'O(1)' },
  ],
  takeaway: 'Insert position = **lower bound**.',
  video,
  videoArgs: [A, T],
  judge: {
    type: 'fn', fn: 'searchInsert', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[1, 3, 5, 6], 5], out: 2 }, { args: [[1, 3, 5, 6], 2], out: 1 }, { args: [[1, 3, 5, 6], 7], out: 4 }, { args: [[1, 3, 5, 6], 0], out: 0 }],
    gen: (r: Rng) => [r.distinct(r.int(1, 10), -10, 10).sort((x, y) => x - y), r.int(-12, 12)],
    ref: (a: number[], t: number) => lower(a, t),
  },
};

export default problem;
