import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const G = [
  ['1', '1', '0', '0', '1'],
  ['1', '1', '0', '0', '0'],
  ['0', '0', '1', '0', '0'],
  ['0', '0', '0', '1', '1'],
];
function islands(g0: string[][]) { const g = g0.map((r) => [...r]); let n = 0; const go = (r: number, c: number) => { if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] !== '1') return; g[r][c] = '0'; go(r + 1, c); go(r - 1, c); go(r, c + 1); go(r, c - 1); }; for (let r = 0; r < g.length; r++) for (let c = 0; c < g[0].length; c++) if (g[r][c] === '1') { n++; go(r, c); } return n; }

function video() {
  const v = new Video('number-of-islands', 'Number of Islands');
  v.chapter('intro', 'The problem');
  v.grid('g', G, { label: '1 = land, 0 = water' });
  v.say('Count the islands: groups of land cells connected horizontally or vertically. Diagonal neighbours do not connect.');
  v.eq(`answer: ${islands(G)}`);

  v.chapter('brute', 'BFS with a separate visited matrix', { cx: 'O(m·n) time · O(m·n) extra', code: ['visited = m × n false', 'for each unvisited land cell: count += 1; BFS marking its island'] });
  v.eq('correct, but allocates a second grid', 'warn').say('Scanning every cell and launching a BFS from each unvisited land cell counts the islands. With a separate visited grid, it uses extra memory the size of the input.');

  v.chapter('optimal', 'DFS that sinks each island in place', { cx: 'O(m·n) time', code: ['for each cell: if it is land:', '  count += 1; sink(r, c)', 'sink(r, c): if off-grid or water: return', '  set it to water; sink the 4 neighbours'] });
  v.clear();
  const g = v.grid('g', G, { label: 'sunk cells turn to water' });
  const w = G.map((r) => [...r]);
  let n = 0, told = 0;
  const sink = (r: number, c: number) => {
    if (r < 0 || c < 0 || r >= w.length || c >= w[0].length || w[r][c] !== '1') return;
    w[r][c] = '0';
    g.set(r, c, `#${n}`).tone(r, c, 'ok');
    v.line(3).eq(`sink (${r},${c})`).hold(300);
    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);
  };
  for (let r = 0; r < w.length; r++) for (let c = 0; c < w[0].length; c++) {
    if (w[r][c] !== '1') continue;
    n++;
    g.tone(r, c, 'active');
    v.line(0, 1).counter(`islands: ${n}`).eq(`land at (${r},${c}) → island ${n}`, 'warn');
    if (told === 0) { v.say('Scan row by row. The first land cell starts island number one. Sink it: turn the whole island into water with a DFS, so its other cells are not counted again.'); told++; }
    else if (told === 1) { v.say('The scan continues past the sunk cells. The next land cell it meets must belong to a new island.'); told++; }
    else if (r === 2) v.say('The single cell in the middle is an island by itself: its only land neighbour is diagonal.');
    else v.hold(500);
    sink(r, c);
  }
  v.eq(`islands = ${n}`, 'ok').say(`${words(n)} islands. Every cell is scanned once and sunk at most once. Sinking in place reuses the grid as the visited mark, though it modifies the input; copy first if that matters.`);
  v.answer(islands(G));

  recap(v, [{ name: 'BFS + visited grid', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'DFS sinking in place', time: 'O(m·n)', space: 'O(m·n) worst-case stack' }], 'Scan; each unvisited land cell starts a new island; flood it.', ['Count connected regions → flood fill from each unvisited cell'], 'Count the starts, not the cells.');
  return v.build();
}

const problem: Problem = {
  slug: 'number-of-islands',
  statement: 'Given an `m × n` grid of `\'1\'` (land) and `\'0\'` (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.',
  examples: [{ input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' }, { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' }],
  constraints: ['1 ≤ m, n ≤ 300'],
  hints: ['Each flood fill covers exactly one island.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'BFS + visited', idea: 'BFS from each unvisited land cell with a visited grid.', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Extra grid.' },
    { id: 'optimal', kind: 'optimal', name: 'Sink in place', idea: 'DFS turning visited land into water.', time: 'O(m·n)', space: 'O(m·n) stack worst case' },
  ],
  takeaway: 'One **flood fill per island**.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'numIslands', params: ['char[][]'], ret: 'int',
    tests: [{ args: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]], out: 1 }, { args: [G], out: islands(G) }, { args: [[['0']]], out: 0 }],
    gen: (r: Rng) => { const m = r.int(1, 6), n = r.int(1, 6); return [Array.from({ length: m }, () => Array.from({ length: n }, () => (r.chance(0.5) ? '1' : '0')))]; },
    ref: (g: string[][]) => islands(g),
  },
};

export default problem;
