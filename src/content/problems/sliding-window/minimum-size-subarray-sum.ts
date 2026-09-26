import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [2, 3, 1, 2, 4, 3];
const T = 7;

function shortest(t: number, a: number[]) {
  let l = 0, s = 0, b = Infinity;
  for (let r = 0; r < a.length; r++) { s += a[r]; while (s >= t) { b = Math.min(b, r - l + 1); s -= a[l++]; } }
  return b === Infinity ? 0 : b;
}

function video() {
  const v = new Video('min-size-subarray', 'Minimum Size Subarray Sum');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `positive numbers · target = ${T}` });
  v.say(`All numbers are positive. Find the length of the shortest contiguous subarray whose sum is at least ${T}, or zero if none exists.`);
  v.eq('[4, 3] has sum 7 → length 2', 'ok');

  v.chapter('brute', 'Brute force: every start, extend until the sum is enough', { cx: 'O(n²)', code: ['for i: s = 0', '  for j from i: s += a[j]; if s >= target: record j − i + 1; break'] });
  v.eq('n starts × up to n steps', 'warn').say('From every start, extend until the sum reaches the target. Quadratic.');

  v.chapter('better', 'Better: prefix sums + binary search', { cx: 'O(n log n)', code: ['P[i] = a[0] + … + a[i−1] (increasing, since values > 0)', 'for each i: binary search the first j with P[j] − P[i] ≥ target'] });
  v.eq('positive numbers → prefix sums are increasing → binary search', 'ok').say('Because every number is positive, prefix sums strictly increase. For each start we can binary search the first end whose prefix sum is large enough. That is n log n.');

  v.chapter('optimal', 'Optimal: shortest-window template', { cx: 'O(n)', code: ['l = 0; s = 0', 'for r in 0..n−1:', '  s += a[r]', '  while s >= target:', '    best = min(best, r − l + 1); s −= a[l]; l += 1'] });
  v.clear();
  const a = v.array('a', A, { label: `target = ${T}` });
  let l = 0;
  let s = 0;
  let b = Infinity;
  v.say('Positive numbers also mean that growing a window always raises the sum and shrinking always lowers it. That is exactly what a sliding window needs. Grow r until the sum is enough, then shrink l as long as it stays enough, recording each valid window.');
  let told = false;
  for (let r = 0; r < A.length; r++) {
    s += A[r];
    a.clearTones().tone(r, 'active').win(l, r, 'win', `sum ${s}`);
    v.line(2).counter(`best: ${b === Infinity ? '—' : b}`).eq(`add ${A[r]} → sum ${s}${s >= T ? ' ≥ ' + T : ' < ' + T}`);
    v.hold(550);
    while (s >= T) {
      b = Math.min(b, r - l + 1);
      a.clearTones().win(l, r, 'win', `sum ${s}`).tone(l, 'bad');
      v.line(4).counter(`best: ${b}`).eq(`[${l}..${r}] sum ${s} ≥ ${T} → length ${r - l + 1}; drop ${A[l]}`, 'ok');
      if (!told) { v.say(`The window two, three, one, two reaches eight. Record length four, then drop the left element to see if a shorter window still works.`); told = true; }
      else v.hold(650);
      s -= A[l];
      l++;
    }
  }
  a.clearTones().noWin();
  v.eq(`shortest = ${b}`, 'ok').say(`Each element is added once and removed once, so this is linear. The shortest length is ${b}: four and three.`);
  v.answer(shortest(T, A));

  recap(v, [
    { name: 'Every start, extend', time: 'O(n²)', space: 'O(1)' },
    { name: 'Prefix sums + binary search', time: 'O(n log n)', space: 'O(n)' },
    { name: 'Sliding window', time: 'O(n)', space: 'O(1)' },
  ], 'Shortest valid window: record inside the shrink loop.', ['Positive numbers + sum threshold → sliding window', 'Negative numbers → prefix sums / deque instead'], 'For the shortest window, record every valid window while shrinking. It only works because the numbers are positive.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-size-subarray-sum',
  statement: 'Given an array of **positive** integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray whose sum is greater than or equal to `target`. If there is none, return `0`.',
  examples: [{ input: 'target = 7, nums = [2,3,1,2,4,3]', output: '2' }, { input: 'target = 4, nums = [1,4,4]', output: '1' }, { input: 'target = 11, nums = [1,1,1,1,1,1,1,1]', output: '0' }],
  constraints: ['1 ≤ target ≤ 10⁹', '1 ≤ n ≤ 10⁵', '1 ≤ nums[i] ≤ 10⁴'],
  hints: ['All values are positive. What does that say about growing and shrinking a window?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every start, extend', idea: 'For each i, add elements until the sum reaches target.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Restarts at every i.' },
    { id: 'better', kind: 'better', name: 'Prefix sums + binary search', idea: 'Prefix sums increase; for each i binary search the first j with P[j] − P[i] ≥ target.', time: 'O(n log n)', space: 'O(n)' },
    { id: 'optimal', kind: 'optimal', name: 'Sliding window', idea: 'Grow r; while sum ≥ target, record r − l + 1 and remove nums[l].', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Shortest window: **record inside the shrink loop**; needs non-negative values.',
  video,
  videoArgs: [T, A],
  judge: {
    type: 'fn', fn: 'minSubArrayLen', params: ['int', 'int[]'], ret: 'int',
    tests: [{ args: [7, [2, 3, 1, 2, 4, 3]], out: 2 }, { args: [4, [1, 4, 4]], out: 1 }, { args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], out: 0 }],
    gen: (r: Rng) => [r.int(1, 30), r.ints(r.int(1, 12), 1, 9)],
    ref: (t: number, a: number[]) => shortest(t, a),
  },
};

export default problem;
