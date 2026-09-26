import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { bsShow } from '../../bsviz';

const A = [-1, 0, 3, 5, 9, 12];
const T = 9;

function video() {
  const v = new Video('binary-search-problem', 'Binary Search');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `sorted ascending · target = ${T}` });
  v.say(`Given a sorted array and a target, return the target's index, or minus one. The required running time is O of log n.`);

  v.chapter('brute', 'Brute force: linear scan', { cx: 'O(n)', code: ['for i: if a[i] == target: return i', 'return −1'] });
  v.clear();
  const s = v.array('a', A, { label: `target = ${T}` });
  for (let i = 0; i < A.length; i++) {
    s.clearTones().ptr('i', i).tone(i, A[i] === T ? 'ok' : 'cmp');
    v.counter(`checks: ${i + 1}`).line(0).hold(380);
    if (A[i] === T) break;
  }
  s.noPtr();
  v.eq('ignores the sorted order · O(n)', 'warn').say('A scan works, but it ignores the sorting and costs n checks in the worst case.');

  v.chapter('optimal', 'Optimal: binary search', { cx: 'O(log n)', code: ['lo, hi = 0, n − 1', 'while lo <= hi:', '  mid = lo + (hi − lo) / 2', '  if a[mid] == target: return mid', '  if a[mid] < target: lo = mid + 1 else hi = mid − 1', 'return −1'] });
  v.clear();
  const a = v.array('a', A, { label: `target = ${T}` });
  let lo = 0;
  let hi = A.length - 1;
  let checks = 0;
  let ans = -1;
  v.say('Look at the middle. If it is too small, the target can only be to its right; if too big, only to its left. Either way, half the range is gone.');
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    checks++;
    bsShow(a, lo, hi, mid, A[mid] === T ? 'ok' : 'cmp');
    v.counter(`checks: ${checks}`);
    if (A[mid] === T) { ans = mid; v.line(3).eq(`a[${mid}] = ${A[mid]} ✓`, 'ok').say(`Found at index ${words(mid)} after ${words(checks)} checks.`); break; }
    if (A[mid] < T) { v.line(4).eq(`a[${mid}] = ${A[mid]} < ${T} → lo = ${mid + 1}`).say(`The middle is ${words(A[mid])}, less than ${words(T)}. Discard the left half.`); lo = mid + 1; }
    else { v.line(4).eq(`a[${mid}] = ${A[mid]} > ${T} → hi = ${mid - 1}`).say(`${words(A[mid])} is more than ${words(T)}. Discard the right half.`); hi = mid - 1; }
  }
  a.noPtr();
  v.answer(ans);

  recap(v, [{ name: 'Linear scan', time: 'O(n)', space: 'O(1)' }, { name: 'Binary search', time: 'O(log n)', space: 'O(1)' }], 'Sorted + find → halve the range each step.', ['Sorted array + O(log n) → binary search'], 'The classic template: lo less than or equal to hi, return inside the loop.');
  return v.build();
}

const problem: Problem = {
  slug: 'binary-search',
  statement: 'Given an array of integers `nums` sorted in ascending order and an integer `target`, return the index of `target` or `-1` if it does not exist. You must write an algorithm with O(log n) runtime.',
  examples: [{ input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' }, { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' }],
  constraints: ['1 ≤ n ≤ 10⁴', 'all values are unique', 'sorted ascending'],
  hints: ['Compare the target with the middle element.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Linear scan', idea: 'Check every element.', time: 'O(n)', space: 'O(1)', bottleneck: 'Ignores the order.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search', idea: 'Compare with the middle; discard the half that cannot contain the target.', time: 'O(log n)', space: 'O(1)' },
  ],
  takeaway: 'The exact-match template: **lo ≤ hi**, return inside the loop.',
  video,
  videoArgs: [A, T],
  judge: {
    type: 'fn', fn: 'search', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[-1, 0, 3, 5, 9, 12], 9], out: 4 }, { args: [[-1, 0, 3, 5, 9, 12], 2], out: -1 }, { args: [[5], 5], out: 0 }],
    gen: (r: Rng) => { const a = r.distinct(r.int(1, 12), -20, 20).sort((x, y) => x - y); return [a, r.chance(0.6) ? r.pick(a) : r.int(-22, 22)]; },
    ref: (a: number[], t: number) => a.indexOf(t),
  },
};

export default problem;
