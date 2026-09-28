import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const IMG = [[1, 1, 1, 0], [1, 1, 0, 0], [1, 0, 1, 1], [0, 1, 1, 1]];
const SR = 1, SC = 1, COLOR = 2;
function ff(img: number[][], sr: number, sc: number, color: number) { const g = img.map((r) => [...r]); const old = g[sr][sc]; if (old === color) return g; const go = (r: number, c: number) => { if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] !== old) return; g[r][c] = color; go(r + 1, c); go(r - 1, c); go(r, c + 1); go(r, c - 1); }; go(sr, sc); return g; }

function video() {
  const v = new Video('flood-fill', 'Flood Fill');
  v.chapter('intro', 'The problem');
  const g0 = v.grid('g', IMG, { label: `start (${SR},${SC}), new color ${COLOR}` });
  g0.tone(SR, SC, 'active');
  v.say(`Like the paint bucket in a drawing app: starting from pixel ${words(SR)}, ${words(SC)}, recolour it and every pixel connected to it, up, down, left or right, that has the same original colour.`);

  v.chapter('brute', 'Brute force: sweep the whole image until nothing changes', { cx: 'O((m·n)²)', code: ['paint the start pixel', 'repeat: for every pixel with the old colour next to a painted one: paint it', 'until a full sweep paints nothing'] });
  v.eq('each sweep may paint just one more pixel', 'bad').say('One could sweep the whole image again and again, painting any old-colour pixel that touches a painted one, until a sweep changes nothing. A long winding region needs a sweep per pixel: quadratic in the image size.');

  v.chapter('optimal', 'DFS from the start pixel', { cx: 'O(m·n)', code: ['old = image[sr][sc]; if old == color: return', 'fill(r, c):', '  if off-image or image[r][c] ≠ old: return', '  image[r][c] = color', '  fill the 4 neighbours'] });
  v.clear();
  const g = v.grid('g', IMG, { label: 'painting' });
  const img = IMG.map((r) => [...r]);
  const old = img[SR][SC];
  let told = 0;
  const go = (r: number, c: number) => {
    if (r < 0 || c < 0 || r >= img.length || c >= img[0].length || img[r][c] !== old) return;
    img[r][c] = COLOR;
    g.set(r, c, COLOR).tone(r, c, 'ok');
    v.line(3, 4).eq(`paint (${r},${c})`);
    if (told === 0) { v.say('Paint the start pixel, then spread to the four neighbours. A neighbour is painted only if it still has the old colour, which also stops us from painting a pixel twice.'); told++; } else v.hold(350);
    go(r + 1, c); go(r - 1, c); go(r, c + 1); go(r, c - 1);
  };
  go(SR, SC);
  v.eq('done: the region is recoloured', 'ok').say('The bottom-right group of ones is not connected to the start, because diagonals do not count, so it keeps its colour. One more trap: if the new colour equals the old colour, return immediately, or the check “still has the old colour” would never stop.');
  v.answer(ff(IMG, SR, SC, COLOR));

  recap(v, [{ name: 'Sweep until stable', time: 'O((m·n)²)', space: 'O(1)' }, { name: 'DFS from the start', time: 'O(m·n)', space: 'O(m·n) stack worst case' }], 'Recolour and spread to 4 neighbours with the old colour.', ['Connected region from a start cell → DFS / BFS flood'], 'The recolouring itself acts as the visited mark.');
  return v.build();
}

const problem: Problem = {
  slug: 'flood-fill',
  statement: 'You are given an image `image[m][n]`, a starting pixel `(sr, sc)` and a `color`. Perform a flood fill: recolour the starting pixel and every pixel 4-directionally connected to it with the same original colour. Return the modified image.',
  examples: [{ input: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', output: '[[2,2,2],[2,2,0],[2,0,1]]' }, { input: 'image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0', output: '[[0,0,0],[0,0,0]]' }],
  constraints: ['1 ≤ m, n ≤ 50', '0 ≤ colours < 2¹⁶'],
  hints: ['DFS from the start pixel.', 'What if the new colour equals the old one?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sweep until stable', idea: 'Repeatedly paint old-colour pixels adjacent to painted ones.', time: 'O((m·n)²)', space: 'O(1)', bottleneck: 'Many full sweeps.' },
    { id: 'optimal', kind: 'optimal', name: 'DFS', idea: 'Recolour and recurse into same-colour neighbours.', time: 'O(m·n)', space: 'O(m·n)' },
  ],
  pitfalls: ['old == color causes infinite recursion without an early return.'],
  takeaway: 'The **recolour is the visited mark**.',
  video,
  videoArgs: [IMG, SR, SC, COLOR],
  judge: {
    type: 'fn', fn: 'floodFill', params: ['int[][]', 'int', 'int', 'int'], ret: 'int[][]',
    tests: [{ args: [[[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2], out: [[2, 2, 2], [2, 2, 0], [2, 0, 1]] }, { args: [[[0, 0, 0], [0, 0, 0]], 0, 0, 0], out: [[0, 0, 0], [0, 0, 0]] }, { args: [IMG, SR, SC, COLOR], out: ff(IMG, SR, SC, COLOR) }],
    gen: (r: Rng) => { const m = r.int(1, 5), n = r.int(1, 5); const img = Array.from({ length: m }, () => r.ints(n, 0, 2)); return [img, r.int(0, m - 1), r.int(0, n - 1), r.int(0, 3)]; },
    ref: (img: number[][], sr: number, sc: number, c: number) => ff(img, sr, sc, c),
  },
};

export default problem;
