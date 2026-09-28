import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { ringBfs } from '../../gridbfs';

const G = [[1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 1], [0, 0, 0, 0]];
function far(g: number[][]) { const n = g.length; const land: [number, number][] = []; g.forEach((row, r) => row.forEach((x, c) => { if (x) land.push([r, c]); })); if (!land.length || land.length === n * n) return -1; const d: number[][] = g.map((row) => row.map((x) => (x ? 0 : -1))); let q = land; let best = 0; while (q.length) { const nq: [number, number][] = []; for (const [r, c] of q) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= n || nc >= n || d[nr][nc] >= 0) continue; d[nr][nc] = d[r][c] + 1; best = d[nr][nc]; nq.push([nr, nc]); } q = nq; } return best; }

function video() {
  const v = new Video('as-far-from-land', 'As Far from Land as Possible');
  const n = G.length;
  v.chapter('intro', 'The problem');
  v.grid('g', G, { label: '1 = land, 0 = water' });
  v.say('Find the water cell whose nearest land cell is as far away as possible, and return that distance, measured in steps up, down, left and right (Manhattan distance). If there is no land or no water, return minus one.');
  v.eq(`answer: ${far(G)}`);

  v.chapter('brute', 'Brute force: every water cell against every land cell', { cx: 'O((n²)²)', code: ['for each water cell:', '  nearest = min over all land cells of |dr| + |dc|', 'answer = max of those'] });
  v.eq('water × land pairs', 'bad').say('For every water cell, measure the distance to every land cell and keep the smallest; then take the largest over water cells. That compares every pair: n to the fourth for an n by n grid.');

  v.chapter('optimal', 'Multi-source BFS from all land: the last ring wins', { cx: 'O(n²)', code: ['queue = every land cell at distance 0', 'expand ring by ring over water', 'answer = the distance of the last ring (−1 if no land or no water)'] });
  v.clear();
  const g = v.grid('g', G.map((r) => r.map((x) => (x ? 'L' : ''))), { label: 'distance from the nearest land' });
  const land: [number, number][] = [];
  G.forEach((row, r) => row.forEach((x, c) => { if (x) land.push([r, c]); }));
  v.line(0).say('Let all land cells flood the water together. Each water cell is reached first by its nearest land. The water reached last is the one farthest from any land.');
  let last = 0;
  ringBfs(v, g, n, n, land, (r, c) => !G[r][c], (ring) => { last = ring; return { eq: `ring ${ring}` }; }, { lines: [1], show: (d) => (d === 0 ? 'L' : d) });
  v.line(2).eq(`last ring = ${last}`, 'ok').say(`The final ring is ring ${words(last)}, so the answer is ${words(last)}. Each cell is visited once.`);
  v.answer(far(G));

  recap(v, [{ name: 'All water–land pairs', time: 'O(n⁴)', space: 'O(1)' }, { name: 'Multi-source BFS from land', time: 'O(n²)', space: 'O(n²)' }], 'The last BFS ring is the farthest water.', ['Maximise the distance to the nearest source → last ring of multi-source BFS'], 'Max of min distances = how long the flood takes.');
  return v.build();
}

const problem: Problem = {
  slug: 'as-far-from-land-as-possible',
  statement: 'Given an `n × n` grid of 0 (water) and 1 (land), find a water cell such that its distance to the nearest land cell is maximised, and return that distance (Manhattan). Return -1 if there is no land or no water.',
  examples: [{ input: 'grid = [[1,0,1],[0,0,0],[1,0,1]]', output: '2' }, { input: 'grid = [[1,0,0],[0,0,0],[0,0,0]]', output: '4' }],
  constraints: ['1 ≤ n ≤ 100'],
  hints: ['Flood from all land at once.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All pairs', idea: 'For each water cell, min distance to every land cell.', time: 'O(n⁴)', space: 'O(1)', bottleneck: 'Pairs.' },
    { id: 'optimal', kind: 'optimal', name: 'Multi-source BFS', idea: 'BFS from all land; the last ring distance is the answer.', time: 'O(n²)', space: 'O(n²)' },
  ],
  takeaway: 'The **last ring** is the farthest.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'maxDistance', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[1, 0, 1], [0, 0, 0], [1, 0, 1]]], out: 2 }, { args: [[[1, 0, 0], [0, 0, 0], [0, 0, 0]]], out: 4 }, { args: [[[1, 1], [1, 1]]], out: -1 }, { args: [[[0, 0], [0, 0]]], out: -1 }, { args: [G], out: far(G) }],
    gen: (r: Rng) => { const n = r.int(1, 5); return [Array.from({ length: n }, () => Array.from({ length: n }, () => (r.chance(0.25) ? 1 : 0)))]; },
    ref: (g: number[][]) => far(g),
  },
};

export default problem;
