import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { ringBfs } from '../../gridbfs';

const G = [
  ['.', '.', '.', '.', 'F'],
  ['.', '#', '.', '.', '.'],
  ['.', '.', '.', '#', '.'],
  ['F', '.', '.', '.', '.'],
];

function video() {
  const v = new Video('multi-source-bfs', 'Multi-source BFS');
  v.chapter('intro', 'Distance to the nearest of many sources');
  v.grid('g', G, { label: 'F = fire station · # = wall' });
  v.say('For every empty cell, how far is the nearest fire station? With one station, a BFS from it gives every distance. With many stations, running one BFS per station and taking the minimum would repeat the work for every station.');

  v.chapter('trick', 'Start BFS from every source at once', { code: ['queue = all sources, each with distance 0', 'while queue: pop cell', '  for each open neighbour not seen: dist = dist + 1; push'] });
  v.clear();
  const g = v.grid('g', G.map((r) => r.map((x) => (x === '.' ? '' : x))), { label: 'numbers = distance to the nearest F' });
  const src: [number, number][] = [];
  G.forEach((row, r) => row.forEach((x, c) => { if (x === 'F') src.push([r, c]); }));
  v.line(0).say('Put every source into the queue at distance zero, before the search starts. Think of all of them catching fire at the same moment: the fire spreads one ring per minute from all of them together.');
  ringBfs(v, g, G.length, G[0].length, src, (r, c) => G[r][c] !== '#', (ring, cells) => ({
    eq: `ring ${ring}: ${cells.length} cell${cells.length === 1 ? '' : 's'} at distance ${ring}`,
    say: ring === 1 ? 'Ring one: every cell next to any station. Each cell is claimed by whichever wave reaches it first, which is exactly its nearest station.' : ring === 3 ? 'Where the two waves meet, a cell already claimed is never revisited, so the total work is one BFS, not one per station.' : undefined,
  }), { lines: [1, 2] });
  v.eq('every cell has its distance to the nearest station · O(rows × cols)', 'ok').say('Every cell is processed once, no matter how many sources there are.');

  v.chapter('equiv', 'Why it works: a super-source');
  v.clear();
  v.text('t', { title: 'Imagine one extra node S*', lines: ['S* is connected to every source by an edge of length 0', 'A normal BFS from S* reaches all sources first, at distance 0', 'Multi-source BFS is that BFS, with S* left out'], shown: 3 });
  v.say('One way to see why this is correct: imagine a single extra node connected to every source. A normal BFS from it would first reach all the sources at distance zero, then everything else in rings. Multi-source BFS is exactly that search.');

  v.chapter('uses', 'Where it shows up');
  v.clear();
  v.table('u', ['Problem', 'Sources'], [
    ['Rotting Oranges', 'all rotten oranges (time = number of rings)'],
    ['01 Matrix', 'all zeros'],
    ['As Far from Land as Possible', 'all land cells'],
    ['Map of Highest Peak', 'all water cells'],
    ['Shortest Bridge', 'every cell of the first island'],
  ]);
  v.say('Spot the phrase “nearest” or “spreads each minute” with several starting points, and seed the queue with all of them.');
  void words;
  return v.build();
}

const body = String.raw`
## The idea

When you need, for every cell, the distance to the **nearest of many sources**, put **all sources into the BFS queue at distance 0** and run one BFS. Each cell is claimed by the first wave that reaches it, which comes from its nearest source.

> Real-life picture: fires starting at several stations at once and spreading one block per minute. Every block burns at the time of its nearest fire.

## Template

\`\`\`java
Deque<int[]> q = new ArrayDeque<>();
int[][] dist = new int[m][n];
for (int[] row : dist) Arrays.fill(row, -1);
for (int[] s : sources) { dist[s[0]][s[1]] = 0; q.offer(s); }     // all at once
while (!q.isEmpty()) {
    int[] p = q.poll();
    for (int[] d : DIRS) {
        int r = p[0] + d[0], c = p[1] + d[1];
        if (r < 0 || c < 0 || r >= m || c >= n || dist[r][c] != -1 || blocked(r, c)) continue;
        dist[r][c] = dist[p[0]][p[1]] + 1;
        q.offer(new int[]{r, c});
    }
}
\`\`\`

\`\`\`python
q = deque(sources)
dist = [[-1] * n for _ in range(m)]
for r, c in sources:
    dist[r][c] = 0                                    # all at once
while q:
    r, c = q.popleft()
    for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
        if 0 <= nr < m and 0 <= nc < n and dist[nr][nc] == -1 and not blocked(nr, nc):
            dist[nr][nc] = dist[r][c] + 1
            q.append((nr, nc))
\`\`\`

\`\`\`cpp
queue<pair<int, int>> q;
vector<vector<int>> dist(m, vector<int>(n, -1));
for (auto [r, c] : sources) { dist[r][c] = 0; q.push({r, c}); }   // all at once
while (!q.empty()) {
    auto [r, c] = q.front(); q.pop();
    for (auto [dr, dc] : DIRS) {
        int nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= m || nc >= n || dist[nr][nc] != -1 || blocked(nr, nc)) continue;
        dist[nr][nc] = dist[r][c] + 1;
        q.push({nr, nc});
    }
}
\`\`\`

## Why not one BFS per source?

k sources × O(m·n) each = O(k·m·n). Multi-source BFS is **O(m·n)** regardless of k.

## Variants

- **Time until everything is reached:** the number of rings (Rotting Oranges).
- **Largest nearest-distance:** the last ring (As Far from Land).
- **Two regions:** mark one region as the sources, stop when the other is touched (Shortest Bridge).
`;

const lesson: Lesson = {
  slug: 'multi-source-bfs',
  video,
  body,
  quiz: [
    { q: 'How are the sources added in multi-source BFS?', options: ['one BFS each', 'all into the queue at distance 0 before starting', 'sorted by position', 'only the first one'], answer: 1, why: 'They expand together, ring by ring.' },
    { q: 'Time with k sources on an m×n grid?', options: ['O(k·m·n)', 'O(m·n)', 'O(k)', 'O((m·n)²)'], answer: 1, why: 'Each cell is processed once.' },
    { q: 'Rotting Oranges: the answer is…', options: ['the number of fresh oranges', 'the number of BFS rings needed', 'the number of rotten oranges', 'always 4'], answer: 1, why: 'Each ring is one minute.' },
    { q: 'A cell reached by two waves gets the distance of…', options: ['the later wave', 'the first wave to reach it', 'their average', 'their sum'], answer: 1, why: 'BFS reaches it first from its nearest source.' },
  ],
};

export default lesson;
