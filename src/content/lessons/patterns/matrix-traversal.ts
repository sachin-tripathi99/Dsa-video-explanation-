import type { Lesson } from '../../types';
import { Video } from '../../helpers';

const G = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
];

function video() {
  const v = new Video('matrix-traversal', 'Working with 2D grids');
  v.chapter('intro', 'Rows, columns, and cells');
  const g = v.grid('g', G, { label: 'm = 3 rows, n = 4 columns', rowHead: ['r0', 'r1', 'r2'], colHead: ['c0', 'c1', 'c2', 'c3'] });
  g.tone(1, 2, 'active');
  v.eq('grid[r][c] · row first, then column').say('A matrix is an array of rows. Grid of r, c means row r, column c: here row one, column two is seven. Always row first. Mixing up rows and columns is the most common matrix bug.');
  g.clearTones();

  v.chapter('dirs', 'Neighbours with a direction array', { code: ['dirs = [(−1,0), (1,0), (0,−1), (0,1)]   # up, down, left, right', 'for dr, dc in dirs:', '  nr, nc = r + dr, c + dc', '  if 0 <= nr < m and 0 <= nc < n: visit(nr, nc)'] });
  g.tone(1, 1, 'active');
  v.line(0).say('To visit the neighbours of a cell, do not write four almost identical if statements. Keep a list of direction offsets, and loop over it.');
  const nb: [number, number][] = [[0, 1], [2, 1], [1, 0], [1, 2]];
  nb.forEach(([r, c], k) => {
    g.tone(r, c, 'cmp');
    v.line(2, 3).eq(`(1, 1) + (${r - 1}, ${c - 1}) = (${r}, ${c}) · inside ✓`).hold(k === 0 ? 800 : 500);
  });
  g.clearTones().tone(0, 0, 'active').tone(1, 0, 'cmp').tone(0, 1, 'cmp');
  v.eq('(0, 0) + (−1, 0) = (−1, 0) · outside ✗', 'bad').say('A corner cell only has two neighbours inside the grid. The bounds check, the new row must be at least zero and less than m, and the same for columns, filters out the rest.');
  g.clearTones();

  v.chapter('transpose', 'Transpose and rotate', { code: ['transpose: swap grid[r][c] with grid[c][r] for c > r', 'rotate 90° clockwise = transpose, then reverse each row'] });
  v.clear();
  const S = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  const s = v.grid('s', S.map((r) => [...r]), { label: 'square matrix' });
  const cur = S.map((r) => [...r]);
  v.say('Two operations turn up constantly. The transpose flips the matrix across its main diagonal, swapping row r, column c with row c, column r.');
  for (let r = 0; r < 3; r++) for (let c = r + 1; c < 3; c++) {
    [cur[r][c], cur[c][r]] = [cur[c][r], cur[r][c]];
    s.set(r, c, cur[r][c]).set(c, r, cur[c][r]).clearTones().tone(r, c, 'ok').tone(c, r, 'ok');
    v.line(0).eq(`swap (${r},${c}) ↔ (${c},${r})`).hold(650);
  }
  s.clearTones();
  v.say('Then reversing every row finishes a ninety degree clockwise rotation.');
  cur.forEach((row, r) => { row.reverse(); row.forEach((x, c) => s.set(r, c, x)); s.toneRow(r, 'ok'); v.line(1).hold(500); });
  s.clearTones();
  v.eq('[[7,4,1],[8,5,2],[9,6,3]] = rotated 90° clockwise', 'ok').say('The first row, seven, four, one, is the old first column read from the bottom up. That is exactly a clockwise rotation, done in place.');

  v.chapter('spiral', 'Walking in layers', { code: ['top, bottom, left, right = 0, m−1, 0, n−1', 'while top <= bottom and left <= right:', '  walk top row → ; right column ↓ ; bottom row ← ; left column ↑', '  shrink the four boundaries'] });
  v.clear();
  const sp = v.grid('g', G, { label: 'spiral order' });
  const out = v.array('out', [], { label: 'visited order' });
  const order: [number, number][] = [];
  let top = 0, bottom = 2, left = 0, right = 3;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) order.push([top, c]);
    top++;
    for (let r = top; r <= bottom; r++) order.push([r, right]);
    right--;
    if (top <= bottom) { for (let c = right; c >= left; c--) order.push([bottom, c]); bottom--; }
    if (left <= right) { for (let r = bottom; r >= top; r--) order.push([r, left]); left++; }
  }
  v.say('Some problems walk the grid in a pattern. For a spiral, keep four boundaries, top, bottom, left and right. Walk along the top row, down the right column, back along the bottom, up the left, and shrink each boundary after using it.');
  order.forEach(([r, c], k) => {
    sp.tone(r, c, 'ok');
    if (k > 0) sp.arrow(order[k - 1], [r, c]);
    out.push(G[r][c]);
    v.line(2).hold(320);
  });
  v.eq(`${order.map(([r, c]) => G[r][c]).join(' ')}`, 'ok').say('Each cell is visited exactly once, so this is linear in the number of cells, with no extra visited array.');

  v.chapter('memory', 'Using the matrix itself as memory');
  v.clear();
  v.table('t', ['Trick', 'Example'], [
    ['Mark visited cells by overwriting them (e.g. 1 → 0)', 'number of islands'],
    ['Use the first row and column as flags', 'set matrix zeroes'],
    ['Encode old and new state in spare bits', 'game of life'],
    ['Diagonals: r − c is constant ↘, r + c is constant ↙', 'N-Queens, diagonal traverse'],
  ]);
  v.say('When a problem asks for constant extra space, the matrix itself can hold extra information: overwrite visited cells, borrow the first row as flags, or pack two states into one number. And remember that on a diagonal going down-right, r minus c stays the same.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'Grid toolkit', lines: ['grid[r][c]: rows m = len(grid), columns n = len(grid[0])', 'Direction arrays + one bounds check', 'Rotate = transpose + reverse rows', 'Layer walks with four shrinking boundaries', 'In-place tricks: markers, first row/col flags, bit encoding'], shown: 5 });
  v.say('Rows first, directions in an array, boundaries for layered walks, and the matrix itself as memory. These cover almost every grid question that is not a graph search. Grid searches, like counting islands, come later with BFS and DFS.');
  return v.build();
}

const body = String.raw`
## Basics

\`grid[r][c]\` is row \`r\`, column \`c\`. With \`m = len(grid)\` rows and \`n = len(grid[0])\` columns, cells are stored row by row (row-major).

> Real-life picture: a spreadsheet. Row numbers go down, column letters go across; in code, the row always comes first.

## Neighbours with a direction array

\`\`\`python
DIRS = [(-1, 0), (1, 0), (0, -1), (0, 1)]          # up, down, left, right
for dr, dc in DIRS:
    nr, nc = r + dr, c + dc
    if 0 <= nr < m and 0 <= nc < n:
        visit(nr, nc)
\`\`\`

\`\`\`java
int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
for (int[] d : DIRS) {
    int nr = r + d[0], nc = c + d[1];
    if (nr >= 0 && nr < m && nc >= 0 && nc < n) visit(nr, nc);
}
\`\`\`

\`\`\`cpp
const int DR[] = {-1, 1, 0, 0}, DC[] = {0, 0, -1, 1};
for (int k = 0; k < 4; k++) {
    int nr = r + DR[k], nc = c + DC[k];
    if (nr >= 0 && nr < m && nc >= 0 && nc < n) visit(nr, nc);
}
\`\`\`

Add the four diagonal offsets for 8-directional movement.

## Common transformations

| Operation | Recipe |
|---|---|
| Transpose (square) | swap \`g[r][c]\` ↔ \`g[c][r]\` for \`c > r\` |
| Rotate 90° clockwise | transpose, then reverse each row |
| Rotate 90° counter-clockwise | transpose, then reverse each column (or reverse rows first) |
| Flip horizontally | reverse each row |
| Main diagonal cells | \`r − c\` constant |
| Anti-diagonal cells | \`r + c\` constant |

## Layer-by-layer walks

Spiral order and "rotate by layers" keep four boundaries: \`top\`, \`bottom\`, \`left\`, \`right\`, shrinking one after each side is walked. Re-check \`top <= bottom\` and \`left <= right\` before the bottom row and left column, or single rows/columns get visited twice.

## O(1)-space tricks

- **Markers:** overwrite visited cells (e.g. set to \`'#'\`), restore later if needed.
- **First row / column as flags:** remember separately whether they themselves need zeroing.
- **Bit encoding:** store the next state in bit 1 while bit 0 keeps the current state; shift at the end.

## Sorted matrices

If rows and columns are both sorted, start at the **top-right** corner: moving left decreases, moving down increases, so each step discards a row or a column (O(m + n)).
`;

const lesson: Lesson = {
  slug: 'matrix-traversal',
  video,
  body,
  quiz: [
    { q: 'Rotate an n × n matrix 90° clockwise in place:', options: ['Reverse each row, then transpose', 'Transpose, then reverse each row', 'Transpose twice', 'Reverse the rows order only'], answer: 1, why: 'Transpose then reverse each row gives the clockwise rotation.' },
    { q: 'Which cells share a down-right diagonal?', options: ['Same r + c', 'Same r − c', 'Same r · c', 'Same r'], answer: 1, why: 'Moving down-right adds 1 to both r and c, so r − c stays fixed.' },
    { q: 'Why use a direction array for neighbours?', options: ['It is faster', 'One loop + one bounds check replaces four copies of nearly identical code', 'Required by Java', 'Avoids recursion'], answer: 1, why: 'Less repeated code means fewer bugs.' },
    { q: 'Matrix sorted by rows and columns: where do you start a staircase search?', options: ['Top-left', 'Top-right (or bottom-left)', 'Center', 'Anywhere'], answer: 1, why: 'From top-right, left is smaller and down is larger, so every step discards a row or a column.' },
  ],
};

export default lesson;
