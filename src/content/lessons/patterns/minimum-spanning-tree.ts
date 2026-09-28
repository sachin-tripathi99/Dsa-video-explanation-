import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const L = ['A', 'B', 'C', 'D', 'E', 'F'];
const POS = [[6, 30], [38, 8], [28, 78], [62, 45], [68, 92], [95, 22]];
const E: [number, number, number][] = [[0, 1, 4], [0, 2, 3], [1, 2, 1], [1, 3, 2], [2, 3, 4], [2, 4, 6], [3, 4, 5], [3, 5, 7], [1, 5, 8], [4, 5, 9]];

function video() {
  const v = new Video('minimum-spanning-tree', 'Minimum spanning tree');
  const n = L.length;
  const nodes = L.map((l, i) => ({ id: String(i), label: l, x: POS[i][0], y: POS[i][1] }));
  const edges = E.map(([a, b, w]) => ({ a: String(a), b: String(b), w }));
  const nm = ([a, b]: [number, number, number]) => `${L[a]}${L[b]}`;

  v.chapter('intro', 'Connect everything as cheaply as possible');
  v.graph('g', nodes, edges, { label: 'possible cables and their costs' });
  v.say('Six buildings need to be networked. Each line is a cable we could lay, with its cost. We want every building connected, directly or indirectly, for the least total cost.');
  v.eq('pick n − 1 edges, no cycle, minimum total');
  v.say('The cheapest answer never contains a cycle, because dropping any edge of a cycle keeps everything connected and saves money. A connected graph with no cycles on n nodes is a tree with n minus one edges: a minimum spanning tree.');

  v.chapter('kruskal', 'Kruskal: cheapest edge first, skip cycles', { cx: 'O(E log E)', code: ['sort edges by cost', 'for each edge (a, b): if find(a) != find(b):', '  take it; union(a, b)', 'else skip: it would close a cycle', 'stop after n − 1 edges'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'green = taken · red = would make a cycle' });
  const sorted = [...E].sort((x, y) => x[2] - y[2]);
  const arr = v.array('e', sorted.map((e) => `${nm(e)} ${e[2]}`), { label: 'edges sorted by cost' });
  v.weight('g', 2.4).weight('e', 1.2);
  v.line(0).say('Kruskal’s idea is greedy. Sort the edges from cheapest to most expensive and walk down the list. Take an edge unless its two ends are already connected, in which case it would only close a cycle.');
  const par = [...Array(n).keys()];
  const find = (x: number): number => (par[x] === x ? x : (par[x] = find(par[x])));
  let taken = 0, total = 0, told = 0;
  for (let i = 0; i < sorted.length && taken < n - 1; i++) {
    const [a, b, w] = sorted[i];
    arr.tone(i, 'cmp');
    const ra = find(a), rb = find(b);
    if (ra !== rb) {
      par[ra] = rb; taken++; total += w;
      g.edge(String(a), String(b), 'ok'); g.tone(String(a), 'ok').tone(String(b), 'ok');
      arr.tone(i, 'ok');
      v.line(1, 2).counter(`${taken}/${n - 1} edges · cost ${total}`).eq(`${nm(sorted[i])} (${w}): different groups → take`, 'ok');
      if (i === 0) v.say(`The cheapest edge, ${L[a]} to ${L[b]} for ${words(w)}, is always safe to take.`);
      else if (taken === n - 1) v.say(`${L[a]}${L[b]} joins the last separate building. That is n minus one edges, so we stop without looking at the rest.`);
      else v.hold(800);
    } else {
      g.edge(String(a), String(b), 'bad');
      arr.tone(i, 'bad');
      v.line(3).eq(`${nm(sorted[i])} (${w}): ${L[a]} and ${L[b]} already connected → skip`, 'bad');
      if (told++ === 0) v.say(`${L[a]} to ${L[b]} costs ${words(w)}, but ${L[a]} and ${L[b]} are already connected through the edges we took. Adding it would close a cycle, so skip it. Union-Find answers “already connected?” in almost constant time.`);
      else v.hold(800);
      g.edge(String(a), String(b), 'none');
    }
  }
  for (let i = 0; i < sorted.length; i++) if (arr.p.tones?.[i] === 'cmp' || !arr.p.tones?.[i]) arr.tone(i, 'dim');
  v.line(4).eq(`MST cost = ${total}`, 'ok').say(`Five edges, total cost ${words(total)}. Sorting dominates: E log E.`);

  v.chapter('prim', 'Prim: grow one tree, always the cheapest edge leaving it', { cx: 'O(E log V)', code: ['start with any node in the tree', 'heap of edges leaving the tree', 'pop cheapest (w, x): skip if x already in the tree', '  add x; push x’s edges to outside nodes'] });
  v.clear();
  const pg = v.graph('g', nodes, edges, { label: 'green = in the tree' });
  const cost = new Map<string, number>();
  const h = v.heap('h', { label: 'min-heap (cost : node)', treeOnly: true, cmp: (x, y) => cost.get(String(x))! - cost.get(String(y))! || (String(x) < String(y) ? -1 : 1) });
  v.layout('row').weight('g', 2.2).weight('h', 1);
  const adj = Array.from({ length: n }, () => [] as [number, number][]);
  E.forEach(([a, b, w]) => { adj[a].push([b, w]); adj[b].push([a, w]); });
  const inT = Array(n).fill(false);
  const via = new Map<string, number>();
  const push = (w: number, x: number, from: number) => { const k = `${w}:${L[x]}`; cost.set(k, w); via.set(k, from); h.push(k); };
  inT[0] = true; pg.tone('0', 'ok');
  adj[0].forEach(([x, w]) => push(w, x, 0));
  v.line(0, 1).eq(`tree = {A}; heap: ${adj[0].map(([x, w]) => `${w}:${L[x]}`).join(', ')}`).say('Prim grows a single tree. Start at A and put every edge leaving the tree into a min-heap.');
  let ptotal = 0, pn = 1, ptold = 0;
  while (h.size && pn < n) {
    const k = String(h.pop());
    const w = cost.get(k)!;
    const x = L.indexOf(k.split(':')[1]);
    const from = via.get(k)!;
    if (inT[x]) {
      v.line(2).eq(`pop ${k}: ${L[x]} already in the tree → skip`, 'warn');
      if (ptold++ === 0) v.say(`The heap offers ${L[x]} for ${words(w)}, but ${L[x]} joined the tree already through a cheaper edge. Skip it.`); else v.hold(700);
      continue;
    }
    inT[x] = true; pn++; ptotal += w;
    pg.tone(String(x), 'ok').edge(String(from), String(x), 'ok');
    const out = adj[x].filter(([y]) => !inT[y]);
    out.forEach(([y, c]) => push(c, y, x));
    v.line(2, 3).counter(`tree ${pn}/${n} · cost ${ptotal}`).eq(`pop ${k}: add ${L[from]}${L[x]}${out.length ? `; push ${out.map(([y, c]) => `${c}:${L[y]}`).join(', ')}` : ''}`, 'ok');
    if (pn === 2) v.say(`The cheapest edge leaving the tree goes to ${L[x]} for ${words(w)}. Add ${L[x]}, and push its edges to nodes still outside.`);
    else if (pn === 3) v.say(`Now the cheapest crossing edge is ${L[from]} to ${L[x]}, cost ${words(w)}. Each step adds the single cheapest edge between the tree and the rest.`);
    else v.hold(800);
  }
  v.eq(`MST cost = ${ptotal}`, 'ok').say(`The same total, ${words(ptotal)}. With a heap Prim is E log V; on a dense graph, like all pairs of points, a plain array version runs in V squared.`);

  v.chapter('why', 'Why greedy is safe: the cut property');
  v.clear();
  v.text('t', { title: 'Cut property', lines: ['Split the nodes into any two groups', 'The cheapest edge crossing between them belongs to some MST', 'Kruskal: the edge joins two groups, and is the cheapest that can', 'Prim: the groups are “tree” and “the rest”'], shown: 4 });
  v.say('Why can we be so greedy? Split the nodes into two groups any way you like. Some edge must cross between them, and swapping in the cheapest crossing edge never makes a spanning tree worse. Both algorithms only ever take such an edge.');

  v.chapter('choose', 'Choosing between them');
  v.clear();
  v.table('c', ['Graph', 'Use', 'Cost'], [
    ['edge list, sparse', 'Kruskal + Union-Find', 'O(E log E)'],
    ['adjacency list', 'Prim + heap', 'O(E log V)'],
    ['complete / dense (all pairs of points)', 'Prim with an array', 'O(V²)'],
  ]);
  v.say('Kruskal is natural when you are handed a list of edges. For points where every pair is an edge, the array version of Prim avoids even building the edges.');
  return v.build();
}

const body = String.raw`
## The idea

A **minimum spanning tree** (MST) connects all \`n\` nodes of a weighted undirected graph using \`n − 1\` edges with the **smallest total weight**. It never has a cycle.

> Real-life picture: laying cable between buildings so everyone is connected, spending as little as possible.

## Kruskal (sort + Union-Find)

\`\`\`java
int kruskal(int n, int[][] edges) {                    // {a, b, w}
    Arrays.sort(edges, (x, y) -> x[2] - y[2]);
    int[] parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int total = 0, used = 0;
    for (int[] e : edges) {
        int a = find(parent, e[0]), b = find(parent, e[1]);
        if (a == b) continue;                          // would close a cycle
        parent[a] = b;
        total += e[2];
        if (++used == n - 1) break;
    }
    return total;
}
int find(int[] p, int x) { return p[x] == x ? x : (p[x] = find(p, p[x])); }
\`\`\`

\`\`\`python
def kruskal(n, edges):                                 # (a, b, w)
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    total = used = 0
    for a, b, w in sorted(edges, key=lambda e: e[2]):
        ra, rb = find(a), find(b)
        if ra == rb:
            continue                                   # would close a cycle
        parent[ra] = rb
        total += w
        used += 1
        if used == n - 1:
            break
    return total
\`\`\`

\`\`\`cpp
int find(vector<int>& p, int x) { return p[x] == x ? x : p[x] = find(p, p[x]); }
int kruskal(int n, vector<array<int,3>> edges) {       // {a, b, w}
    sort(edges.begin(), edges.end(), [](auto& x, auto& y) { return x[2] < y[2]; });
    vector<int> parent(n);
    iota(parent.begin(), parent.end(), 0);
    int total = 0, used = 0;
    for (auto& [a, b, w] : edges) {
        int ra = find(parent, a), rb = find(parent, b);
        if (ra == rb) continue;                        // would close a cycle
        parent[ra] = rb;
        total += w;
        if (++used == n - 1) break;
    }
    return total;
}
\`\`\`

## Prim (grow one tree)

Start from any node. Keep a min-heap of edges leaving the tree; pop the cheapest, skip it if its far end is already in the tree, otherwise add that node and push its edges. On a **dense** graph use an array \`best[v]\` (cheapest edge from the tree to \`v\`) and scan it: O(V²), no heap needed.

## Why greedy works

**Cut property**: for any split of the nodes into two groups, the cheapest edge crossing the split is in some MST. Kruskal and Prim only ever add such edges.

## Pitfalls

- An MST needs a **connected** graph; if Kruskal ends with fewer than n − 1 edges, the graph is disconnected.
- Shortest path trees and minimum spanning trees are **different** things.
- For points, the graph has n² edges: prefer O(n²) Prim over sorting n² edges.
`;

const lesson: Lesson = {
  slug: 'minimum-spanning-tree',
  video,
  body,
  quiz: [
    { q: 'How many edges does a spanning tree of n nodes have?', options: ['n', 'n − 1', 'n + 1', 'n²'], answer: 1, why: 'A tree on n nodes always has n − 1 edges.' },
    { q: 'Kruskal skips an edge when…', options: ['it is expensive', 'its ends are already connected', 'it is the first edge', 'it touches a leaf'], answer: 1, why: 'It would close a cycle.' },
    { q: 'Best MST algorithm for 1000 points where every pair is an edge?', options: ['Kruskal', 'Prim with an array (O(V²))', 'Bellman-Ford', 'Dijkstra'], answer: 1, why: 'The graph is complete; O(V²) beats sorting V² edges.' },
    { q: 'Which data structure makes Kruskal’s cycle check fast?', options: ['stack', 'Union-Find', 'trie', 'deque'], answer: 1, why: 'find() tells whether two nodes are already connected.' },
  ],
};

export default lesson;
