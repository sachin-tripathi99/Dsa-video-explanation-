import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { bsShow } from '../../bsviz';

const A = [4, 5, 6, 7, 0, 1, 2];

function video() {
  const v = new Video('find-min-rotated', 'Find Minimum in Rotated Sorted Array');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'rotated sorted array, distinct values' });
  v.say('Find the smallest element of a rotated sorted array of distinct values, in log n time.');
  v.eq('the minimum is where the rotation happened');

  v.chapter('brute', 'Brute force: scan', { cx: 'O(n)', code: ['return min(a)'] });
  v.eq('linear', 'warn');

  v.chapter('optimal', 'Optimal: compare mid with the right end', { cx: 'O(log n)', code: ['lo, hi = 0, n − 1', 'while lo < hi:', '  mid = lo + (hi − lo) / 2', '  if a[mid] > a[hi]: lo = mid + 1   # the drop is to the right of mid', '  else: hi = mid                     # mid..hi is sorted; min is at mid or left', 'return a[lo]'] });
  v.clear();
  const a = v.array('a', A, { label: 'compare a[mid] with a[hi]' });
  let lo = 0;
  let hi = A.length - 1;
  let k = 0;
  v.say('Compare the middle with the last element of the range. If a of mid is bigger than a of hi, the numbers must drop somewhere after mid, so the minimum is to the right. Otherwise mid to hi is sorted, and the minimum is mid or to its left.');
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const right = A[mid] > A[hi];
    bsShow(a, lo, hi, mid, 'cmp');
    a.tone(hi, 'active');
    v.line(3 + (right ? 0 : 1)).eq(`a[${mid}] = ${A[mid]} ${right ? '>' : '≤'} a[${hi}] = ${A[hi]} → ${right ? `lo = ${mid + 1}` : `hi = ${mid}`}`);
    if (k === 0) v.say(`Seven is bigger than two, so the drop, and the minimum, are to the right of mid.`);
    else v.hold(800);
    k++;
    if (right) lo = mid + 1;
    else hi = mid;
  }
  bsShow(a, lo, lo, lo, 'ok');
  a.noPtr().ptr('min', lo);
  v.line(5).eq(`minimum = a[${lo}] = ${A[lo]}`, 'ok').say(`The range shrinks to index ${words(lo)}, which holds ${words(A[lo])}, the minimum. Comparing with the right end, not the left, avoids a special case when the array is not rotated at all.`);
  v.answer(A[lo]);

  recap(v, [{ name: 'Scan', time: 'O(n)', space: 'O(1)' }, { name: 'Binary search vs. right end', time: 'O(log n)', space: 'O(1)' }], 'a[mid] > a[hi] → the drop is right of mid.', ['Rotation point / minimum of a rotated array → compare with a[hi]'], 'The rotation point is the only place where the order breaks. Compare with the right end to find which side it is on.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-minimum-in-rotated-sorted-array',
  statement: 'An ascending array of **unique** elements was rotated between 1 and n times. Given the rotated array `nums`, return its minimum element. You must write an algorithm that runs in O(log n) time.',
  examples: [{ input: 'nums = [3,4,5,1,2]', output: '1' }, { input: 'nums = [4,5,6,7,0,1,2]', output: '0' }, { input: 'nums = [11,13,15,17]', output: '11' }],
  constraints: ['1 ≤ n ≤ 5000', 'unique values'],
  hints: ['Compare nums[mid] with nums[hi].'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan', idea: 'Return the minimum by scanning.', time: 'O(n)', space: 'O(1)', bottleneck: 'Linear.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search vs. right end', idea: 'If nums[mid] > nums[hi] then lo = mid + 1 else hi = mid; return nums[lo].', time: 'O(log n)', space: 'O(1)' },
  ],
  takeaway: 'Rotated array minimum: **compare mid with hi**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'findMin', params: ['int[]'], ret: 'int',
    tests: [{ args: [[3, 4, 5, 1, 2]], out: 1 }, { args: [[4, 5, 6, 7, 0, 1, 2]], out: 0 }, { args: [[11, 13, 15, 17]], out: 11 }, { args: [[2, 1]], out: 1 }],
    gen: (r: Rng) => { const s = r.distinct(r.int(1, 10), -10, 20).sort((x, y) => x - y); const k = r.int(0, s.length - 1); return [[...s.slice(k), ...s.slice(0, k)]]; },
    ref: (a: number[]) => Math.min(...a),
  },
};

export default problem;
