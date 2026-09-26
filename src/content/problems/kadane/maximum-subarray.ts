import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
const say = (x: number) => (x < 0 ? `minus ${words(-x)}` : words(x));

function kadane(a: number[]) {
  let cur = a[0], best = a[0];
  for (let i = 1; i < a.length; i++) { cur = Math.max(a[i], cur + a[i]); best = Math.max(best, cur); }
  return best;
}

function video() {
  const v = new Video('maximum-subarray', 'Maximum Subarray');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Find the contiguous, non-empty subarray with the largest sum, and return that sum.');
  v.eq('[4, −1, 2, 1] → 6', 'ok');

  v.chapter('brute', 'Brute force: every start, running sum', { cx: 'O(n²)', code: ['for i: s = 0', '  for j from i: s += a[j]; best = max(best, s)'] });
  v.eq(`${(A.length * (A.length + 1)) / 2} subarrays for n = ${A.length}`, 'warn').say('Fix a start, extend the end with a running sum, and track the best. That is n squared.');

  v.chapter('better', 'Better: divide and conquer', { cx: 'O(n log n)', code: ['best(l, r) = max(best(l, m), best(m+1, r), best crossing m)', 'crossing = best suffix of left half + best prefix of right half'] });
  v.clear();
  const d = v.array('a', A, { label: 'split at the middle' });
  const m = Math.floor((A.length - 1) / 2);
  d.toneRange(0, m, 'cmp').toneRange(m + 1, A.length - 1, 'active');
  v.eq('answer lies left, right, or across the middle').say('Split the array in half. The best subarray lies entirely in the left half, entirely in the right half, or crosses the middle. The first two are recursive calls; the crossing one is the best suffix of the left plus the best prefix of the right, found in linear time. That gives n log n, like merge sort.');

  v.chapter('optimal', "Optimal: Kadane's algorithm", { cx: 'O(n) · O(1)', code: ['cur = best = a[0]', 'for i in 1..n−1:', '  cur = max(a[i], cur + a[i])', '  best = max(best, cur)'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const vars = v.vars('v', { cur: A[0], best: A[0] });
  let cur = A[0];
  let best = A[0];
  let start = 0;
  a.win(0, 0, 'win', `cur ${cur}`);
  v.line(0).say('Keep cur, the best sum of a subarray ending at the current index. Each new number either extends it or starts a new run, whichever is larger.');
  for (let i = 1; i < A.length; i++) {
    const prev = cur;
    const extend = prev + A[i] > A[i];
    if (!extend) start = i;
    cur = Math.max(A[i], prev + A[i]);
    best = Math.max(best, cur);
    a.clearTones().tone(i, extend ? 'ok' : 'warn').win(start, i, 'win', `cur ${cur}`);
    vars.set({ cur, best });
    v.line(2, 3).eq(extend ? `extend: ${prev} + ${A[i]} = ${cur}` : `restart at ${A[i]} (previous cur ${prev} would only hurt)`, cur === best && extend ? 'ok' : undefined);
    if (i === 3) v.say(`Here cur was ${say(prev)}. Adding it to four would give less than four alone, so the run restarts at four.`);
    else if (i === 6) v.say(`Extending through two and one reaches ${say(cur)}, the best so far.`);
    else if (i === 7) v.say(`Minus five drops cur to ${say(cur)}, but we still extend, because ${say(cur)} is better than minus five alone. The best stays ${say(best)}.`);
    else v.hold(600);
  }
  a.clearTones().noWin();
  v.eq(`best = ${best}`, 'ok').say(`The maximum subarray sum is ${say(best)}. One pass, two variables.`);
  v.answer(kadane(A));

  recap(v, [
    { name: 'Every subarray', time: 'O(n²)', space: 'O(1)' },
    { name: 'Divide and conquer', time: 'O(n log n)', space: 'O(log n)' },
    { name: "Kadane's algorithm", time: 'O(n)', space: 'O(1)' },
  ], 'Best ending here = max(a[i], previous best ending + a[i]).', ['Maximum contiguous sum → Kadane', 'Initialise with a[0], not 0'], 'Kadane’s rule, extend or restart, is the simplest dynamic programming you will ever write.');
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-subarray',
  statement: 'Given an integer array `nums`, find the subarray (contiguous, non-empty) with the largest sum, and return its sum.',
  examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', why: '[4,-1,2,1]' }, { input: 'nums = [1]', output: '1' }, { input: 'nums = [5,4,-1,7,8]', output: '23' }],
  constraints: ['1 ≤ n ≤ 10⁵', '−10⁴ ≤ nums[i] ≤ 10⁴'],
  hints: ['What is the best subarray that ends at index i?', 'If the running sum is negative, is it worth keeping?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every subarray', idea: 'For each start, extend with a running sum.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'better', kind: 'better', name: 'Divide and conquer', idea: 'Best of left half, right half, and the best subarray crossing the middle.', time: 'O(n log n)', space: 'O(log n)' },
    { id: 'optimal', kind: 'optimal', name: "Kadane's algorithm", idea: 'cur = max(a[i], cur + a[i]); best = max(best, cur).', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: '**Extend or restart**: best sum ending here.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'maxSubArray', params: ['int[]'], ret: 'int',
    tests: [{ args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], out: 6 }, { args: [[1]], out: 1 }, { args: [[5, 4, -1, 7, 8]], out: 23 }, { args: [[-3, -1, -2]], out: -1 }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), -9, 9)],
    ref: (a: number[]) => kadane(a),
  },
};

export default problem;
