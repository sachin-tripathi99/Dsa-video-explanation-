import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0];
const K = 2;

function longest(a: number[], k: number) {
  let l = 0, z = 0, b = 0;
  for (let r = 0; r < a.length; r++) { if (a[r] === 0) z++; while (z > k) { if (a[l] === 0) z--; l++; } b = Math.max(b, r - l + 1); }
  return b;
}

function video() {
  const v = new Video('max-consecutive-ones-iii', 'Max Consecutive Ones III');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `binary array · may flip at most k = ${K} zeros` });
  v.say(`You may flip at most ${K} zeros into ones. What is the longest run of consecutive ones you can make?`);
  v.eq('rephrase: longest window containing at most k zeros', 'ok').say('Flipping is a distraction. Any window with at most k zeros can be turned into all ones. So we want the longest window with at most k zeros.');

  v.chapter('brute', 'Brute force: every start, extend while zeros ≤ k', { cx: 'O(n²)', code: ['for i: zeros = 0', '  for j from i: count zeros; stop when zeros > k; record j − i + 1'] });
  v.eq('n starts × n steps', 'warn').say('Extending from every start is n squared.');

  v.chapter('optimal', 'Optimal: longest window with at most k zeros', { cx: 'O(n)', code: ['l = 0; zeros = 0', 'for r in 0..n−1:', '  if a[r] == 0: zeros += 1', '  while zeros > k: if a[l] == 0: zeros −= 1; l += 1', '  best = max(best, r − l + 1)'] });
  v.clear();
  const a = v.array('a', A, { label: `k = ${K}` });
  let l = 0;
  let z = 0;
  let b = 0;
  let told = false;
  v.say('Grow the window to the right, counting zeros. When there are more than k, shrink from the left until one zero leaves.');
  for (let r = 0; r < A.length; r++) {
    if (A[r] === 0) z++;
    a.clearTones().tone(r, A[r] ? 'ok' : 'warn').win(l, r, 'win', `zeros ${z}`);
    if (z > K) {
      v.line(3).eq(`zeros = ${z} > ${K} → shrink`, 'bad');
      if (!told) { v.say('The third zero makes three zeros, one too many. Move l right until a zero leaves the window. Here that means dropping the three leading ones and the first zero.'); told = true; }
      else v.hold(500);
      while (z > K) { if (A[l] === 0) z--; l++; }
      a.win(l, r, 'win', `zeros ${z}`);
    }
    b = Math.max(b, r - l + 1);
    v.line(4).counter(`best: ${b}`).eq(`window [${l}..${r}] length ${r - l + 1}`);
    v.hold(450);
  }
  a.clearTones().noWin();
  v.eq(`best = ${b}`, 'ok').say(`The best window has length ${b}: two flipped zeros followed by four ones.`);
  v.answer(longest(A, K));

  recap(v, [{ name: 'Every start, extend', time: 'O(n²)', space: 'O(1)' }, { name: 'Sliding window', time: 'O(n)', space: 'O(1)' }], 'Rephrase “flip k” as “window with at most k bad elements”.', ['“At most k exceptions” → window with a counter'], 'Turn operations into a condition on the window. Then it is the longest-valid-window template.');
  return v.build();
}

const problem: Problem = {
  slug: 'max-consecutive-ones-iii',
  statement: 'Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`s in the array if you can flip at most `k` `0`s.',
  examples: [{ input: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2', output: '6' }, { input: 'nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3', output: '10' }],
  constraints: ['1 ≤ n ≤ 10⁵', 'nums[i] is 0 or 1', '0 ≤ k ≤ n'],
  hints: ['Which windows can become all ones?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every start, extend', idea: 'For each i, extend while the zero count stays ≤ k.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Restarts at each i.' },
    { id: 'optimal', kind: 'optimal', name: 'Sliding window', idea: 'Count zeros in the window; shrink while zeros > k; track the longest window.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: '“Flip at most k” = window with **at most k bad elements**.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'longestOnes', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], out: 6 }, { args: [[0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3], out: 10 }, { args: [[0, 0, 0], 0], out: 0 }],
    gen: (r: Rng) => { const a = r.ints(r.int(1, 14), 0, 1); return [a, r.int(0, 3)]; },
    ref: (a: number[], k: number) => longest(a, k),
  },
};

export default problem;
