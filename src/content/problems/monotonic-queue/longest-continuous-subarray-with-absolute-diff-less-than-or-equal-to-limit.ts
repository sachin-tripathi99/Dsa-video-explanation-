import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [10, 1, 2, 4, 7, 2];
const LIM = 5;
function lcs(a: number[], lim: number) { const mx: number[] = [], mn: number[] = []; let l = 0, best = 0; for (let r = 0; r < a.length; r++) { while (mx.length && a[mx[mx.length - 1]] <= a[r]) mx.pop(); mx.push(r); while (mn.length && a[mn[mn.length - 1]] >= a[r]) mn.pop(); mn.push(r); while (a[mx[0]] - a[mn[0]] > lim) { l++; if (mx[0] < l) mx.shift(); if (mn[0] < l) mn.shift(); } best = Math.max(best, r - l + 1); } return best; }

function video() {
  const v = new Video('longest-subarray-limit', 'Longest Subarray With Limit');
  v.chapter('intro', 'The problem');
  const a0 = v.array('a', A, { label: `nums, limit = ${LIM}` });
  a0.win(2, 5, 'ok', 'max 7 − min 2 = 5');
  v.say(`Find the longest contiguous subarray in which the difference between any two elements is at most ${words(LIM)}. That is the same as saying: its maximum minus its minimum is at most ${words(LIM)}.`);
  v.eq(`answer: ${lcs(A, LIM)}  ([2, 4, 7, 2])`);

  v.chapter('brute', 'Brute force: every subarray', { cx: 'O(n²)', code: ['for i: mx = mn = nums[i]', '  for j from i: update mx, mn', '    if mx − mn > limit: break', '    best = max(best, j − i + 1)'] });
  v.eq('n² pairs in the worst case', 'warn').say('Try every start, extend while tracking the maximum and minimum, and stop once the difference is too big. Quadratic.');

  v.chapter('better', 'Better: sliding window + heaps', { cx: 'O(n log n)', code: ['grow r; push into a max-heap and a min-heap', 'while max − min > limit: move l, lazily drop tops with index < l'] });
  v.eq('window is valid ⇔ max − min ≤ limit · shrink when invalid', 'warn').say('A valid window stays valid when it shrinks, so this is a sliding window. We need the window maximum and minimum quickly: two heaps with lazy deletion give n log n.');

  v.chapter('optimal', 'Optimal: two monotonic deques', { cx: 'O(n)', code: ['push r into both deques', 'while max − min > limit:', '  l += 1; drop fronts < l', 'best = max(best, r − l + 1)'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const qx = v.queue('mx', [], { label: 'max deque (decreasing)', ends: ['front = max', 'back'] });
  const qn = v.queue('mn', [], { label: 'min deque (increasing)', ends: ['front = min', 'back'] });
  const mx: number[] = [], mn: number[] = [];
  let l = 0, best = 0;
  const told = { shrink: false, best: false };
  v.say('Replace the heaps with two monotonic deques: one decreasing, whose front is the window maximum, and one increasing, whose front is the window minimum. Each gives its answer in constant time.');
  const show = () => a.clearTones().noWin().win(l, Math.min(A.length - 1, r0), 'win');
  let r0 = 0;
  for (let r = 0; r < A.length; r++) {
    r0 = r;
    while (mx.length && A[mx[mx.length - 1]] <= A[r]) { mx.pop(); qx.pop(); }
    mx.push(r); qx.push(`${r}:${A[r]}`);
    while (mn.length && A[mn[mn.length - 1]] >= A[r]) { mn.pop(); qn.pop(); }
    mn.push(r); qn.push(`${r}:${A[r]}`);
    show(); a.tone(r, 'active');
    const d = A[mx[0]] - A[mn[0]];
    v.line(0).eq(`add ${A[r]}: max ${A[mx[0]]} − min ${A[mn[0]]} = ${d}${d > LIM ? ` > ${LIM}` : ''}`, d > LIM ? 'bad' : undefined);
    if (d > LIM && !told.shrink) v.say(`Adding ${words(A[r])} makes the maximum ${words(A[mx[0]])} and the minimum ${words(A[mn[0]])}. The difference is ${words(d)}, too big. Shrink from the left.`);
    else v.hold(600);
    while (A[mx[0]] - A[mn[0]] > LIM) {
      l++;
      if (mx[0] < l) { mx.shift(); qx.shift(); }
      if (mn[0] < l) { mn.shift(); qn.shift(); }
      show();
      v.line(1, 2).eq(`l → ${l}: max ${A[mx[0]]} − min ${A[mn[0]]} = ${A[mx[0]] - A[mn[0]]}`);
      if (!told.shrink) { v.say(`Moving l past index ${words(l - 1)} drops it from the front of whichever deque held it. Now the maximum is ${words(A[mx[0]])}, the difference is ${words(A[mx[0]] - A[mn[0]])}, and the window is valid again.`); told.shrink = true; } else v.hold(600);
    }
    const len = r - l + 1;
    const nb = len > best;
    best = Math.max(best, len);
    v.line(3).counter(`best: ${best}`).eq(`window [${l}..${r}] length ${len}${nb ? ' ← best' : ''}`, nb ? 'ok' : undefined);
    if (nb && len === 4) v.say(`The window from index ${words(l)} to ${words(r)} has length four: the longest so far.`);
    else v.hold(450);
  }
  a.clearTones().noWin();
  v.eq(`longest = ${best}`, 'ok').say(`Each index enters and leaves each deque at most once, so everything is linear. The answer is ${words(best)}.`);
  v.answer(lcs(A, LIM));

  recap(v, [{ name: 'Every subarray', time: 'O(n²)', space: 'O(1)' }, { name: 'Sliding window + heaps', time: 'O(n log n)', space: 'O(n)' }, { name: 'Sliding window + two deques', time: 'O(n)', space: 'O(n)' }], 'A max deque and a min deque give the window extremes in O(1).', ['Window constraint on max − min → two monotonic deques'], 'Sliding window decides the shape; the deques supply the maximum and minimum.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit',
  statement: 'Given an array of integers `nums` and an integer `limit`, return the size of the longest non-empty subarray such that the absolute difference between any two elements of this subarray is less than or equal to `limit`.',
  examples: [{ input: 'nums = [8,2,4,7], limit = 4', output: '2' }, { input: 'nums = [10,1,2,4,7,2], limit = 5', output: '4' }, { input: 'nums = [4,2,2,2,4,4,2,2], limit = 0', output: '3' }],
  constraints: ['1 ≤ n ≤ 10⁵', '1 ≤ nums[i] ≤ 10⁹', '0 ≤ limit ≤ 10⁹'],
  hints: ['"Any two elements" means max − min.', 'Sliding window: shrink while max − min > limit.', 'Get the window max and min with two monotonic deques.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every subarray', idea: 'Extend each start while tracking max and min.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'better', kind: 'better', name: 'Sliding window + heaps', idea: 'Max-heap and min-heap of (value, index) with lazy deletion.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Log factor.' },
    { id: 'optimal', kind: 'optimal', name: 'Two monotonic deques', idea: 'Decreasing deque for max, increasing deque for min; shrink l while max − min > limit.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Window constraint on max − min → **two deques**.',
  video,
  videoArgs: [A, LIM],
  judge: {
    type: 'fn', fn: 'longestSubarray', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[8, 2, 4, 7], 4], out: 2 }, { args: [A, LIM], out: 4 }, { args: [[4, 2, 2, 2, 4, 4, 2, 2], 0], out: 3 }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), 1, 10), r.int(0, 6)],
    ref: (a: number[], lim: number) => lcs(a, lim),
  },
};

export default problem;
