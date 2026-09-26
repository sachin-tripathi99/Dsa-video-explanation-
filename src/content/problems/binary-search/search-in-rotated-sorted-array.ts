import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { bsShow } from '../../bsviz';

const A = [4, 5, 6, 7, 0, 1, 2];
const T = 0;

function video() {
  const v = new Video('search-rotated', 'Search in Rotated Sorted Array');
  v.chapter('intro', 'The problem');
  const a0 = v.array('a', A, { label: `sorted, then rotated · target = ${T}` });
  a0.toneRange(0, 3, 'cmp').toneRange(4, 6, 'active');
  v.say(`A sorted array of distinct numbers was rotated at some unknown point. Find the target's index, or minus one, in log n time.`);
  v.eq('two sorted runs: [4, 5, 6, 7] and [0, 1, 2]');

  v.chapter('brute', 'Brute force: linear scan', { cx: 'O(n)', code: ['for i: if a[i] == target: return i'] });
  v.eq('ignores the structure', 'warn');

  v.chapter('better', 'Better: find the rotation point, then search one run', { cx: 'O(log n), two passes', code: ['k = index of the minimum (binary search)', 'binary search the run that can contain target'] });
  v.eq('find the minimum first, then an ordinary binary search', 'ok').say('One way: first binary search for the smallest element, which splits the two runs, then search the right run. Two passes, still log n.');

  v.chapter('optimal', 'Optimal: one pass, check the sorted half', { cx: 'O(log n)', code: ['while lo <= hi: mid = …; if a[mid] == target: return mid', '  if a[lo] <= a[mid]:            # left half sorted', '    if a[lo] <= target < a[mid]: hi = mid − 1 else lo = mid + 1', '  else:                           # right half sorted', '    if a[mid] < target <= a[hi]: lo = mid + 1 else hi = mid − 1'] });
  v.clear();
  const a = v.array('a', A, { label: `target = ${T}` });
  let lo = 0;
  let hi = A.length - 1;
  let ans = -1;
  let k = 0;
  v.say('In a single pass: around any mid, one half is sorted. Compare a of lo with a of mid to know which. A sorted half has known bounds, so one check tells us whether the target can be inside it.');
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    bsShow(a, lo, hi, mid, A[mid] === T ? 'ok' : 'cmp');
    if (A[mid] === T) { ans = mid; v.line(0).eq(`a[${mid}] = ${T} ✓`, 'ok').say(`Found at index ${words(mid)}.`); break; }
    if (A[lo] <= A[mid]) {
      a.toneRange(lo, mid - 1, 'win');
      const inside = A[lo] <= T && T < A[mid];
      v.line(1, 2).eq(`left [${A[lo]}..${A[mid]}] sorted · ${T} ${inside ? 'inside → go left' : 'outside → go right'}`);
      if (k === 0) v.say(`Mid holds ${words(A[mid])}. a of lo, ${words(A[lo])}, is at most ${words(A[mid])}, so the left half, ${words(A[lo])} up to ${words(A[mid])}, is sorted. ${words(T)} is not between them, so it must be on the right.`);
      else v.hold(900);
      if (inside) hi = mid - 1;
      else lo = mid + 1;
    } else {
      a.toneRange(mid + 1, hi, 'win');
      const inside = A[mid] < T && T <= A[hi];
      v.line(3, 4).eq(`right [${A[mid]}..${A[hi]}] sorted · ${T} ${inside ? 'inside → go right' : 'outside → go left'}`);
      if (k === 1) v.say(`Now a of lo is bigger than a of mid, so the left half contains the rotation, and the right half is the sorted one. ${words(T)} is ${inside ? 'inside it' : 'not inside it'}.`);
      else v.hold(900);
      if (inside) lo = mid + 1;
      else hi = mid - 1;
    }
    k++;
  }
  a.noPtr();
  v.answer(ans);

  recap(v, [{ name: 'Linear scan', time: 'O(n)', space: 'O(1)' }, { name: 'Find pivot, then search', time: 'O(log n)', space: 'O(1)' }, { name: 'One pass, sorted-half check', time: 'O(log n)', space: 'O(1)' }], 'One half around mid is always sorted; use its bounds.', ['Rotated sorted array → identify the sorted half each step'], 'You do not need a fully sorted array. You need one comparison that tells you which half to drop.');
  return v.build();
}

const problem: Problem = {
  slug: 'search-in-rotated-sorted-array',
  statement: 'An ascending array `nums` of **distinct** values was rotated at an unknown pivot (e.g. `[0,1,2,4,5,6,7]` → `[4,5,6,7,0,1,2]`). Given `target`, return its index or `-1`. You must write an algorithm with O(log n) runtime.',
  examples: [{ input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' }, { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' }, { input: 'nums = [1], target = 0', output: '-1' }],
  constraints: ['1 ≤ n ≤ 5000', 'distinct values'],
  hints: ['At least one half around mid is sorted.', 'Check whether the target lies within the sorted half’s bounds.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Linear scan', idea: 'Check every element.', time: 'O(n)', space: 'O(1)', bottleneck: 'Ignores structure.' },
    { id: 'better', kind: 'better', name: 'Find pivot, then search', idea: 'Binary search the minimum; binary search the run that can contain target.', time: 'O(log n)', space: 'O(1)' },
    { id: 'optimal', kind: 'optimal', name: 'One-pass sorted-half check', idea: 'If a[lo] ≤ a[mid] the left half is sorted: go left iff a[lo] ≤ t < a[mid]. Else the right half is sorted: go right iff a[mid] < t ≤ a[hi].', time: 'O(log n)', space: 'O(1)' },
  ],
  pitfalls: ['Use `a[lo] <= a[mid]` (with equals): when lo == mid the left half is a single sorted element.'],
  takeaway: 'Rotated arrays: **one half is sorted**; test the target against it.',
  video,
  videoArgs: [A, T],
  judge: {
    type: 'fn', fn: 'search', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[4, 5, 6, 7, 0, 1, 2], 0], out: 4 }, { args: [[4, 5, 6, 7, 0, 1, 2], 3], out: -1 }, { args: [[1], 0], out: -1 }, { args: [[3, 1], 1], out: 1 }],
    gen: (r: Rng) => { const s = r.distinct(r.int(1, 10), 0, 20).sort((x, y) => x - y); const k = r.int(0, s.length - 1); const a = [...s.slice(k), ...s.slice(0, k)]; return [a, r.chance(0.7) ? r.pick(a) : r.int(0, 21)]; },
    ref: (a: number[], t: number) => a.indexOf(t),
  },
};

export default problem;
