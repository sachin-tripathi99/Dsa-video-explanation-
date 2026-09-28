import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree } from '../../dpviz';

const A = [1, 1, 1, 1, 1], TGT = 3;
function ways(a: number[], t: number) { const s = a.reduce((x, y) => x + y, 0); if (Math.abs(t) > s || (s + t) % 2) return 0; const p = (s + t) / 2; const d = Array(p + 1).fill(0); d[0] = 1; for (const x of a) for (let c = p; c >= x; c--) d[c] += d[c - x]; return d[p]; }

function video() {
  const v = new Video('target-sum', 'Target Sum');
  const S = A.reduce((x, y) => x + y, 0), P = (S + TGT) / 2;
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say(`Put a plus or a minus sign in front of every number. How many ways give a total of ${words(TGT)}?`);
  v.eq(`${ways(A, TGT)} ways: exactly one of the five 1s gets a minus`);

  v.chapter('brute', 'Brute force: try both signs for every number', { cx: 'O(2ⁿ)', code: ['count(i, sum): i == n → sum == target ? 1 : 0', '  count(i+1, sum + nums[i]) + count(i+1, sum − nums[i])'] });
  v.clear();
  const small = [1, 1, 1];
  const t = callTree<[number, number]>(v, 'rt', 'three 1s, target 1: count(i, sum)', [0, 0], {
    kids: ([i, s]) => (i === small.length ? [] : [[i + 1, s + small[i]], [i + 1, s - small[i]]]),
    key: String, text: ([i, s]) => `${i},${s}`, lines: { call: [1], base: [0] }, hold: 300,
    say: ([i, s], info) => (info.calls === 1 ? 'Each number gets a plus branch and a minus branch.' : info.repeat && i === 2 ? 'Index two with sum zero appears from plus-minus and from minus-plus: the same subproblem twice.' : undefined),
  });
  v.eq(`${t.calls} calls for 3 numbers · 2ⁿ⁺¹ in general`, 'bad').say('Exponential, and many branches end at the same index and the same running sum.');

  v.chapter('better', 'Better: memoise (i, sum)', { cx: 'O(n · total)', code: ['cache count(i, sum)'] });
  v.eq('sums range over −total..total', 'warn').say('Caching index and running sum gives n times the range of sums.');

  v.chapter('insight', 'Turn signs into a subset sum');
  v.clear();
  v.text('math', { title: 'Plus group P, minus group N', lines: ['P − N = target', 'P + N = total', 'add them: 2P = target + total', `P = (target + total) / 2 = (${TGT} + ${S}) / 2 = ${P}`], shown: 4 });
  v.say(`Call the numbers with a plus sign group P and the rest group N. Then P minus N is the target, and P plus N is the total. Adding the two equations, P is target plus total, over two: ${words(P)}. So we only need to count subsets that sum to ${words(P)}. If that number is not a whole number, or the target is out of range, the answer is zero.`);

  v.chapter('optimal', 'Count subsets with sum P', { cx: 'O(n · P) time, O(P) space', code: ['P = (total + target) / 2 (else 0 ways)', 'dp[0] = 1', 'for x in nums: for c from P down to x: dp[c] += dp[c − x]', 'return dp[P]'] });
  const d = Array(P + 1).fill(0); d[0] = 1;
  const a = v.array('a', A, { label: 'nums' });
  const row = v.array('dp', d, { label: `dp[s] = subsets summing to s (s = 0..${P})` });
  v.line(0, 1);
  A.forEach((x, k) => {
    a.clearTones().tone(k, 'active');
    for (let c = P; c >= x; c--) d[c] += d[c - x];
    row.clearTones();
    d.forEach((val, s) => row.set(s, val));
    for (let c = x; c <= P; c++) if (d[c]) row.tone(c, 'ok');
    v.line(2).counter(`after number ${k + 1}`).eq(`dp = [${d.join(', ')}]`);
    if (k === 0) v.say('After the first one: one way to make zero, one way to make one.');
    else if (k === 1) v.say('The second one: dp of one gains the ways to make zero, dp of two gains the ways to make one. Counting from high to low uses each number once.');
    else v.hold(900);
  });
  a.clearTones();
  row.tone(P, 'ok');
  v.line(3).eq(`dp[${P}] = ${d[P]}`, 'ok').say(`There are ${words(d[P])} ways to choose the plus group, so ${words(d[P])} ways to sign the numbers.`);
  v.answer(ways(A, TGT));

  recap(v, [{ name: 'Try all signs', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoise (i, sum)', time: 'O(n · total)', space: 'O(n · total)' }, { name: 'Count subsets to P', time: 'O(n · P)', space: 'O(P)' }], 'P = (total + target) / 2, then count subsets.', ['± signs to hit a target → subset-count knapsack'], 'Odd total + target or |target| > total → 0.');
  return v.build();
}

const problem: Problem = {
  slug: 'target-sum',
  statement: 'You are given an integer array `nums` and an integer `target`. Build an expression by putting "+" or "-" before each number and concatenating. Return the number of different expressions that evaluate to `target`.',
  examples: [{ input: 'nums = [1,1,1,1,1], target = 3', output: '5' }, { input: 'nums = [1], target = 1', output: '1' }],
  constraints: ['1 ≤ nums.length ≤ 20', '0 ≤ nums[i] ≤ 1000', 'sum(nums) ≤ 1000', '−1000 ≤ target ≤ 1000'],
  hints: ['Let P be the plus group: P − N = target, P + N = total.', 'Count subsets with sum (total + target) / 2.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All signs', idea: 'Recurse with + and − for each number.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache (index, running sum).', time: 'O(n · total)', space: 'O(n · total)', bottleneck: 'Large state space.' },
    { id: 'optimal', kind: 'optimal', name: 'Subset count', idea: 'Count subsets with sum (total + target) / 2.', time: 'O(n · P)', space: 'O(P)' },
  ],
  takeaway: 'Signs → **subset with sum (total + target) / 2**.',
  video,
  videoArgs: [A, TGT],
  judge: {
    type: 'fn', fn: 'findTargetSumWays', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [A, TGT], out: 5 }, { args: [[1], 1], out: 1 }, { args: [[0, 0, 1], 1], out: 4 }, { args: [[1, 2], 4], out: 0 }, { args: [[100], -200], out: 0 }],
    gen: (r: Rng) => { const a = Array.from({ length: r.int(1, 12) }, () => r.int(0, 6)); return [a, r.int(-10, 10)]; },
    ref: (a: number[], t: number) => ways(a, t),
  },
};

export default problem;
