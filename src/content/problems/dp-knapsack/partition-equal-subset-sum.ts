import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree } from '../../dpviz';

const A = [1, 5, 11, 5];
function can(a: number[]) { const s = a.reduce((x, y) => x + y, 0); if (s % 2) return false; const t = s / 2; const d = Array(t + 1).fill(false); d[0] = true; for (const x of a) for (let c = t; c >= x; c--) d[c] = d[c] || d[c - x]; return d[t]; }

function video() {
  const v = new Video('partition-equal-subset-sum', 'Partition Equal Subset Sum');
  const S = A.reduce((x, y) => x + y, 0), T = S / 2;
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Can the array be split into two groups with equal sums?');
  v.eq(`total ${S} → each half must be ${T}: {11} and {1, 5, 5} → ${can(A)}`);
  v.say(`If the total is odd, it is impossible. Otherwise we only need one group summing to exactly half, ${words(T)}; the rest automatically makes the other half. So the question is: is there a subset with sum ${words(T)}?`);

  v.chapter('brute', 'Brute force: include or exclude each number', { cx: 'O(2ⁿ)', code: ['can(i, target): target == 0 → true; i == n → false', '  can(i+1, target) or can(i+1, target − nums[i])'] });
  v.clear();
  const small = [1, 5, 5];
  v.array('s', small, { label: 'small example: target 6' });
  const t = callTree<[number, number]>(v, 'rt', 'can(i, remaining)', [0, 6], {
    kids: ([i, r]) => (r === 0 || i === small.length ? [] : [[i + 1, r], ...(r >= small[i] ? [[i + 1, r - small[i]] as [number, number]] : [])]),
    key: String, text: ([i, r]) => `${i},${r}`, lines: { call: [1], base: [0] }, hold: 350, mark: ([, r]) => (r === 0 ? 'ok' : undefined),
    say: ([i, r], info) => (info.calls === 1 ? 'Each number is either in the subset or not: two branches per number.' : r === 0 ? 'Remaining zero: found a subset that hits the target.' : undefined),
  });
  v.eq(`${t.calls} calls · 2ⁿ in general`, 'bad').say('Two choices per number is exponential. But the state is only the index and the remaining target: n times half the total.');

  v.chapter('better', 'Better: memoise (i, remaining)', { cx: 'O(n · sum)', code: ['cache can(i, remaining)'] });
  v.eq('n × (sum / 2) states', 'warn').say('Caching the pair of index and remaining target gives n times the half-sum.');

  v.chapter('optimal', 'Optimal: one boolean row of reachable sums', { cx: 'O(n · sum) time, O(sum) space', code: ['dp[0] = true', 'for x in nums:', '  for c from target down to x: dp[c] |= dp[c − x]', 'return dp[target]'] });
  v.clear();
  const a = v.array('a', A, { label: 'nums' });
  const d = Array(T + 1).fill(false); d[0] = true;
  const row = v.array('dp', d.map((x) => (x ? 'T' : '·')), { label: `dp[s] = some subset sums to s (s = 0..${T})` });
  v.line(0).say('Keep a row of booleans: dp of s is true if some subset of the numbers seen so far sums to s. Initially only zero is reachable, with the empty subset.');
  A.forEach((x, k) => {
    a.clearTones().tone(k, 'active');
    const newly: number[] = [];
    for (let c = T; c >= x; c--) if (!d[c] && d[c - x]) { d[c] = true; newly.push(c); }
    row.clearTones();
    d.forEach((b, s) => { row.set(s, b ? 'T' : '·'); if (b) row.tone(s, 'done'); });
    newly.forEach((c) => { row.tone(c, 'ok'); row.tone(c - x, 'cmp'); });
    v.line(1, 2).counter(`after ${x}`).eq(`add ${x}: ${newly.length ? `new sums ${newly.sort((p, q) => p - q).join(', ')}` : 'nothing new'}`, newly.length ? 'ok' : undefined);
    if (k === 0) v.say('Number one: every reachable sum s makes s plus one reachable. Zero gives one.');
    else if (k === 1) v.say('Five: from zero and one we reach five and six. We scan the sums from high to low, so the five just added is never used twice in the same pass.');
    else if (k === 2) v.say(`Eleven: from zero we reach eleven, which is the target.`);
    else v.hold(900);
  });
  a.clearTones();
  row.tone(T, 'ok');
  v.line(3).eq(`dp[${T}] = ${d[T] ? 'true' : 'false'}`, 'ok').say(`Sum ${words(T)} is reachable, so the array can be split evenly. A bitset makes each pass a single shift-and-OR.`);
  v.answer(can(A));

  recap(v, [{ name: 'Include / exclude recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n · sum)', space: 'O(n · sum)' }, { name: 'Boolean row, backwards', time: 'O(n · sum)', space: 'O(sum)' }], 'Equal halves ⇔ a subset sums to total / 2.', ['Split into two equal groups → subset sum to half'], 'Odd total → false immediately.');
  return v.build();
}

const problem: Problem = {
  slug: 'partition-equal-subset-sum',
  statement: 'Given an integer array `nums`, return `true` if you can partition it into two subsets with equal sums.',
  examples: [{ input: 'nums = [1,5,11,5]', output: 'true' }, { input: 'nums = [1,2,3,5]', output: 'false' }],
  constraints: ['1 ≤ nums.length ≤ 200', '1 ≤ nums[i] ≤ 100'],
  hints: ['One half must sum to total / 2.', 'Subset sum with a boolean row.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Include/exclude each number toward total/2.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache (index, remaining).', time: 'O(n · sum)', space: 'O(n · sum)', bottleneck: '2D memo.' },
    { id: 'optimal', kind: 'optimal', name: 'Boolean row', idea: 'dp[c] |= dp[c − x], capacity high → low.', time: 'O(n · sum)', space: 'O(sum)' },
  ],
  takeaway: 'Partition = **subset sum to half**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'canPartition', params: ['int[]'], ret: 'boolean',
    tests: [{ args: [A], out: true }, { args: [[1, 2, 3, 5]], out: false }, { args: [[2]], out: false }, { args: [[1, 1]], out: true }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 14) }, () => r.int(1, 12))],
    ref: (a: number[]) => can(a),
  },
};

export default problem;
