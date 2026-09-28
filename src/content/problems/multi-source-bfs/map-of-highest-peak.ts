import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { ringBfs } from '../../gridbfs';

const W = [[0, 0, 1, 0], [0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]];
function peak(w: number[][]) { const m = w.length, n = w[0].length; const h: number[][] = w.map((row) => row.map((x) => (x ? 0 : -1))); let q: [number, number][] = []; w.forEach((row, r) => row.forEach((x, c) => { if (x) q.push([r, c]); })); while (q.length) { const nq: [number, number][] = []; for (const [r, c] of q) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= m || nc >= n || h[nr][nc] >= 0) continue; h[nr][nc] = h[r][c] + 1; nq.push([nr, nc]); } q = nq; } return h; }

function video() {
  const v = new Video('map-of-highest-peak', 'Map of Highest Peak');
  const m = W.length, n = W[0].length;
  v.chapter('intro', 'The problem');
  v.grid('g', W.map((r) => r.map((x) => (x ? '≈' : ''))), { label: '≈ = water (height 0)' });
  v.say('Assign a height to every cell. Water cells must have height zero, and neighbouring cells may differ by at most one. Make the highest peak as high as possible.');

  v.chapter('insight', 'Every cell’s height is capped by its distance to water');
  v.clear();
  v.text('t', { title: 'Why the answer is a distance', lines: ['Walking away from water, the height grows by at most 1 per step', 'So height(cell) ≤ distance to the nearest water', 'Setting height = that distance satisfies every rule, and reaches every cap'], shown: 3 });
  v.say('Each step away from water can raise the height by at most one, so a cell can be no higher than its distance to the nearest water. Setting every height exactly to that distance obeys all the rules and reaches every cap at once. The problem is really: distance to the nearest water, for every cell.');

  v.chapter('brute', 'BFS from every cell to its nearest water', { cx: 'O((m·n)²)', code: ['for each cell: BFS until the first water cell'] });
  v.eq('one search per cell', 'bad').say('One search per cell would be quadratic.');

  v.chapter('optimal', 'Multi-source BFS from all water', { cx: 'O(m·n)', code: ['queue = all water cells at height 0', 'ring k gets height k'] });
  v.clear();
  const g = v.grid('g', W.map((r) => r.map((x) => (x ? 0 : ''))), { label: 'heights' });
  const src: [number, number][] = [];
  W.forEach((row, r) => row.forEach((x, c) => { if (x) src.push([r, c]); }));
  v.line(0).say('Start the BFS from all water cells together. Ring k gets height k.');
  let top = 0;
  ringBfs(v, g, m, n, src, () => true, (ring) => { top = ring; return { eq: `height ${ring}` }; }, { lines: [1] });
  v.eq(`highest peak = ${top}`, 'ok').say(`The highest peak is ${words(top)}, at the cell farthest from any water. It is the same algorithm as 01 Matrix, with water as the zeros.`);
  v.answer(peak(W));

  recap(v, [{ name: 'BFS per cell', time: 'O((m·n)²)', space: 'O(m·n)' }, { name: 'Multi-source BFS from water', time: 'O(m·n)', space: 'O(m·n)' }], 'Height = distance to the nearest water.', ['“Differ by at most 1, maximise” → distances from the fixed cells'], 'Recognise a distance problem behind the story.');
  return v.build();
}

const problem: Problem = {
  slug: 'map-of-highest-peak',
  statement: 'You are given an `m × n` matrix `isWater` (1 = water, 0 = land). Assign non-negative heights so that water cells are 0 and any two adjacent cells differ by at most 1, maximising the highest height. Return the height matrix (the optimal assignment is unique).',
  examples: [{ input: 'isWater = [[0,1],[0,0]]', output: '[[1,0],[2,1]]' }, { input: 'isWater = [[0,0,1],[1,0,0],[0,0,0]]', output: '[[1,1,0],[0,1,1],[1,2,2]]' }],
  constraints: ['1 ≤ m, n ≤ 1000', 'at least one water cell'],
  hints: ['A cell cannot be higher than its distance to water.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'BFS per cell', idea: 'For each cell, BFS to the nearest water.', time: 'O((m·n)²)', space: 'O(m·n)', bottleneck: 'Repeated searches.' },
    { id: 'optimal', kind: 'optimal', name: 'Multi-source BFS', idea: 'BFS from all water; ring k is height k.', time: 'O(m·n)', space: 'O(m·n)' },
  ],
  takeaway: 'Height = **distance to water**.',
  video,
  videoArgs: [W],
  judge: {
    type: 'fn', fn: 'highestPeak', params: ['int[][]'], ret: 'int[][]',
    tests: [{ args: [[[0, 1], [0, 0]]], out: [[1, 0], [2, 1]] }, { args: [[[0, 0, 1], [1, 0, 0], [0, 0, 0]]], out: [[1, 1, 0], [0, 1, 1], [1, 2, 2]] }, { args: [W], out: peak(W) }],
    gen: (r: Rng) => { const m = r.int(1, 5), n = r.int(1, 5); const g = Array.from({ length: m }, () => Array.from({ length: n }, () => (r.chance(0.2) ? 1 : 0))); g[r.int(0, m - 1)][r.int(0, n - 1)] = 1; return [g]; },
    ref: (w: number[][]) => peak(w),
  },
};

export default problem;
