import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const G = [
  [0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 1, 0],
  [1, 1, 0, 0, 0],
];
function enclaves(g0: number[][]) { const g = g0.map((r) => [...r]); const m = g.length, n = g[0].length; const go = (r: number, c: number) => { if (r < 0 || c < 0 || r >= m || c >= n || g[r][c] !== 1) return; g[r][c] = 0; go(r + 1, c); go(r - 1, c); go(r, c + 1); go(r, c - 1); }; for (let r = 0; r < m; r++) { go(r, 0); go(r, n - 1); } for (let c = 0; c < n; c++) { go(0, c); go(m - 1, c); } return g.flat().filter((x) => x === 1).length; }

function video() {
  const v = new Video('number-of-enclaves', 'Number of Enclaves');
  v.chapter('intro', 'The problem');
  v.grid('g', G, { label: '1 = land' });
  v.say('A move goes to an adjacent land cell, or off the edge of the grid. Count the land cells from which you can never walk off the grid.');
  v.eq(`answer: ${enclaves(G)}`);

  v.chapter('brute', 'Brute force: search from every land cell', { cx: 'O((m·n)²)', code: ['for each land cell: BFS; if it reaches the border it can escape', 'count the ones that cannot'] });
  v.eq('a fresh search per land cell', 'warn').say('A search from every land cell, asking whether it reaches the border, repeats work for every cell of the same region.');

  v.chapter('optimal', 'Sink everything connected to the border, count what is left', { cx: 'O(m·n)', code: ['for every land cell on the border: sink its region', 'return the number of land cells remaining'] });
  v.clear();
  const g = v.grid('g', G, { label: 'sunk from the border (grey) · trapped (red)' });
  const w = G.map((r) => [...r]);
  const m = w.length, n = w[0].length;
  let told = 0;
  const go = (r: number, c: number) => {
    if (r < 0 || c < 0 || r >= m || c >= n || w[r][c] !== 1) return;
    w[r][c] = 0;
    g.tone(r, c, 'dim');
    v.line(0).eq(`(${r},${c}) can walk off → sink`);
    if (told === 0) { v.say('Same trick as Surrounded Regions. Any land connected to the border can walk off, so sink those regions, starting from border cells.'); told++; } else v.hold(350);
    go(r + 1, c); go(r - 1, c); go(r, c + 1); go(r, c - 1);
  };
  for (let r = 0; r < m; r++) { go(r, 0); go(r, n - 1); }
  for (let c = 0; c < n; c++) { go(0, c); go(m - 1, c); }
  let cnt = 0;
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (w[r][c] === 1) { cnt++; g.tone(r, c, 'bad'); }
  v.line(1).eq(`land left = ${cnt}`, 'ok').say(`The land that survives can never reach the edge: ${words(cnt)} cells.`);
  v.answer(enclaves(G));

  recap(v, [{ name: 'Search per cell', time: 'O((m·n)²)', space: 'O(m·n)' }, { name: 'Sink from the border', time: 'O(m·n)', space: 'O(m·n)' }], 'Sink border-connected land; count the rest.', ['Cells that cannot reach the edge → flood from the border'], 'Surrounded Regions, counted instead of flipped.');
  return v.build();
}

const problem: Problem = {
  slug: 'number-of-enclaves',
  statement: 'You are given an `m × n` binary matrix where 0 is sea and 1 is land. A move is walking to an adjacent (4-directional) land cell or off the boundary. Return the number of land cells from which you cannot walk off the boundary in any number of moves.',
  examples: [{ input: 'grid = [[0,0,0,0],[1,0,1,0],[0,1,1,0],[0,0,0,0]]', output: '3' }, { input: 'grid = [[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,0,0,0]]', output: '0' }],
  constraints: ['1 ≤ m, n ≤ 500'],
  hints: ['Which land cells can definitely walk off?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Search per cell', idea: 'BFS from each land cell to see whether it reaches the border.', time: 'O((m·n)²)', space: 'O(m·n)', bottleneck: 'Repeated searches.' },
    { id: 'optimal', kind: 'optimal', name: 'Border flood', idea: 'Sink land reachable from the border; count remaining land.', time: 'O(m·n)', space: 'O(m·n)' },
  ],
  takeaway: 'Sink from the **border**, count the rest.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'numEnclaves', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[0, 0, 0, 0], [1, 0, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]], out: 3 }, { args: [[[0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]]], out: 0 }, { args: [G], out: enclaves(G) }],
    gen: (r: Rng) => { const m = r.int(1, 6), n = r.int(1, 6); return [Array.from({ length: m }, () => r.ints(n, 0, 1))]; },
    ref: (g: number[][]) => enclaves(g),
  },
};

export default problem;
