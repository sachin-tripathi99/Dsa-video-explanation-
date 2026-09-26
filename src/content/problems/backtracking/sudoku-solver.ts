import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';

const P = [
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
const P2 = [
  ['.', '.', '9', '7', '4', '8', '.', '.', '.'],
  ['7', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '2', '.', '1', '.', '9', '.', '.', '.'],
  ['.', '.', '7', '.', '.', '.', '2', '4', '.'],
  ['.', '6', '4', '.', '1', '.', '5', '9', '.'],
  ['.', '9', '8', '.', '.', '.', '3', '.', '.'],
  ['.', '.', '.', '8', '.', '3', '.', '2', '.'],
  ['.', '.', '.', '.', '.', '.', '.', '.', '6'],
  ['.', '.', '.', '2', '7', '5', '9', '.', '.'],
];
function solve(b0: string[][]) {
  const b = b0.map((r) => [...r]);
  const ok = (r: number, c: number, d: string) => { for (let k = 0; k < 9; k++) { if (b[r][k] === d || b[k][c] === d) return false; const br = 3 * Math.floor(r / 3) + Math.floor(k / 3), bc = 3 * Math.floor(c / 3) + (k % 3); if (b[br][bc] === d) return false; } return true; };
  const go = (): boolean => { for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (b[r][c] === '.') { for (let d = 1; d <= 9; d++) { const s = String(d); if (ok(r, c, s)) { b[r][c] = s; if (go()) return true; b[r][c] = '.'; } } return false; } return true; };
  go();
  return b;
}

function video() {
  const v = new Video('sudoku-solver', 'Sudoku Solver');
  v.chapter('intro', 'The problem');
  v.grid('g', P.map((r) => r.map((x) => (x === '.' ? '' : x))), { label: 'puzzle' });
  v.say('Fill the empty cells so that every row, every column and every three by three box contains the digits one to nine exactly once. The puzzle has exactly one solution; change the board in place.');

  v.chapter('brute', 'Plain backtracking: cells in order, scan to validate', { cx: 'O(9ᵐ) with 27 checks per try', code: ['find the first empty cell', 'for d in 1..9: if d not in its row, column, box (scan 27 cells):', '  place d; recurse; if solved: done', '  remove d'] });
  v.eq('fills cells left to right, rescanning to validate', 'warn').say('The straightforward way: take the first empty cell, try each digit that does not clash, recurse, and undo on failure. Each validity check scans twenty-seven cells, and cells are taken in reading order even when a later cell has only one option.');

  v.chapter('optimal', 'Bitmasks + most constrained cell first', { cx: 'far fewer branches', code: ['rows[r], cols[c], boxes[b] = bitmasks of used digits', 'pick the empty cell with the FEWEST candidates', 'for each candidate d: place; recurse; undo', 'a cell with 0 candidates → backtrack at once'] });
  v.clear();
  const cur = P.map((r) => [...r]);
  const g = v.grid('g', cur.map((r) => r.map((x) => (x === '.' ? '' : x))), { label: 'filling: green = placed by the solver' });
  const used = (r: number, c: number) => { const s = new Set<string>(); for (let k = 0; k < 9; k++) { s.add(cur[r][k]); s.add(cur[k][c]); s.add(cur[3 * Math.floor(r / 3) + Math.floor(k / 3)][3 * Math.floor(c / 3) + (k % 3)]); } return s; };
  const cands = (r: number, c: number) => { const u = used(r, c); return '123456789'.split('').filter((d) => !u.has(d)); };
  v.say('Two upgrades. First, keep a bitmask of used digits for every row, column and box, so checking a digit is one bit test instead of a scan. Second, always fill the empty cell with the fewest candidates. A cell with a single candidate is forced, and a cell with none tells us to backtrack immediately.');
  let steps = 0;
  const told = { forced: false, branch: false };
  const go = (): boolean => {
    let best: [number, number] | null = null;
    let bestC: string[] = [];
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (cur[r][c] === '.') { const cs = cands(r, c); if (!best || cs.length < bestC.length) { best = [r, c]; bestC = cs; } }
    if (!best) return true;
    const [r, c] = best;
    for (const d of bestC) {
      cur[r][c] = d;
      steps++;
      if (steps <= 14) {
        g.set(r, c, d).clearTones();
        for (let rr = 0; rr < 9; rr++) for (let cc = 0; cc < 9; cc++) if (P[rr][cc] === '.' && cur[rr][cc] !== '.') g.tone(rr, cc, 'ok');
        g.tone(r, c, 'active');
        v.line(1, 2).counter(`placed: ${steps}`).eq(`cell (${r},${c}) has ${bestC.length} candidate${bestC.length > 1 ? 's' : ''} {${bestC.join(',')}} → place ${d}`, bestC.length === 1 ? 'ok' : 'warn');
        if (bestC.length === 1 && !told.forced) { v.say(`Cell row ${words(r)}, column ${words(c)} has only one candidate, ${words(Number(d))}: its row, column and box already use every other digit. It is forced.`); told.forced = true; }
        else if (bestC.length > 1 && !told.branch) { v.say(`Now the most constrained cell has ${words(bestC.length)} candidates. Try the first one; if it leads to a dead end we come back and try the next.`); told.branch = true; }
        else v.hold(450);
      } else if (steps === 15) {
        v.eq('… the same step repeats: most constrained cell, place, recurse', 'ok').say('This continues in the same way. On this puzzle almost every step turns out to be forced, so the solver barely branches.');
      }
      if (go()) return true;
      cur[r][c] = '.';
    }
    return false;
  };
  go();
  const sol = solve(P);
  sol.forEach((row, r) => row.forEach((x, c) => { g.set(r, c, x); g.tone(r, c, P[r][c] === '.' ? 'ok' : 'none'); }));
  v.line(3).counter(`placed: ${steps}`).eq(`solved with ${steps} placements`, 'ok').say(`Solved in ${steps} placements for ${P.flat().filter((x) => x === '.').length} empty cells${steps === P.flat().filter((x) => x === '.').length ? ': not a single wrong guess' : ''}. Picking the most constrained cell first is the key heuristic; the bitmasks make each check instant.`);
  v.answer(sol);

  recap(v, [{ name: 'Plain backtracking', time: 'O(9ᵐ), scans per check', space: 'O(m)' }, { name: 'Bitmasks + most constrained cell', time: 'far fewer branches', space: 'O(1) masks' }], 'Bitmask sets for rows, columns and boxes; always fill the cell with the fewest candidates.', ['Constraint satisfaction → backtracking + fail-first ordering'], 'Fail first: attack the tightest constraint.');
  return v.build();
}

const problem: Problem = {
  slug: 'sudoku-solver',
  statement: 'Write a program to solve a Sudoku puzzle by filling the empty cells (`.`) in place. Each of the digits 1–9 must occur exactly once in each row, each column and each of the nine 3×3 sub-boxes. The input has exactly one solution.',
  examples: [{ input: 'board = the classic 9×9 puzzle shown in the video', output: 'the filled board' }],
  constraints: ['board is 9 × 9', 'exactly one solution'],
  hints: ['Backtrack over empty cells.', 'Track used digits per row, column and box.', 'Fill the most constrained cell first.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Plain backtracking', idea: 'First empty cell, digits 1–9, validate by scanning.', time: 'O(9ᵐ)', space: 'O(m)', bottleneck: 'No ordering heuristic; slow checks.' },
    { id: 'optimal', kind: 'optimal', name: 'Bitmasks + MRV', idea: 'Bitmask candidates; always branch on the cell with the fewest candidates.', time: 'exponential worst, tiny in practice', space: 'O(1)' },
  ],
  takeaway: '**Fail first**: fill the most constrained cell.',
  video,
  videoArgs: [P],
  judge: {
    type: 'fn', fn: 'solveSudoku', params: ['char[][]'], ret: 'void', inplace: 0,
    tests: [{ args: [P], out: solve(P) }, { args: [P2], out: solve(P2) }],
  },
};

export default problem;
