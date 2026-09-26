import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { bsShow } from '../../bsviz';

const A = [1, 1, 2, 3, 3, 4, 4, 8, 8];

function video() {
  const v = new Video('single-element-sorted', 'Single Element in a Sorted Array');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'every value appears twice, except one' });
  v.say('In a sorted array, every element appears exactly twice, except one element that appears once. Find it in log n time and constant space.');

  v.chapter('brute', 'Brute force: XOR everything, or scan pairs', { cx: 'O(n)', code: ['x = 0; for v in a: x ^= v', 'return x          # pairs cancel out'] });
  v.eq('x ^ x = 0, so pairs cancel: linear time', 'warn').say('XOR of all numbers cancels every pair and leaves the single one. Clever, but linear, and it ignores the sorting.');

  v.chapter('optimal', 'Optimal: binary search on pair alignment', { cx: 'O(log n)', code: ['lo, hi = 0, n − 1', 'while lo < hi:', '  mid = lo + (hi − lo) / 2; if mid is odd: mid −= 1   # mid = first of a pair', '  if a[mid] == a[mid + 1]: lo = mid + 2   # pairs still aligned → single is right', '  else: hi = mid                          # alignment broken → single at mid or left', 'return a[lo]'] });
  v.clear();
  const a = v.array('a', A, { label: 'pairs start at even indices until the single element' });
  a.subs(A.map((_, i) => (i % 2 === 0 ? 'even' : 'odd')));
  v.say('Before the single element, each pair starts at an even index: zero and one, two and three, and so on. After it, everything shifts by one, so pairs start at odd indices. That switch is a monotonic boundary, so we can binary search for it.');
  let lo = 0;
  let hi = A.length - 1;
  let k = 0;
  while (lo < hi) {
    let mid = lo + Math.floor((hi - lo) / 2);
    if (mid % 2 === 1) mid--;
    const aligned = A[mid] === A[mid + 1];
    bsShow(a, lo, hi, mid, aligned ? 'ok' : 'bad');
    a.tone(mid + 1, aligned ? 'ok' : 'bad');
    v.line(2, aligned ? 3 : 4).eq(`a[${mid}] = ${A[mid]} ${aligned ? '=' : '≠'} a[${mid + 1}] = ${A[mid + 1]} → ${aligned ? `aligned: lo = ${mid + 2}` : `broken: hi = ${mid}`}`);
    if (k === 0) v.say(`Take mid as an even index, ${words(mid)}. a of ${words(mid)} ${aligned ? 'equals' : 'differs from'} its right neighbour, so the pairs ${aligned ? 'are still aligned here, and the single element is further right' : 'are already shifted, so the single element is at mid or before it'}.`);
    else v.hold(900);
    k++;
    if (aligned) lo = mid + 2;
    else hi = mid;
  }
  bsShow(a, lo, lo, lo, 'ok');
  a.noPtr().ptr('single', lo);
  v.line(5).eq(`single = a[${lo}] = ${A[lo]}`, 'ok').say(`The range shrinks to index ${words(lo)}: the single element is ${words(A[lo])}.`);
  v.answer(A[lo]);

  recap(v, [{ name: 'XOR / scan', time: 'O(n)', space: 'O(1)' }, { name: 'Binary search on pair parity', time: 'O(log n)', space: 'O(1)' }], 'Pairs start at even indices before the single element, odd after.', ['Hidden monotonic property → binary search on it'], 'Look for a property that flips exactly once. Here: where pairs start.');
  return v.build();
}

const problem: Problem = {
  slug: 'single-element-in-a-sorted-array',
  statement: 'You are given a sorted array where every element appears exactly twice, except for one element which appears exactly once. Return that single element. Your solution must run in O(log n) time and O(1) space.',
  examples: [{ input: 'nums = [1,1,2,3,3,4,4,8,8]', output: '2' }, { input: 'nums = [3,3,7,7,10,11,11]', output: '10' }],
  constraints: ['1 ≤ n ≤ 10⁵', 'n is odd'],
  hints: ['Before the single element, where do pairs start? After it?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'XOR everything', idea: 'Pairs cancel under XOR; the result is the single element.', time: 'O(n)', space: 'O(1)', bottleneck: 'Linear.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search on pair alignment', idea: 'Force mid even; if nums[mid] == nums[mid+1] the single is right (lo = mid + 2), else hi = mid.', time: 'O(log n)', space: 'O(1)' },
  ],
  takeaway: 'Find the property that **flips once**, then binary search it.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'singleNonDuplicate', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 1, 2, 3, 3, 4, 4, 8, 8]], out: 2 }, { args: [[3, 3, 7, 7, 10, 11, 11]], out: 10 }, { args: [[5]], out: 5 }],
    gen: (r: Rng) => { const vals = r.distinct(r.int(1, 7), 0, 30).sort((x, y) => x - y); const s = r.pick(vals); return [vals.flatMap((x) => (x === s ? [x] : [x, x]))]; },
    ref: (a: number[]) => a.reduce((x, y) => x ^ y, 0),
  },
};

export default problem;
