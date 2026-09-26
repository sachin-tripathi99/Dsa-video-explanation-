import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { bsShow } from '../../bsviz';

const A = [1, 2, 1, 3, 5, 6, 4];

function video() {
  const v = new Video('find-peak-element', 'Find Peak Element');
  v.chapter('intro', 'The problem');
  const a0 = v.array('a', A, { label: 'neighbours are distinct; outside the array counts as −∞', bars: true });
  a0.tone(1, 'ok').tone(5, 'ok');
  v.say('A peak is an element strictly greater than its neighbours. Beyond both ends, imagine minus infinity. Return the index of any peak, in log n time.');
  v.eq('indices 1 and 5 are both peaks; either is accepted');

  v.chapter('brute', 'Brute force: scan for the first descent', { cx: 'O(n)', code: ['for i in 0..n−2: if a[i] > a[i+1]: return i', 'return n − 1'] });
  v.eq('walk until the values start going down', 'warn').say('Walking right until the values first go down finds a peak, but in linear time.');

  v.chapter('optimal', 'Optimal: walk uphill with binary search', { cx: 'O(log n)', code: ['lo, hi = 0, n − 1', 'while lo < hi:', '  mid = lo + (hi − lo) / 2', '  if a[mid] < a[mid + 1]: lo = mid + 1   # uphill to the right → a peak exists there', '  else: hi = mid                         # downhill → a peak at mid or left', 'return lo'] });
  v.clear();
  const a = v.array('a', A, { label: 'compare a[mid] with its right neighbour', bars: true });
  let lo = 0;
  let hi = A.length - 1;
  let k = 0;
  v.say('The array is not sorted, but we can still halve. Look at mid and its right neighbour. If the slope goes up to the right, keep climbing right: since the far end drops to minus infinity, the climb must reach a peak somewhere on the right. If it goes down, a peak exists at mid or to its left.');
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const up = A[mid] < A[mid + 1];
    bsShow(a, lo, hi, mid, 'cmp');
    a.tone(mid + 1, 'active');
    v.line(up ? 3 : 4).eq(`a[${mid}] = ${A[mid]} ${up ? '<' : '>'} a[${mid + 1}] = ${A[mid + 1]} → ${up ? `uphill: lo = ${mid + 1}` : `downhill: hi = ${mid}`}`);
    if (k === 0) v.say(`Mid is three with value ${words(A[mid])}; its right neighbour is ${words(A[mid + 1])}. Uphill, so there is a peak on the right. Drop the left half.`);
    else v.hold(900);
    k++;
    if (up) lo = mid + 1;
    else hi = mid;
  }
  bsShow(a, lo, lo, lo, 'ok');
  a.noPtr().ptr('peak', lo);
  v.line(5).eq(`peak at index ${lo} (value ${A[lo]})`, 'ok').say(`We land on index ${words(lo)}, value ${words(A[lo])}, a peak. Binary search does not need sorted data, only a rule that tells you which half surely contains an answer.`);
  v.answer(lo);

  recap(v, [{ name: 'Scan for descent', time: 'O(n)', space: 'O(1)' }, { name: 'Binary search on the slope', time: 'O(log n)', space: 'O(1)' }], 'Go toward the higher neighbour: a peak must exist that way.', ['“Any local max / min” in O(log n) → binary search on the slope'], 'Binary search needs a guarantee about one half, not a sorted array.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-peak-element',
  statement: 'A peak element is an element strictly greater than its neighbours. Given an integer array `nums` where `nums[i] != nums[i + 1]`, find a peak element and return its index; any peak is fine. Imagine `nums[-1] = nums[n] = −∞`. You must write an algorithm that runs in O(log n) time.',
  examples: [{ input: 'nums = [1,2,3,1]', output: '2' }, { input: 'nums = [1,2,1,3,5,6,4]', output: '1 or 5' }],
  constraints: ['1 ≤ n ≤ 1000', 'adjacent elements differ'],
  hints: ['If nums[mid] < nums[mid+1], is there a peak to the right?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan for descent', idea: 'Return the first i with nums[i] > nums[i+1], or n − 1.', time: 'O(n)', space: 'O(1)', bottleneck: 'Linear.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search on the slope', idea: 'Uphill at mid → lo = mid + 1; downhill → hi = mid.', time: 'O(log n)', space: 'O(1)' },
  ],
  takeaway: 'Follow the **uphill** side: a peak is guaranteed there.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'findPeakElement', params: ['int[]'], ret: 'int', cmp: { checker: 'peak' },
    tests: [{ args: [[1, 2, 3, 1]], out: 2 }, { args: [[1, 2, 1, 3, 5, 6, 4]], out: 5 }, { args: [[7]], out: 0 }],
    gen: (r: Rng) => { const a = [r.int(0, 9)]; const n = r.int(1, 10); while (a.length < n) { let x = r.int(0, 9); while (x === a[a.length - 1]) x = r.int(0, 9); a.push(x); } return [a]; },
    ref: (a: number[]) => { for (let i = 0; i < a.length - 1; i++) if (a[i] > a[i + 1]) return i; return a.length - 1; },
  },
};

export default problem;
