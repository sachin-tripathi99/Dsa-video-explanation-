import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree, fill1D } from '../../dpviz';

const N = 6;
function climb(n: number) { let a = 1, b = 1; for (let i = 2; i <= n; i++) [a, b] = [b, a + b]; return b; }

function video() {
  const v = new Video('climbing-stairs', 'Climbing Stairs');
  v.chapter('intro', 'The problem');
  v.array('st', Array.from({ length: N + 1 }, (_, i) => i), { label: 'steps (0 = ground)' });
  v.say(`It takes ${words(N)} steps to reach the top. Each move climbs one or two steps. How many distinct ways are there to climb to the top?`);
  v.eq(`n = ${N} → ${climb(N)} ways`);
  v.say('Think about the last move onto step n: it came either from step n minus one or from step n minus two. Every way to reach the top is a way to reach one of those, plus one final move.');

  v.chapter('brute', 'Brute force: plain recursion', { cx: 'O(2ⁿ)', code: ['ways(n):', '  if n ≤ 1: return 1', '  return ways(n − 1) + ways(n − 2)'] });
  v.clear();
  const r = callTree<number>(v, 'rt', 'calls for ways(4)', 4, {
    kids: (n) => (n <= 1 ? [] : [n - 1, n - 2]), key: String, text: (n) => `w(${n})`,
    lines: { call: [2], base: [1] },
    say: (n, i) => (i.calls === 1 ? 'Written directly, ways of four calls ways of three and ways of two, and so on down to the base cases.' : i.repeat && n === 2 ? 'Ways of two is solved again from scratch: amber marks a repeated call.' : undefined),
  });
  v.eq(`${r.calls} calls for n = 4 · ~2ⁿ in general`, 'bad').say('The number of calls grows exponentially, because the same small cases are recomputed again and again.');

  v.chapter('better', 'Better: memoise each n', { cx: 'O(n) time, O(n) space', code: ['memo = {}', 'ways(n): if n ≤ 1: return 1', '  if n in memo: return memo[n]', '  memo[n] = ways(n − 1) + ways(n − 2)'] });
  v.clear();
  const m = callTree<number>(v, 'rt', 'calls with a memo', 4, {
    kids: (n) => (n <= 1 ? [] : [n - 1, n - 2]), key: String, text: (n) => `w(${n})`, memo: true,
    lines: { call: [3], base: [1], cached: [2] },
    say: (n, i) => (i.cached ? `Ways of ${words(n)} is already in the memo, so it returns at once.` : undefined),
  });
  v.eq(`${m.calls} calls instead of ${r.calls}`, 'ok').say('With a cache every n is solved once: linear time, but the recursion still uses stack space.');

  v.chapter('optimal', 'Optimal: bottom-up with two variables', { cx: 'O(n) time, O(1) space', code: ['dp[0] = dp[1] = 1', 'for i in 2..n: dp[i] = dp[i − 1] + dp[i − 2]', 'keep only the last two values'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: N + 1 }, (_, i) => (i <= 1 ? 1 : '')), { label: 'dp[i] = ways to reach step i' });
  v.line(0).say('Fill the answers from the ground up. Zero and one steps have exactly one way each.');
  fill1D(v, a, [...Array(N - 1).keys()].map((k) => k + 2), {
    base: [0, 1], deps: (i) => [i - 1, i - 2], val: climb, line: [1],
    eq: (i) => `dp[${i}] = ${climb(i - 1)} + ${climb(i - 2)} = ${climb(i)}`,
    say: (i) => (i === 2 ? 'Step two: from step one or from the ground, one plus one, two ways.' : i === 3 ? 'Every cell is the sum of the two before it: the Fibonacci numbers.' : undefined),
  });
  a.tone(N, 'ok');
  v.line(2).eq(`answer dp[${N}] = ${climb(N)}`, 'ok').say(`The top has ${words(climb(N))} ways. Since each cell reads only the previous two, two variables replace the array: constant space.`);
  v.answer(climb(N));

  recap(v, [{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n)', space: 'O(n)' }, { name: 'Bottom-up, 2 variables', time: 'O(n)', space: 'O(1)' }], 'ways(n) = ways(n − 1) + ways(n − 2).', ['Count ways with small steps → sum over the last move'], 'Base cases: ways(0) = ways(1) = 1.');
  return v.build();
}

const problem: Problem = {
  slug: 'climbing-stairs',
  statement: 'You are climbing a staircase that takes `n` steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
  examples: [{ input: 'n = 2', output: '2' }, { input: 'n = 3', output: '3' }],
  constraints: ['1 ≤ n ≤ 45'],
  hints: ['How did you arrive at step n?', 'ways(n) = ways(n − 1) + ways(n − 2).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'ways(n) = ways(n−1) + ways(n−2) without caching.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Recomputes the same n many times.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache each ways(n).', time: 'O(n)', space: 'O(n)', bottleneck: 'Recursion stack and memo array.' },
    { id: 'optimal', kind: 'optimal', name: 'Two variables', idea: 'Iterate upward keeping the last two values.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'It is **Fibonacci**: sum over the last move.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'climbStairs', params: ['int'], ret: 'int',
    tests: [{ args: [1], out: 1 }, { args: [2], out: 2 }, { args: [3], out: 3 }, { args: [N], out: climb(N) }, { args: [20], out: climb(20) }, { args: [45], out: climb(45), big: true }],
    gen: (r: Rng) => [r.int(1, 20)],
    ref: (n: number) => climb(n),
  },
};

export default problem;
