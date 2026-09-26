import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const C = [[10, 20], [30, 200], [400, 50], [30, 20]];
function tcs(c: number[][]) { const s = [...c].sort((a, b) => a[0] - a[1] - (b[0] - b[1])); const n = c.length / 2; return s.reduce((t, x, i) => t + (i < n ? x[0] : x[1]), 0); }

function video() {
  const v = new Video('two-city-scheduling', 'Two City Scheduling');
  v.chapter('intro', 'The problem');
  v.table('t', ['person', 'cost to A', 'cost to B'], C.map((c, i) => [String(i), String(c[0]), String(c[1])]));
  v.say(`${words(C.length)} people must be flown for interviews: exactly half to city A and half to city B. Each person has a cost for each city. Minimise the total cost.`);
  v.eq(`answer: ${tcs(C)}`);

  v.chapter('brute', 'Brute force: DP over people and A-slots used', { cx: 'O(n²)', code: ['dp[i][a] = min cost for the first i people with a of them sent to A', 'dp[i][a] = min(dp[i−1][a−1] + A_i, dp[i−1][a] + B_i)'] });
  v.eq('2n × n states', 'warn').say('A dynamic program over people and how many were sent to A works in n squared. But there is a neat greedy.');

  v.chapter('insight', 'Think in terms of savings');
  v.clear();
  v.text('t', { title: 'Send everyone to B, then switch half to A', lines: ['Start with everyone flying to B', 'Switching person i to A changes the cost by A_i − B_i', 'Pick the n people with the smallest (most negative) A_i − B_i'], shown: 3 });
  v.say('Imagine everyone flies to B first. Switching a person to A changes the total by their A cost minus their B cost. We must switch exactly half of them, so pick the half with the smallest differences: the people who save the most, or lose the least, by going to A.');

  v.chapter('optimal', 'Optimal: sort by A − B', { cx: 'O(n log n)', code: ['sort people by cost[A] − cost[B]', 'first half → A, second half → B'] });
  v.clear();
  const idx = C.map((_, i) => i).sort((a, b) => C[a][0] - C[a][1] - (C[b][0] - C[b][1]));
  const t = v.table('t', ['person', 'A', 'B', 'A − B', 'goes to'], idx.map((i) => [String(i), String(C[i][0]), String(C[i][1]), String(C[i][0] - C[i][1]), '']), { label: 'sorted by A − B' });
  v.line(0).say('Sort by A minus B. The most negative differences come first: those people are much cheaper in A.');
  const half = C.length / 2;
  let total = 0;
  idx.forEach((i, r) => {
    const toA = r < half;
    total += toA ? C[i][0] : C[i][1];
    t.setCell(r, 4, toA ? 'A' : 'B').tone(r, toA ? 'ok' : 'cmp');
    v.line(1).counter(`total: ${total}`).eq(`person ${i} → ${toA ? 'A' : 'B'} (+${toA ? C[i][0] : C[i][1]})`).hold(700);
  });
  v.eq(`total = ${total}`, 'ok').say(`The first half go to A and the rest to B, for a total of ${words(total)}. One sort, n log n.`);
  v.answer(tcs(C));

  recap(v, [{ name: 'DP', time: 'O(n²)', space: 'O(n²)' }, { name: 'Sort by A − B', time: 'O(n log n)', space: 'O(1)' }], 'Sort by the difference; cheapest-to-switch half goes to A.', ['Assign each item to one of two options with a quota → sort by the difference'], 'Compare options by what you gain or lose from switching.');
  return v.build();
}

const problem: Problem = {
  slug: 'two-city-scheduling',
  statement: 'A company plans to interview `2n` people. `costs[i] = [aCostᵢ, bCostᵢ]`. Return the minimum cost to fly every person to a city such that exactly `n` people arrive in each city.',
  examples: [{ input: 'costs = [[10,20],[30,200],[400,50],[30,20]]', output: '110' }],
  constraints: ['2 ≤ costs.length ≤ 100 (even)', '1 ≤ costs ≤ 1000'],
  hints: ['What does it cost to move one person from B to A?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DP', idea: 'dp over people and number sent to A.', time: 'O(n²)', space: 'O(n²)', bottleneck: 'Quadratic.' },
    { id: 'optimal', kind: 'optimal', name: 'Sort by A − B', idea: 'Smallest n differences go to A.', time: 'O(n log n)', space: 'O(1)' },
  ],
  takeaway: 'Sort by the **difference** between the two options.',
  video,
  videoArgs: [C],
  judge: {
    type: 'fn', fn: 'twoCitySchedCost', params: ['int[][]'], ret: 'int',
    tests: [{ args: [C], out: 110 }, { args: [[[259, 770], [448, 54], [926, 667], [184, 139], [840, 118], [577, 469]]], out: 1859 }],
    gen: (r: Rng) => [Array.from({ length: 2 * r.int(1, 4) }, () => [r.int(1, 50), r.int(1, 50)])],
    ref: (c: number[][]) => tcs(c),
  },
};

export default problem;
