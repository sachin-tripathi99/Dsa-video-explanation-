import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const M = [['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']];
const M2 = [['0', '1', '1', '1', '0'], ['1', '1', '1', '1', '0'], ['0', '1', '1', '1', '1'], ['0', '1', '1', '1', '1'], ['0', '0', '1', '1', '1']];
function tbl(m: string[][]) { const R = m.length, C = m[0].length; const d = m.map((r) => r.map(() => 0)); for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (m[r][c] === '1') d[r][c] = r && c ? 1 + Math.min(d[r - 1][c], d[r][c - 1], d[r - 1][c - 1]) : 1; return d; }
function area(m: string[][]) { const s = Math.max(0, ...tbl(m).flat()); return s * s; }

function video() {
  const v = new Video('maximal-square', 'Maximal Square');
  const X = M2;
  const R = X.length, C = X[0].length;
  const d = tbl(X);
  const best = Math.max(...d.flat());
  v.chapter('intro', 'The problem');
  v.grid('g', X, { label: 'binary matrix' });
  v.say('Find the largest square made only of ones, and return its area.');
  v.eq(`largest side ${best} → area ${best * best}`);

  v.chapter('brute', 'Brute force: grow a square from every cell', { cx: 'O((m·n)²)', code: ['for each top-left cell:', '  for size = 1, 2, …: check the new row and column are all 1', '  stop at the first 0'] });
  v.eq('each cell may check a growing square', 'bad').say('Treat every cell as a top-left corner and try bigger and bigger squares, checking the new edge each time. Correct, but each cell can do a lot of work: roughly the grid size squared overall.');

  v.chapter('better', 'Better: recursion on the bottom-right corner, memoised', { cx: 'O(m·n)', code: ['side(r, c) = largest square ending at (r, c)', '= 1 + min(side(up), side(left), side(up-left)) if cell is 1'] });
  v.eq('each cell asks its three neighbours', 'warn').say('Describe a square by its bottom-right corner. Memoised recursion over that definition already gives linear time; the table below shows why the formula is right.');

  v.chapter('optimal', 'Optimal: side = 1 + min(up, left, diagonal)', { cx: 'O(m·n) time, O(n) space', code: ['if cell == 1:', '  dp[r][c] = 1 + min(dp[r−1][c], dp[r][c−1], dp[r−1][c−1])', 'else dp[r][c] = 0', 'answer = (max dp)²'] });
  v.clear();
  v.grid('in', X, { label: 'matrix' });
  const g = v.grid('dp', X.map((r) => r.map(() => '')), { label: 'dp = side of largest square ending here' });
  v.layout('row');
  v.line(0).say('Let dp of r, c be the side of the largest all-ones square whose bottom-right corner is r, c. A square of side k there needs squares of side k minus one ending at the cell above, the cell to the left, and the cell diagonally up-left. So the side is one plus the smallest of those three.');
  const cells: [number, number][] = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) cells.push([r, c]);
  let told = 0;
  fill2D(v, g, cells, {
    deps: (r, c) => (X[r][c] === '1' && r && c ? [[r - 1, c], [r, c - 1], [r - 1, c - 1]] : []),
    val: (r, c) => d[r][c], tone: (r, c) => (X[r][c] === '0' ? 'bad' : d[r][c] === best ? 'ok' : 'active'),
    line: (r, c) => (X[r][c] === '1' ? [1] : [2]),
    eq: (r, c) => (X[r][c] === '0' ? `(${r},${c}) = 0 → 0` : r && c ? `dp[${r}][${c}] = 1 + min(${d[r - 1][c]}, ${d[r][c - 1]}, ${d[r - 1][c - 1]}) = ${d[r][c]}` : `edge cell = 1`),
    say: (r, c) => {
      if (X[r][c] === '1' && r && c && d[r][c] === 2 && told === 0) { told++; return 'Here all three neighbours are at least one, so a two by two square ends here.'; }
      if (X[r][c] === '1' && r && c && Math.min(d[r - 1][c], d[r][c - 1], d[r - 1][c - 1]) === 0 && told === 1) { told++; return 'One neighbour is zero, so despite the other two, only a one by one square ends here: the smallest neighbour is the limit.'; }
      if (d[r][c] === best && best >= 3 && told === 2) { told++; return `Three neighbours of at least two: a ${words(best)} by ${words(best)} square ends here.`; }
      return undefined;
    },
    hold: 260,
  });
  v.line(3).eq(`max side = ${best} → area ${best * best}`, 'ok').say(`The largest side is ${words(best)}, so the area is ${words(best * best)}. Each cell reads three neighbours from this row and the previous one, so one row plus a saved diagonal is enough space.`);
  v.answer(area(X));

  recap(v, [{ name: 'Grow squares from each cell', time: 'O((m·n)²)', space: 'O(1)' }, { name: 'Memoised recursion', time: 'O(m·n)', space: 'O(m·n)' }, { name: 'Bottom-up, one row', time: 'O(m·n)', space: 'O(n)' }], 'Square side = 1 + min(up, left, up-left).', ['Largest square of 1s → dp on the bottom-right corner'], 'Return the area: side².');
  return v.build();
}

const problem: Problem = {
  slug: 'maximal-square',
  statement: 'Given an `m × n` binary matrix of "0" and "1" characters, find the largest square containing only 1s and return its area.',
  examples: [{ input: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', output: '4' }, { input: 'matrix = [["0","1"],["1","0"]]', output: '1' }, { input: 'matrix = [["0"]]', output: '0' }],
  constraints: ['1 ≤ m, n ≤ 300', 'matrix[i][j] is "0" or "1"'],
  hints: ['Describe a square by its bottom-right corner.', 'dp = 1 + min(up, left, up-left).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Grow from every cell', idea: 'Expand a square from each top-left corner until a 0 appears.', time: 'O((m·n)²)', space: 'O(1)', bottleneck: 'Rechecks cells for every corner.' },
    { id: 'better', kind: 'better', name: 'Memoised recursion', idea: 'side(r, c) = 1 + min of three neighbours, cached.', time: 'O(m·n)', space: 'O(m·n)', bottleneck: 'Full memo + recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Bottom-up, one row', idea: 'Roll a single row plus the diagonal value.', time: 'O(m·n)', space: 'O(n)' },
  ],
  takeaway: '**1 + min** of up, left, up-left.',
  video,
  videoArgs: [M2],
  judge: {
    type: 'fn', fn: 'maximalSquare', params: ['char[][]'], ret: 'int',
    tests: [{ args: [M], out: 4 }, { args: [[['0', '1'], ['1', '0']]], out: 1 }, { args: [[['0']]], out: 0 }, { args: [M2], out: area(M2) }],
    gen: (r: Rng) => { const R = r.int(1, 7), C = r.int(1, 7); return [Array.from({ length: R }, () => Array.from({ length: C }, () => (r.chance(0.7) ? '1' : '0')))]; },
    ref: (m: string[][]) => area(m),
  },
};

export default problem;
