import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { dijkstraViz, graphView } from '../../dijkstraviz';

const L = ['A', 'B', 'C', 'D', 'E', 'F'];
const POS = [[5, 50], [35, 12], [35, 88], [65, 12], [65, 88], [95, 50]];
const W: [number, number, number][] = [[0, 1, 4], [0, 2, 2], [2, 1, 1], [1, 3, 5], [2, 3, 8], [2, 4, 10], [3, 4, 2], [3, 5, 6], [4, 5, 2]];

// Bellman-Ford example: one negative edge (B → A)
const BL = ['S', 'A', 'B', 'C'];
const BPOS = [[8, 50], [50, 12], [50, 88], [92, 50]];
const BE: [number, number, number][] = [[0, 1, 4], [0, 2, 5], [1, 3, 2], [2, 1, -3], [2, 3, 6]];

// Floyd-Warshall example
const FE: [number, number, number][] = [[0, 1, 3], [0, 3, 7], [1, 0, 8], [1, 2, 2], [2, 0, 5], [2, 3, 1], [3, 0, 2]];
const FPOS = [[15, 15], [85, 15], [85, 85], [15, 85]];

function video() {
  const v = new Video('shortest-paths', 'Shortest paths');
  const n = L.length;
  const nodes = L.map((l, i) => ({ id: String(i), label: l, x: POS[i][0], y: POS[i][1] }));
  const edges = W.map(([a, b, w]) => ({ a: String(a), b: String(b), w }));
  const adj = Array.from({ length: n }, () => [] as [number, number][]);
  W.forEach(([a, b, w]) => { adj[a].push([b, w]); adj[b].push([a, w]); });

  v.chapter('intro', 'When edges have weights, fewest edges is not cheapest');
  const g0 = v.graph('g', nodes, edges, { label: 'roads with travel times' });
  v.say('Roads between towns, each with a travel time. BFS finds the route with the fewest roads, but that is no longer what we want.');
  g0.edge('0', '1', 'bad');
  v.eq('A → B directly: 1 road, 4 minutes', 'bad').say('BFS would take the direct road from A to B: one road, four minutes.');
  g0.clearTones(); g0.edge('0', '2', 'ok').edge('2', '1', 'ok');
  v.eq('A → C → B: 2 roads, 2 + 1 = 3 minutes', 'ok').say('Going through C uses two roads but takes only three minutes. With weights we need a different tool, and there are three classic ones.');

  v.chapter('dijkstra', 'Dijkstra: always settle the closest unsettled node', { cx: 'O(E log V)', code: ['dist[src] = 0; heap = [(0, src)]', 'pop (d, u); skip if stale; d is final', 'for (w, cost) in adj[u]: if d + cost < dist[w]:', '  dist[w] = d + cost; push (dist[w], w)'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'badge = best time known · green = final' });
  v.layout('row').weight('g', 2.2);
  const res = dijkstraViz(v, graphView(g), n, adj, 0, {
    name: (i) => L[i],
    lines: { init: [0], pop: [1], relax: [2, 3], done: [1] },
    narrate: 4,
    firstPopSay: 'Nothing can beat zero, so A is final.',
    sayInit: 'Dijkstra keeps a best-known time for every town, starting with zero at A and infinity elsewhere, and a min-heap of candidates.',
  });
  v.eq(`final: ${L.map((l, i) => `${l}=${res.dist[i]}`).join(' ')}`, 'ok').say(`Every town is settled. F is ${words(res.dist[5])} minutes away, via ${pathOf(res.parent, 5).map((i) => L[i]).join(', ')}. Each edge pushes at most one entry, so the heap work is E log V.`);

  v.chapter('why', 'Why it works, and when it breaks');
  v.clear();
  v.text('t', { title: 'The greedy step', lines: ['The heap top u has the smallest tentative time d', 'Any other route to u leaves the settled set through a node already costing ≥ d', 'With non-negative weights, the rest of that route can only add → d is final', 'A negative edge could make a later route cheaper → Dijkstra can be wrong'], shown: 4 });
  v.say('Why is the popped time final? Any other route to that node must leave the settled region through some node that is already at least as far, and non-negative edges can only add more. A negative edge breaks this argument: a detour could get cheaper after the node was settled. For negative edges, use Bellman-Ford.');

  v.chapter('bellman', 'Bellman-Ford: relax every edge, V − 1 times', { cx: 'O(V · E)', code: ['dist[src] = 0, others ∞', 'repeat V − 1 times:', '  for each edge (a, b, w): dist[b] = min(dist[b], dist[a] + w)', 'stop early if a round changes nothing'] });
  v.clear();
  const bn = BL.length;
  const bg = v.graph('g', BL.map((l, i) => ({ id: String(i), label: l, x: BPOS[i][0], y: BPOS[i][1] })), BE.map(([a, b, w]) => ({ a: String(a), b: String(b), w })), { label: 'B → A costs −3', directed: true });
  const tb = v.table('tb', ['round', ...BL], [['start', '0', '∞', '∞', '∞']]);
  v.layout('row').weight('g', 2.2).weight('tb', 1);
  const bd = [0, Infinity, Infinity, Infinity];
  const f = (x: number) => (x === Infinity ? '∞' : String(x));
  bg.badge('0', '0');
  v.line(0).say('Bellman-Ford makes no greedy choice. It simply relaxes every edge, over and over. After round k, every shortest path that uses at most k edges is correct, so V minus one rounds are always enough.');
  for (let round = 1; round < bn; round++) {
    let changed = false;
    for (const [a, b, w] of BE) {
      bg.clearTones(); bg.edge(String(a), String(b), 'cmp');
      if (bd[a] !== Infinity && bd[a] + w < bd[b]) {
        bd[b] = bd[a] + w; changed = true;
        bg.badge(String(b), bd[b]).tone(String(b), 'ok');
        v.line(2).counter(`round ${round}`).eq(`${BL[a]} → ${BL[b]}: ${bd[a]} + (${w}) = ${bd[b]} → update`, 'ok');
        if (round === 1 && a === 2 && b === 1) v.say('B to A costs minus three. Five plus minus three is two, better than A’s four. Dijkstra would already have settled A at four; Bellman-Ford just updates it.');
        else if (round === 1) v.hold(800);
        else v.say(`Round ${words(round)}: A improved last round, so the edge from A to C now gives ${words(bd[3])}.`);
      } else if (round === 1) {
        v.line(2).counter(`round ${round}`).eq(`${BL[a]} → ${BL[b]}: ${f(bd[a] + w)} is not better than ${f(bd[b])}`);
        v.hold(700);
      }
    }
    bg.clearTones();
    tb.addRow([String(round), ...bd.map(f)]);
    if (!changed) { v.line(3).eq(`round ${round}: nothing changed → done`, 'ok').say(`Round ${words(round)} changes nothing, so the distances are final and we can stop early.`); break; }
    v.line(1).eq(`after round ${round}: ${BL.map((l, i) => `${l}=${f(bd[i])}`).join(' ')}`);
    if (round === 1) v.say(`End of round one. Notice C is still six, computed from A’s old value. The next round fixes it.`); else v.hold(700);
  }
  v.say('If a V-th round could still improve something, there is a negative cycle, and no shortest path exists. Bellman-Ford also handles “at most k edges”: run exactly k rounds, each using only the previous round’s values.');

  v.chapter('floyd', 'Floyd–Warshall: all pairs, one middle node at a time', { cx: 'O(V³)', code: ['d[i][j] = edge weight, 0 on the diagonal, else ∞', 'for k in nodes:', '  for i, j: d[i][j] = min(d[i][j], d[i][k] + d[k][j])'] });
  v.clear();
  const fn = 4;
  const fg = v.graph('g', [...Array(fn).keys()].map((i) => ({ id: String(i), label: String(i), x: FPOS[i][0], y: FPOS[i][1] })), FE.map(([a, b, w]) => ({ a: String(a), b: String(b), w })), { label: 'directed', directed: true });
  const d = Array.from({ length: fn }, (_, i) => Array.from({ length: fn }, (_, j) => (i === j ? 0 : Infinity)));
  FE.forEach(([a, b, w]) => { d[a][b] = w; });
  const m = v.grid('m', d.map((r) => r.map(f)), { label: 'd[i][j] · row = from, column = to' });
  v.layout('row').weight('g', 1.5).weight('m', 1);
  v.line(0).say('For the shortest time between every pair of nodes, Floyd–Warshall fills a table. Start with the direct edges: zero on the diagonal, infinity where there is no edge.');
  for (let k = 0; k < fn; k++) {
    m.clearTones();
    fg.clearTones(); fg.tone(String(k), 'cmp');
    for (let t = 0; t < fn; t++) { m.tone(k, t, 'cmp'); m.tone(t, k, 'cmp'); }
    const ch: string[] = [];
    for (let i = 0; i < fn; i++) for (let j = 0; j < fn; j++) if (d[i][k] + d[k][j] < d[i][j]) { d[i][j] = d[i][k] + d[k][j]; m.set(i, j, d[i][j]).tone(i, j, 'ok'); ch.push(`${i}→${j}=${d[i][j]}`); }
    v.line(1, 2).counter(`k = ${k}`).eq(ch.length ? `via ${k}: ${ch.join(', ')}` : `via ${k}: nothing improves`, ch.length ? 'ok' : undefined);
    if (k === 0) v.say(`Now allow node zero as a stopover. For every pair i, j: is going i to zero, then zero to j, faster? The blue row and column hold those two legs. ${ch.length ? `${ch.length === 1 ? 'One entry improves' : `${cap(words(ch.length))} entries improve`}, shown in green.` : ''}`);
    else if (k === 1) v.say(`Then allow node one as a stopover too, using the updated table. After processing node k, each entry is the best route using only the first k plus one nodes as stopovers.`);
    else v.hold(1100);
  }
  m.clearTones(); fg.clearTones();
  v.eq('all-pairs shortest paths · O(V³)', 'ok').say('After every node has been a stopover, the table holds every pair’s shortest time. Three nested loops: V cubed, which is fine for a few hundred nodes.');

  v.chapter('choose', 'Choosing the tool');
  v.clear();
  v.table('t', ['Situation', 'Use', 'Cost'], [
    ['all weights equal', 'BFS', 'O(V + E)'],
    ['weights 0 or 1', '0-1 BFS with a deque', 'O(V + E)'],
    ['non-negative weights, one source', 'Dijkstra + heap', 'O(E log V)'],
    ['negative edges, or at most k edges', 'Bellman-Ford', 'O(V · E)'],
    ['all pairs, small V', 'Floyd–Warshall', 'O(V³)'],
    ['minimise the max edge on a path', 'Dijkstra with max instead of +', 'O(E log V)'],
  ]);
  v.say('Pick by the weights and the question. Dijkstra also works whenever extending a path can never make it better: maximum probability multiplies numbers at most one, and minimum effort takes a maximum. Both are still Dijkstra with a different combine step.');
  return v.build();
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
function pathOf(parent: number[], t: number) { const p: number[] = []; for (let x = t; x >= 0; x = parent[x]) p.unshift(x); return p; }

const body = String.raw`
## The idea

With weighted edges, "fewest edges" (BFS) is not "cheapest". Three tools cover almost every interview problem:

| Algorithm | Handles | Time |
|---|---|---|
| **Dijkstra** | one source, weights ≥ 0 | O(E log V) |
| **Bellman-Ford** | negative edges, "at most k edges" | O(V · E) |
| **Floyd–Warshall** | all pairs | O(V³) |

> Real-life picture: Dijkstra is water spreading through pipes of different lengths: it reaches the nearest junctions first, and a junction, once wet, never gets "wetter".

## Dijkstra with a heap

\`\`\`java
int[] dijkstra(List<int[]>[] adj, int src) {          // adj[u] = {v, w}
    int[] dist = new int[adj.length];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src});
    while (!pq.isEmpty()) {
        int[] top = pq.poll();
        int d = top[0], u = top[1];
        if (d > dist[u]) continue;                     // stale entry
        for (int[] e : adj[u])
            if (d + e[1] < dist[e[0]]) { dist[e[0]] = d + e[1]; pq.offer(new int[]{dist[e[0]], e[0]}); }
    }
    return dist;
}
\`\`\`

\`\`\`python
import heapq

def dijkstra(adj, src):                               # adj[u] = [(v, w), ...]
    dist = [float("inf")] * len(adj)
    dist[src] = 0
    pq = [(0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue                                  # stale entry
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return dist
\`\`\`

\`\`\`cpp
vector<long long> dijkstra(vector<vector<pair<int,int>>>& adj, int src) {
    vector<long long> dist(adj.size(), LLONG_MAX);
    dist[src] = 0;
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    pq.push({0, src});
    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;                     // stale entry
        for (auto [v, w] : adj[u])
            if (d + w < dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }
    }
    return dist;
}
\`\`\`

## Bellman-Ford

Relax **every** edge, V − 1 times: \`dist[b] = min(dist[b], dist[a] + w)\`. After round k, all shortest paths with at most k edges are correct. For "at most k edges" run exactly k rounds, each reading a **copy** of the previous round, or one round can chain several edges. An improvement in round V means a negative cycle.

## Floyd–Warshall

\`\`\`python
for k in range(n):
    for i in range(n):
        for j in range(n):
            d[i][j] = min(d[i][j], d[i][k] + d[k][j])
\`\`\`

The loop over the stopover \`k\` must be the **outermost** one.

## Variations

- **Maximum probability**: combine with \`×\`, pop the **largest** first (a max-heap).
- **Minimise the largest step** (effort, water level): combine with \`max(d, w)\` instead of \`d + w\`.
- **Grid**: cells are nodes, the 4 neighbours are edges.

## Pitfalls

- Skip stale heap entries (\`d > dist[u]\`), or the run can blow up.
- Dijkstra is wrong with negative edges.
- Use 64-bit integers when sums can overflow, and never add to "infinity".
`;

const lesson: Lesson = {
  slug: 'shortest-paths',
  video,
  body,
  quiz: [
    { q: 'Which algorithm fails with a negative edge weight?', options: ['Bellman-Ford', 'Dijkstra', 'Floyd–Warshall', 'none of them'], answer: 1, why: 'Its greedy “popped means final” step assumes adding an edge never makes a route cheaper.' },
    { q: 'Cheapest route using at most k edges?', options: ['Dijkstra', 'BFS', 'Bellman-Ford with k rounds', 'Floyd–Warshall'], answer: 2, why: 'Round i of Bellman-Ford fixes all routes of at most i edges.' },
    { q: 'Time of Dijkstra with a binary heap?', options: ['O(V + E)', 'O(E log V)', 'O(V · E)', 'O(V³)'], answer: 1, why: 'Each edge can push one heap entry.' },
    { q: 'In Floyd–Warshall, which loop must be outermost?', options: ['i', 'j', 'k (the stopover)', 'any order works'], answer: 2, why: 'Each phase allows one more stopover and relies on the previous phase being complete.' },
  ],
};

export default lesson;
