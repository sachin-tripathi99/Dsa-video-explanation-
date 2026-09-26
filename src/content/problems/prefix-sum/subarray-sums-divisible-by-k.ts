import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [4, 5, 0, -2, -3, 1];
const K = 5;
const mod = (x: number, k: number) => ((x % k) + k) % k;

function count(a: number[], k: number) {
  const c = new Map<number, number>([[0, 1]]);
  let run = 0, ans = 0;
  for (const x of a) { run = mod(run + x, k); ans += c.get(run) ?? 0; c.set(run, (c.get(run) ?? 0) + 1); }
  return ans;
}

function video() {
  const v = new Video('subarray-sums-divisible', 'Subarray Sums Divisible by K');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `k = ${K}` });
  v.say(`Count the subarrays whose sum is divisible by ${K}.`);
  v.eq('sum(i..j) divisible by k ⇔ P[j+1] and P[i] have the same remainder mod k', 'ok').say('A subarray sum is P of j plus one minus P of i. That difference is divisible by k exactly when both prefix sums leave the same remainder when divided by k.');

  v.chapter('brute', 'Brute force: every subarray', { cx: 'O(n²)', code: ['for i: s = 0', '  for j from i: s += a[j]; if s % k == 0: count += 1'] });
  v.eq('n² subarrays', 'warn').say('Checking every subarray is n squared.');

  v.chapter('optimal', 'Optimal: count prefix remainders', { cx: 'O(n + k)', code: ['count = {0: 1}; run = 0', 'for x in a:', '  run = ((run + x) % k + k) % k      # non-negative remainder', '  ans += count[run]; count[run] += 1'] });
  v.clear();
  const a = v.array('a', A, { label: `k = ${K}` });
  const m = v.map('cnt', { label: 'prefix remainder → times seen' });
  m.put(0, 1);
  const c = new Map<number, number>([[0, 1]]);
  let run = 0;
  let raw = 0;
  let ans = 0;
  let told = 0;
  v.say('So keep a count of how many prefixes had each remainder. Each new prefix pairs up with every earlier prefix that has the same remainder.');
  A.forEach((x, i) => {
    raw += x;
    const pre = run + x;
    run = mod(pre, K);
    const got = c.get(run) ?? 0;
    ans += got;
    a.clearTones().tone(i, 'active');
    m.clearTones();
    if (got) m.tone(run, 'ok');
    v.line(2, 3).counter(`count: ${ans}`).eq(`prefix ${raw}, remainder ${run} → +${got}`, got ? 'ok' : undefined);
    if (pre < 0 && told === 1) { v.say(`Careful here. The previous remainder plus ${x < 0 ? `minus ${words(-x)}` : words(x)} is ${pre < 0 ? `minus ${words(-pre)}` : words(pre)}. In Java and C plus plus, the remainder of a negative number is negative, so add k and take the remainder again: ${words(run)}. ${got ? `It matches ${got === 1 ? 'one earlier prefix' : `${words(got)} earlier prefixes`}.` : ''}`); told++; }
    else if (got && told === 0) { v.say(`Prefix ${words(raw)} has remainder ${words(run)}, the same as ${got === 1 ? 'one earlier prefix' : `${words(got)} earlier prefixes`}. Each pair gives one subarray divisible by five.`); told++; }
    else v.hold(650);
    c.set(run, got + 1);
    m.put(run, got + 1).tone(run, 'active');
  });
  a.clearTones();
  v.eq(`${ans} subarrays`, 'ok').say(`${words(ans)} subarrays in total, in a single pass.`);
  v.answer(count(A, K));

  recap(v, [{ name: 'Every subarray', time: 'O(n²)', space: 'O(1)' }, { name: 'Prefix remainder counts', time: 'O(n + k)', space: 'O(k)' }], 'Same remainder ⇒ difference divisible by k.', ['“Divisible by k” subarrays → prefix sums mod k', 'Normalise negative remainders'], 'Divisibility turns into matching remainders. Watch out for negative remainders in Java and C plus plus.');
  return v.build();
}

const problem: Problem = {
  slug: 'subarray-sums-divisible-by-k',
  statement: 'Given an integer array `nums` and an integer `k`, return the number of non-empty **subarrays** that have a sum divisible by `k`.',
  examples: [{ input: 'nums = [4,5,0,-2,-3,1], k = 5', output: '7' }, { input: 'nums = [5], k = 9', output: '0' }],
  constraints: ['1 ≤ n ≤ 3 · 10⁴', '−10⁴ ≤ nums[i] ≤ 10⁴', '2 ≤ k ≤ 10⁴'],
  hints: ['When is P[j] − P[i] divisible by k?', 'Count prefixes by remainder.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every subarray', idea: 'Running sum from each start; count sums with s % k == 0.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Prefix remainder counts', idea: 'For each prefix remainder r, add count[r], then count[r]++. Seed count[0] = 1.', time: 'O(n + k)', space: 'O(k)' },
  ],
  pitfalls: ['`-7 % 5` is `-2` in Java/C++: use `((x % k) + k) % k`.'],
  takeaway: 'Divisible differences ⇔ **equal remainders** of prefix sums.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'subarraysDivByK', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[4, 5, 0, -2, -3, 1], 5], out: 7 }, { args: [[5], 9], out: 0 }, { args: [[-1, 2, 9], 2], out: 2 }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), -9, 9), r.int(2, 6)],
    ref: (a: number[], k: number) => count(a, k),
  },
};

export default problem;
