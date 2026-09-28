import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { layered, kahnViz, andList } from '../../topoviz';

// Getting dressed: an arrow a → b means "a must go on before b".
const ITEMS = [['🩲', 'shorts'], ['🧦', 'socks'], ['👕', 'shirt'], ['⌚', 'watch'], ['👖', 'pants'], ['👔', 'tie'], ['👟', 'shoes'], ['🧥', 'jacket']];
const E: [number, number][] = [[0, 4], [4, 6], [1, 6], [2, 5], [5, 7], [4, 7]];
const CYC: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 1], [0, 4]];

const adjOf = (n: number, e: [number, number][]) => { const a = Array.from({ length: n }, () => [] as number[]); e.forEach(([x, y]) => a[x].push(y)); return a; };

function video() {
  const v = new Video('topological-sort', 'Topological sort');
  const n = ITEMS.length;
  const nodes = layered(n, E, { label: (i) => ITEMS[i][0], sub: (i) => ITEMS[i][1] });
  const edges = E.map(([a, b]) => ({ a: String(a), b: String(b) }));
  const nm = (i: number) => ITEMS[i][1];

  v.chapter('intro', 'Ordering things that depend on each other');
  v.graph('g', nodes, edges, { label: 'a → b: a goes on before b', directed: true });
  v.say('Getting dressed. Shorts before pants, pants before shoes, socks before shoes, shirt before tie, tie and pants before the jacket. The watch can go on whenever. We need one order that respects every arrow.');
  v.eq('topological order: every arrow points forward in the list');
  v.say('Such an order is called a topological order. Laid out in a line, every arrow points forward. Course prerequisites, build systems, spreadsheet formulas and package installs are all this problem.');

  v.chapter('cycle', 'An order exists only without cycles');
  v.clear();
  v.graph('c', [{ id: 'a', label: 'A', x: 50, y: 12 }, { id: 'b', label: 'B', x: 80, y: 85 }, { id: 'c', label: 'C', x: 20, y: 85 }], [{ a: 'a', b: 'b' }, { a: 'b', b: 'c' }, { a: 'c', b: 'a' }], { label: 'A before B before C before A?', directed: true });
  v.eq('cycle → no valid order', 'bad').say('If A must come before B, B before C, and C before A, nobody can go first. A topological order exists exactly when the directed graph has no cycle, a DAG. So every algorithm here doubles as a cycle detector.');

  v.chapter('kahn', 'Kahn’s algorithm: repeatedly take what is ready', { cx: 'O(V + E)', code: ['indeg[v] = # arrows into v; queue all v with indeg 0', 'while queue: u = pop; order.append(u)', '  for w in adj[u]: indeg[w]--; if indeg[w] == 0: push w', 'len(order) < n → there was a cycle'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'badge = arrows still waiting', directed: true });
  v.say('Kahn’s idea is what you do naturally. Anything with no remaining prerequisites can go on now. Putting it on satisfies one prerequisite of each thing it points to. Keep a count of unmet prerequisites per node, and a queue of nodes whose count is zero.');
  kahnViz(v, g, n, adjOf(n, E), {
    name: nm,
    lines: { init: [0], pop: [1, 2], done: [3] },
    finalSay: (order) => `Everything is placed: ${order.map(nm).join(', ')}. Each item was queued once and each arrow was crossed once, so Kahn’s algorithm is O(V + E).`,
  });
  v.say('Many orders are valid. Which one you get depends on the order nodes enter the queue. Swap the queue for a min-heap and you get the smallest order in dictionary order.');

  v.chapter('detect', 'Cycle detection for free');
  v.clear();
  const cn = 5;
  const cg = v.graph('g', layered(cn, CYC), CYC.map(([a, b]) => ({ a: String(a), b: String(b) })), { label: '1 → 2 → 3 → 1 is a cycle', directed: true });
  kahnViz(v, cg, cn, adjOf(cn, CYC), {
    lines: { init: [0], pop: [1, 2], done: [3] },
    narrate: 'all',
    sayInit: 'Now a graph with a cycle: one, two and three wait on each other. Only zero starts ready.',
    finalSay: (order, stuck) => `The queue runs dry after placing ${words(order.length)} of ${words(cn)}. Nodes ${andList(stuck.map(String))} still have unmet prerequisites, and they always will: each waits for the next around the cycle. Checking whether the order has all n nodes is the cycle test.`,
  });

  v.chapter('dfs', 'The other way: DFS finish order, reversed', { cx: 'O(V + E)', code: ['dfs(u): mark u in progress', '  for w in adj[u]: if w in progress → cycle; if new: dfs(w)', '  mark u done; finished.append(u)', 'order = reversed(finished)'] });
  v.clear();
  const d = v.graph('g', nodes, edges, { label: 'gray = on the current path · green = finished', directed: true });
  const fin = v.vars('fin', { finished: '—' });
  v.say('There is a second classic method. Run a DFS. A node finishes only after everything it points to has finished. So the finish order is a valid order backwards; reverse it at the end.');
  const adj = adjOf(n, E);
  const state = Array(n).fill(0);
  const finished: number[] = [];
  let told = 0;
  const dfs = (u: number) => {
    state[u] = 1;
    d.tone(String(u), 'active');
    v.line(0, 1).eq(`enter ${nm(u)}`);
    v.hold(450);
    for (const w of adj[u]) if (state[w] === 0) { d.edge(String(u), String(w), 'path'); dfs(w); }
    state[u] = 2;
    finished.push(u);
    d.tone(String(u), 'ok');
    fin.set({ finished: finished.map(nm).join(' → ') });
    v.line(2).eq(`finish ${nm(u)} → finished: ${finished.map(nm).join(', ')}`);
    if (told === 0) { v.say(`${nm(u)[0].toUpperCase()}${nm(u).slice(1)} ${adj[u].length ? 'has nothing unfinished below it' : 'points nowhere'}, so it finishes first: it can safely go last.`); told++; }
    else if (told === 1 && adj[u].length) { v.say(`${nm(u)[0].toUpperCase()}${nm(u).slice(1)} finishes only after ${adj[u].map(nm).join(' and ')}, which it must come before.`); told++; }
    else v.hold(600);
  };
  for (let i = 0; i < n; i++) if (state[i] === 0) dfs(i);
  const order = [...finished].reverse();
  fin.set({ order: order.map(nm).join(' → ') }, 'ok');
  v.line(3).eq(`reversed: ${order.map(nm).join(', ')}`, 'ok').say(`Reverse the finish order and every arrow points forward. For cycle detection, the in-progress mark matters: meeting a node that is still on the current path means an arrow points back into the path, which is a cycle.`);

  v.chapter('patterns', 'Where it shows up');
  v.clear();
  v.table('t', ['Problem shape', 'Technique'], [
    ['can all tasks finish? (course schedule)', 'Kahn; count placed == n'],
    ['produce an order (build order, alien dictionary)', 'Kahn’s order, or reversed DFS finish'],
    ['nodes that never reach a cycle (safe states)', 'Kahn on the reversed graph'],
    ['reachability between all pairs of a DAG', 'propagate sets in topological order'],
    ['centre of a tree (min height trees)', 'peel leaves layer by layer, like Kahn'],
  ]);
  v.say('Whenever a problem talks about prerequisites, dependencies, or things that must happen before other things, draw the arrows and think topological order.');
  return v.build();
}

const body = String.raw`
## The idea

A **topological order** of a directed graph lists every node so that **every edge points forward**. It exists exactly when the graph has **no directed cycle** (a DAG), so every topological sort is also a cycle detector.

> Real-life picture: getting dressed. Socks before shoes, shirt before tie. The watch can go on whenever.

## Kahn's algorithm (BFS)

1. Count \`indeg[v]\`, the number of edges into each node.
2. Queue every node with \`indeg == 0\`: they are ready.
3. Pop \`u\`, append it to the order, and decrement \`indeg\` of each neighbour; any that hit 0 join the queue.
4. If the order has fewer than \`n\` nodes, the rest sit on a cycle.

\`\`\`java
int[] topo(int n, List<List<Integer>> adj) {
    int[] indeg = new int[n];
    for (List<Integer> out : adj) for (int w : out) indeg[w]++;
    Deque<Integer> q = new ArrayDeque<>();
    for (int v = 0; v < n; v++) if (indeg[v] == 0) q.offer(v);
    int[] order = new int[n];
    int k = 0;
    while (!q.isEmpty()) {
        int u = q.poll();
        order[k++] = u;
        for (int w : adj.get(u)) if (--indeg[w] == 0) q.offer(w);
    }
    return k == n ? order : new int[0];               // short → cycle
}
\`\`\`

\`\`\`python
from collections import deque

def topo(n, adj):
    indeg = [0] * n
    for out in adj:
        for w in out:
            indeg[w] += 1
    q = deque(v for v in range(n) if indeg[v] == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for w in adj[u]:
            indeg[w] -= 1
            if indeg[w] == 0:
                q.append(w)
    return order if len(order) == n else []          # short → cycle
\`\`\`

\`\`\`cpp
vector<int> topo(int n, vector<vector<int>>& adj) {
    vector<int> indeg(n, 0), order;
    for (auto& out : adj) for (int w : out) indeg[w]++;
    queue<int> q;
    for (int v = 0; v < n; v++) if (indeg[v] == 0) q.push(v);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int w : adj[u]) if (--indeg[w] == 0) q.push(w);
    }
    return (int)order.size() == n ? order : vector<int>{};   // short → cycle
}
\`\`\`

## DFS alternative

Run DFS with three states: **new**, **in progress** (on the current path), **done**. When a node finishes, append it; the **reversed** finish list is a topological order. Reaching an in-progress node means a back edge, which is a cycle.

## Patterns

| Shape | Technique |
|---|---|
| Can everything be scheduled? | Kahn, then check \`placed == n\` |
| Produce any valid order | Kahn's order, or reversed DFS finish order |
| Smallest order in dictionary order | Kahn with a min-heap instead of a queue |
| Nodes that cannot reach a cycle | Kahn on the **reversed** graph (out-degrees) |
| All-pairs "is a before b?" | Propagate reachable sets in topological order |
| Tree centres | Peel leaves (degree 1) layer by layer |

## Pitfalls

- Get the edge direction right: prerequisite \`[a, b]\` ("take b before a") is the edge **b → a**.
- Nodes with no edges at all still belong in the order.
- In DFS cycle detection, "visited" is not enough: you need the in-progress state, or a node reached twice by two different paths looks like a cycle.
`;

const lesson: Lesson = {
  slug: 'topological-sort',
  video,
  body,
  quiz: [
    { q: 'When does a directed graph have a topological order?', options: ['always', 'when it has no directed cycle', 'when it is connected', 'when every node has an edge'], answer: 1, why: 'A cycle leaves no node that can go first.' },
    { q: 'In Kahn’s algorithm, which nodes start in the queue?', options: ['nodes with out-degree 0', 'nodes with in-degree 0', 'all nodes', 'the node with most edges'], answer: 1, why: 'Nodes with no unmet prerequisites are ready.' },
    { q: 'Kahn placed 7 of 9 nodes before the queue emptied. What does that mean?', options: ['a bug', 'the graph has a cycle', 'two components', 'the order is reversed'], answer: 1, why: 'The leftover nodes wait on each other around a cycle.' },
    { q: 'Prerequisite pair [a, b] means “take b before a”. Which edge do you add?', options: ['a → b', 'b → a', 'both', 'neither'], answer: 1, why: 'Edges point from what comes first to what depends on it.' },
  ],
};

export default lesson;
