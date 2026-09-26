import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const A = [0, 1, 1, 0, 1, 1, 1, 0];

function longest(a: number[]) {
  const first = new Map<number, number>([[0, -1]]);
  let run = 0, b = 0;
  a.forEach((x, i) => { run += x ? 1 : -1; if (first.has(run)) b = Math.max(b, i - first.get(run)!); else first.set(run, i); });
  return b;
}

function video() {
  const v = new Video('contiguous-array', 'Contiguous Array');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'binary array' });
  v.say('Find the longest contiguous subarray with an equal number of zeros and ones.');
  v.eq('trick: count 0 as −1 and 1 as +1 → equal counts ⇔ sum 0', 'ok').say('Here is the key rewrite. Treat every zero as minus one and every one as plus one. Then equal numbers of zeros and ones means the subarray sums to zero.');

  v.chapter('brute', 'Brute force: every subarray', { cx: 'O(n²)', code: ['for i: bal = 0', '  for j from i: bal += (a[j] ? 1 : −1); if bal == 0: best = max(best, j − i + 1)'] });
  v.eq('n² subarrays', 'warn').say('Trying every subarray with a running balance is n squared.');

  v.chapter('optimal', 'Optimal: first index of each running balance', { cx: 'O(n)', code: ['first = {0: −1}; run = 0', 'for i: run += (a[i] ? 1 : −1)', '  if run in first: best = max(best, i − first[run])', '  else: first[run] = i'] });
  v.clear();
  const a = v.array('a', A, { label: '0 → −1, 1 → +1' });
  const m = v.map('first', { label: 'running balance → first index seen' });
  m.put(0, -1);
  const first = new Map<number, number>([[0, -1]]);
  let run = 0;
  let b = 0;
  let told = 0;
  v.say('A subarray sums to zero when the running balance returns to a value it had before. To make it as long as possible, remember only the first index where each balance appeared.');
  A.forEach((x, i) => {
    run += x ? 1 : -1;
    a.clearTones().tone(i, 'active');
    m.clearTones();
    if (first.has(run)) {
      const len = i - first.get(run)!;
      const nb = len > b;
      b = Math.max(b, len);
      m.tone(run, 'ok');
      a.win(first.get(run)! + 1, i, nb ? 'ok' : 'win', `len ${len}`);
      v.line(2).counter(`best: ${b}`).eq(`balance ${run} first seen at ${first.get(run)} → length ${len}${nb ? ' ← best' : ''}`, nb ? 'ok' : undefined);
      const where = first.get(run) === -1 ? 'before the array started' : `at index ${first.get(run)}`;
      if (told === 0) { v.say(`The balance is back to ${run}, the value it had ${where}. Everything after that point up to here is balanced: length ${len}.`); told++; }
      else if (nb && told === 1) { v.say(`Balance ${run} again, first seen ${where}. That gives length ${len}, the new best.`); told++; }
      else v.hold(650);
    } else {
      first.set(run, i);
      m.put(run, i).tone(run, 'active');
      a.noWin();
      v.line(3).counter(`best: ${b}`).eq(`balance ${run} is new → first[${run}] = ${i}`);
      v.hold(550);
    }
  });
  a.clearTones().noWin();
  v.eq(`longest = ${b}`, 'ok').say(`The answer is ${b}. Storing the first index, not the count, is what makes the subarray as long as possible.`);
  v.answer(longest(A));

  recap(v, [{ name: 'Every subarray', time: 'O(n²)', space: 'O(1)' }, { name: 'Balance + first index map', time: 'O(n)', space: 'O(n)' }], 'Map 0 → −1; equal counts ⇔ zero sum; longest ⇔ first index.', ['Equal counts of two things → ±1 balance', 'Longest subarray with sum k → map of first index'], 'Turn a counting condition into a sum, then use a prefix map. Store first indices when you want the longest.');
  return v.build();
}

const problem: Problem = {
  slug: 'contiguous-array',
  statement: 'Given a binary array `nums`, return the maximum length of a contiguous subarray with an equal number of `0` and `1`.',
  examples: [{ input: 'nums = [0,1]', output: '2' }, { input: 'nums = [0,1,0]', output: '2' }, { input: 'nums = [0,1,1,1,1,1,0,0,0]', output: '6' }],
  constraints: ['1 ≤ n ≤ 10⁵', 'nums[i] is 0 or 1'],
  hints: ['Replace 0 with −1. What does “equal counts” become?', 'For the longest subarray, remember the first index of each running sum.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every subarray', idea: 'For each start, keep a ±1 balance and record zero-balance lengths.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Balance + first index', idea: 'Running balance; if seen before, length i − first[balance]; else store first[balance] = i. Seed {0: −1}.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Equal counts → **±1 balance**; longest → **first index** of each prefix.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'findMaxLength', params: ['int[]'], ret: 'int',
    tests: [{ args: [[0, 1]], out: 2 }, { args: [[0, 1, 0]], out: 2 }, { args: [[0, 1, 1, 1, 1, 1, 0, 0, 0]], out: 6 }, { args: [[1, 1]], out: 0 }],
    gen: (r: Rng) => [r.ints(r.int(1, 14), 0, 1)],
    ref: (a: number[]) => longest(a),
  },
};

export default problem;
