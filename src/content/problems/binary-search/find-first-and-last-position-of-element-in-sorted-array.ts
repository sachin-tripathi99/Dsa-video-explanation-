import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { bsShow } from '../../bsviz';

const A = [5, 7, 7, 8, 8, 8, 10];
const T = 8;
const lower = (a: number[], t: number) => { let lo = 0, hi = a.length; while (lo < hi) { const m = (lo + hi) >> 1; if (a[m] >= t) hi = m; else lo = m + 1; } return lo; };
const range = (a: number[], t: number) => { const f = lower(a, t); if (f === a.length || a[f] !== t) return [-1, -1]; return [f, lower(a, t + 1) - 1]; };

function video() {
  const v = new Video('first-last-position', 'Find First and Last Position of Element in Sorted Array');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `sorted, with duplicates · target = ${T}` });
  v.say(`Return the first and last index of the target, or minus one, minus one. In log n time.`);
  v.eq(`${T} occupies indices ${range(A, T).join(' to ')}`);

  v.chapter('brute', 'Brute force: find one, then expand', { cx: 'O(n) worst case', code: ['i = any index of target (binary search)', 'walk left and right while a[j] == target'] });
  v.eq('if every element equals the target, the walk is O(n)', 'warn').say('Finding any copy and then walking outwards looks fast, but if the array is all eights, the walk visits everything.');

  v.chapter('optimal', 'Optimal: two boundary searches', { cx: 'O(log n)', code: ['first = lowerBound(target)            # first a[i] ≥ target', 'if first == n or a[first] != target: return [−1, −1]', 'last = lowerBound(target + 1) − 1    # first a[i] > target, minus one', 'return [first, last]'] });
  v.clear();
  const a = v.array('a', A, { label: `target = ${T}` });
  const run = (t: number, label: string) => {
    let lo = 0;
    let hi = A.length;
    a.subs(A.map((x) => (x >= t ? 'T' : 'F')));
    let k = 0;
    while (lo < hi) {
      const mid = lo + Math.floor((hi - lo) / 2);
      const ok = A[mid] >= t;
      bsShow(a, lo, Math.min(hi, A.length - 1), mid, ok ? 'ok' : 'bad');
      v.eq(`${label}: a[${mid}] = ${A[mid]} ${ok ? `≥ ${t} → hi = ${mid}` : `< ${t} → lo = ${mid + 1}`}`);
      if (k === 0) v.say(`Search for the first element that is at least ${words(t)}. Mid ${words(mid)} holds ${words(A[mid])}, so ${ok ? 'keep mid and go left' : 'go right'}.`);
      else v.hold(700);
      k++;
      if (ok) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  };
  v.say('Two boundary searches solve it. The first index is the first element at least eight. The last index is one before the first element at least nine, that is, strictly greater than eight.');
  const f = run(T, 'first');
  a.clearTones().noPtr().ptr('first', f).tone(f, 'ok');
  v.line(0, 1).eq(`first = ${f}`, 'ok').say(`The first eight is at index ${words(f)}.`);
  const g = run(T + 1, 'last');
  const last = g - 1;
  a.clearTones().noPtr().ptrs({ first: f, last }).toneRange(f, last, 'ok');
  v.line(2, 3).eq(`last = ${g} − 1 = ${last}`, 'ok').say(`The first element above eight is at index ${words(g)}, so the last eight is at ${words(last)}. Two log n searches, no matter how many copies there are.`);
  a.subs([]);
  v.answer(range(A, T));

  recap(v, [{ name: 'Find one, then expand', time: 'O(n) worst', space: 'O(1)' }, { name: 'Two lower bounds', time: 'O(log n)', space: 'O(1)' }], 'first = lowerBound(t); last = lowerBound(t + 1) − 1.', ['First / last occurrence → boundary searches', 'Count of t = last − first + 1'], 'One boundary template, called twice, gives both ends of a run of equal values.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-first-and-last-position-of-element-in-sorted-array',
  statement: 'Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If `target` is not found, return `[-1, -1]`. You must write an algorithm with O(log n) runtime.',
  examples: [{ input: 'nums = [5,7,7,8,8,10], target = 8', output: '[3,4]' }, { input: 'nums = [5,7,7,8,8,10], target = 6', output: '[-1,-1]' }, { input: 'nums = [], target = 0', output: '[-1,-1]' }],
  constraints: ['0 ≤ n ≤ 10⁵', 'sorted non-decreasing'],
  hints: ['Two separate binary searches: leftmost and rightmost.', 'The last t is just before the first value greater than t.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Find one, then expand', idea: 'Locate any occurrence, walk outwards.', time: 'O(n) worst', space: 'O(1)', bottleneck: 'Long runs of duplicates.' },
    { id: 'optimal', kind: 'optimal', name: 'Two lower bounds', idea: 'first = lowerBound(t); last = lowerBound(t + 1) − 1; check a[first] == t.', time: 'O(log n)', space: 'O(1)' },
  ],
  takeaway: 'Run of equal values = **[lowerBound(t), lowerBound(t+1) − 1]**.',
  video,
  videoArgs: [A, T],
  judge: {
    type: 'fn', fn: 'searchRange', params: ['int[]', 'int'], ret: 'int[]',
    tests: [{ args: [[5, 7, 7, 8, 8, 10], 8], out: [3, 4] }, { args: [[5, 7, 7, 8, 8, 10], 6], out: [-1, -1] }, { args: [[], 0], out: [-1, -1] }, { args: [[2, 2], 2], out: [0, 1] }],
    gen: (r: Rng) => { const a = r.ints(r.int(0, 12), 0, 5).sort((x, y) => x - y); return [a, r.int(-1, 6)]; },
    ref: (a: number[], t: number) => range(a, t),
  },
};

export default problem;
