import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [1, -1, 2, 1, -2, 3];
const K = 2;

function count(a: number[], k: number) {
  const m = new Map<number, number>([[0, 1]]);
  let run = 0, ans = 0;
  for (const x of a) { run += x; ans += m.get(run - k) ?? 0; m.set(run, (m.get(run) ?? 0) + 1); }
  return ans;
}

function video() {
  const v = new Video('subarray-sum-equals-k', 'Subarray Sum Equals K');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `k = ${K} · negatives allowed` });
  v.say(`Count the contiguous subarrays whose sum is exactly ${K}. Numbers may be negative, which rules out a sliding window.`);

  v.chapter('brute', 'Brute force: every subarray', { cx: 'O(n²)', code: ['for i: s = 0', '  for j from i: s += a[j]; if s == k: count += 1'] });
  v.eq('n² / 2 subarrays, each extended in O(1)', 'warn').say('Fix a start, extend the end while keeping a running sum, and count hits. That is n squared, too slow for twenty thousand numbers.');

  v.chapter('optimal', 'Optimal: prefix sums + hash map', { cx: 'O(n)', code: ['count = {0: 1}; run = 0', 'for x in a:', '  run += x', '  ans += count[run − k]', '  count[run] += 1'] });
  v.clear();
  const a = v.array('a', A, { label: `k = ${K}` });
  const m = v.map('cnt', { label: 'prefix sum → times seen' });
  m.put(0, 1);
  const cnt = new Map<number, number>([[0, 1]]);
  const at = new Map<number, number[]>([[0, [-1]]]);
  let run = 0;
  let ans = 0;
  let told = 0;
  v.say(`A subarray ending at j sums to ${K} exactly when the running sum now, minus ${K}, equals some earlier running sum. Keep a hash map counting how often each running sum has appeared, starting with zero seen once for the empty prefix.`);
  A.forEach((x, i) => {
    run += x;
    const got = cnt.get(run - K) ?? 0;
    ans += got;
    a.clearTones().tone(i, 'active');
    m.clearTones();
    if (got) {
      m.tone(run - K, 'ok');
      (at.get(run - K) ?? []).forEach((p) => a.toneRange(p + 1, i, 'ok'));
    }
    v.line(2, 3).counter(`count: ${ans}`).eq(`run ${run}, need earlier ${run} − ${K} = ${run - K} → +${got}`, got ? 'ok' : undefined);
    if (got && told < 2) {
      const subs = (at.get(run - K) ?? []).map((p) => `[${A.slice(p + 1, i + 1).join(', ')}]`);
      v.say(`Running sum ${words(run)}. Earlier prefixes equal to ${words(run - K)}: ${got === 1 ? 'one' : words(got)}. So ${subs.join(' and ')} ${got === 1 ? 'sums' : 'each sum'} to ${words(K)}.`);
      told++;
    } else v.hold(700);
    cnt.set(run, (cnt.get(run) ?? 0) + 1);
    at.set(run, [...(at.get(run) ?? []), i]);
    m.put(run, cnt.get(run)!).tone(run, 'active');
    v.line(4).hold(300);
  });
  a.clearTones();
  v.eq(`${ans} subarrays`, 'ok').say(`${words(ans)} subarrays in total. Each element does one lookup and one update, so this is linear.`);
  v.answer(count(A, K));

  recap(v, [{ name: 'Every subarray', time: 'O(n²)', space: 'O(1)' }, { name: 'Prefix sums + hash map', time: 'O(n)', space: 'O(n)' }], 'Count earlier prefixes equal to run − k.', ['Subarray sum = k with negatives → prefix + hash map', 'Seed the map with {0: 1}'], 'Whenever a subarray condition can be written as “prefix now minus prefix earlier equals k”, use a hash map of prefixes.');
  return v.build();
}

const problem: Problem = {
  slug: 'subarray-sum-equals-k',
  statement: 'Given an array of integers `nums` and an integer `k`, return the total number of **subarrays** (contiguous, non-empty) whose sum equals `k`.',
  examples: [{ input: 'nums = [1,1,1], k = 2', output: '2' }, { input: 'nums = [1,2,3], k = 3', output: '2' }],
  constraints: ['1 ≤ n ≤ 2 · 10⁴', '−1000 ≤ nums[i] ≤ 1000', '−10⁷ ≤ k ≤ 10⁷'],
  hints: ['sum(i..j) = P[j+1] − P[i].', 'For each j, how many earlier prefixes equal P[j+1] − k?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every subarray', idea: 'Fix i, extend j with a running sum, count sums equal to k.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Prefix sums + hash map', idea: 'Running sum; add count[run − k]; then count[run]++. Seed count[0] = 1.', time: 'O(n)', space: 'O(n)' },
  ],
  pitfalls: ['A sliding window fails because values can be negative.', 'Look up before inserting the current prefix, or k = 0 counts empty subarrays.'],
  takeaway: '**run − k** lookups in a prefix-count map count subarrays with sum k.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'subarraySum', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[1, 1, 1], 2], out: 2 }, { args: [[1, 2, 3], 3], out: 2 }, { args: [[0, 0, 0], 0], out: 6 }, { args: [[1, -1, 0], 0], out: 3 }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), -3, 3), r.int(-3, 4)],
    ref: (a: number[], k: number) => count(a, k),
  },
};

export default problem;
