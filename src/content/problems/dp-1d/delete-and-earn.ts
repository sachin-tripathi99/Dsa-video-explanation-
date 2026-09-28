import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill1D } from '../../dpviz';

const A = [2, 2, 3, 3, 3, 4];
function earn(a: number[]) { const m = Math.max(...a); const pts = Array(m + 1).fill(0); a.forEach((x) => (pts[x] += x)); let p2 = 0, p1 = 0; for (const x of pts) [p2, p1] = [p1, Math.max(p1, p2 + x)]; return p1; }

function video() {
  const v = new Video('delete-and-earn', 'Delete and Earn');
  const ans = earn(A);
  const m = Math.max(...A);
  const pts = Array(m + 1).fill(0); A.forEach((x) => (pts[x] += x));
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Pick a number x to earn x points. Then every x minus one and x plus one in the array is deleted. Repeat as long as you like. What is the most you can earn?');
  v.eq(`answer: ${ans}`);
  v.say('Here, taking all three threes earns nine, and deletes the twos and the four. Taking the twos and the four instead earns only eight.');

  v.chapter('brute', 'Brute force: try every order of picks', { cx: 'exponential', code: ['recursively pick any remaining number,', 'delete its neighbours, recurse, keep the best'] });
  v.eq('exponentially many choices', 'bad').say('Trying every possible sequence of picks explodes quickly.');

  v.chapter('insight', 'Group equal values: it becomes House Robber');
  v.clear();
  const p = v.array('p', pts, { label: 'points[x] = x × (count of x)' });
  v.say('Two observations. If you pick one copy of x, you might as well pick every copy: nothing else is lost. And picking x forbids x minus one and x plus one, exactly like neighbouring houses. So add up the points per value, and rob a street where house x holds points of x.');
  p.tone(3, 'ok');
  v.eq(`points = [${pts.join(', ')}]`).say(`Value two is worth four, three is worth nine, four is worth four. Adjacent values cannot both be taken.`);

  v.chapter('optimal', 'House Robber over the values', { cx: 'O(n + max)', code: ['points[x] += x for every x', 'dp[x] = max(dp[x−1], dp[x−2] + points[x])', 'answer = dp[max]'] });
  const d: number[] = [];
  pts.forEach((x, i) => d.push(Math.max(i ? d[i - 1] : 0, (i > 1 ? d[i - 2] : 0) + x)));
  const a = v.array('dp', pts.map(() => ''), { label: 'dp[x] = best using values 0..x' });
  v.line(0);
  fill1D(v, a, pts.map((_, i) => i), {
    deps: (i) => [i - 1, i - 2].filter((k) => k >= 0), val: (i) => d[i], line: [1],
    eq: (i) => `dp[${i}] = max(${i ? d[i - 1] : 0}, ${i > 1 ? d[i - 2] : 0} + ${pts[i]}) = ${d[i]}`,
    say: (i) => (i === 3 ? `At value three: skip it and keep ${words(d[2])}, or take nine plus ${words(i > 1 ? d[1] : 0)}. Take it.` : i === 4 ? `At value four: taking it adds four to ${words(d[2])}, just ${words(d[2] + 4)}; keeping ${words(d[3])} is better.` : undefined),
    hold: 500,
  });
  a.tone(m, 'ok');
  v.line(2).eq(`answer = ${ans}`, 'ok').say(`The answer is ${words(ans)}. Counting is linear, and the robber pass runs over the value range.`);
  v.answer(ans);

  recap(v, [{ name: 'Try all pick orders', time: 'exponential', space: 'O(n)' }, { name: 'Memoised robber on values', time: 'O(n + max)', space: 'O(max)' }, { name: 'Bottom-up robber on values', time: 'O(n + max)', space: 'O(max)' }], 'Bucket points by value, then “no two adjacent values”.', ['Taking x forbids x ± 1 → House Robber on the value line'], 'Recognise an old problem in disguise.');
  return v.build();
}

const problem: Problem = {
  slug: 'delete-and-earn',
  statement: 'Given `nums`, you may repeatedly pick any `nums[i]` to earn `nums[i]` points, after which you must delete every element equal to `nums[i] − 1` and `nums[i] + 1`. Return the maximum number of points you can earn.',
  examples: [{ input: 'nums = [3,4,2]', output: '6' }, { input: 'nums = [2,2,3,3,3,4]', output: '9' }],
  constraints: ['1 ≤ nums.length ≤ 2 · 10⁴', '1 ≤ nums[i] ≤ 10⁴'],
  hints: ['If you take one x, take them all.', 'Taking x forbids x − 1 and x + 1: House Robber on values.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion on values', idea: 'Take/skip each value recursively (points bucketed).', time: 'O(2^max)', space: 'O(max)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache best(x).', time: 'O(n + max)', space: 'O(max)', bottleneck: 'Recursion depth up to max.' },
    { id: 'optimal', kind: 'optimal', name: 'Bottom-up robber', idea: 'points[x] then House Robber with two variables.', time: 'O(n + max)', space: 'O(max)' },
  ],
  takeaway: 'Bucket by value → **House Robber**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'deleteAndEarn', params: ['int[]'], ret: 'int',
    tests: [{ args: [[3, 4, 2]], out: 6 }, { args: [A], out: 9 }, { args: [[1]], out: 1 }, { args: [[1, 1, 1, 2, 4, 5, 5, 5, 6]], out: 18 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 12) }, () => r.int(1, 14))],
    ref: (a: number[]) => earn(a),
  },
};

export default problem;
