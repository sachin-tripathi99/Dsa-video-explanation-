import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { callTree, fill2D } from '../../dpviz';

const R = 3, C = 4;
const G = [[1, 3, 1], [1, 5, 1], [4, 2, 1]];

function video() {
  const v = new Video('dp-on-grids', '2D DP on grids');
  const paths = (r: number, c: number): number => (r === 0 || c === 0 ? 1 : paths(r - 1, c) + paths(r, c - 1));

  v.chapter('intro', 'Counting paths on a grid');
  const g0 = v.grid('g', Array.from({ length: R }, () => Array(C).fill('')), { label: `${R} × ${C} grid` });
  g0.set(0, 0, 'S').tone(0, 0, 'active').set(R - 1, C - 1, 'E').tone(R - 1, C - 1, 'ok');
  v.say(`A robot starts in the top-left corner and must reach the bottom-right. It can only move right or down. How many different paths are there?`);
  v.eq(`answer: ${paths(R - 1, C - 1)} paths`);
  v.say('Grid DP problems all look like this: the answer for a cell is built from the answers of the cells you could have come from.');

  v.chapter('recursion', 'The last move decides the recursion', { cx: 'O(2^(r+c))', code: ['paths(r, c):', '  if r == 0 or c == 0: return 1', '  return paths(r − 1, c) + paths(r, c − 1)'] });
  v.clear();
  v.say('To stand on cell r, c, the last move came from above or from the left. So the paths to r, c are the paths to the cell above plus the paths to the cell on the left. The top row and left column have exactly one path each: straight along the edge.');
  const t = callTree<[number, number]>(v, 'rt', 'calls for paths(2, 2)', [2, 2], {
    kids: ([r, c]) => (r === 0 || c === 0 ? [] : [[r - 1, c], [r, c - 1]]), key: String, text: ([r, c]) => `${r},${c}`,
    lines: { call: [2], base: [1] },
    say: ([r, c], i) => (i.repeat && r === 1 && c === 1 ? 'Cell one, one is reached from both sides, so its whole subtree is computed twice.' : undefined),
    hold: 330,
  });
  v.eq(`${t.calls} calls for a 3 × 3 grid · exponential in general`, 'bad').say('Paths overlap heavily, so the recursion repeats itself exponentially. Every cell is its own subproblem: only rows times columns of them.');

  v.chapter('table', 'Fill the grid row by row', { cx: 'O(R·C)', code: ['dp[0][*] = dp[*][0] = 1', 'for r in 1..R−1: for c in 1..C−1:', '  dp[r][c] = dp[r−1][c] + dp[r][c−1]', 'return dp[R−1][C−1]'] });
  v.clear();
  const g = v.grid('dp', Array.from({ length: R }, (_, r) => Array.from({ length: C }, (_, c) => (r === 0 || c === 0 ? 1 : ''))), { label: 'dp[r][c] = paths to (r, c)' });
  v.line(0).say('Store every cell’s answer in a table of the same shape. The first row and column are all ones. Every other cell is filled after the cell above it and the cell to its left, so row by row, left to right, works.');
  const cells: [number, number][] = [];
  for (let r = 1; r < R; r++) for (let c = 1; c < C; c++) cells.push([r, c]);
  fill2D(v, g, cells, {
    deps: (r, c) => [[r - 1, c], [r, c - 1]], val: paths, line: [2],
    eq: (r, c) => `dp[${r}][${c}] = ${paths(r - 1, c)} + ${paths(r, c - 1)} = ${paths(r, c)}`,
    say: (r, c) => (r === 1 && c === 1 ? 'Cell one, one: one path from above plus one from the left. Two.' : r === R - 1 && c === C - 1 ? `The corner sums its two neighbours: ${words(paths(r, c))} paths.` : undefined),
  });
  g.tone(R - 1, C - 1, 'ok');
  v.line(3).eq(`dp[${R - 1}][${C - 1}] = ${paths(R - 1, C - 1)}`, 'ok').say('Each cell is computed once from two neighbours: rows times columns in total.');

  v.chapter('minsum', 'Same shape, different combine: minimum path sum', { cx: 'O(R·C)', code: ['dp[r][c] = grid[r][c] + min(dp[r−1][c], dp[r][c−1])', 'first row / column: only one way in'] });
  v.clear();
  v.grid('in', G, { label: 'cost of each cell' });
  const n = G.length;
  const dp = G.map((row) => row.map(() => 0));
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) dp[r][c] = G[r][c] + (r === 0 && c === 0 ? 0 : Math.min(r ? dp[r - 1][c] : Infinity, c ? dp[r][c - 1] : Infinity));
  const m = v.grid('dp', G.map((row) => row.map(() => '')), { label: 'dp = cheapest total cost to reach the cell' });
  v.layout('row');
  v.say('Change the question to the cheapest path, where each cell costs something. The shape is the same; only the combine step changes from plus to minimum.');
  const all: [number, number][] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) all.push([r, c]);
  fill2D(v, m, all, {
    deps: (r, c) => [...(r ? [[r - 1, c] as [number, number]] : []), ...(c ? [[r, c - 1] as [number, number]] : [])], val: (r, c) => dp[r][c], line: [0],
    eq: (r, c) => (r === 0 && c === 0 ? `dp[0][0] = ${G[0][0]}` : `dp[${r}][${c}] = ${G[r][c]} + min(${[r ? dp[r - 1][c] : null, c ? dp[r][c - 1] : null].filter((x) => x !== null).join(', ')}) = ${dp[r][c]}`),
    say: (r, c) => (r === 1 && c === 1 ? 'The middle cell costs five, plus the cheaper of its two ways in: from above, four, or from the left, two. Seven.' : undefined),
    hold: 500,
  });
  m.tone(n - 1, n - 1, 'ok');
  v.eq(`cheapest path = ${dp[n - 1][n - 1]}`, 'ok').say(`The cheapest route costs ${words(dp[n - 1][n - 1])}.`);

  v.chapter('rolling', 'Space: keep one row');
  v.clear();
  v.text('tx', { title: 'Rolling row', lines: ['dp[r][c] only reads the row above and the cell to its left', 'So one array of length C is enough:', '  row[c] = row[c] (old = above) + row[c − 1] (new = left)', 'Space drops from O(R·C) to O(C)'], shown: 4 });
  v.say('Each cell only reads the row above and its left neighbour. So a single row can be updated in place: before the update, row of c still holds the value from above, and row of c minus one has already been updated to the left neighbour.');

  v.chapter('family', 'The grid DP family');
  v.clear();
  v.table('t', ['Problem', 'Cell depends on', 'Combine'], [
    ['unique paths (± obstacles)', 'up, left', 'sum (0 on obstacles)'],
    ['minimum path sum', 'up, left', 'cost + min'],
    ['maximal square', 'up, left, up-left', '1 + min of three'],
    ['triangle / falling path', 'the row above (2–3 cells)', 'cost + min'],
    ['dungeon game', 'down, right (fill backwards)', 'max(1, min − cell)'],
  ]);
  v.say('Once you see which neighbours a cell depends on, the filling order follows: dependencies first. When the answer is needed at the start, like the dungeon game, fill from the end backwards.');
  return v.build();
}

const body = String.raw`
## The idea

On a grid, a cell's answer is built from the cells you could have arrived from. Define \`dp[r][c]\`, write the transition from the **last move**, fill in an order where those neighbours are already done.

> Real-life picture: a city of one-way streets going east and south. The number of routes to a corner is the routes to the corner north of it plus the routes to the corner west of it.

## Template: unique paths

\`\`\`java
int uniquePaths(int m, int n) {
    int[] row = new int[n];
    Arrays.fill(row, 1);                               // first row: one path each
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++) row[c] += row[c - 1];   // above + left
    return row[n - 1];
}
\`\`\`

\`\`\`python
def unique_paths(m, n):
    row = [1] * n                                      # first row: one path each
    for _ in range(1, m):
        for c in range(1, n):
            row[c] += row[c - 1]                       # above + left
    return row[-1]
\`\`\`

\`\`\`cpp
int uniquePaths(int m, int n) {
    vector<int> row(n, 1);                             // first row: one path each
    for (int r = 1; r < m; r++)
        for (int c = 1; c < n; c++) row[c] += row[c - 1];   // above + left
    return row[n - 1];
}
\`\`\`

## Variations

| Problem | Transition |
|---|---|
| Paths with obstacles | \`dp = 0\` on an obstacle, else up + left |
| Minimum path sum | \`grid[r][c] + min(up, left)\` |
| Maximal square | \`1 + min(up, left, up-left)\` where the cell is 1 |
| Triangle | bottom-up: \`t[r][c] + min(below, below-right)\` |
| Dungeon game | backwards: \`max(1, min(down, right) − cell)\` |

## Pitfalls

- First row and first column have only one way in: handle them (or pad with a sentinel row/column).
- When rolling a row, check whether you need the **old** or the **new** value of a neighbour.
- If the answer depends on the future (minimum health needed at the start), fill backwards.
`;

const lesson: Lesson = {
  slug: 'dp-on-grids',
  video,
  body,
  quiz: [
    { q: 'Robot moving right/down: paths to (r, c) =', options: ['paths(r−1, c) × paths(r, c−1)', 'paths(r−1, c) + paths(r, c−1)', 'r + c', 'max of the two'], answer: 1, why: 'The last move came from above or from the left.' },
    { q: 'Time for an R × C grid DP with O(1) work per cell?', options: ['O(R + C)', 'O(R · C)', 'O(2^(R+C))', 'O((R·C)²)'], answer: 1, why: 'Each cell is filled once.' },
    { q: 'Maximal square: dp[r][c] for a 1-cell is…', options: ['up + left', '1 + min(up, left, up-left)', 'max(up, left)', 'r · c'], answer: 1, why: 'The smallest of the three neighbouring squares limits the new one.' },
    { q: 'When should a grid DP be filled from the bottom-right?', options: ['never', 'when the answer at the start depends on what comes later', 'always', 'only for square grids'], answer: 1, why: 'e.g. the dungeon game: health needed depends on the rest of the path.' },
  ],
};

export default lesson;
