import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { ringBfs } from '../../gridbfs';

const M = [[0, 1, 1, 1], [1, 1, 1, 1], [1, 1, 0, 1], [1, 1, 1, 1]];
function upd(g: number[][]) { const m = g.length, n = g[0].length; const d: number[][] = g.map((r) => r.map((x) => (x === 0 ? 0 : -1))); let q: [number, number][] = []; g.forEach((row, r) => row.forEach((x, c) => { if (!x) q.push([r, c]); })); while (q.length) { const nq: [number, number][] = []; for (const [r, c] of q) for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= m || nc >= n || d[nr][nc] >= 0) continue; d[nr][nc] = d[r][c] + 1; nq.push([nr, nc]); } q = nq; } return d; }

function video() {
  const v = new Video('01-matrix', '01 Matrix');
  const m = M.length, n = M[0].length;
  v.chapter('intro', 'The problem');
  v.grid('g', M, { label: 'matrix' });
  v.say('For every cell, return the distance to the nearest zero, counting steps up, down, left and right. The matrix contains at least one zero.');

  v.chapter('brute', 'BFS from every 1 to its nearest 0', { cx: 'O((m·n)²)', code: ['for each cell with 1:', '  BFS until the first 0 is found'] });
  v.eq('a separate search for every cell', 'bad').say('Running a BFS from every one-cell, stopping at the first zero, repeats huge amounts of work: quadratic.');

  v.chapter('optimal', 'Multi-source BFS from all zeros', { cx: 'O(m·n)', code: ['queue = every 0 (distance 0); other cells unknown', 'pop; each unknown neighbour gets distance + 1; push'] });
  v.clear();
  const g = v.grid('g', M.map((r) => r.map((x) => (x === 0 ? 0 : ''))), { label: 'distances fill in ring by ring' });
  const zeros: [number, number][] = [];
  M.forEach((row, r) => row.forEach((x, c) => { if (!x) zeros.push([r, c]); }));
  v.line(0).say('Flip the direction: instead of every cell searching for a zero, let every zero search outwards at the same time. Put all zeros in the queue with distance zero.');
  ringBfs(v, g, m, n, zeros, () => true, (ring, cells) => ({ eq: `distance ${ring}: ${cells.length} cells`, say: ring === 1 ? 'Ring one is every cell touching a zero: distance one.' : ring === 2 ? 'Ring two: each of these cells was reached first from its nearest zero, whichever that is.' : undefined }), { lines: [1] });
  v.eq('each cell finished once · O(m·n)', 'ok').say('Every cell gets its distance the first time a wave reaches it, and is never touched again.');
  v.answer(upd(M));

  recap(v, [{ name: 'BFS per cell', time: 'O((m·n)²)', space: 'O(m·n)' }, { name: 'Multi-source BFS from zeros', time: 'O(m·n)', space: 'O(m·n)' }], 'Seed the queue with every 0.', ['Distance to the nearest X for every cell → BFS from all X at once'], 'Search from the targets, all together.');
  void words;
  return v.build();
}

const problem: Problem = {
  slug: '01-matrix',
  statement: 'Given an `m × n` binary matrix `mat`, return the distance of the nearest 0 for each cell. The distance between two adjacent cells is 1. There is at least one 0.',
  examples: [{ input: 'mat = [[0,0,0],[0,1,0],[0,0,0]]', output: '[[0,0,0],[0,1,0],[0,0,0]]' }, { input: 'mat = [[0,0,0],[0,1,0],[1,1,1]]', output: '[[0,0,0],[0,1,0],[1,2,1]]' }],
  constraints: ['1 ≤ m·n ≤ 10⁴', 'at least one 0'],
  hints: ['Start BFS from every zero at once.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'BFS per cell', idea: 'For each 1, BFS to the first 0.', time: 'O((m·n)²)', space: 'O(m·n)', bottleneck: 'Repeated searches.' },
    { id: 'optimal', kind: 'optimal', name: 'Multi-source BFS', idea: 'Queue all zeros; assign distances ring by ring.', time: 'O(m·n)', space: 'O(m·n)' },
  ],
  takeaway: 'BFS from **all zeros**.',
  video,
  videoArgs: [M],
  judge: {
    type: 'fn', fn: 'updateMatrix', params: ['int[][]'], ret: 'int[][]',
    tests: [{ args: [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], out: [[0, 0, 0], [0, 1, 0], [0, 0, 0]] }, { args: [[[0, 0, 0], [0, 1, 0], [1, 1, 1]]], out: [[0, 0, 0], [0, 1, 0], [1, 2, 1]] }, { args: [M], out: upd(M) }],
    gen: (r: Rng) => { const m = r.int(1, 5), n = r.int(1, 5); const g = Array.from({ length: m }, () => Array.from({ length: n }, () => (r.chance(0.3) ? 0 : 1))); g[r.int(0, m - 1)][r.int(0, n - 1)] = 0; return [g]; },
    ref: (g: number[][]) => upd(g),
  },
};

export default problem;
