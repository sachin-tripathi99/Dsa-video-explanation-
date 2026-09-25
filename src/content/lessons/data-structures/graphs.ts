import type { Lesson } from '../../types';
import { Video } from '../../helpers';

const NODES = [
  { id: '0', label: '0', x: 10, y: 50 },
  { id: '1', label: '1', x: 40, y: 12 },
  { id: '2', label: '2', x: 40, y: 88 },
  { id: '3', label: '3', x: 72, y: 50 },
  { id: '4', label: '4', x: 96, y: 50 },
];
const EDGES = [{ a: '0', b: '1' }, { a: '0', b: '2' }, { a: '1', b: '2' }, { a: '1', b: '3' }, { a: '3', b: '4' }];

function video() {
  const v = new Video('graphs', 'Graphs and how to store them');
  v.chapter('intro', 'Cities and roads');
  const g = v.graph('g', NODES, EDGES, { label: 'an undirected graph: 5 nodes, 5 edges' });
  v.say('A graph is a set of things, called nodes or vertices, and connections between them, called edges. Cities and roads. People and friendships. Web pages and links. Trees and linked lists are special cases of graphs.');
  g.tone('1', 'active');
  ['0', '2', '3'].forEach((n) => g.tone(n, 'cmp'));
  v.eq('neighbours of 1: 0, 2, 3 → degree 3').say('The neighbours of a node are the nodes it has an edge to. Node one has three neighbours, so its degree is three.');
  g.clearTones();

  v.chapter('kinds', 'Directed, weighted, cyclic');
  v.clear();
  v.table('k', ['Kind', 'Meaning', 'Example'], [
    ['Undirected', 'edges go both ways', 'friendships, roads'],
    ['Directed', 'edges have a direction a → b', 'followers, prerequisites, links'],
    ['Weighted', 'edges carry a cost or distance', 'road lengths, flight prices'],
    ['Cyclic / acyclic', 'a path can / cannot return to its start', 'a DAG: task dependencies'],
    ['Connected', 'every node reachable from every other', 'components = separate islands'],
  ]);
  v.say('Graphs come in flavours. Edges may be directed, like following someone who does not follow you back. They may carry weights, like distances. And a directed graph with no cycles, a DAG, models dependencies.');

  v.chapter('store', 'Storing a graph', { code: ['adj = list of lists, one per node', 'for (a, b) in edges:', '  adj[a].append(b)', '  adj[b].append(a)    (undirected)'] });
  v.clear().layout('row');
  const g2 = v.graph('g', NODES, EDGES, { label: 'edges: [0,1] [0,2] [1,2] [1,3] [3,4]' });
  const adj = v.map('adj', { label: 'adjacency list' });
  const lists: Record<string, string[]> = {};
  NODES.forEach((n) => { lists[n.id] = []; adj.put(n.id, '[]'); });
  v.say('Problems usually give you a list of edges. The standard way to store a graph is an adjacency list: for every node, the list of its neighbours.');
  EDGES.forEach((e, i) => {
    lists[e.a].push(e.b);
    lists[e.b].push(e.a);
    adj.put(e.a, `[${lists[e.a].join(', ')}]`).put(e.b, `[${lists[e.b].join(', ')}]`).clearTones().tone(e.a, 'active').tone(e.b, 'active');
    g2.clearTones().edge(e.a, e.b, 'active');
    v.line(2, 3).eq(`edge ${e.a}–${e.b}: add each to the other’s list`);
    if (i === 0) v.say('For each edge, add each endpoint to the other one’s list, because an undirected edge works both ways.');
    else v.hold(650);
  });
  g2.clearTones();
  adj.clearTones();
  v.eq('space O(V + E)', 'ok').say('The adjacency list uses space proportional to nodes plus edges, and lets you loop over a node’s neighbours directly.');
  v.clear();
  const M = NODES.map((a) => NODES.map((b) => (EDGES.some((e) => (e.a === a.id && e.b === b.id) || (e.b === a.id && e.a === b.id)) ? 1 : 0)));
  v.grid('m', M, { label: 'adjacency matrix: m[a][b] = 1 if there is an edge', rowHead: NODES.map((n) => n.id), colHead: NODES.map((n) => n.id) });
  v.eq('space O(V²) · "is there an edge a–b?" in O(1)').say('The alternative is an adjacency matrix: a V by V grid of zeros and ones. Checking one specific edge is instant, but it always costs V squared space. Use it for small, dense graphs; use lists otherwise.');

  v.chapter('traverse', 'Visiting everything: BFS and DFS', { code: ['visited = {start}; queue = [start]', 'while queue:', '  node = queue.popleft()', '  for nb in adj[node]: if not visited → mark, enqueue'] });
  v.clear().layout('row');
  const g3 = v.graph('g', NODES, EDGES, { label: 'breadth-first search from 0' });
  const q = v.queue('q', [0], { label: 'queue', ends: ['front', 'back'] });
  const visited = new Set(['0']);
  const order: string[] = [];
  const queue = ['0'];
  const nb: Record<string, string[]> = { 0: ['1', '2'], 1: ['0', '2', '3'], 2: ['0', '1'], 3: ['1', '4'], 4: ['3'] };
  g3.tone('0', 'visit').badge('0', 'd=0');
  const dist: Record<string, number> = { 0: 0 };
  v.say('Most graph algorithms start by visiting every reachable node exactly once. Breadth-first search uses a queue and explores in rings: first the neighbours, then their neighbours.');
  while (queue.length) {
    const n = queue.shift()!;
    q.shift();
    order.push(n);
    g3.tone(n, 'active');
    for (const m of nb[n]) {
      if (visited.has(m)) continue;
      visited.add(m);
      queue.push(m);
      q.push(Number(m));
      dist[m] = dist[n] + 1;
      g3.tone(m, 'visit').edge(n, m, 'visit').badge(m, `d=${dist[m]}`);
    }
    v.line(3).eq(`visit ${n} · queue: [${queue.join(', ')}]`).hold(900);
    g3.tone(n, 'done');
  }
  v.eq(`order ${order.join(' → ')} · each node and edge handled once: O(V + E)`, 'ok').say('Every node is enqueued once and every edge is looked at twice, once from each end. So BFS is O of V plus E. The badges show the number of edges from the start, which BFS finds as the shortest path in an unweighted graph. Depth-first search does the same with a stack or recursion. Both get full modules later.');

  v.chapter('grids', 'Grids are graphs too');
  v.clear();
  const grid = v.grid('gr', [[1, 1, 0], [0, 1, 0], [1, 0, 1]], { label: 'each cell is a node; neighbours are up, down, left, right' });
  grid.tone(1, 1, 'active').tone(0, 1, 'cmp').tone(2, 1, 'cmp').tone(1, 0, 'cmp').tone(1, 2, 'cmp');
  v.eq('(r, c) → (r±1, c), (r, c±1)').say('Many problems hide a graph in a grid. Every cell is a node, and its neighbours are the cells above, below, left and right. You do not build an adjacency list; you compute neighbours on the fly.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.table('r', ['Representation', 'Space', 'Neighbours of v', 'Edge (a, b)?'], [
    ['Adjacency list', 'O(V + E)', 'O(deg v)', 'O(deg a)'],
    ['Adjacency matrix', 'O(V²)', 'O(V)', 'O(1)'],
    ['Edge list', 'O(E)', 'O(E)', 'O(E)'],
  ]).tone(0, 'ok');
  v.say('Build an adjacency list first, almost always. Then BFS and DFS visit everything in O of V plus E. That is the foundation for islands, shortest paths, topological sort, union find, and more.');
  return v.build();
}

const body = String.raw`
## The idea

A **graph** is a set of **nodes** (vertices) connected by **edges**. Trees, linked lists and grids are all special graphs.

> Real-life picture: a road map. Cities are nodes, roads are edges; one-way streets are directed edges; distances are weights.

| Term | Meaning |
|---|---|
| directed / undirected | edges have a direction (a → b) or not |
| weighted | edges carry a number (distance, cost, time) |
| degree | number of edges at a node (in-degree / out-degree when directed) |
| path, cycle | a sequence of edges; a cycle returns to its start |
| connected component | a maximal set of nodes that can reach each other |
| DAG | directed acyclic graph: dependencies, build orders |

## Representations

| | Space | Neighbours of v | Is (a, b) an edge? | Use when |
|---|---|---|---|---|
| **Adjacency list** | O(V + E) | O(deg v) | O(deg a) | almost always |
| Adjacency matrix | O(V²) | O(V) | O(1) | small or dense graphs |
| Edge list | O(E) | O(E) | O(E) | Kruskal's MST, Bellman-Ford |

\`\`\`java
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
for (int[] e : edges) {
    adj.get(e[0]).add(e[1]);
    adj.get(e[1]).add(e[0]);        // omit for directed graphs
}
\`\`\`

\`\`\`python
from collections import defaultdict
adj = defaultdict(list)             # or [[] for _ in range(n)]
for a, b in edges:
    adj[a].append(b)
    adj[b].append(a)                # omit for directed graphs
\`\`\`

\`\`\`cpp
vector<vector<int>> adj(n);
for (auto& e : edges) {
    adj[e[0]].push_back(e[1]);
    adj[e[1]].push_back(e[0]);      // omit for directed graphs
}
\`\`\`

## Visiting every node

**BFS** (queue) explores in rings around the start and finds shortest paths in unweighted graphs. **DFS** (stack or recursion) goes deep first; great for components, cycle detection and topological order. Both run in **O(V + E)** with a \`visited\` set so each node is processed once.

\`\`\`python
from collections import deque
def bfs(start):
    seen = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for nb in adj[node]:
            if nb not in seen:
                seen.add(nb)        # mark when enqueuing, not when popping
                q.append(nb)
\`\`\`

\`\`\`java
void bfs(int start, List<List<Integer>> adj, boolean[] seen) {
    Deque<Integer> q = new ArrayDeque<>();
    q.offer(start);
    seen[start] = true;             // mark when enqueuing
    while (!q.isEmpty()) {
        int node = q.poll();
        for (int nb : adj.get(node)) if (!seen[nb]) { seen[nb] = true; q.offer(nb); }
    }
}
\`\`\`

\`\`\`cpp
void bfs(int start, vector<vector<int>>& adj, vector<bool>& seen) {
    queue<int> q;
    q.push(start);
    seen[start] = true;             // mark when enqueuing
    while (!q.empty()) {
        int node = q.front(); q.pop();
        for (int nb : adj[node]) if (!seen[nb]) { seen[nb] = true; q.push(nb); }
    }
}
\`\`\`

## Grids are graphs

A cell \`(r, c)\` has neighbours \`(r±1, c)\` and \`(r, c±1)\` inside the bounds. Don't build an adjacency list; loop over four direction offsets.

## Where graphs lead in this course

[Graph BFS/DFS](#/learn/graph-traversal) → [Multi-source BFS](#/learn/multi-source-bfs) → [Topological sort](#/learn/topological-sort) → [Union-Find](#/learn/union-find) → [Shortest paths](#/learn/shortest-paths) → [Minimum spanning tree](#/learn/mst).
`;

const lesson: Lesson = {
  slug: 'graphs',
  video,
  body,
  quiz: [
    { q: 'Space used by an adjacency list?', options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V²)'], answer: 2, why: 'One list per node, plus one entry per edge endpoint.' },
    { q: 'When is an adjacency matrix a good idea?', options: ['Huge sparse graphs', 'Small or dense graphs, or when you need O(1) edge checks', 'Never', 'Only for trees'], answer: 1, why: 'It always costs V² space, so it only pays off when V is small or edges are dense.' },
    { q: 'BFS and DFS with a visited set run in…', options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V · E)'], answer: 2, why: 'Each node is processed once and each edge examined a constant number of times.' },
    { q: 'In an undirected graph given as an edge list, when building adjacency lists you must…', options: ['add only a → b', 'add both a → b and b → a', 'sort the edges first', 'remove duplicates first'], answer: 1, why: 'Undirected edges can be traversed both ways.' },
  ],
};

export default lesson;
