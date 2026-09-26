import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const M = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
const T = 16;

function video() {
  const v = new Video('search-2d-matrix', 'Search a 2D Matrix');
  v.chapter('intro', 'The problem');
  v.grid('m', M, { label: 'each row sorted; each row starts after the previous row ends' });
  v.say(`Each row is sorted, and the first number of each row is bigger than the last number of the row before. Is ${words(T)} in the matrix? In log of m times n time.`);
  v.eq('read row by row, the whole matrix is ONE sorted list', 'ok').say('Read row after row, the matrix is simply one long sorted array that has been folded into rows.');

  v.chapter('brute', 'Brute force: scan everything', { cx: 'O(mn)', code: ['for each cell: compare'] });
  v.eq('ignores all order', 'warn');

  v.chapter('better', 'Better: find the row, then search it', { cx: 'O(log m + log n)', code: ['binary search the row whose range contains target', 'binary search inside that row'] });
  v.eq('two binary searches: also O(log(mn))', 'ok').say('Two binary searches, one over the first column to pick a row and one inside the row, also reach log time.');

  v.chapter('optimal', 'Optimal: one binary search over virtual indices', { cx: 'O(log(mn))', code: ['lo, hi = 0, m·n − 1', 'mid → row = mid / n, col = mid % n', 'compare matrix[row][col] with target as in a normal binary search'] });
  v.clear();
  const n = M[0].length;
  const flat = M.flat();
  const g = v.grid('m', M, { label: `target = ${T}` });
  const vars = v.vars('v', { lo: 0, hi: flat.length - 1, mid: '' });
  v.say(`Pretend it is one array of length m times n. Index k in that array is row k divided by n, column k mod n. Then run the ordinary binary search.`);
  let lo = 0;
  let hi = flat.length - 1;
  let found = false;
  let k = 0;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const r = Math.floor(mid / n);
    const c = mid % n;
    const x = M[r][c];
    g.clearTones();
    for (let i = 0; i < flat.length; i++) if (i < lo || i > hi) g.tone(Math.floor(i / n), i % n, 'out');
    g.tone(r, c, x === T ? 'ok' : 'cmp').ptr('mid', r, c);
    vars.set({ lo, hi, mid: `${mid} → (${r}, ${c})` });
    v.line(1, 2).eq(`mid ${mid} → (${mid} / ${n}, ${mid} % ${n}) = (${r}, ${c}) → ${x}${x === T ? ' ✓' : x < T ? ' < ' + T : ' > ' + T}`, x === T ? 'ok' : undefined);
    if (k === 0) v.say(`Mid is ${words(mid)}. ${words(mid)} divided by ${words(n)} is row ${words(r)}, remainder column ${words(c)}. That cell holds ${words(x)}.`);
    else if (x === T) v.say(`Found ${words(T)}.`);
    else v.hold(700);
    k++;
    if (x === T) { found = true; break; }
    if (x < T) lo = mid + 1;
    else hi = mid - 1;
  }
  g.noPtr();
  v.answer(found);

  recap(v, [{ name: 'Scan everything', time: 'O(mn)', space: 'O(1)' }, { name: 'Row, then column', time: 'O(log m + log n)', space: 'O(1)' }, { name: 'Virtual 1D binary search', time: 'O(log(mn))', space: 'O(1)' }], 'Index k ↔ (k / n, k % n).', ['Fully ordered matrix → treat it as a 1D array'], 'A matrix that is sorted row after row is just a folded sorted array. Unfold it with division and remainder.');
  return v.build();
}

const problem: Problem = {
  slug: 'search-a-2d-matrix',
  statement: 'You are given an `m × n` integer matrix where each row is sorted in non-decreasing order and the first integer of each row is greater than the last integer of the previous row. Given `target`, return `true` if it is in the matrix. You must write a solution in O(log(m · n)) time.',
  examples: [{ input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', output: 'true' }, { input: 'same matrix, target = 13', output: 'false' }],
  constraints: ['1 ≤ m, n ≤ 100'],
  hints: ['Row by row, the matrix is one sorted list.', 'Map index k to (k / n, k % n).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Scan everything', idea: 'Check every cell.', time: 'O(mn)', space: 'O(1)', bottleneck: 'Ignores order.' },
    { id: 'better', kind: 'better', name: 'Row, then column', idea: 'Binary search the row by its first element, then search inside it.', time: 'O(log m + log n)', space: 'O(1)' },
    { id: 'optimal', kind: 'optimal', name: 'Virtual 1D binary search', idea: 'Binary search indices 0…mn−1, reading matrix[k / n][k % n].', time: 'O(log(mn))', space: 'O(1)' },
  ],
  takeaway: 'Fully sorted matrix = **flattened array**: k → (k / n, k % n).',
  video,
  videoArgs: [M, T],
  judge: {
    type: 'fn', fn: 'searchMatrix', params: ['int[][]', 'int'], ret: 'boolean',
    tests: [{ args: [M, 3], out: true }, { args: [M, 13], out: false }, { args: [[[1]], 2], out: false }],
    gen: (r: Rng) => { const m = r.int(1, 4), n = r.int(1, 4); const flat = r.distinct(m * n, 0, 40).sort((x, y) => x - y); return [Array.from({ length: m }, (_, i) => flat.slice(i * n, i * n + n)), r.int(0, 40)]; },
    ref: (m: number[][], t: number) => m.flat().includes(t),
  },
};

export default problem;
