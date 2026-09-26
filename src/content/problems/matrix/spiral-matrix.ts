import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const M = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];

function spiral(m: number[][]) {
  const out: number[] = [];
  let top = 0, bottom = m.length - 1, left = 0, right = m[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) out.push(m[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) out.push(m[r][right]);
    right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) out.push(m[bottom][c]); bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) out.push(m[r][left]); left++; }
  }
  return out;
}

function video() {
  const v = new Video('spiral-matrix', 'Spiral Matrix');
  v.chapter('intro', 'The problem');
  v.grid('m', M, { label: '3 × 4' });
  v.say('Return all elements of the matrix in spiral order: along the top, down the right side, back along the bottom, up the left side, then inwards.');
  v.eq(`[${spiral(M).join(', ')}]`);

  v.chapter('brute', 'Simulation with a visited matrix', { cx: 'O(mn) time · O(mn) space', code: ['walk in the current direction', 'if the next cell is outside or visited: turn right', 'mark every cell visited'] });
  v.eq('extra m × n visited matrix', 'warn').say('One approach simulates a walker: keep going straight, and turn right whenever the next cell is off the grid or already visited. It works, but needs a visited matrix as large as the input.');

  v.chapter('optimal', 'Optimal: four shrinking boundaries', { cx: 'O(mn) · O(1) extra', code: ['top, bottom, left, right = 0, m−1, 0, n−1', 'top row left→right; top += 1', 'right column top→bottom; right −= 1', 'if top <= bottom: bottom row right→left; bottom −= 1', 'if left <= right: left column bottom→top; left += 1'] });
  v.clear();
  const g = v.grid('m', M, { label: 'boundaries shrink after each side' });
  const out = v.array('out', [], { label: 'output' });
  const vars = v.vars('b', { top: 0, bottom: 2, left: 0, right: 3 });
  let top = 0, bottom = M.length - 1, left = 0, right = M[0].length - 1;
  let prev: [number, number] | null = null;
  const visit = (r: number, c: number, line: number) => {
    g.tone(r, c, 'ok');
    if (prev) g.arrow(prev, [r, c]);
    prev = [r, c];
    out.push(M[r][c]);
    v.line(line).hold(330);
  };
  v.say('Instead of remembering visited cells, remember the edges of the part not yet visited: top, bottom, left and right. After walking a side, move that boundary inward.');
  let layer = 0;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) visit(top, c, 1);
    top++;
    vars.set({ top, bottom, left, right });
    if (layer === 0) v.say('Walk the top row, then move top down.');
    for (let r = top; r <= bottom; r++) visit(r, right, 2);
    right--;
    vars.set({ top, bottom, left, right });
    if (top <= bottom) { for (let c = right; c >= left; c--) visit(bottom, c, 3); bottom--; }
    vars.set({ top, bottom, left, right });
    if (left <= right) { for (let r = bottom; r >= top; r--) visit(r, left, 4); left++; }
    vars.set({ top, bottom, left, right });
    if (layer === 0) v.say('After one full lap, the boundaries have shrunk to the inner part. Repeat.');
    layer++;
  }
  v.eq(`[${spiral(M).join(', ')}]`, 'ok').say('The two if checks matter: when only one row or one column is left, they stop us from walking it twice.');
  v.answer(spiral(M));

  recap(v, [{ name: 'Simulation + visited', time: 'O(mn)', space: 'O(mn)' }, { name: 'Shrinking boundaries', time: 'O(mn)', space: 'O(1) extra' }], 'Four boundaries describe the unvisited rectangle.', ['Layer-by-layer walks → top / bottom / left / right'], 'Boundaries replace a visited matrix. Guard the last row and column with two extra checks.');
  return v.build();
}

const problem: Problem = {
  slug: 'spiral-matrix',
  statement: 'Given an `m × n` `matrix`, return all elements of the matrix in **spiral order**.',
  examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' }, { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]' }],
  constraints: ['1 ≤ m, n ≤ 10', '−100 ≤ matrix[i][j] ≤ 100'],
  hints: ['Keep track of the rectangle that is still unvisited.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Simulation + visited', idea: 'Walk straight; turn right when the next cell is outside or visited.', time: 'O(mn)', space: 'O(mn)', bottleneck: 'Visited matrix.' },
    { id: 'optimal', kind: 'optimal', name: 'Shrinking boundaries', idea: 'Walk top, right, bottom, left sides of the current rectangle; shrink after each; guard the last two sides.', time: 'O(mn)', space: 'O(1) extra' },
  ],
  pitfalls: ['Without the `top <= bottom` / `left <= right` checks, a single remaining row or column is output twice.'],
  takeaway: 'Layer walks: **top / bottom / left / right** boundaries.',
  video,
  videoArgs: [M],
  judge: {
    type: 'fn', fn: 'spiralOrder', params: ['int[][]'], ret: 'List<Integer>',
    tests: [{ args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], out: [1, 2, 3, 6, 9, 8, 7, 4, 5] }, { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], out: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] }, { args: [[[1], [2], [3]]], out: [1, 2, 3] }],
    gen: (r: Rng) => { const m = r.int(1, 5), n = r.int(1, 5); return [Array.from({ length: m }, () => r.ints(n, -9, 9))]; },
    ref: (m: number[][]) => spiral(m),
  },
};

export default problem;
