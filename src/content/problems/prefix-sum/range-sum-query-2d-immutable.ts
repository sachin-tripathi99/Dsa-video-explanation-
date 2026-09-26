import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const M = [
  [3, 0, 1, 4, 2],
  [5, 6, 3, 2, 1],
  [1, 2, 0, 1, 5],
  [4, 1, 0, 1, 7],
  [1, 0, 3, 0, 5],
];

function video() {
  const v = new Video('range-sum-2d', 'Range Sum Query 2D - Immutable');
  v.chapter('intro', 'The problem');
  const g = v.grid('m', M, { label: 'matrix (never changes)' });
  const [r1, c1, r2, c2] = [2, 1, 4, 3];
  for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) g.tone(r, c, 'active');
  let s = 0;
  for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) s += M[r][c];
  v.say('Given a matrix once, answer many queries: the sum of the rectangle between two corners. The matrix never changes.');
  v.eq(`sumRegion(${r1}, ${c1}, ${r2}, ${c2}) = ${s}`);

  v.chapter('brute', 'Brute force: add every cell of the rectangle', { cx: 'O(rows · cols) per query', code: ['for r in r1..r2: for c in c1..c2: s += m[r][c]'] });
  v.eq('up to 40,000 cells per query', 'warn').say('Adding every cell costs the area of the rectangle per query.');

  v.chapter('better', 'Better: a prefix sum per row', { cx: 'O(rows) per query', code: ['row[r][c + 1] = row[r][c] + m[r][c]', 'query: for r in r1..r2: s += row[r][c2 + 1] − row[r][c1]'] });
  v.eq('each row becomes one subtraction', 'ok').say('One-dimensional prefix sums per row turn each row into one subtraction, so a query costs the number of rows.');

  v.chapter('optimal', 'Optimal: 2D prefix sums', { cx: 'O(1) per query', code: ['S[r+1][c+1] = m[r][c] + S[r][c+1] + S[r+1][c] − S[r][c]', 'query = S[r2+1][c2+1] − S[r1][c2+1] − S[r2+1][c1] + S[r1][c1]'] });
  v.clear().layout('row');
  const R = M.length;
  const C = M[0].length;
  const S = Array.from({ length: R + 1 }, () => Array(C + 1).fill(0));
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) S[r + 1][c + 1] = M[r][c] + S[r][c + 1] + S[r + 1][c] - S[r][c];
  v.grid('m', M, { label: 'matrix' });
  const sg = v.grid('S', S, { label: 'S[i][j] = sum of the top-left i × j block' });
  v.line(0).say('Let S of i, j be the sum of the whole block above and to the left. Build it with inclusion–exclusion: the cell, plus the block above, plus the block to the left, minus the overlap that was counted twice.');
  sg.tone(r2 + 1, c2 + 1, 'ok');
  v.line(1).eq(`S[${r2 + 1}][${c2 + 1}] = ${S[r2 + 1][c2 + 1]} (everything up to the bottom-right corner)`).say('For a query, start with the big block up to the bottom-right corner.');
  sg.tone(r1, c2 + 1, 'bad').tone(r2 + 1, c1, 'bad');
  v.eq(`− S[${r1}][${c2 + 1}] = ${S[r1][c2 + 1]} (rows above) − S[${r2 + 1}][${c1}] = ${S[r2 + 1][c1]} (columns left)`, 'bad').say('Subtract the block above the rectangle and the block to its left.');
  sg.tone(r1, c1, 'active');
  const q = S[r2 + 1][c2 + 1] - S[r1][c2 + 1] - S[r2 + 1][c1] + S[r1][c1];
  v.eq(`+ S[${r1}][${c1}] = ${S[r1][c1]} (subtracted twice) → ${q}`, 'ok').say(`The top-left corner block was subtracted twice, so add it back once. ${S[r2 + 1][c2 + 1]} minus ${S[r1][c2 + 1]} minus ${S[r2 + 1][c1]} plus ${S[r1][c1]} is ${q}. Four lookups, constant time.`);

  recap(v, [
    { name: 'Add the cells', time: 'O(R · C) per query', space: 'O(1)' },
    { name: 'Row prefix sums', time: 'O(R) per query', space: 'O(R · C)' },
    { name: '2D prefix sums', time: 'O(1) per query', space: 'O(R · C)' },
  ], 'Inclusion–exclusion: big − top − left + corner.', ['Static grid + rectangle sums → 2D prefix sums'], 'In two dimensions, prefix sums need inclusion–exclusion: add, subtract twice, add back the corner.');
  return v.build();
}

const problem: Problem = {
  slug: 'range-sum-query-2d-immutable',
  statement: 'Implement `NumMatrix`:\n\n- `NumMatrix(int[][] matrix)` initialises the object.\n- `int sumRegion(int row1, int col1, int row2, int col2)` returns the sum of the rectangle with upper-left `(row1, col1)` and lower-right `(row2, col2)`.\n\nEach `sumRegion` call must run in O(1).',
  examples: [{ input: '["NumMatrix","sumRegion","sumRegion","sumRegion"]\n[[[[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]],[2,1,4,3],[1,1,2,2],[1,2,2,4]]', output: '[null,8,11,12]' }],
  constraints: ['1 ≤ rows, cols ≤ 200', 'at most 10⁴ calls'],
  hints: ['Precompute sums of every top-left block.', 'Use inclusion–exclusion to cut out a rectangle.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Add the cells', idea: 'Loop over the rectangle.', time: 'O(R · C) per query', space: 'O(1)', bottleneck: 'Area-sized work per query.' },
    { id: 'better', kind: 'better', name: 'Row prefix sums', idea: 'One prefix array per row; a query subtracts once per row.', time: 'O(R) per query', space: 'O(R · C)' },
    { id: 'optimal', kind: 'optimal', name: '2D prefix sums', idea: 'S[i][j] = block sum; query = S[r2+1][c2+1] − S[r1][c2+1] − S[r2+1][c1] + S[r1][c1].', time: 'O(1) per query', space: 'O(R · C)' },
  ],
  takeaway: '2D prefix sums: **big − top − left + corner**.',
  video,
  judge: {
    type: 'design', cls: 'NumMatrix', ctor: ['int[][]'],
    methods: { sumRegion: { params: ['int', 'int', 'int', 'int'], ret: 'int' } },
    tests: [{ ops: ['NumMatrix', 'sumRegion', 'sumRegion', 'sumRegion'], args: [[M], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]], out: [null, 8, 11, 12] }],
    gen: (r: Rng) => {
      const R = r.int(1, 5), C = r.int(1, 5);
      const m = Array.from({ length: R }, () => r.ints(C, -5, 9));
      const ops = ['NumMatrix'];
      const args: unknown[][] = [[m]];
      for (let k = 0; k < 10; k++) { const a = r.int(0, R - 1), b = r.int(a, R - 1), c = r.int(0, C - 1), d = r.int(c, C - 1); ops.push('sumRegion'); args.push([a, c, b, d]); }
      return { ops, args };
    },
    ref: (ops, args) => { const m = args[0][0] as number[][]; return ops.map((op, i) => { if (op === 'NumMatrix') return null; const [a, c, b, d] = args[i] as number[]; let s = 0; for (let x = a; x <= b; x++) for (let y = c; y <= d; y++) s += m[x][y]; return s; }); },
  },
};

export default problem;
