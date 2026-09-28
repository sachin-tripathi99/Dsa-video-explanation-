import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree, fill1D } from '../../dpviz';

const COST = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1];
function minCost(c: number[]) { const n = c.length; const d = Array(n + 1).fill(0); for (let i = 2; i <= n; i++) d[i] = Math.min(d[i - 1] + c[i - 1], d[i - 2] + c[i - 2]); return d[n]; }
function table(c: number[]) { const n = c.length; const d = Array(n + 1).fill(0); for (let i = 2; i <= n; i++) d[i] = Math.min(d[i - 1] + c[i - 1], d[i - 2] + c[i - 2]); return d; }

function video() {
  const v = new Video('min-cost-climbing-stairs', 'Min Cost Climbing Stairs');
  const n = COST.length;
  const d = table(COST);
  v.chapter('intro', 'The problem');
  v.array('c', COST, { label: 'cost[i] = price of stepping off step i' });
  v.say('Each step has a cost you pay when you leave it, climbing one or two steps. You may start on step zero or step one for free. What is the cheapest way to reach the top, just past the last step?');
  v.eq(`answer: ${minCost(COST)}`);

  v.chapter('brute', 'Brute force: try both last moves recursively', { cx: 'O(2ⁿ)', code: ['best(i) = cheapest way to stand on step i', 'best(0) = best(1) = 0', 'best(i) = min(best(i−1) + cost[i−1], best(i−2) + cost[i−2])'] });
  v.clear();
  v.array('c', [10, 15, 20], { label: 'small example: cost = [10, 15, 20]' });
  const r = callTree<number>(v, 'rt', 'calls for best(3)', 3, {
    kids: (i) => (i <= 1 ? [] : [i - 1, i - 2]), key: String, text: (i) => `best(${i})`,
    lines: { call: [2], base: [1] },
    say: (i, info) => (info.calls === 1 ? 'To stand at the top, index three, you arrived from step two paying twenty, or from step one paying fifteen. Each option asks the same question about an earlier step.' : undefined),
  });
  v.eq(`${r.calls} calls · exponential for long staircases`, 'bad').say('The branching repeats the same earlier steps many times, so plain recursion is exponential.');

  v.chapter('better', 'Better: memoise best(i)', { cx: 'O(n)', code: ['cache best(i); every step solved once'] });
  v.eq('n states, O(1) work each', 'warn').say('There are only n plus one different steps, so caching gives linear time, with linear memory for the cache and the recursion.');

  v.chapter('optimal', 'Optimal: fill from the bottom, two variables', { cx: 'O(n) time, O(1) space', code: ['dp[0] = dp[1] = 0', 'for i in 2..n:', '  dp[i] = min(dp[i−1] + cost[i−1], dp[i−2] + cost[i−2])', 'return dp[n]'] });
  v.clear();
  const c = v.array('c', COST, { label: 'cost' });
  const a = v.array('dp', Array.from({ length: n + 1 }, (_, i) => (i <= 1 ? 0 : '')), { label: 'dp[i] = cheapest cost to stand on step i (n = top)' });
  v.line(0).say('Fill a table where dp of i is the cheapest cost to be standing on step i. Starting on step zero or one is free.');
  fill1D(v, a, [...Array(n - 1).keys()].map((k) => k + 2), {
    base: [0, 1], deps: (i) => [i - 1, i - 2], val: (i) => d[i], line: [2],
    eq: (i) => { const x = d[i - 1] + COST[i - 1], y = d[i - 2] + COST[i - 2]; return `dp[${i}] = min(${d[i - 1]}+${COST[i - 1]}, ${d[i - 2]}+${COST[i - 2]}) = min(${x}, ${y}) = ${d[i]}`; },
    say: (i) => (i === 2 ? 'Step two: from step one paying a hundred, or from step zero paying one. One is cheaper.' : i === 3 ? 'Step three: from step two, one plus one is two; from step one, zero plus a hundred. Two.' : i === 6 ? 'Notice how the expensive steps, the hundreds, are always jumped over: the min picks the path that skips them.' : undefined),
  });
  c.clearTones();
  a.tone(n, 'ok');
  v.line(3).eq(`top = dp[${n}] = ${d[n]}`, 'ok').say(`The top costs ${words(d[n])}. Each value reads only the previous two, so two variables are enough.`);
  v.answer(minCost(COST));

  recap(v, [{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n)', space: 'O(n)' }, { name: 'Bottom-up, 2 variables', time: 'O(n)', space: 'O(1)' }], 'dp[i] = min over the last move of (dp[prev] + cost[prev]).', ['Min cost with 1- or 2-step moves → min over the last move'], 'The top is index n, one past the last step.');
  return v.build();
}

const problem: Problem = {
  slug: 'min-cost-climbing-stairs',
  statement: 'You are given an integer array `cost` where `cost[i]` is the cost of the i-th step. Once you pay it you can climb one or two steps. You can start from step 0 or step 1. Return the minimum cost to reach the top of the floor (index n).',
  examples: [{ input: 'cost = [10,15,20]', output: '15' }, { input: 'cost = [1,100,1,1,1,100,1,1,100,1]', output: '6' }],
  constraints: ['2 ≤ cost.length ≤ 1000', '0 ≤ cost[i] ≤ 999'],
  hints: ['dp[i] = cheapest cost to stand on step i.', 'The top is index n.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try both last moves.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential repeats.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache best(i).', time: 'O(n)', space: 'O(n)', bottleneck: 'Memo and stack.' },
    { id: 'optimal', kind: 'optimal', name: 'Two variables', idea: 'Bottom-up, keep the last two values.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: '**min** over the last move.',
  video,
  videoArgs: [COST],
  judge: {
    type: 'fn', fn: 'minCostClimbingStairs', params: ['int[]'], ret: 'int',
    tests: [{ args: [[10, 15, 20]], out: 15 }, { args: [COST], out: 6 }, { args: [[0, 0]], out: 0 }],
    gen: (r: Rng) => [Array.from({ length: r.int(2, 16) }, () => r.int(0, 50))],
    ref: (c: number[]) => minCost(c),
  },
};

export default problem;
