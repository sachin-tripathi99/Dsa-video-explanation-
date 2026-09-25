import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const B1 = [
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '.', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
];
const B2 = B1.map((r, i) => (i === 0 ? ['8', ...r.slice(1)] : [...r]));

function valid(b: string[][]) {
  const seen = new Set<string>();
  for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
    const d = b[r][c];
    if (d === '.') continue;
    const keys = [`${d} in row ${r}`, `${d} in col ${c}`, `${d} in box ${Math.floor(r / 3)}-${Math.floor(c / 3)}`];
    if (keys.some((k) => seen.has(k))) return false;
    keys.forEach((k) => seen.add(k));
  }
  return true;
}

function video() {
  const v = new Video('valid-sudoku', 'Valid Sudoku');
  v.chapter('intro', 'The problem');
  const show = (b: string[][]) => b.map((r) => r.map((x) => (x === '.' ? null : x)));
  const g = v.grid('g', show(B2), { label: 'partially filled board', cellSize: 44 });
  v.say('Check whether a partially filled Sudoku board is valid so far. Only the filled cells matter: no digit may repeat in any row, any column, or any of the nine three-by-three boxes. We do not have to solve it.');

  v.chapter('brute', 'Three separate passes', { cx: 'O(81)', code: ['for each row: set of digits, duplicate → false', 'for each column: same', 'for each 3×3 box: same'] });
  for (let c = 0; c < 9; c++) g.tone(0, c, 'active');
  v.line(0).eq('row 0: 8, 3, 7 → no repeats ✓', 'ok').say('The direct way: check every row with a set, then every column, then every box. Three passes over the board.');
  g.clearTones();
  for (let r = 0; r < 9; r++) g.tone(r, 0, 'active');
  g.tone(0, 0, 'bad').tone(3, 0, 'bad');
  v.line(1).eq('column 0: 8 appears twice ✗', 'bad').say('Column zero has eight twice. Invalid.');

  v.chapter('optimal', 'One pass with 27 sets', { cx: 'O(81)', code: ['rows[9], cols[9], boxes[9] = empty sets', 'for each filled cell (r, c, d):', '  b = (r / 3) * 3 + c / 3', '  if d in rows[r] or cols[c] or boxes[b]: false', '  add d to all three'] });
  v.clear();
  const h = v.grid('g', show(B2), { label: 'box index b = (r / 3) × 3 + c / 3', cellSize: 44 });
  const vars = v.vars('v', { r: 0, c: 0, box: 0 });
  v.say('A single pass does all three checks at once. Keep nine sets for rows, nine for columns and nine for boxes. The box of a cell is row over three, times three, plus column over three.');
  const seen = new Set<string>();
  let stop = false;
  for (let r = 0; r < 9 && !stop; r++) for (let c = 0; c < 9 && !stop; c++) {
    const d = B2[r][c];
    if (d === '.') continue;
    const bx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
    const keys = [`r${r}${d}`, `c${c}${d}`, `b${bx}${d}`];
    const clash = keys.some((k) => seen.has(k));
    h.tone(r, c, clash ? 'bad' : 'ok');
    vars.set({ r, c, box: bx, digit: d });
    if (clash) {
      h.tone(0, 0, 'bad');
      v.line(3).eq(`8 already in column 0 (and box 0) → false`, 'bad').say('At row three, column zero we meet eight again. It is already in column zero and in box zero. Return false.');
      stop = true;
      break;
    }
    keys.forEach((k) => seen.add(k));
    v.line(4).hold(r === 0 && c === 0 ? 900 : 260);
  }
  v.note('fixed 9×9 board → constant time');
  v.answer(valid(B2));
  recap(v, [{ name: 'Three passes', time: 'O(81) = O(1)', space: 'O(9)' }, { name: 'One pass, 27 sets', time: 'O(81) = O(1)', space: 'O(243) = O(1)' }], 'Both are constant for a 9×9 board; the one-pass version is cleaner. For an n×n board: O(n²).', ['Several uniqueness constraints → one set per constraint group', 'Box index = (r / 3) × 3 + c / 3'], 'Map each cell to every group it belongs to, and keep one set per group.');
  return v.build();
}

const problem: Problem = {
  slug: 'valid-sudoku',
  statement: 'Determine if a 9 × 9 Sudoku board is **valid**. Only the filled cells need to be checked: each row, each column and each of the nine 3 × 3 sub-boxes must contain the digits 1–9 **without repetition**. Empty cells are `"."`. The board does not need to be solvable.',
  examples: [{ input: 'the board in the video with board[0][0] = "5"', output: 'true' }, { input: 'the same board with board[0][0] = "8"', output: 'false', why: 'Two 8s in column 0 and in the top-left box.' }],
  constraints: ['board is 9 × 9', 'cells are digits 1–9 or "."'],
  hints: ['Check rows, columns and boxes with sets.', 'Which box does cell (r, c) belong to?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Three separate passes', idea: 'Check all rows, then all columns, then all boxes, each with a fresh set.', time: 'O(n²) = O(81)', space: 'O(n)' },
    { id: 'optimal', kind: 'optimal', name: 'One pass, 27 sets', idea: 'For each filled cell, check and insert its digit into `rows[r]`, `cols[c]` and `boxes[(r/3)*3 + c/3]`.', time: 'O(n²) = O(81)', space: 'O(n²)' },
  ],
  pitfalls: ['Wrong box index formula.', 'Treating "." as a digit.'],
  takeaway: 'Several uniqueness rules → **one set per group**, updated in a single pass.',
  video,
  videoArgs: [B2],
  judge: {
    type: 'fn', fn: 'isValidSudoku', params: ['char[][]'], ret: 'boolean',
    tests: [{ args: [B1], out: true }, { args: [B2], out: false }],
    gen: (r) => { const b = Array.from({ length: 9 }, () => Array(9).fill('.')); for (let k = r.int(3, 18); k > 0; k--) b[r.int(0, 8)][r.int(0, 8)] = String(r.int(1, 9)); return [b]; },
    ref: (b: string[][]) => valid(b),
  },
};

export default problem;
