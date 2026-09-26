import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const M = [[1, 0, 2, 1], [3, 4, 5, 2], [1, 3, 0, 5]];

function zeroes(m: number[][]) {
  const rows = new Set<number>(), cols = new Set<number>();
  m.forEach((row, r) => row.forEach((x, c) => { if (x === 0) { rows.add(r); cols.add(c); } }));
  return m.map((row, r) => row.map((x, c) => (rows.has(r) || cols.has(c) ? 0 : x)));
}

function video() {
  const v = new Video('set-matrix-zeroes', 'Set Matrix Zeroes');
  v.chapter('intro', 'The problem');
  v.layout('row');
  v.grid('m', M, { label: 'before' });
  v.grid('z', zeroes(M), { label: 'after' });
  v.say('If a cell is zero, set its entire row and its entire column to zero. Do it in place.');
  v.eq('careful: zeros you write must not trigger more zeroing', 'warn').say('The trap: if you zero rows and columns while scanning, the new zeros look like original zeros and wipe out everything. So first record which rows and columns to clear, then clear them.');

  v.chapter('brute', 'Brute force: work from a copy', { cx: 'O(mn) extra', code: ['copy = m', 'for each zero in copy: zero its row and column in m'] });
  v.eq('an extra m × n copy', 'warn').say('Reading zeros from a copy avoids the trap, at the cost of a full copy.');

  v.chapter('better', 'Better: remember zero rows and columns', { cx: 'O(m + n) extra', code: ['rows, cols = sets of rows / columns containing a zero', 'm[r][c] = 0 if r in rows or c in cols'] });
  v.clear();
  const g = v.grid('m', M.map((r) => [...r]), { label: 'mark rows and columns' });
  const rs = new Set<number>(), cs = new Set<number>();
  M.forEach((row, r) => row.forEach((x, c) => { if (x === 0) { rs.add(r); cs.add(c); g.tone(r, c, 'bad'); } }));
  v.eq(`zero rows {${[...rs].join(', ')}} · zero columns {${[...cs].join(', ')}}`).say('We only need to know which rows and which columns contain a zero. Two small sets, m plus n memory.');
  rs.forEach((r) => g.toneRow(r, 'dim'));
  cs.forEach((c) => g.toneCol(c, 'dim'));
  v.say('Then a second pass zeroes every cell whose row or column is marked. Can we store those marks without any extra memory?');

  v.chapter('optimal', 'Optimal: use the first row and column as the marks', { cx: 'O(1) extra', code: ['rowFlag = 0 in row 0; colFlag = 0 in col 0', 'inner zero at (r,c): m[r][0] = m[0][c] = 0', 'inner cell: zero if m[r][0] or m[0][c] is 0', 'last: clear row 0 / col 0 by the flags'] });
  v.clear();
  const cur = M.map((r) => [...r]);
  const R = cur.length;
  const C = cur[0].length;
  const o = v.grid('m', cur.map((r) => [...r]), { label: 'row 0 and column 0 double as flags' });
  const firstRow = cur[0].some((x) => x === 0);
  const firstCol = cur.some((row) => row[0] === 0);
  v.vars('f', { firstRowZero: String(firstRow), firstColZero: String(firstCol) });
  o.toneRow(0, 'cmp').toneCol(0, 'cmp');
  v.line(0).say(`Borrow row zero and column zero to hold the marks. But they have their own original values, so first remember, in two booleans, whether row zero or column zero themselves must be cleared. Here row zero ${firstRow ? 'does' : 'does not'} contain a zero, and column zero ${firstCol ? 'does' : 'does not'}.`);
  for (let r = 1; r < R; r++) for (let c = 1; c < C; c++) if (cur[r][c] === 0) { cur[r][0] = 0; cur[0][c] = 0; o.set(r, 0, 0).set(0, c, 0).tone(r, 0, 'bad').tone(0, c, 'bad'); v.line(1).hold(600); }
  v.line(1).eq('inner zeros copied their marks into row 0 / column 0').say('Scan the inner cells. Each zero writes a mark into the first cell of its row and the first cell of its column.');
  o.clearTones();
  for (let r = 1; r < R; r++) for (let c = 1; c < C; c++) {
    if (cur[r][0] === 0 || cur[0][c] === 0) { cur[r][c] = 0; o.set(r, c, 0).tone(r, c, 'bad'); }
  }
  v.line(2).eq('inner cells cleared from the marks').say('Now clear every inner cell whose row mark or column mark is zero.');
  if (firstRow) for (let c = 0; c < C; c++) { cur[0][c] = 0; o.set(0, c, 0).tone(0, c, 'bad'); }
  if (firstCol) for (let r = 0; r < R; r++) { cur[r][0] = 0; o.set(r, 0, 0).tone(r, 0, 'bad'); }
  v.line(3).eq(`[[${cur.map((r) => r.join(',')).join('],[')}]]`, 'ok').say('Last, use the two booleans to clear row zero and column zero themselves. They must be handled last, because they held the marks.');
  v.answer(cur);

  recap(v, [
    { name: 'Copy the matrix', time: 'O(mn)', space: 'O(mn)' },
    { name: 'Row and column sets', time: 'O(mn)', space: 'O(m + n)' },
    { name: 'First row/column as flags', time: 'O(mn)', space: 'O(1)' },
  ], 'Record first, modify second; borrow the matrix to hold the record.', ['O(1) space on a matrix → store flags inside it'], 'Separate the “find” pass from the “write” pass, and borrow part of the matrix as storage.');
  return v.build();
}

const problem: Problem = {
  slug: 'set-matrix-zeroes',
  statement: 'Given an `m × n` integer `matrix`, if an element is `0`, set its entire row and column to `0`s. Do it **in place**.',
  examples: [{ input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', output: '[[1,0,1],[0,0,0],[1,0,1]]' }, { input: 'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', output: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]' }],
  constraints: ['1 ≤ m, n ≤ 200', '−2³¹ ≤ matrix[i][j] ≤ 2³¹ − 1'],
  hints: ['Do not zero while scanning; record first.', 'Can the first row and column store the record?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Copy the matrix', idea: 'Find zeros in a copy; clear rows and columns in the original.', time: 'O(mn)', space: 'O(mn)', bottleneck: 'Full copy.' },
    { id: 'better', kind: 'better', name: 'Row and column sets', idea: 'Record rows and columns containing zeros, then clear.', time: 'O(mn)', space: 'O(m + n)' },
    { id: 'optimal', kind: 'optimal', name: 'First row/column as flags', idea: 'Two booleans for row 0 / column 0; inner zeros mark m[r][0] and m[0][c]; clear inner cells, then row 0 and column 0.', time: 'O(mn)', space: 'O(1)' },
  ],
  pitfalls: ['Clearing row 0 / column 0 before using their marks destroys the information.'],
  takeaway: 'Record, then write: **the matrix can store its own flags**.',
  video,
  videoArgs: [M],
  judge: {
    type: 'fn', fn: 'setZeroes', params: ['int[][]'], ret: 'void', inplace: 0,
    tests: [{ args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], out: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] }, { args: [[[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]], out: [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]] }],
    gen: (r: Rng) => { const m = r.int(1, 5), n = r.int(1, 5); return [Array.from({ length: m }, () => r.ints(n, 0, 4))]; },
    ref: (m: number[][]) => zeroes(m),
  },
};

export default problem;
