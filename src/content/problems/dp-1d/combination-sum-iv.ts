import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree, fill1D } from '../../dpviz';

const NUMS = [1, 2, 3], T = 4;
function tbl(nums: number[], t: number) { const d = Array(t + 1).fill(0); d[0] = 1; for (let s = 1; s <= t; s++) for (const x of nums) if (x <= s) d[s] += d[s - x]; return d; }
function comb(nums: number[], t: number) { return tbl(nums, t)[t]; }

function video() {
  const v = new Video('combination-sum-iv', 'Combination Sum IV');
  const d = tbl(NUMS, T);
  v.chapter('intro', 'The problem');
  v.array('n', NUMS, { label: 'nums (each usable any number of times)' });
  v.say(`Count the sequences of numbers from the list that add up to ${words(T)}. Order matters: one then three and three then one are different sequences.`);
  v.eq(`target ${T} → ${comb(NUMS, T)}: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2, 1+3, 3+1`);
  v.say('They are: four ones; two ones and a two, in three different orders; two twos; and one and three, in either order. Despite the name, this counts ordered sequences, like climbing stairs with step sizes one, two and three.');

  v.chapter('brute', 'Brute force: choose the last number, recurse', { cx: 'O(kᵗ)', code: ['count(t): if t == 0: return 1', '  return Σ count(t − x) for x in nums with x ≤ t'] });
  v.clear();
  const r = callTree<number>(v, 'rt', `calls for count(${T})`, T, {
    kids: (t) => NUMS.filter((x) => x <= t).map((x) => t - x), key: String, text: (t) => `c(${t})`,
    lines: { call: [1], base: [0] },
    say: (t, info) => (info.calls === 1 ? 'The last number in the sequence is one, two or three; what comes before it must add up to the rest.' : info.repeat && t === 1 ? 'Count of one is recomputed many times.' : undefined),
  });
  v.eq(`${r.calls} calls for target ${T}`, 'bad').say('The branching is exponential in the target.');

  v.chapter('better', 'Better: memoise count(t)', { cx: 'O(t · k)', code: ['cache count(t)'] });
  v.eq('t + 1 states × k numbers', 'warn').say('Only target plus one different totals, each summing k options.');

  v.chapter('optimal', 'Bottom-up: dp[s] = Σ dp[s − x]', { cx: 'O(t · k) time, O(t) space', code: ['dp[0] = 1', 'for s in 1..target:', '  for x in nums: if x ≤ s: dp[s] += dp[s − x]', 'return dp[target]'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: T + 1 }, (_, i) => (i === 0 ? 1 : '')), { label: 'dp[s] = ordered sequences summing to s' });
  v.line(0).say('dp of zero is one: the empty sequence. Then each total adds up the ways to reach it with each possible last number.');
  fill1D(v, a, [...Array(T).keys()].map((k) => k + 1), {
    base: [0], deps: (s) => NUMS.filter((x) => x <= s).map((x) => s - x), val: (s) => d[s], line: [2],
    eq: (s) => `dp[${s}] = ${NUMS.filter((x) => x <= s).map((x) => `dp[${s - x}]`).join(' + ')} = ${NUMS.filter((x) => x <= s).map((x) => d[s - x]).join(' + ')} = ${d[s]}`,
    say: (s) => (s === 3 ? 'Three: end with one after any way to make two, end with two after any way to make one, or just three. Two plus one plus one: four.' : s === T ? 'Four sums the three cells before it: four plus two plus one, seven.' : undefined),
  });
  a.tone(T, 'ok');
  v.line(3).eq(`dp[${T}] = ${d[T]}`, 'ok').say(`${words(d[T])[0].toUpperCase()}${words(d[T]).slice(1)} sequences. Putting the total in the outer loop is what counts different orders separately; swapping the loops would count combinations instead, which is Coin Change II.`);
  v.answer(comb(NUMS, T));

  recap(v, [{ name: 'Recursion', time: 'O(kᵗ)', space: 'O(t)' }, { name: 'Memoisation', time: 'O(t · k)', space: 'O(t)' }, { name: 'Bottom-up', time: 'O(t · k)', space: 'O(t)' }], 'Total in the outer loop → ordered sequences.', ['Count ordered ways to reach a total → dp[s] = Σ dp[s − x]'], 'Loop order decides permutations vs combinations.');
  return v.build();
}

const problem: Problem = {
  slug: 'combination-sum-iv',
  statement: 'Given an array of distinct integers `nums` and a `target`, return the number of possible combinations that add up to `target`, where different orders count as different combinations. The answer fits in a 32-bit integer.',
  examples: [{ input: 'nums = [1,2,3], target = 4', output: '7' }, { input: 'nums = [9], target = 3', output: '0' }],
  constraints: ['1 ≤ nums.length ≤ 200', '1 ≤ nums[i] ≤ 1000, all distinct', '1 ≤ target ≤ 1000'],
  hints: ['Order matters: think of the last number chosen.', 'dp[s] = Σ dp[s − x].'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Sum count(t − x) over the last number x.', time: 'O(kᵗ)', space: 'O(t)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache count(t).', time: 'O(t · k)', space: 'O(t)', bottleneck: 'Recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Bottom-up', idea: 'Fill dp[0..target], totals in the outer loop.', time: 'O(t · k)', space: 'O(t)' },
  ],
  takeaway: 'Totals outside, numbers inside → **orders count**.',
  video,
  videoArgs: [NUMS, T],
  judge: {
    type: 'fn', fn: 'combinationSum4', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [NUMS, T], out: 7 }, { args: [[9], 3], out: 0 }, { args: [[2, 1, 3], 35], out: comb([2, 1, 3], 35), big: true }],
    gen: (r: Rng) => [[...new Set(Array.from({ length: r.int(1, 4) }, () => r.int(1, 6)))], r.int(1, 12)],
    ref: (n: number[], t: number) => comb(n, t),
  },
};

export default problem;
