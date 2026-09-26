import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const B = [[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]];

function step(b: number[][]) {
  const m = b.length, n = b[0].length;
  return b.map((row, r) => row.map((x, c) => {
    let live = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) live += b[nr][nc];
    }
    return x ? (live === 2 || live === 3 ? 1 : 0) : live === 3 ? 1 : 0;
  }));
}

function video() {
  const v = new Video('game-of-life', 'Game of Life');
  v.chapter('intro', 'The rules');
  v.layout('row');
  v.grid('b', B, { label: 'now' });
  v.grid('n', step(B), { label: 'next generation' });
  v.say('Each cell is alive, one, or dead, zero. Count its eight neighbours. A live cell with two or three live neighbours survives; otherwise it dies. A dead cell with exactly three live neighbours comes alive. Every cell updates at the same moment.');
  v.eq('“at the same moment”: updates must use the OLD board', 'warn');

  v.chapter('brute', 'Straightforward: compute into a copy', { cx: 'O(mn) extra space', code: ['next = new board', 'next[r][c] = rule(count live neighbours in board)', 'copy next into board'] });
  v.eq('a second board of the same size', 'warn').say('The easy way computes the next generation into a second board, so the old values are never overwritten too early.');

  v.chapter('optimal', 'Optimal: keep both states in one number', { cx: 'O(mn) · O(1) extra', code: ['bit 0 = current state, bit 1 = next state', 'live neighbours: count (cell & 1)', 'if next state is alive: cell |= 2', 'finally: cell >>= 1 for every cell'] });
  v.clear();
  const cur = B.map((r) => [...r]);
  const g = v.grid('b', cur.map((r) => [...r]), { label: 'values 0–3: bit 0 = now, bit 1 = next' });
  const nxt = step(B);
  v.say('Each cell only stores zero or one, but an int has many bits. Keep the current state in bit zero, and write the next state into bit one. Neighbours are counted with “cell and one”, which still sees the old state.');
  for (let r = 0; r < cur.length; r++) for (let c = 0; c < cur[0].length; c++) {
    if (nxt[r][c]) { cur[r][c] |= 2; g.set(r, c, cur[r][c]); }
    g.clearTones().tone(r, c, nxt[r][c] ? 'ok' : 'cmp');
    v.line(1, 2).eq(`(${r},${c}): now ${B[r][c]}, next ${nxt[r][c]} → stored ${cur[r][c]}`).hold(r === 0 && c === 1 ? 900 : 300);
  }
  g.clearTones();
  v.eq('0 dead→dead · 1 alive→dead · 2 dead→alive · 3 alive→alive').say('The values are now between zero and three. Two means dead now, alive next. Three means alive now and next.');
  for (let r = 0; r < cur.length; r++) for (let c = 0; c < cur[0].length; c++) { cur[r][c] >>= 1; g.set(r, c, cur[r][c]); }
  v.line(3).eq('shift right by 1 → only the next state remains', 'ok').say('A final pass shifts every value right by one bit, keeping only the next state. No second board needed.');
  v.answer(cur);

  recap(v, [{ name: 'Copy board', time: 'O(mn)', space: 'O(mn)' }, { name: 'Two states in two bits', time: 'O(mn)', space: 'O(1)' }], 'Simultaneous updates in place → encode old and new together.', ['“Update all at once” in place → keep old and new state in one cell'], 'When every cell must update at once, store old and new states together and finish with one decoding pass.');
  return v.build();
}

const problem: Problem = {
  slug: 'game-of-life',
  statement: 'Given an `m × n` board where each cell is live (`1`) or dead (`0`), compute the next state **in place** using Conway’s rules (applied to all cells simultaneously, with 8 neighbours):\n\n1. A live cell with fewer than two live neighbours dies.\n2. A live cell with two or three live neighbours lives.\n3. A live cell with more than three live neighbours dies.\n4. A dead cell with exactly three live neighbours becomes live.',
  examples: [{ input: 'board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]', output: '[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]' }, { input: 'board = [[1,1],[1,0]]', output: '[[1,1],[1,1]]' }],
  constraints: ['1 ≤ m, n ≤ 25', 'board[i][j] is 0 or 1'],
  hints: ['Updating a cell too early corrupts its neighbours’ counts.', 'An int can hold more than one bit of information.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Copy board', idea: 'Compute the next generation into a new board, then copy it back.', time: 'O(mn)', space: 'O(mn)', bottleneck: 'Second board.' },
    { id: 'optimal', kind: 'optimal', name: 'Two states in two bits', idea: 'Count neighbours with `& 1`; set bit 1 for next-alive cells; shift every cell right at the end.', time: 'O(mn)', space: 'O(1)' },
  ],
  takeaway: 'Simultaneous in-place updates → **encode old and new state together**.',
  video,
  videoArgs: [B],
  judge: {
    type: 'fn', fn: 'gameOfLife', params: ['int[][]'], ret: 'void', inplace: 0,
    tests: [{ args: [[[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]]], out: [[0, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]] }, { args: [[[1, 1], [1, 0]]], out: [[1, 1], [1, 1]] }],
    gen: (r: Rng) => { const m = r.int(1, 5), n = r.int(1, 5); return [Array.from({ length: m }, () => r.ints(n, 0, 1))]; },
    ref: (b: number[][]) => step(b),
  },
};

export default problem;
