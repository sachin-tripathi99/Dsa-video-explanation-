import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const B = [
  ['X', 'X', 'X', 'X', 'X'],
  ['X', 'O', 'O', 'X', 'X'],
  ['X', 'X', 'O', 'X', 'O'],
  ['X', 'O', 'X', 'X', 'O'],
  ['X', 'X', 'X', 'O', 'O'],
];
function solve(b0: string[][]) { const b = b0.map((r) => [...r]); const m = b.length, n = b[0].length; const go = (r: number, c: number) => { if (r < 0 || c < 0 || r >= m || c >= n || b[r][c] !== 'O') return; b[r][c] = 'S'; go(r + 1, c); go(r - 1, c); go(r, c + 1); go(r, c - 1); }; for (let r = 0; r < m; r++) { go(r, 0); go(r, n - 1); } for (let c = 0; c < n; c++) { go(0, c); go(m - 1, c); } return b.map((row) => row.map((x) => (x === 'S' ? 'O' : 'X'))); }

function video() {
  const v = new Video('surrounded-regions', 'Surrounded Regions');
  v.chapter('intro', 'The problem');
  v.grid('g', B, { label: 'board' });
  v.say('Capture every region of O cells that is completely surrounded by X: flip it to X. A region is safe if any of its cells lies on the border, because it cannot be enclosed there.');

  v.chapter('brute', 'Brute force: check every region for a way out', { cx: 'O((m·n)²)', code: ['for each O cell:', '  BFS its region; if no cell touches the border: flip the region'] });
  v.eq('each cell may re-explore its whole region', 'warn').say('Asking every O cell whether its region reaches the border, with a fresh search each time, repeats the same regions again and again.');

  v.chapter('optimal', 'Flip the question: start from the border', { cx: 'O(m·n)', code: ['for every O on the border: DFS, marking its region SAFE', 'then: O → X (captured), SAFE → O'] });
  v.clear();
  const g = v.grid('g', B, { label: 'green = safe (connected to the border)' });
  const b = B.map((r) => [...r]);
  const m = b.length, n = b[0].length;
  let told = 0;
  const go = (r: number, c: number) => {
    if (r < 0 || c < 0 || r >= m || c >= n || b[r][c] !== 'O') return;
    b[r][c] = 'S';
    g.tone(r, c, 'ok');
    v.line(0).eq(`(${r},${c}) is connected to the border → safe`);
    if (told === 0) { v.say('Instead of asking which regions are trapped, find the ones that are not. Every O on the border is safe, and so is everything connected to it. DFS from each border O and mark its region safe.'); told++; } else v.hold(350);
    go(r + 1, c); go(r - 1, c); go(r, c + 1); go(r, c - 1);
  };
  for (let r = 0; r < m; r++) { go(r, 0); go(r, n - 1); }
  for (let c = 0; c < n; c++) { go(0, c); go(m - 1, c); }
  const cap: [number, number][] = [];
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (b[r][c] === 'O') { cap.push([r, c]); g.tone(r, c, 'bad'); }
  v.eq(`${cap.length} O cells never reached from the border`, 'bad').say(`Every O that was not marked has no path to the border: it is surrounded. Here that is ${words(cap.length)} cells.`);
  cap.forEach(([r, c]) => g.set(r, c, 'X'));
  v.line(1).eq('flip them to X', 'ok').say('Flip those to X, and turn the safe marks back into O. Each cell is visited a constant number of times.');
  v.answer(solve(B));

  recap(v, [{ name: 'Search per cell', time: 'O((m·n)²)', space: 'O(m·n)' }, { name: 'Flood from the border', time: 'O(m·n)', space: 'O(m·n)' }], 'Mark what the border can reach; capture the rest.', ['Enclosed regions → flood from the border inward'], 'Solve the complement: it is easier to find what escapes.');
  return v.build();
}

const problem: Problem = {
  slug: 'surrounded-regions',
  statement: 'Given an `m × n` board of `X` and `O`, capture all regions of `O` that are 4-directionally surrounded by `X` by flipping them to `X`, in place. A region with any cell on the border is not surrounded.',
  examples: [{ input: 'board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]', output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]' }, { input: 'board = [["X"]]', output: '[["X"]]' }],
  constraints: ['1 ≤ m, n ≤ 200'],
  hints: ['Which O cells can never be captured?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Search per cell', idea: 'For each O, search its region for a border cell.', time: 'O((m·n)²)', space: 'O(m·n)', bottleneck: 'Repeated searches.' },
    { id: 'optimal', kind: 'optimal', name: 'Border flood', idea: 'DFS from border O cells marking safe; flip the rest.', time: 'O(m·n)', space: 'O(m·n)' },
  ],
  takeaway: 'Flood **from the border**.',
  video,
  videoArgs: [B],
  judge: {
    type: 'fn', fn: 'solve', params: ['char[][]'], ret: 'void', inplace: 0,
    tests: [{ args: [[['X', 'X', 'X', 'X'], ['X', 'O', 'O', 'X'], ['X', 'X', 'O', 'X'], ['X', 'O', 'X', 'X']]], out: [['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'X', 'X', 'X'], ['X', 'O', 'X', 'X']] }, { args: [[['X']]], out: [['X']] }, { args: [B], out: solve(B) }],
    gen: (r: Rng) => { const m = r.int(1, 6), n = r.int(1, 6); return [Array.from({ length: m }, () => Array.from({ length: n }, () => (r.chance(0.45) ? 'O' : 'X')))]; },
    ref: (b: string[][]) => solve(b),
  },
};

export default problem;
