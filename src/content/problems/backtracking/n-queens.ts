import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const N = 4;
function nq(n: number) { const out: string[][] = []; const q: number[] = []; const cols = new Set<number>(), d1 = new Set<number>(), d2 = new Set<number>(); const go = (r: number) => { if (r === n) { out.push(q.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1))); return; } for (let c = 0; c < n; c++) { if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue; cols.add(c); d1.add(r - c); d2.add(r + c); q.push(c); go(r + 1); q.pop(); cols.delete(c); d1.delete(r - c); d2.delete(r + c); } }; go(0); return out; }

function video() {
  const v = new Video('n-queens', 'N-Queens');
  v.chapter('intro', 'The problem');
  const sol = nq(N);
  v.grid('g', sol[0].map((row) => row.split('').map((c) => (c === 'Q' ? '♛' : ''))), { label: `one solution for n = ${N}` });
  v.say(`Place ${words(N)} queens on a ${words(N)} by ${words(N)} board so that no two attack each other: no two in the same row, column or diagonal. Return every distinct board.`);
  v.eq(`n = ${N} has ${sol.length} solutions`);

  v.chapter('brute', 'Brute force: every column permutation, then check diagonals', { cx: 'O(n! · n²)', code: ['one queen per row → the columns form a permutation', 'for each permutation: check all pairs for a shared diagonal'] });
  v.eq(`${N}! = 24 boards, each checked in full`, 'warn').say('One queen per row, and all columns different, so the columns form a permutation. Trying all n factorial permutations and then checking diagonals works, but many permutations fail in the first two rows and we still build them completely.');

  v.chapter('optimal', 'Backtracking row by row with attack sets', { cx: 'O(n!) with heavy pruning', code: ['go(row):', '  if row == n: record board', '  for col in 0..n−1:', '    if col, row−col or row+col is taken: skip', '    place queen; mark col, row−col, row+col; go(row + 1)', '    remove queen; unmark'] });
  v.clear();
  const g = v.grid('g', Array.from({ length: N }, () => Array(N).fill('')), { label: 'board: ♛ queen · shaded = attacked' });
  const vars = v.vars('v', { row: 0 });
  const q: number[] = [];
  const cols = new Set<number>(), d1 = new Set<number>(), d2 = new Set<number>();
  const attacked = (r: number, c: number) => cols.has(c) || d1.has(r - c) || d2.has(r + c);
  const paint = () => {
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { g.set(r, c, q[r] === c ? '♛' : ''); g.tone(r, c, q[r] === c ? 'ok' : attacked(r, c) && r >= q.length ? 'dim' : 'none'); }
  };
  let found = 0;
  const told = { place: 0, skip: false, back: false, sol: false, diag: false };
  const go = (r: number) => {
    if (r === N) {
      found++;
      paint();
      v.line(1).counter(`solutions: ${found}`).eq(`all ${N} rows filled → record board ${found}`, 'ok');
      if (!told.sol) { v.say('Every row has a queen and none attack each other. Record this board, then keep backtracking to find the others.'); told.sol = true; } else v.hold(900);
      return;
    }
    vars.set({ row: r });
    for (let c = 0; c < N; c++) {
      if (attacked(r, c)) {
        paint(); g.tone(r, c, 'bad');
        const why = cols.has(c) ? 'column' : 'diagonal';
        v.line(3).eq(`(${r},${c}) attacked on a ${why} → skip`, 'bad');
        if (!told.skip) { v.say(`Row ${words(r)}, column ${words(c)} is attacked along a ${why}. Three sets answer that in constant time: used columns, row minus column for one diagonal direction, and row plus column for the other.`); told.skip = true; }
        else if (why === 'diagonal' && !told.diag) { v.say('Cells on the same diagonal share row minus column, or row plus column. That is why those two numbers identify a diagonal.'); told.diag = true; }
        else v.hold(350);
        continue;
      }
      cols.add(c); d1.add(r - c); d2.add(r + c); q.push(c);
      paint();
      v.line(4).eq(`place queen at (${r},${c})`, 'ok');
      if (told.place === 0) { v.say('Row zero, column zero is free. Place a queen. The shaded cells in later rows are now attacked.'); told.place++; }
      else if (told.place === 1) { v.say(`Row ${words(r)}: the first safe column is ${words(c)}.`); told.place++; }
      else v.hold(500);
      go(r + 1);
      cols.delete(c); d1.delete(r - c); d2.delete(r + c); q.pop();
      paint();
      if (found === 0 || r < N - 1) {
        v.line(5).eq(`remove queen from (${r},${c}) → try the next column`, 'warn');
        if (!told.back && found === 0) { v.say(`The rows below could not be completed. Remove this queen and try the next column in row ${words(r)}. That is the backtrack.`); told.back = true; } else v.hold(400);
      }
    }
  };
  go(0);
  paint();
  v.eq(`${found} solutions for n = ${N}`, 'ok').say(`Two boards for four queens. Pruning with the attack sets cuts most branches after one or two rows.`);
  v.answer(nq(N));

  recap(v, [{ name: 'Permutations + check', time: 'O(n! · n²)', space: 'O(n)' }, { name: 'Row-by-row with attack sets', time: 'O(n!) pruned', space: 'O(n)' }], 'One queen per row; sets for columns, r − c and r + c.', ['Place items under attack constraints → row-by-row backtracking with O(1) checks'], 'Diagonals are identified by r − c and r + c.');
  return v.build();
}

const problem: Problem = {
  slug: 'n-queens',
  statement: 'The n-queens puzzle is the problem of placing `n` queens on an `n × n` chessboard such that no two queens attack each other. Return all distinct solutions; each solution is a board where `Q` is a queen and `.` an empty square.',
  examples: [{ input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' }, { input: 'n = 1', output: '[["Q"]]' }],
  constraints: ['1 ≤ n ≤ 9'],
  hints: ['Exactly one queen per row.', 'r − c and r + c identify the two diagonals.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Permutations + check', idea: 'Try every column permutation and check diagonals.', time: 'O(n! · n²)', space: 'O(n)', bottleneck: 'No early pruning.' },
    { id: 'optimal', kind: 'optimal', name: 'Backtracking + sets', idea: 'Place row by row; skip attacked columns and diagonals in O(1).', time: 'O(n!) pruned', space: 'O(n)' },
  ],
  takeaway: 'Diagonals = **r − c** and **r + c**.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'solveNQueens', params: ['int'], ret: 'List<List<String>>', cmp: 'sorted',
    tests: [{ args: [4], out: nq(4) }, { args: [1], out: [['Q']] }, { args: [5], out: nq(5) }, { args: [6], out: nq(6) }],
    gen: (r: Rng) => [r.int(1, 7)],
    ref: (n: number) => nq(n),
  },
};

export default problem;
