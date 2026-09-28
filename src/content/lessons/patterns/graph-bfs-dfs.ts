import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const G = [
  ['1', '1', '0', '0', '0'],
  ['1', '1', '0', '1', '0'],
  ['0', '0', '0', '1', '1'],
  ['0', '1', '0', '0', '1'],
];
const D = [
  ['S', '.', '.', '#', '.'],
  ['#', '#', '.', '#', '.'],
  ['.', '.', '.', '.', '.'],
  ['.', '#', '#', '#', 'T'],
];

function video() {
  const v = new Video('graph-bfs-dfs', 'BFS and DFS on graphs and grids');
  v.chapter('intro', 'A grid is a graph');
  v.grid('g', G, { label: '1 = land, 0 = water' });
  v.say('A graph is a set of nodes joined by edges. A grid is a graph in disguise: every cell is a node, joined to its up, down, left and right neighbours. Almost every graph traversal problem asks one of two things: what can I reach from here, and how far is it?');

  v.chapter('dfs', 'DFS: explore one region completely', { code: ['dfs(r, c):', '  if off-grid, water, or visited: return', '  mark (r, c) visited', '  dfs on the 4 neighbours'] });
  v.clear();
  const g = v.grid('g', G, { label: 'count islands with DFS' });
  const R = G.length, C = G[0].length;
  const seen = G.map((row) => row.map(() => false));
  let islands = 0;
  let told = 0;
  const dfs = (r: number, c: number) => {
    if (r < 0 || c < 0 || r >= R || c >= C || G[r][c] !== '1' || seen[r][c]) return;
    seen[r][c] = true;
    g.tone(r, c, 'ok'); g.set(r, c, String(islands));
    v.line(2, 3).counter(`islands: ${islands}`).eq(`visit (${r},${c})`);
    if (told === 0) { v.say('Scan the grid. At the first unvisited land cell, start a DFS: mark the cell, then visit its four neighbours, which visit theirs, until the whole island is marked.'); told++; } else v.hold(350);
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (G[r][c] === '1' && !seen[r][c]) {
    islands++;
    g.tone(r, c, 'active');
    v.counter(`islands: ${islands}`).eq(`new island #${islands} starts at (${r},${c})`, 'warn');
    if (islands === 2) v.say('The next unvisited land cell starts a second island. Cells already marked are skipped, so every cell is processed once.'); else v.hold(600);
    dfs(r, c);
  }
  v.eq(`${islands} islands · O(rows × cols)`, 'ok').say(`Three islands. Each cell is visited at most once, so the cost is the number of cells.`);

  v.chapter('bfs', 'BFS: shortest path when every step costs 1', { code: ['queue = [start]; dist[start] = 0', 'while queue: cell = pop front', '  for each open neighbour not seen:', '    dist = dist[cell] + 1; mark seen; push'] });
  v.clear();
  const b = v.grid('b', D.map((r) => r.map((x) => (x === '.' ? '' : x))), { label: 'S → T, # = wall' });
  const dist: number[][] = D.map((r) => r.map(() => -1));
  const q: [number, number][] = [[0, 0]];
  dist[0][0] = 0;
  b.set(0, 0, 0).tone(0, 0, 'active');
  v.line(0).say('For the shortest path in an unweighted grid, use BFS. It explores in rings: first every cell one step away, then two steps, and so on. The first time it reaches a cell is along a shortest path.');
  let ring = 0;
  while (q.length) {
    const size = q.length;
    ring++;
    const next: [number, number][] = [];
    for (let k = 0; k < size; k++) {
      const [r, c] = q.shift()!;
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= D.length || nc >= D[0].length || D[nr][nc] === '#' || dist[nr][nc] >= 0) continue;
        dist[nr][nc] = dist[r][c] + 1;
        next.push([nr, nc]);
        q.push([nr, nc]);
      }
    }
    next.forEach(([r, c]) => b.set(r, c, D[r][c] === 'T' ? `T${dist[r][c]}` : dist[r][c]).tone(r, c, D[r][c] === 'T' ? 'ok' : 'cmp'));
    if (next.length) {
      v.line(2, 3).counter(`ring ${ring}`).eq(`distance ${ring}: ${next.length} cell${next.length > 1 ? 's' : ''}`);
      if (ring === 1) v.say('Ring one: the only open neighbour of S. Mark cells when you push them, so no cell is queued twice.');
      else if (next.some(([r, c]) => D[r][c] === 'T')) { v.say(`T is reached in ring ${words(ring)}: the shortest path has ${words(ring)} steps.`); break; }
      else v.hold(600);
    }
  }

  v.chapter('patterns', 'Patterns');
  v.clear();
  v.table('t', ['Problem shape', 'Technique'], [
    ['count / measure connected regions', 'DFS or BFS from each unvisited cell'],
    ['cells connected to the border', 'start the search from the border'],
    ['two-colour a graph (bipartite)', 'BFS / DFS alternating colours'],
    ['fewest steps, equal weights', 'BFS, distance by ring'],
    ['states instead of cells (word ladder)', 'BFS on an implicit graph'],
  ]);
  v.say('Most graph traversal problems are one of these shapes. The technique is always the same visit-once loop; what changes is where you start and what you record.');
  return v.build();
}

const body = String.raw`
## The idea

**DFS** goes deep along one path before backing up; **BFS** explores in rings of equal distance. Both visit every reachable node **once** using a **visited** mark: O(V + E), or O(rows × cols) on a grid.

> Real-life picture: DFS is exploring a maze with one hand on the wall; BFS is a rumour spreading one handshake at a time.

## Grid DFS template

\`\`\`java
void dfs(char[][] g, int r, int c) {
    if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;
    g[r][c] = '#';                                  // mark visited
    dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);
}
\`\`\`

\`\`\`python
def dfs(r, c):
    if r < 0 or c < 0 or r >= R or c >= C or g[r][c] != "1":
        return
    g[r][c] = "#"                                   # mark visited
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        dfs(r + dr, c + dc)
\`\`\`

\`\`\`cpp
void dfs(vector<vector<char>>& g, int r, int c) {
    if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] != '1') return;
    g[r][c] = '#';                                  // mark visited
    dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);
}
\`\`\`

## BFS shortest path (unweighted)

Push the start with distance 0. Pop a cell, and for every unvisited neighbour set \`dist = dist + 1\`, **mark it when you push it** (not when you pop it), and push it. The first time BFS reaches a cell is along a shortest path.

## Patterns

| Shape | Technique |
|---|---|
| Count / size regions | DFS/BFS from each unvisited cell |
| Regions touching the border | Start from border cells instead |
| Two-colouring (bipartite) | Alternate colours; a same-colour edge means "no" |
| Fewest steps | BFS by rings |
| Implicit graphs (words, states) | Generate neighbours on the fly, BFS |

## Pitfalls

- Deep recursion on big grids can overflow the stack: switch to BFS or an explicit stack.
- Mark visited **when enqueuing** in BFS, or a cell can be queued many times.
- Disconnected graphs: loop over all nodes, starting a new search at each unvisited one.
`;

const lesson: Lesson = {
  slug: 'graph-bfs-dfs',
  video,
  body,
  quiz: [
    { q: 'Shortest path in a grid where each step costs 1?', options: ['DFS', 'BFS', 'Dijkstra only', 'binary search'], answer: 1, why: 'BFS reaches cells in increasing distance.' },
    { q: 'When should BFS mark a cell visited?', options: ['when popped', 'when pushed', 'never', 'at the end'], answer: 1, why: 'Otherwise the same cell can be queued several times.' },
    { q: 'Time to count islands in an R×C grid?', options: ['O(R + C)', 'O(R · C)', 'O((R·C)²)', 'O(log(R·C))'], answer: 1, why: 'Each cell is visited once.' },
    { q: 'Cells that cannot reach the border: best start?', options: ['every interior cell', 'the border cells', 'the centre', 'random cells'], answer: 1, why: 'Mark everything reachable from the border; the rest is enclosed.' },
  ],
};

export default lesson;
