import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const B = [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']];
const W = 'ABCCED';
function exist(b: string[][], w: string) { const R = b.length, C = b[0].length; const seen = b.map((r) => r.map(() => false)); const go = (r: number, c: number, k: number): boolean => { if (r < 0 || c < 0 || r >= R || c >= C || seen[r][c] || b[r][c] !== w[k]) return false; if (k === w.length - 1) return true; seen[r][c] = true; const ok = go(r + 1, c, k + 1) || go(r - 1, c, k + 1) || go(r, c + 1, k + 1) || go(r, c - 1, k + 1); seen[r][c] = false; return ok; }; for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (go(r, c, 0)) return true; return false; }

function video() {
  const v = new Video('word-search', 'Word Search');
  v.chapter('intro', 'The problem');
  v.grid('g', B, { label: `board, word = "${W}"` });
  v.say(`Can the word be spelled by walking between horizontally or vertically adjacent cells, using each cell at most once?`);
  v.eq(`"${W}" → ${exist(B, W)} · "ABCB" → ${exist(B, 'ABCB')}`);

  v.chapter('brute', 'Brute force: build whole paths, compare at the end', { cx: 'O(m · n · 4ᴸ)', code: ['from every cell, walk every path of length L', 'compare the collected letters with the word'] });
  v.eq('never stops early on a wrong letter', 'bad').say('Walking every path of the word’s length and only comparing at the end explores up to four to the L paths from every cell, even when the very first letter is wrong.');

  v.chapter('optimal', 'Backtracking: DFS that stops at the first mismatch', { cx: 'O(m · n · 3ᴸ)', code: ['dfs(r, c, k):', '  if off-board or cell ≠ word[k]: false', '  if k == L − 1: true', '  mark cell; try 4 neighbours with k + 1', '  unmark cell   # backtrack'] });
  v.clear();
  const g = v.grid('g', B, { label: `board, word = "${W}"` });
  const R = B.length, C = B[0].length;
  const used = B.map((r) => r.map(() => false));
  const path: [number, number][] = [];
  const told = { start: false, bad: false, back: false };
  const paint = () => { g.clearTones(); path.forEach(([r, c], i) => g.tone(r, c, i === path.length - 1 ? 'active' : 'path')); };
  let steps = 0;
  const dfs = (r: number, c: number, k: number): boolean => {
    if (r < 0 || c < 0 || r >= R || c >= C || used[r][c]) return false;
    steps++;
    if (B[r][c] !== W[k]) {
      paint(); g.tone(r, c, 'bad');
      v.line(1).counter(`matched ${k}/${W.length}`).eq(`(${r},${c}) = ${B[r][c]} ≠ ${W[k]} → stop`, 'bad');
      if (!told.bad && k > 0) { v.say(`The next letter should be ${W[k]}, but this neighbour holds ${B[r][c]}. Stop right here: no path through it can work.`); told.bad = true; } else v.hold(400);
      return false;
    }
    path.push([r, c]); used[r][c] = true; paint();
    v.line(3).counter(`matched ${k + 1}/${W.length}`).eq(`(${r},${c}) = ${W[k]} ✓ → "${W.slice(0, k + 1)}"`, 'ok');
    if (!told.start) { v.say(`Start from each cell that holds ${W[0]}. The top-left cell matches the first letter. Mark it as used and look at its neighbours for ${W[1]}.`); told.start = true; } else v.hold(550);
    if (k === W.length - 1) return true;
    const ok = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
    if (!ok) {
      path.pop(); used[r][c] = false; paint();
      v.line(4).eq(`dead end at (${r},${c}) → unmark and back up`, 'warn');
      if (!told.back) { v.say('Every neighbour failed. Unmark this cell, so other paths may use it, and back up one letter.'); told.back = true; } else v.hold(500);
    }
    return ok;
  };
  let found = false;
  outer: for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (B[r][c] === W[0] && dfs(r, c, 0)) { found = true; break outer; }
  g.clearTones(); path.forEach(([r, c]) => g.tone(r, c, 'ok'));
  v.line(2).eq(`found "${W}" after ${steps} cell visits`, 'ok').say(`All six letters matched along a path of distinct cells: true. Each step has at most three new directions, because we never step back onto the cell we came from, so the cost is bounded by m times n times three to the L.`);
  void found;
  v.answer(exist(B, W));

  recap(v, [{ name: 'All paths, compare at end', time: 'O(m · n · 4ᴸ)', space: 'O(L)' }, { name: 'DFS with early stop', time: 'O(m · n · 3ᴸ)', space: 'O(L)' }], 'Mark on the way down, unmark on the way back.', ['Path in a grid under constraints → DFS backtracking with a visited mark'], 'Undo the visited mark so other paths can use the cell.');
  return v.build();
}

const problem: Problem = {
  slug: 'word-search',
  statement: 'Given an `m × n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontal or vertical neighbours); the same cell may not be used more than once.',
  examples: [{ input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' }, { input: 'same board, word = "SEE"', output: 'true' }, { input: 'same board, word = "ABCB"', output: 'false' }],
  constraints: ['1 ≤ m, n ≤ 6', '1 ≤ word.length ≤ 15'],
  hints: ['DFS from every cell that matches the first letter.', 'Mark cells as used, and unmark when backtracking.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All paths', idea: 'Walk every path of length L; compare at the end.', time: 'O(m · n · 4ᴸ)', space: 'O(L)', bottleneck: 'No early pruning.' },
    { id: 'optimal', kind: 'optimal', name: 'DFS backtracking', idea: 'Stop on the first mismatch; mark/unmark cells in place.', time: 'O(m · n · 3ᴸ)', space: 'O(L)' },
  ],
  takeaway: '**Mark, explore, unmark**.',
  video,
  videoArgs: [B, W],
  judge: {
    type: 'fn', fn: 'exist', params: ['char[][]', 'String'], ret: 'boolean',
    tests: [{ args: [B, 'ABCCED'], out: true }, { args: [B, 'SEE'], out: true }, { args: [B, 'ABCB'], out: false }, { args: [[['a']], 'a'], out: true }],
    gen: (r: Rng) => { const R = r.int(1, 3), C = r.int(1, 3); const b = Array.from({ length: R }, () => Array.from({ length: C }, () => r.pick(['a', 'b', 'c']))); return [b, r.str(r.int(1, 4), 'abc')]; },
    ref: (b: string[][], w: string) => exist(b, w),
  },
};

export default problem;
