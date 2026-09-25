import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const N = 5;

function video() {
  const v = new Video('pascals-triangle', "Pascal's Triangle");
  v.chapter('intro', 'The problem');
  v.say("Return the first n rows of Pascal's triangle. Each row starts and ends with one, and every number inside is the sum of the two numbers above it.");

  v.chapter('brute', 'Brute force: compute every entry from scratch', { cx: 'O(n³)', code: ['for r in 0..n-1:', '  for c in 0..r:', '    row[c] = C(r, c)   (loop of length c)'] });
  v.text('b', { title: 'Binomial coefficients', lines: ['Entry (r, c) = C(r, c) = r! / (c! (r − c)!)', 'Computing each one with its own loop: O(c) work', 'n² entries × O(n) each = O(n³), and factorials overflow fast'] });
  v.say('Every entry is a binomial coefficient, r choose c. We could compute each one independently with a loop, but that repeats work, and factorials overflow quickly.');
  v.drop('b');

  v.chapter('optimal', 'Optimal: build each row from the one above', { cx: 'O(n²)', code: ['rows = [[1]]', 'for r in 1..n-1:', '  row = [1]', '  for c in 1..r-1: row.append(prev[c-1] + prev[c])', '  row.append(1)'] });
  const grid: (number | null)[][] = Array.from({ length: N }, () => Array(N).fill(null));
  const g = v.grid('g', grid, { label: "Pascal's triangle (left-aligned)", rowHead: Array.from({ length: N }, (_, r) => `row ${r}`) });
  g.set(0, 0, 1).tone(0, 0, 'ok');
  v.line(0).say('Row zero is just one. Now build each new row from the previous one.');
  const rows: number[][] = [[1]];
  for (let r = 1; r < N; r++) {
    const prev = rows[r - 1];
    const row = [1];
    g.clearTones(['ok']).set(r, 0, 1).tone(r, 0, 'ok');
    for (let c = 1; c < r; c++) {
      row.push(prev[c - 1] + prev[c]);
      g.set(r, c, row[c]).tone(r, c, 'active').tone(r - 1, c - 1, 'cmp').tone(r - 1, c, 'cmp');
      v.line(3).eq(`${prev[c - 1]} + ${prev[c]} = ${row[c]}`);
      if (r === 2) v.say('Row two, middle: one plus one is two, the two numbers diagonally above.');
      else v.hold(550);
      g.tone(r, c, 'ok').tone(r - 1, c - 1, 'ok').tone(r - 1, c, 'ok');
    }
    row.push(1);
    if (r > 0) g.set(r, r, 1).tone(r, r, 'ok');
    rows.push(row);
    v.line(4).hold(450);
  }
  g.clearTones();
  v.eq('each entry computed once from two neighbours', 'ok').say('Each entry is one addition. The triangle has about n squared over two entries, so this is O of n squared, the size of the output itself.');
  v.answer(rows);

  recap(v, [{ name: 'Each entry from scratch', time: 'O(n³)', space: 'O(1) extra' }, { name: 'Row from previous row', time: 'O(n²)', space: 'O(1) extra' }], 'Reusing the previous row makes each entry a single addition.', ['New value = combination of neighbours in the previous row → build row by row', 'This is a tiny dynamic programming table'], "Pascal's triangle is your first dynamic programming table: each cell comes from cells you already filled.");
  return v.build();
}

const problem: Problem = {
  slug: 'pascals-triangle',
  statement: "Given `numRows`, return the first `numRows` rows of **Pascal's triangle**. Each row starts and ends with `1`; every inner number is the sum of the two numbers directly above it.",
  examples: [{ input: 'numRows = 5', output: '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]' }, { input: 'numRows = 1', output: '[[1]]' }],
  constraints: ['1 ≤ numRows ≤ 30'],
  hints: ['Row r has r + 1 numbers.', 'row[c] = prev[c − 1] + prev[c] for the inner positions.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Binomial coefficient per entry', idea: 'Compute C(r, c) for every entry with the multiplicative formula `C = C * (r − k + 1) / k`.', time: 'O(n³)', space: 'O(1) extra', bottleneck: 'Recomputes each coefficient from scratch.' },
    { id: 'optimal', kind: 'optimal', name: 'Build from the previous row', idea: 'Start each row with 1, fill inner values with `prev[c − 1] + prev[c]`, end with 1.', time: 'O(n²)', space: 'O(1) extra (output aside)' },
  ],
  takeaway: 'Filling a table where each cell comes from **already computed neighbours** is dynamic programming in its simplest form.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'generate', params: ['int'], ret: 'List<List<Integer>>',
    tests: [{ args: [5], out: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]] }, { args: [1], out: [[1]] }],
    gen: (r) => [r.int(1, 30)],
    ref: (n: number) => { const rows = [[1]]; for (let r = 1; r < n; r++) { const p = rows[r - 1]; const row = [1]; for (let c = 1; c < r; c++) row.push(p[c - 1] + p[c]); row.push(1); rows.push(row); } return rows; },
    genCount: 8,
  },
};

export default problem;
