import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const G = [
  [0, 1, 1, 0, 0, 1],
  [0, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 1],
  [0, 0, 0, 1, 0, 1],
];
function maxArea(g0: number[][]) { const g = g0.map((r) => [...r]); const go = (r: number, c: number): number => { if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] !== 1) return 0; g[r][c] = 0; return 1 + go(r + 1, c) + go(r - 1, c) + go(r, c + 1) + go(r, c - 1); }; let b = 0; for (let r = 0; r < g.length; r++) for (let c = 0; c < g[0].length; c++) b = Math.max(b, go(r, c)); return b; }

function video() {
  const v = new Video('max-area-of-island', 'Max Area of Island');
  v.chapter('intro', 'The problem');
  v.grid('g', G, { label: '1 = land' });
  v.say('Return the area of the largest island: the number of land cells in it. If there is no land, return zero.');
  v.eq(`answer: ${maxArea(G)}`);

  v.chapter('brute', 'Measure an island from every land cell', { cx: 'O((m·n)²)', code: ['for each land cell: BFS its island with a fresh visited set', 'best = max(best, size)'] });
  v.eq('the same island is measured once per cell it contains', 'bad').say('Measuring the island around every single land cell, with a fresh visited set each time, repeats the same island over and over.');

  v.chapter('optimal', 'DFS that returns the size and sinks as it goes', { cx: 'O(m·n)', code: ['area(r, c):', '  if off-grid or water: return 0', '  sink (r, c)', '  return 1 + area of the 4 neighbours'] });
  v.clear();
  const g = v.grid('g', G, { label: 'each island measured once' });
  const w = G.map((r) => [...r]);
  let best = 0, told = 0, id = 0;
  for (let r = 0; r < w.length; r++) for (let c = 0; c < w[0].length; c++) {
    if (w[r][c] !== 1) continue;
    id++;
    let size = 0;
    const go = (rr: number, cc: number): number => { if (rr < 0 || cc < 0 || rr >= w.length || cc >= w[0].length || w[rr][cc] !== 1) return 0; w[rr][cc] = 0; size++; g.set(rr, cc, size).tone(rr, cc, 'cmp'); v.line(2, 3).eq(`island ${id}: ${size} cell${size > 1 ? 's' : ''} so far`).hold(260); return 1 + go(rr + 1, cc) + go(rr - 1, cc) + go(rr, cc + 1) + go(rr, cc - 1); };
    const a = go(r, c);
    const nb = a > best;
    best = Math.max(best, a);
    v.counter(`best: ${best}`).eq(`island ${id} has area ${a}${nb ? ' ← best' : ''}`, nb ? 'ok' : undefined);
    if (told === 0) { v.say(`The DFS returns one for the cell itself plus whatever its neighbours return. The first island has area ${words(a)}.`); told++; }
    else if (nb) v.say(`This island has area ${words(a)}: the new largest.`);
    else v.hold(600);
    g.clearTones();
  }
  v.eq(`max area = ${best}`, 'ok').say('Every cell is visited once in total.');
  v.answer(maxArea(G));

  recap(v, [{ name: 'Re-measure per cell', time: 'O((m·n)²)', space: 'O(m·n)' }, { name: 'Sinking DFS returning size', time: 'O(m·n)', space: 'O(m·n) stack' }], 'area = 1 + area of the 4 neighbours, sinking visited land.', ['Size of connected regions → DFS that returns a count'], 'Let the recursion add up the size for you.');
  return v.build();
}

const problem: Problem = {
  slug: 'max-area-of-island',
  statement: 'You are given an `m × n` binary matrix `grid`. An island is a group of 1s connected 4-directionally. Return the maximum area of an island, or 0 if there is none.',
  examples: [{ input: 'grid = [[0,0,1,0],[0,1,1,0],[0,0,0,1]]', output: '3' }, { input: 'grid = [[0,0,0,0,0,0,0,0]]', output: '0' }],
  constraints: ['1 ≤ m, n ≤ 50'],
  hints: ['A DFS can return the number of cells it visits.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Re-measure per cell', idea: 'BFS the island around every land cell with a fresh visited set.', time: 'O((m·n)²)', space: 'O(m·n)', bottleneck: 'Repeats islands.' },
    { id: 'optimal', kind: 'optimal', name: 'Sinking DFS', idea: 'area = 1 + neighbours’ areas; sink visited cells.', time: 'O(m·n)', space: 'O(m·n) stack' },
  ],
  takeaway: 'DFS **returns the size**.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'maxAreaOfIsland', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[0, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 1]]], out: 3 }, { args: [[[0, 0, 0, 0, 0, 0, 0, 0]]], out: 0 }, { args: [G], out: maxArea(G) }],
    gen: (r: Rng) => { const m = r.int(1, 6), n = r.int(1, 6); return [Array.from({ length: m }, () => r.ints(n, 0, 1))]; },
    ref: (g: number[][]) => maxArea(g),
  },
};

export default problem;
