import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [2, -1, 2, 3, -2, 4];
const K = 5;
function ssk(a: number[], k: number) { const P = [0]; for (const x of a) P.push(P[P.length - 1] + x); const dq: number[] = []; let best = Infinity; for (let j = 0; j < P.length; j++) { while (dq.length && P[j] - P[dq[0]] >= k) best = Math.min(best, j - dq.shift()!); while (dq.length && P[dq[dq.length - 1]] >= P[j]) dq.pop(); dq.push(j); } return best === Infinity ? -1 : best; }
const sn = (x: number) => (x < 0 ? `minus ${words(-x)}` : words(x));

function video() {
  const v = new Video('shortest-subarray-sum-k', 'Shortest Subarray with Sum at Least K');
  const P = [0];
  for (const x of A) P.push(P[P.length - 1] + x);
  v.chapter('intro', 'The problem');
  const a0 = v.array('a', A, { label: `nums, k = ${K}` });
  a0.win(2, 3, 'ok', 'sum 5');
  v.say(`Return the length of the shortest non-empty subarray whose sum is at least ${words(K)}, or minus one if there is none. The catch: numbers can be negative.`);
  v.eq(`answer: ${ssk(A, K)}`);

  v.chapter('why', 'Why a plain sliding window fails');
  v.clear();
  const aw = v.array('a', A, { label: 'nums' });
  aw.win(0, 1, 'bad', 'sum 1');
  v.eq('adding −1 made the sum smaller · shrinking can make it bigger', 'bad').say('A sliding window assumes that growing the window increases the sum and shrinking decreases it. Negative numbers break both. So we switch to prefix sums: the sum of a subarray from i to j minus one is P of j minus P of i.');

  v.chapter('brute', 'Brute force: every pair of prefix sums', { cx: 'O(n²)', code: ['for j in 1..n: for i in 0..j−1:', '  if P[j] − P[i] ≥ k: best = min(best, j − i)'] });
  v.eq('n² pairs', 'warn').say('For every end, try every start. Quadratic.');

  v.chapter('better', 'Better: min-heap of prefix sums', { cx: 'O(n log n)', code: ['for j: while heap.min.P ≤ P[j] − k:', '  best = min(best, j − heap.pop().index)', 'push (P[j], j)'] });
  v.eq('a start used once never needs to be used again (later ends are longer)', 'warn').say('Keep earlier prefix sums in a min-heap. While the smallest one is small enough, it forms a valid subarray. Pop it: any later end would only give a longer subarray with that start. That is n log n.');

  v.chapter('optimal', 'Optimal: increasing deque of prefix indices', { cx: 'O(n)', code: ['for j in 0..n:', '  while P[j] − P[front] ≥ k:', '    best = min(best, j − front); pop front', '  while P[back] ≥ P[j]: pop back', '  push back j'] });
  v.clear();
  const pa = v.array('P', P, { label: 'prefix sums P (P[j] = sum of first j numbers)' });
  const q = v.queue('dq', [], { label: 'deque of prefix indices (P increasing)', ends: ['front', 'back'] });
  const dq: number[] = [];
  let best = Infinity;
  const told = { front: false, back: false };
  v.say('Walk over the prefix sums. The deque holds candidate starts with increasing prefix values. Two rules. From the front: while the current prefix minus the front is at least k, we found a subarray; record it and pop, because later ends would only be longer. From the back: an earlier start with a prefix at least as large as the current one is never better, since the current one is both later and smaller. Pop it.');
  for (let j = 0; j < P.length; j++) {
    pa.clearTones().tone(j, 'active');
    dq.forEach((i) => pa.tone(i, 'cmp'));
    while (dq.length && P[j] - P[dq[0]] >= K) {
      const i = dq.shift()!;
      q.shift();
      const len = j - i;
      const nb = len < best;
      best = Math.min(best, len);
      pa.tone(i, 'ok');
      v.line(1, 2).counter(`best: ${best}`).eq(`P[${j}] − P[${i}] = ${P[j]} − ${P[i]} = ${P[j] - P[i]} ≥ ${K} → length ${len}${nb ? ' ← best' : ''}, pop front`, 'ok');
      if (!told.front) { v.say(`P of ${words(j)} is ${words(P[j])}. Minus the front, P of ${words(i)}, which is ${sn(P[i])}, gives ${words(P[j] - P[i])}: at least ${words(K)}. That is a subarray of length ${words(len)}. Pop the front and try the next one.`); told.front = true; }
      else if (nb) v.say(`The next start also works, giving length ${words(len)}. Shorter, so it is the new best.`);
      else v.hold(700);
    }
    while (dq.length && P[dq[dq.length - 1]] >= P[j]) {
      const i = dq.pop()!;
      q.pop();
      pa.tone(i, 'bad');
      v.line(3).eq(`P[${i}] = ${P[i]} ≥ P[${j}] = ${P[j]} → start ${i} is never better, pop back`, 'bad');
      if (!told.back) { v.say(`P of ${words(j)} is ${sn(P[j])}, smaller than P of ${words(i)}. The negative number dipped the prefix. Any future end prefers start ${words(j)}: it is later, giving a shorter subarray, and smaller, giving a bigger sum. So start ${words(i)} is useless.`); told.back = true; }
      else v.hold(650);
    }
    dq.push(j);
    q.push(`${j}:${P[j]}`);
    v.line(4).eq(`push ${j} (P = ${P[j]})`).hold(450);
  }
  pa.clearTones();
  v.eq(`shortest length = ${best}`, 'ok').say(`Each prefix index enters and leaves the deque once. The shortest length is ${words(best)}: the subarray two, three.`);
  v.answer(ssk(A, K));

  recap(v, [{ name: 'Every pair of prefix sums', time: 'O(n²)', space: 'O(n)' }, { name: 'Min-heap of prefix sums', time: 'O(n log n)', space: 'O(n)' }, { name: 'Monotonic deque on prefix sums', time: 'O(n)', space: 'O(n)' }], 'Increasing deque of prefix indices: pop the front when it works, pop the back when it is dominated.', ['Negative numbers + subarray sum ≥ k → prefix sums + monotonic deque'], 'When a sliding window breaks on negative numbers, move to prefix sums and keep only undominated starts.');
  return v.build();
}

const problem: Problem = {
  slug: 'shortest-subarray-with-sum-at-least-k',
  statement: 'Given an integer array `nums` and an integer `k`, return the length of the shortest non-empty subarray of `nums` with a sum of at least `k`. If there is no such subarray, return `-1`.',
  examples: [{ input: 'nums = [1], k = 1', output: '1' }, { input: 'nums = [1,2], k = 4', output: '-1' }, { input: 'nums = [2,-1,2], k = 3', output: '3' }],
  constraints: ['1 ≤ n ≤ 10⁵', '−10⁵ ≤ nums[i] ≤ 10⁵', '1 ≤ k ≤ 10⁹'],
  hints: ['Negative numbers break the sliding window. Use prefix sums.', 'If P[i₁] ≥ P[i₂] with i₁ < i₂, start i₁ is never better than i₂.', 'Once a start produces a valid subarray, it is done.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every pair of prefix sums', idea: 'Check P[j] − P[i] ≥ k for all i < j.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Quadratic.' },
    { id: 'better', kind: 'better', name: 'Min-heap of prefix sums', idea: 'Pop heap minimums while P[j] − min ≥ k, recording lengths.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Log factor.' },
    { id: 'optimal', kind: 'optimal', name: 'Monotonic deque', idea: 'Increasing deque of prefix indices: pop front while valid (record), pop back while dominated.', time: 'O(n)', space: 'O(n)' },
  ],
  pitfalls: ['Prefix sums can exceed 32 bits: use 64-bit integers.', 'A plain sliding window gives wrong answers with negative numbers.'],
  takeaway: '**Prefix sums + monotonic deque** handles negatives.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'shortestSubarray', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[1], 1], out: 1 }, { args: [[1, 2], 4], out: -1 }, { args: [[2, -1, 2], 3], out: 3 }, { args: [A, K], out: 2 }, { args: [[84, -37, 32, 40, 95], 167], out: 3 }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), -4, 6), r.int(1, 12)],
    ref: (a: number[], k: number) => ssk(a, k),
  },
};

export default problem;
