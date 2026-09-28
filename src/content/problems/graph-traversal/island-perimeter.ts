import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const G = [[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]];
function per(g: number[][]) { let land = 0, shared = 0; for (let r = 0; r < g.length; r++) for (let c = 0; c < g[0].length; c++) if (g[r][c]) { land++; if (r + 1 < g.length && g[r + 1][c]) shared++; if (c + 1 < g[0].length && g[r][c + 1]) shared++; } return 4 * land - 2 * shared; }

function video() {
  const v = new Video('island-perimeter', 'Island Perimeter');
  v.chapter('intro', 'The problem');
  v.grid('g', G, { label: 'exactly one island, no lakes' });
  v.say('The grid contains exactly one island. Return the length of its coastline: the number of unit edges between land and water, including the grid border.');
  v.eq(`answer: ${per(G)}`);

  v.chapter('brute', 'Count exposed sides of every land cell', { cx: 'O(m·n)', code: ['for each land cell:', '  for each of its 4 sides:', '    if the neighbour is water or off-grid: perimeter += 1'] });
  v.clear();
  const g = v.grid('g', G, { label: 'badge = exposed sides' });
  let p = 0, told = 0;
  for (let r = 0; r < G.length; r++) for (let c = 0; c < G[0].length; c++) {
    if (!G[r][c]) continue;
    let e = 0;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nr = r + dr, nc = c + dc; if (nr < 0 || nc < 0 || nr >= G.length || nc >= G[0].length || !G[nr][nc]) e++; }
    p += e;
    g.set(r, c, e).tone(r, c, 'ok');
    v.line(2).counter(`perimeter: ${p}`).eq(`(${r},${c}) has ${e} exposed side${e === 1 ? '' : 's'}`);
    if (told === 0) { v.say(`Look at each land cell’s four sides. A side that faces water or the border is coastline. The top cell has ${words(e)} exposed sides.`); told++; } else v.hold(450);
  }
  v.eq(`perimeter = ${p}`, 'ok').say('This is already linear time, and no graph search is needed: a single island means we can simply count edges.');

  v.chapter('optimal', 'Count land and shared edges', { cx: 'O(m·n)', code: ['land = number of land cells', 'shared = land–land pairs (look only right and down)', 'perimeter = 4 · land − 2 · shared'] });
  v.clear();
  const g2 = v.grid('g', G, { label: 'shared edges hide two sides each' });
  let land = 0, shared = 0;
  for (let r = 0; r < G.length; r++) for (let c = 0; c < G[0].length; c++) if (G[r][c]) {
    land++; g2.tone(r, c, 'cmp');
    if (r + 1 < G.length && G[r + 1][c]) { shared++; g2.arrow([r, c], [r + 1, c], 'ok'); }
    if (c + 1 < G[0].length && G[r][c + 1]) { shared++; g2.arrow([r, c], [r, c + 1], 'ok'); }
  }
  v.line(0, 1).eq(`land = ${land}, shared = ${shared}`).say(`Another way to count: every land cell brings four sides, and every edge shared by two land cells hides one side of each. There are ${words(land)} land cells and ${words(shared)} shared edges; looking only right and down counts each shared edge once.`);
  v.line(2).eq(`4 · ${land} − 2 · ${shared} = ${per(G)}`, 'ok').say(`Four times ${words(land)} minus two times ${words(shared)} is ${words(per(G))}. Same linear time, with a neat formula.`);
  v.answer(per(G));

  recap(v, [{ name: 'Exposed sides per cell', time: 'O(m·n)', space: 'O(1)' }, { name: '4·land − 2·shared', time: 'O(m·n)', space: 'O(1)' }], 'Every shared edge removes two sides.', ['Grid geometry → count cells and adjacencies, no search needed'], 'Not every grid problem needs DFS.');
  return v.build();
}

const problem: Problem = {
  slug: 'island-perimeter',
  statement: 'You are given a `row × col` grid where 1 is land and 0 is water. The grid contains exactly one island (no lakes). Cells connect horizontally and vertically. Return the perimeter of the island.',
  examples: [{ input: 'grid = [[0,1,0,0],[1,1,1,0],[0,1,0,0],[1,1,0,0]]', output: '16' }, { input: 'grid = [[1]]', output: '4' }, { input: 'grid = [[1,0]]', output: '4' }],
  constraints: ['1 ≤ rows, cols ≤ 100', 'exactly one island'],
  hints: ['Each land cell has 4 sides; shared sides are not coastline.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Exposed sides', idea: 'For each land cell, count sides facing water or the border.', time: 'O(m·n)', space: 'O(1)' },
    { id: 'optimal', kind: 'optimal', name: 'Formula', idea: '4 · land − 2 · shared, counting right/down neighbours.', time: 'O(m·n)', space: 'O(1)' },
  ],
  takeaway: '**4·land − 2·shared**.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'islandPerimeter', params: ['int[][]'], ret: 'int',
    tests: [{ args: [G], out: 16 }, { args: [[[1]]], out: 4 }, { args: [[[1, 0]]], out: 4 }],
    gen: (r: Rng) => { const m = r.int(1, 6), n = r.int(1, 6); const g = Array.from({ length: m }, () => Array(n).fill(0)); let cr = r.int(0, m - 1), cc = r.int(0, n - 1); for (let k = 0; k < r.int(1, 10); k++) { g[cr][cc] = 1; const [dr, dc] = r.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]); cr = Math.min(m - 1, Math.max(0, cr + dr)); cc = Math.min(n - 1, Math.max(0, cc + dc)); } return [g]; },
    ref: (g: number[][]) => per(g),
  },
};

export default problem;
