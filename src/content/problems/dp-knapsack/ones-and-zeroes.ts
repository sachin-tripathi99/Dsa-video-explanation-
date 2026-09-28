import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const STRS = ['10', '0001', '111001', '1', '0'];
const M = 5, N = 3;
const cnt = (s: string) => [[...s].filter((c) => c === '0').length, [...s].filter((c) => c === '1').length];
function most(strs: string[], m: number, n: number) { const d = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0)); for (const s of strs) { const [z, o] = cnt(s); for (let i = m; i >= z; i--) for (let j = n; j >= o; j--) d[i][j] = Math.max(d[i][j], d[i - z][j - o] + 1); } return d[m][n]; }

function video() {
  const v = new Video('ones-and-zeroes', 'Ones and Zeroes');
  v.chapter('intro', 'The problem');
  v.table('s', ['string', 'zeros', 'ones'], STRS.map((s) => [s, ...cnt(s).map(String)]));
  v.say(`Choose as many strings as possible, using at most ${words(M)} zeros and ${words(N)} ones in total.`);
  v.eq(`answer: ${most(STRS, M, N)} ("10", "0001", "1", "0")`);
  v.say('It is a knapsack with two capacities at once: a zero budget and a one budget. Each string is an item that is taken at most once, and each taken string is worth one.');

  v.chapter('brute', 'Brute force: take or skip every string', { cx: 'O(2ᵏ)', code: ['best(i, zerosLeft, onesLeft):', '  skip: best(i+1, z, o)', '  take (if it fits): 1 + best(i+1, z − zeros[i], o − ones[i])'] });
  v.eq(`2^${STRS.length} subsets`, 'bad').say('Every string is in or out: exponential.');

  v.chapter('better', 'Better: memoise (i, zeros left, ones left)', { cx: 'O(k · m · n)', code: ['cache the triple'] });
  v.eq('k × (m+1) × (n+1) states', 'warn').say('The state is three numbers: strings considered, zeros left, and ones left.');

  v.chapter('optimal', 'A 2D budget table, updated from the top corner down', { cx: 'O(k · m · n) time, O(m · n) space', code: ['dp[z][o] = most strings using ≤ z zeros and ≤ o ones', 'for each string (zs, os):', '  for z from m down to zs, o from n down to os:', '    dp[z][o] = max(dp[z][o], dp[z − zs][o − os] + 1)'] });
  v.clear();
  const d = Array.from({ length: M + 1 }, () => Array(N + 1).fill(0));
  const g = v.grid('dp', d.map((r) => [...r]), { label: 'dp[zeros][ones]' });
  g.heads([...Array(M + 1).keys()].map((z) => `${z} zeros`), [...Array(N + 1).keys()].map((o) => `${o} ones`));
  const list = v.array('l', STRS, { label: 'strings' });
  v.weight('dp', 2.6).weight('l', 0.8);
  v.line(0).say('Instead of one capacity row, keep a small grid indexed by zeros used and ones used. For each string, update the grid from the largest budgets down, so each string counts at most once.');
  STRS.forEach((s, k) => {
    const [z, o] = cnt(s);
    list.clearTones().tone(k, 'active');
    g.clearTones().noArrows();
    const changed: [number, number][] = [];
    for (let i = M; i >= z; i--) for (let j = N; j >= o; j--) if (d[i - z][j - o] + 1 > d[i][j]) { d[i][j] = d[i - z][j - o] + 1; g.set(i, j, d[i][j]).tone(i, j, 'ok'); changed.push([i, j]); }
    if (changed.length) g.arrow([changed[changed.length - 1][0] - z, changed[changed.length - 1][1] - o], changed[changed.length - 1], 'cmp');
    v.line(2, 3).counter(`string ${k + 1}/${STRS.length}`).eq(`"${s}" (${z} zeros, ${o} ones): ${changed.length} cells improve`);
    if (k === 0) v.say('The string one zero costs one zero and one one. Every budget that can afford it can now hold one string.');
    else if (k === 2) v.say('One one one zero zero one needs two zeros and four ones, more ones than we have: it changes nothing.');
    else if (k === STRS.length - 1) v.say('The last string, a single zero. The top budget of five zeros and three ones now fits four strings.');
    else v.hold(1000);
  });
  list.clearTones(); g.clearTones().noArrows().tone(M, N, 'ok');
  v.eq(`dp[${M}][${N}] = ${d[M][N]}`, 'ok').say(`Four strings fit within the budgets. Two budgets simply means two nested backward loops.`);
  v.answer(most(STRS, M, N));

  recap(v, [{ name: 'Take / skip recursion', time: 'O(2ᵏ)', space: 'O(k)' }, { name: 'Memoisation', time: 'O(k · m · n)', space: 'O(k · m · n)' }, { name: '2D budget table', time: 'O(k · m · n)', space: 'O(m · n)' }], 'Two capacities → a 2D knapsack row, both loops backwards.', ['Several budgets, each item once → multi-dimensional 0/1 knapsack'], 'Both loops go high → low.');
  return v.build();
}

const problem: Problem = {
  slug: 'ones-and-zeroes',
  statement: 'You are given an array of binary strings `strs` and two integers `m` and `n`. Return the size of the largest subset of `strs` such that there are at most `m` zeros and `n` ones in the subset.',
  examples: [{ input: 'strs = ["10","0001","111001","1","0"], m = 5, n = 3', output: '4' }, { input: 'strs = ["10","0","1"], m = 1, n = 1', output: '2' }],
  constraints: ['1 ≤ strs.length ≤ 600', '1 ≤ strs[i].length ≤ 100', '1 ≤ m, n ≤ 100'],
  hints: ['Each string is an item with two weights.', 'dp[z][o], both loops backwards.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Take or skip each string.', time: 'O(2ᵏ)', space: 'O(k)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache (i, zeros left, ones left).', time: 'O(k · m · n)', space: 'O(k · m · n)', bottleneck: '3D memo.' },
    { id: 'optimal', kind: 'optimal', name: '2D row', idea: 'dp[z][o] updated from high budgets down.', time: 'O(k · m · n)', space: 'O(m · n)' },
  ],
  takeaway: '**Two capacities**, two backward loops.',
  video,
  videoArgs: [STRS, M, N],
  judge: {
    type: 'fn', fn: 'findMaxForm', params: ['String[]', 'int', 'int'], ret: 'int',
    tests: [{ args: [STRS, M, N], out: 4 }, { args: [['10', '0', '1'], 1, 1], out: 2 }, { args: [['111'], 1, 1], out: 0 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 10) }, () => Array.from({ length: r.int(1, 4) }, () => (r.chance(0.5) ? '1' : '0')).join('')), r.int(1, 6), r.int(1, 6)],
    ref: (s: string[], m: number, n: number) => most(s, m, n),
  },
};

export default problem;
