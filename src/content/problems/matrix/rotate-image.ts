import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const M = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
const rot = (m: number[][]) => m[0].map((_, c) => m.map((row) => row[c]).reverse());

function video() {
  const v = new Video('rotate-image', 'Rotate Image');
  v.chapter('intro', 'The problem');
  v.layout('row');
  v.grid('m', M, { label: 'before' });
  v.grid('r', rot(M), { label: 'after: rotated 90° clockwise' });
  v.say('Rotate an n by n matrix ninety degrees clockwise, in place, without allocating another matrix.');

  v.chapter('brute', 'Brute force: copy into a new matrix', { cx: 'O(n²) extra space', code: ['out[c][n − 1 − r] = m[r][c] for all r, c', 'copy out back into m'] });
  v.clear();
  const n = M.length;
  const src = v.grid('m', M, { label: 'm' });
  const dst = v.grid('out', M.map((r) => r.map(() => null as number | null)), { label: 'out (extra n × n)' });
  v.layout('row');
  v.say('Cell r, c moves to row c, column n minus one minus r. Writing into a second matrix makes that easy, but uses n squared extra memory.');
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    src.clearTones().tone(r, c, 'active');
    dst.set(c, n - 1 - r, M[r][c]).clearTones().tone(c, n - 1 - r, 'ok');
    v.line(0).eq(`(${r},${c}) → (${c},${n - 1 - r})`).hold(r === 0 && c === 0 ? 900 : 280);
  }
  src.clearTones();
  dst.clearTones();
  v.eq('correct, but not in place', 'warn');

  v.chapter('optimal', 'Optimal: transpose, then reverse each row', { cx: 'O(n²) time · O(1) space', code: ['for r: for c > r: swap m[r][c], m[c][r]   # transpose', 'for each row: reverse it'] });
  v.clear();
  const cur = M.map((r) => [...r]);
  const g = v.grid('m', cur.map((r) => [...r]), { label: 'm (in place)' });
  v.say('Split the rotation into two moves that are easy to do in place. First, transpose: flip across the main diagonal.');
  for (let r = 0; r < n; r++) for (let c = r + 1; c < n; c++) {
    [cur[r][c], cur[c][r]] = [cur[c][r], cur[r][c]];
    g.set(r, c, cur[r][c]).set(c, r, cur[c][r]).clearTones().tone(r, c, 'ok').tone(c, r, 'ok');
    v.line(0).eq(`swap (${r},${c}) ↔ (${c},${r})`).hold(600);
  }
  g.clearTones();
  v.eq('after transpose: rows are the old columns').say('Now each row holds an old column, top to bottom. A clockwise rotation needs each old column read bottom to top, so reverse every row.');
  cur.forEach((row, r) => { row.reverse(); row.forEach((x, c) => g.set(r, c, x)); g.clearTones().toneRow(r, 'ok'); v.line(1).eq(`reverse row ${r} → [${row.join(', ')}]`).hold(600); });
  g.clearTones();
  v.eq(`[[${cur.map((r) => r.join(',')).join('],[')}]]`, 'ok').say('Done: every element moved exactly where it should, using only swaps.');
  v.answer(cur);

  recap(v, [{ name: 'Copy to a new matrix', time: 'O(n²)', space: 'O(n²)' }, { name: 'Transpose + reverse rows', time: 'O(n²)', space: 'O(1)' }], 'Rotation = two in-place reflections.', ['In-place rotation → transpose + reverse'], 'A rotation is two reflections. Each reflection is a set of swaps, so it works in place.');
  return v.build();
}

const problem: Problem = {
  slug: 'rotate-image',
  statement: 'You are given an `n × n` 2D `matrix`. Rotate it by 90 degrees clockwise **in place**: do not allocate another 2D matrix.',
  examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' }, { input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' }],
  constraints: ['1 ≤ n ≤ 20', '−1000 ≤ matrix[i][j] ≤ 1000'],
  hints: ['Where does cell (r, c) end up?', 'Try a transpose followed by a reflection.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Copy to a new matrix', idea: 'out[c][n−1−r] = m[r][c]; copy back.', time: 'O(n²)', space: 'O(n²)', bottleneck: 'Extra matrix.' },
    { id: 'optimal', kind: 'optimal', name: 'Transpose + reverse rows', idea: 'Swap across the main diagonal, then reverse each row.', time: 'O(n²)', space: 'O(1)' },
  ],
  takeaway: 'Rotate clockwise = **transpose + reverse each row**.',
  video,
  videoArgs: [M],
  judge: {
    type: 'fn', fn: 'rotate', params: ['int[][]'], ret: 'void', inplace: 0,
    tests: [{ args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], out: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] }, { args: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]], out: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]] }, { args: [[[1]]], out: [[1]] }],
    gen: (r: Rng) => { const n = r.int(1, 5); return [Array.from({ length: n }, () => r.ints(n, -9, 9))]; },
    ref: (m: number[][]) => rot(m),
  },
};

export default problem;
