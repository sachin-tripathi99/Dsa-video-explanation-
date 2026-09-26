import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const M = [[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]];
const T = 13;

function video() {
  const v = new Video('search-2d-matrix-ii', 'Search a 2D Matrix II');
  v.chapter('intro', 'The problem');
  v.grid('m', M, { label: 'rows sorted left→right, columns sorted top→bottom' });
  v.say(`Each row is sorted left to right and each column is sorted top to bottom. Is the value ${T} in the matrix?`);

  v.chapter('brute', 'Brute force: scan every cell', { cx: 'O(m · n)', code: ['for each cell: if cell == target: return true'] });
  v.eq('ignores both sort orders', 'warn').say('Scanning every cell ignores all the sorting.');

  v.chapter('better', 'Better: binary search each row', { cx: 'O(m log n)', code: ['for each row: binary search for target'] });
  v.eq('uses the row order, ignores the column order', 'ok').say('Binary searching every row uses the row order, giving m log n. But we are still ignoring the columns.');

  v.chapter('optimal', 'Optimal: staircase from the top-right corner', { cx: 'O(m + n)', code: ['r, c = 0, n − 1', 'while r < m and c >= 0:', '  if m[r][c] == target: return true', '  if m[r][c] > target: c −= 1    # whole column below is bigger', '  else: r += 1                   # whole row to the left is smaller'] });
  v.clear();
  const g = v.grid('m', M, { label: `target = ${T}` });
  let r = 0;
  let c = M[0].length - 1;
  let step = 0;
  v.say('Stand at the top-right corner. Everything to its left is smaller, and everything below it is bigger. So each comparison rules out a whole row or a whole column.');
  let found = false;
  while (r < M.length && c >= 0) {
    const x = M[r][c];
    g.ptr('here', r, c).tone(r, c, x === T ? 'ok' : 'active');
    if (x === T) { v.line(2).eq(`${x} = ${T} ✓`, 'ok').say(`Found ${T} after ${step + 1} steps.`); found = true; break; }
    if (x > T) {
      v.line(3).eq(`${x} > ${T} → column ${c} is all ≥ ${x}: discard it`, 'bad');
      for (let rr = r; rr < M.length; rr++) g.tone(rr, c, 'dim');
      if (step === 0) v.say(`${x} is bigger than ${T}. Everything below it in this column is even bigger, so the whole column is out. Move left.`);
      else v.hold(700);
      c--;
    } else {
      v.line(4).eq(`${x} < ${T} → row ${r} is all ≤ ${x}: discard it`, 'bad');
      for (let cc = 0; cc <= c; cc++) g.tone(r, cc, 'dim');
      if (step < 4) v.say(`${x} is smaller than ${T}. Everything to its left in this row is smaller still, so the row is out. Move down.`);
      else v.hold(700);
      r++;
    }
    step++;
  }
  g.noPtr();
  v.answer(found);
  v.eq(`at most m + n steps`, 'ok');

  recap(v, [
    { name: 'Scan every cell', time: 'O(mn)', space: 'O(1)' },
    { name: 'Binary search each row', time: 'O(m log n)', space: 'O(1)' },
    { name: 'Staircase from top-right', time: 'O(m + n)', space: 'O(1)' },
  ], 'From the top-right corner, each step discards a row or a column.', ['Rows and columns both sorted → staircase search'], 'Pick a starting corner where one direction increases and the other decreases. Then every step eliminates a line.');
  return v.build();
}

const problem: Problem = {
  slug: 'search-a-2d-matrix-ii',
  statement: 'Write an efficient algorithm that searches for `target` in an `m × n` integer `matrix` where each row is sorted in ascending order from left to right and each column is sorted in ascending order from top to bottom.',
  examples: [{ input: 'matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5', output: 'true' }, { input: 'same matrix, target = 20', output: 'false' }],
  constraints: ['1 ≤ m, n ≤ 300', 'rows and columns sorted ascending'],
  hints: ['Which corner has one smaller direction and one larger direction?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan every cell', idea: 'Check every element.', time: 'O(mn)', space: 'O(1)', bottleneck: 'Ignores sorting.' },
    { id: 'better', kind: 'better', name: 'Binary search each row', idea: 'Binary search in every row.', time: 'O(m log n)', space: 'O(1)' },
    { id: 'optimal', kind: 'optimal', name: 'Staircase search', idea: 'Start top-right; too big → move left; too small → move down.', time: 'O(m + n)', space: 'O(1)' },
  ],
  takeaway: 'Doubly sorted matrix → **staircase** from the top-right.',
  video,
  videoArgs: [M, T],
  judge: {
    type: 'fn', fn: 'searchMatrix', params: ['int[][]', 'int'], ret: 'boolean',
    tests: [{ args: [M, 5], out: true }, { args: [M, 20], out: false }, { args: [[[-5]], -5], out: true }],
    gen: (r: Rng) => {
      const m = r.int(1, 5), n = r.int(1, 5);
      const g = Array.from({ length: m }, () => Array(n).fill(0));
      for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) g[i][j] = Math.max(i ? g[i - 1][j] : 0, j ? g[i][j - 1] : 0) + r.int(1, 3);
      return [g, r.int(0, 20)];
    },
    ref: (m: number[][], t: number) => m.some((row) => row.includes(t)),
  },
};

export default problem;
