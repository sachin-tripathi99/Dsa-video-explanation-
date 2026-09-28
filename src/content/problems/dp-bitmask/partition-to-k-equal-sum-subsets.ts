import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill1D } from '../../dpviz';

const A = [1, 2, 2, 3], K = 2;
function tbl(a: number[], k: number) { const s = a.reduce((x, y) => x + y, 0); const n = a.length; const d = Array(1 << n).fill(-1); if (s % k) return { d, t: -1 }; const t = s / k; d[0] = 0; for (let m = 1; m < 1 << n; m++) for (let i = 0; i < n; i++) if (m & (1 << i)) { const p = d[m ^ (1 << i)]; if (p >= 0 && p + a[i] <= t) { d[m] = (p + a[i]) % t; break; } } return { d, t }; }
function can(a: number[], k: number) { const { d, t } = tbl(a, k); return t > 0 && d[(1 << a.length) - 1] === 0; }

function video() {
  const v = new Video('partition-to-k-equal-sum-subsets', 'Partition to K Equal Sum Subsets');
  const n = A.length;
  const { d, t } = tbl(A, K);
  const bin = (m: number) => m.toString(2).padStart(n, '0');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say(`Can the numbers be split into ${words(K)} groups with equal sums? Every number must be used exactly once.`);
  v.eq(`total ${A.reduce((x, y) => x + y, 0)} → each group ${t}: {1, 3} and {2, 2} → ${can(A, K)}`);

  v.chapter('brute', 'Brute force: put each number in one of k buckets', { cx: 'O(kⁿ)', code: ['assign(i): try nums[i] in every bucket that stays ≤ target', 'all assigned and every bucket == target → true'] });
  v.eq('k choices per number', 'bad').say('Try every bucket for every number: k to the n.');

  v.chapter('better', 'Better: sort descending, prune, skip equal buckets', { cx: 'much less than kⁿ', code: ['sort big → small', 'skip a bucket if an earlier bucket had the same sum'] });
  v.eq('pruning helps, but repeated situations remain', 'warn').say('Placing big numbers first and treating equal buckets as the same cuts a lot. But the same set of used numbers is still reached in many ways.');

  v.chapter('optimal', 'Optimal: dp over the set of used numbers', { cx: 'O(2ⁿ · n)', code: ['fill groups one after another; only the current group is partial', 'dp[mask] = sum of the current group (sum of mask mod target), or −1', 'dp[mask] valid if some x in mask: dp[mask − x] valid and dp[mask − x] + x ≤ target', 'answer: dp[all] == 0'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: 1 << n }, (_, m) => (m === 0 ? 0 : '')), { label: `dp[mask] = fill of the current group (target ${t}), ✗ = impossible` });
  a.subs([...Array(1 << n).keys()].map(bin));
  v.line(0, 1).say('Fill the groups one at a time. Then, given which numbers are used, the finished groups are complete and the current group holds whatever is left over: the sum of the used numbers, modulo the target. So a mask tells us everything, and the only question is whether it can be reached without ever overflowing a group.');
  fill1D(v, a, [...Array((1 << n) - 1).keys()].map((k) => k + 1), {
    base: [0],
    deps: (m) => { for (let i = 0; i < n; i++) if (m & (1 << i)) { const p = d[m ^ (1 << i)]; if (p >= 0 && p + A[i] <= t) return [m ^ (1 << i)]; } return []; },
    val: (m) => (d[m] < 0 ? '✗' : d[m]), line: [2],
    eq: (m) => { for (let i = 0; i < n; i++) if (m & (1 << i)) { const p = d[m ^ (1 << i)]; if (p >= 0 && p + A[i] <= t) return `{${bin(m)}}: add ${A[i]} to a group holding ${p} → ${(p + A[i]) % t}`; } return `{${bin(m)}}: every way overflows a group → ✗`; },
    say: (m) => (m === 0b1100 ? 'Using the two and the three: two plus three is five, more than the target four, whichever came last. Impossible.' : m === 0b1001 ? 'The one and the three: they fill a group exactly, so the next group starts at zero.' : m === (1 << n) - 1 ? 'All numbers used and the current group is back at zero: every group is full.' : undefined),
    hold: 380,
  });
  a.tone((1 << n) - 1, 'ok');
  v.line(3).eq(`dp[all] = ${d[(1 << n) - 1]} → ${can(A, K)}`, 'ok').say(`So the split is possible. Two to the n masks, n candidates each.`);
  v.answer(can(A, K));

  recap(v, [{ name: 'k buckets per number', time: 'O(kⁿ)', space: 'O(n)' }, { name: 'Pruned backtracking', time: 'much less', space: 'O(n)' }, { name: 'Bitmask DP', time: 'O(2ⁿ · n)', space: 'O(2ⁿ)' }], 'Fill groups in turn; mask → current group fill.', ['Split a small set into equal groups → dp over masks'], 'Check total % k first.');
  return v.build();
}

const problem: Problem = {
  slug: 'partition-to-k-equal-sum-subsets',
  statement: 'Given an integer array `nums` and an integer `k`, return `true` if it is possible to divide the array into `k` non-empty subsets whose sums are all equal.',
  examples: [{ input: 'nums = [4,3,2,3,5,2,1], k = 4', output: 'true' }, { input: 'nums = [1,2,3,4], k = 3', output: 'false' }],
  constraints: ['1 ≤ k ≤ nums.length ≤ 16', '1 ≤ nums[i] ≤ 10⁴'],
  hints: ['Each group must sum to total / k.', 'Fill one group at a time; the used-set determines the current fill.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Buckets', idea: 'Try each number in each bucket.', time: 'O(kⁿ)', space: 'O(n)', bottleneck: 'Exponential in k.' },
    { id: 'better', kind: 'better', name: 'Pruned backtracking', idea: 'Sort descending, skip equal buckets.', time: 'pruned', space: 'O(n)', bottleneck: 'Repeated used-sets.' },
    { id: 'optimal', kind: 'optimal', name: 'Bitmask DP', idea: 'dp[mask] = fill of the current group.', time: 'O(2ⁿ · n)', space: 'O(2ⁿ)' },
  ],
  takeaway: 'Mask → **current group fill**.',
  video,
  videoArgs: [A, K],
  judge: {
    type: 'fn', fn: 'canPartitionKSubsets', params: ['int[]', 'int'], ret: 'boolean',
    tests: [{ args: [[4, 3, 2, 3, 5, 2, 1], 4], out: true }, { args: [[1, 2, 3, 4], 3], out: false }, { args: [A, K], out: true }, { args: [[2, 2, 2, 2, 3, 4, 5], 4], out: false }],
    gen: (r: Rng) => { const a = Array.from({ length: r.int(1, 10) }, () => r.int(1, 6)); return [a, r.int(1, Math.min(4, a.length))]; },
    ref: (a: number[], k: number) => can(a, k),
  },
};

export default problem;
