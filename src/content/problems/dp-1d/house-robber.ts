import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree, fill1D } from '../../dpviz';

const H = [2, 7, 9, 3, 1];
function robT(a: number[]) { const d: number[] = []; a.forEach((x, i) => d.push(Math.max(i ? d[i - 1] : 0, (i > 1 ? d[i - 2] : 0) + x))); return d; }
export function rob(a: number[]) { const d = robT(a); return d.length ? d[d.length - 1] : 0; }

function video() {
  const v = new Video('house-robber', 'House Robber');
  const d = robT(H);
  v.chapter('intro', 'The problem');
  v.array('h', H, { label: 'money in each house' });
  v.say('Houses along a street hold some money. Robbing two neighbouring houses sets off the alarm. What is the most you can take?');
  v.eq(`answer: ${rob(H)} (houses 0, 2, 4: 2 + 9 + 1)`);

  v.chapter('brute', 'Brute force: take it or skip it, recursively', { cx: 'O(2ⁿ)', code: ['best(i) = most money from houses 0..i', 'best(i) = max(best(i−1), best(i−2) + money[i])', 'best(−1) = 0, best(0) = money[0]'] });
  v.clear();
  v.array('h', H, { label: 'money' });
  v.say('Look at the last house i. Either we skip it, and get the best from the houses before it, or we rob it, and then house i minus one is off limits, so we add its money to the best up to i minus two.');
  const r = callTree<number>(v, 'rt', 'calls for best(4)', 4, {
    kids: (i) => (i <= 0 ? [] : [i - 1, i - 2]), key: String, text: (i) => `b(${i})`,
    lines: { call: [1], base: [2] },
    say: (i, info) => (info.repeat && i === 2 ? 'Best of two is needed by both branches, and gets recomputed.' : undefined),
  });
  v.eq(`${r.calls} calls · exponential`, 'bad').say('Two branches per house, with heavy repetition.');

  v.chapter('better', 'Better: memoise best(i)', { cx: 'O(n)', code: ['cache best(i)'] });
  v.eq('n states × O(1)', 'warn').say('Only n different questions exist, one per house: caching makes it linear.');

  v.chapter('optimal', 'Optimal: one pass, two variables', { cx: 'O(n) time, O(1) space', code: ['dp[i] = max(dp[i−1], dp[i−2] + money[i])', 'skip house i  →  dp[i−1]', 'rob house i   →  dp[i−2] + money[i]', 'answer = dp[n−1]'] });
  v.clear();
  const h = v.array('h', H, { label: 'money' });
  const a = v.array('dp', H.map(() => ''), { label: 'dp[i] = best from houses 0..i' });
  v.line(0).say('Fill dp from left to right. Each cell makes one decision about its own house.');
  fill1D(v, a, H.map((_, i) => i), {
    deps: (i) => [i - 1, i - 2].filter((k) => k >= 0), val: (i) => d[i], line: [0],
    eq: (i) => { const skip = i ? d[i - 1] : 0, take = (i > 1 ? d[i - 2] : 0) + H[i]; return `dp[${i}] = max(skip ${skip}, rob ${i > 1 ? d[i - 2] : 0} + ${H[i]} = ${take}) = ${d[i]}`; },
    say: (i) => { h.clearTones().tone(i, 'active'); const skip = i ? d[i - 1] : 0, take = (i > 1 ? d[i - 2] : 0) + H[i]; if (i === 0) return 'House zero alone: rob it, two.'; if (i === 1) return 'House one: rob it for seven, or keep the two. Seven wins.'; if (i === 2) return `House two: skip it and keep ${words(skip)}, or rob it for nine plus the ${words(d[0])} from house zero, ${words(take)}. Rob it.`; if (i === 3) return `House three: skipping keeps ${words(skip)}; robbing gives three plus ${words(d[1])}, only ${words(take)}. Skip.`; return undefined; },
  });
  h.clearTones();
  a.tone(H.length - 1, 'ok');
  v.line(3).eq(`answer = ${d[H.length - 1]}`, 'ok').say(`The best is ${words(d[H.length - 1])}. Each cell reads only the two before it, so two variables do the job.`);
  v.answer(rob(H));

  recap(v, [{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n)', space: 'O(n)' }, { name: 'Two variables', time: 'O(n)', space: 'O(1)' }], 'dp[i] = max(skip: dp[i−1], take: dp[i−2] + x).', ['Pick elements, no two adjacent, maximise → take / skip DP'], 'Taking i forbids i − 1, so it pairs with dp[i − 2].');
  return v.build();
}

const problem: Problem = {
  slug: 'house-robber',
  statement: 'You are a robber planning to rob houses along a street; `nums[i]` is the money in house i. Adjacent houses have connected alarms, so you cannot rob two adjacent houses. Return the maximum amount you can rob.',
  examples: [{ input: 'nums = [1,2,3,1]', output: '4' }, { input: 'nums = [2,7,9,3,1]', output: '12' }],
  constraints: ['1 ≤ nums.length ≤ 100', '0 ≤ nums[i] ≤ 400'],
  hints: ['For each house: rob it or skip it.', 'dp[i] = max(dp[i−1], dp[i−2] + nums[i]).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Take/skip each house recursively.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache best(i).', time: 'O(n)', space: 'O(n)', bottleneck: 'Memo + stack.' },
    { id: 'optimal', kind: 'optimal', name: 'Two variables', idea: 'Roll dp[i−1], dp[i−2].', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: '**Take or skip**: max(dp[i−1], dp[i−2] + x).',
  video,
  videoArgs: [H],
  judge: {
    type: 'fn', fn: 'rob', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 2, 3, 1]], out: 4 }, { args: [H], out: 12 }, { args: [[5]], out: 5 }, { args: [[2, 1, 1, 2]], out: 4 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 18) }, () => r.int(0, 40))],
    ref: (a: number[]) => rob(a),
  },
};

export default problem;
