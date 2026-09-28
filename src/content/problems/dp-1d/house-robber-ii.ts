import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill1D } from '../../dpviz';

const H = [2, 7, 9, 3, 1];
function line(a: number[]) { let p2 = 0, p1 = 0; for (const x of a) [p2, p1] = [p1, Math.max(p1, p2 + x)]; return p1; }
function robCircle(a: number[]) { return a.length === 1 ? a[0] : Math.max(line(a.slice(0, -1)), line(a.slice(1))); }
function tbl(a: number[]) { const d: number[] = []; a.forEach((x, i) => d.push(Math.max(i ? d[i - 1] : 0, (i > 1 ? d[i - 2] : 0) + x))); return d; }

function video() {
  const v = new Video('house-robber-ii', 'House Robber II');
  const n = H.length;
  const ans = robCircle(H);
  v.chapter('intro', 'The problem');
  v.array('h', H, { label: 'houses in a circle: the last is next to the first' });
  v.say('The same robbery, but the houses stand in a circle, so the first and the last house are neighbours too.');
  v.eq(`answer: ${ans}`);
  v.say(`In the straight street, robbing houses zero, two and four gave twelve. Here zero and four are neighbours, so that plan is not allowed.`);

  v.chapter('brute', 'Brute force: try every allowed subset', { cx: 'O(2ⁿ · n)', code: ['for each subset of houses:', '  valid if no two chosen are adjacent (circularly)', '  keep the best sum'] });
  v.eq(`2^${n} = ${2 ** n} subsets here`, 'bad').say('Trying every subset of houses and checking the circle rule works for five houses, not for a hundred.');

  v.chapter('insight', 'Break the circle into two straight streets');
  v.clear();
  const a0 = v.array('a', H.slice(0, -1), { label: 'case 1: skip the last house → houses 0..n−2' });
  const a1 = v.array('b', H.slice(1), { label: 'case 2: skip the first house → houses 1..n−1' });
  v.say('The first and last house can never both be robbed. So at least one of them is skipped. If we skip the last, what remains is a straight street, houses zero to n minus two. If we skip the first, it is houses one to n minus one. The answer is the better of the two.');
  void a0; void a1;

  v.chapter('optimal', 'Run the straight-street DP twice', { cx: 'O(n) time, O(1) space', code: ['if n == 1: return nums[0]', 'a = rob_line(nums[0 .. n−2])', 'b = rob_line(nums[1 .. n−1])', 'return max(a, b)'] });
  v.clear();
  const L1 = H.slice(0, -1), L2 = H.slice(1);
  const d1 = tbl(L1), d2 = tbl(L2);
  v.array('s1', L1, { label: 'houses 0..3' });
  const t1 = v.array('d1', L1.map(() => ''), { label: 'dp without the last house' });
  v.line(1).say('First street: without the last house.');
  fill1D(v, t1, L1.map((_, i) => i), { deps: (i) => [i - 1, i - 2].filter((k) => k >= 0), val: (i) => d1[i], line: [1], eq: (i) => `dp[${i}] = max(${i ? d1[i - 1] : 0}, ${i > 1 ? d1[i - 2] : 0} + ${L1[i]}) = ${d1[i]}`, hold: 500 });
  t1.tone(L1.length - 1, 'ok');
  v.eq(`case 1 = ${d1[d1.length - 1]}`, 'ok').say(`Best without the last house: ${words(d1[d1.length - 1])}.`);
  v.clear();
  v.array('s2', L2, { label: 'houses 1..4' });
  const t2 = v.array('d2', L2.map(() => ''), { label: 'dp without the first house' });
  v.line(2).say('Second street: without the first house.');
  fill1D(v, t2, L2.map((_, i) => i), { deps: (i) => [i - 1, i - 2].filter((k) => k >= 0), val: (i) => d2[i], line: [2], eq: (i) => `dp[${i}] = max(${i ? d2[i - 1] : 0}, ${i > 1 ? d2[i - 2] : 0} + ${L2[i]}) = ${d2[i]}`, hold: 500 });
  t2.tone(L2.length - 1, 'ok');
  v.eq(`case 2 = ${d2[d2.length - 1]}`).say(`Best without the first house: ${words(d2[d2.length - 1])}.`);
  v.line(3).eq(`max(${d1[d1.length - 1]}, ${d2[d2.length - 1]}) = ${ans}`, 'ok').say(`The answer is the larger, ${words(ans)}. Two linear passes, constant extra space.`);
  v.answer(ans);

  recap(v, [{ name: 'All subsets', time: 'O(2ⁿ · n)', space: 'O(n)' }, { name: 'Two linear DPs', time: 'O(n)', space: 'O(1)' }], 'A circle = max of two straight lines (drop first or drop last).', ['Circular array constraint → solve two linear cases'], 'Handle n = 1 separately.');
  return v.build();
}

const problem: Problem = {
  slug: 'house-robber-ii',
  statement: 'Houses are arranged in a circle, so the first house is adjacent to the last. `nums[i]` is the money in house i; you cannot rob two adjacent houses. Return the maximum amount you can rob.',
  examples: [{ input: 'nums = [2,3,2]', output: '3' }, { input: 'nums = [1,2,3,1]', output: '4' }, { input: 'nums = [1,2,3]', output: '3' }],
  constraints: ['1 ≤ nums.length ≤ 100', '0 ≤ nums[i] ≤ 1000'],
  hints: ['The first and last house cannot both be robbed.', 'Solve houses [0..n−2] and [1..n−1] separately.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion per case', idea: 'Take/skip recursion on both straight cases.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation per case', idea: 'Cache best(i) for each case.', time: 'O(n)', space: 'O(n)', bottleneck: 'Memo arrays.' },
    { id: 'optimal', kind: 'optimal', name: 'Two linear passes', idea: 'House Robber on [0..n−2] and [1..n−1]; take the max.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Circle → **two straight streets**.',
  video,
  videoArgs: [H],
  judge: {
    type: 'fn', fn: 'rob', params: ['int[]'], ret: 'int',
    tests: [{ args: [[2, 3, 2]], out: 3 }, { args: [[1, 2, 3, 1]], out: 4 }, { args: [[1, 2, 3]], out: 3 }, { args: [[7]], out: 7 }, { args: [H], out: robCircle(H) }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 16) }, () => r.int(0, 40))],
    ref: (a: number[]) => robCircle(a),
  },
};

export default problem;
