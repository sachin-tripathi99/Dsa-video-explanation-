import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const G = [[1, 2], [0, 3], [0, 3], [1, 2, 4], [3]];
function shortest(g: number[][]) { const n = g.length, full = (1 << n) - 1; if (n === 1) return 0; const seen = new Set<number>(); let q: [number, number][] = []; for (let i = 0; i < n; i++) { q.push([i, 1 << i]); seen.add(i * 4096 + (1 << i)); } for (let d = 0; q.length; d++) { const nq: [number, number][] = []; for (const [u, m] of q) { if (m === full) return d; for (const w of g[u]) { const nm = m | (1 << w); const k = w * 4096 + nm; if (!seen.has(k)) { seen.add(k); nq.push([w, nm]); } } } q = nq; } return -1; }

function video() {
  const v = new Video('shortest-path-visiting-all-nodes', 'Shortest Path Visiting All Nodes');
  const n = G.length, full = (1 << n) - 1;
  const ans = shortest(G);
  const pos = [[10, 50], [40, 15], [40, 85], [70, 50], [95, 50]];
  const nodes = G.map((_, i) => ({ id: String(i), label: String(i), x: pos[i][0], y: pos[i][1] }));
  const edges: { a: string; b: string }[] = [];
  G.forEach((ns, a) => ns.forEach((b) => { if (a < b) edges.push({ a: String(a), b: String(b) }); }));
  const bin = (m: number) => m.toString(2).padStart(n, '0');
  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: 'undirected, connected graph' });
  v.say('Find the length of the shortest walk that visits every node. You may start and stop anywhere, and revisit nodes and edges as often as you like.');
  v.eq(`answer: ${ans} (e.g. 1 → 0 → 2 → 3 → 4)`);

  v.chapter('brute', 'Brute force: try every visiting order', { cx: 'O(n! · n)', code: ['all-pairs distances with BFS', 'for each order of nodes: sum distances between consecutive nodes'] });
  v.eq('n! orders', 'bad').say('Since revisits are allowed, the walk between two consecutive new nodes is just a shortest path. Trying every order of the nodes is n factorial.');

  v.chapter('better', 'Better: Held–Karp dp[mask][last]', { cx: 'O(2ⁿ · n²)', code: ['dp[mask][last] = shortest walk covering mask, ending at last', 'dp[mask | w][w] = min(dp[mask][last] + dist[last][w])'] });
  v.eq('2ⁿ · n states', 'warn').say('The bitmask DP from the lesson works, using all-pairs distances.');

  v.chapter('optimal', 'Optimal: BFS over states (node, visited mask)', { cx: 'O(2ⁿ · n · deg)', code: ['start: every (i, {i}) at distance 0', 'BFS: (u, mask) → (w, mask | w) for each neighbour w', 'first state with mask == all → its distance'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'nodes appearing in this BFS layer' });
  const tb = v.table('t', ['steps', 'states reached (node : visited)'], []);
  v.layout('row').weight('g', 1.4).weight('t', 1.2);
  v.line(0).say('Every step costs one, so the shortest walk is a BFS, but not over nodes: a node visited with different histories is a different situation. The state is the current node plus the set of visited nodes. Start from every node at once, since the walk may start anywhere.');
  const seen = new Set<string>();
  let q: [number, number][] = [];
  for (let i = 0; i < n; i++) { q.push([i, 1 << i]); seen.add(`${i}:${1 << i}`); }
  for (let d = 0; q.length; d++) {
    g.clearTones();
    q.forEach(([u]) => g.tone(String(u), 'active'));
    const done = q.find(([, m]) => m === full);
    const shown = q.slice(0, 4).map(([u, m]) => `${u}:${bin(m)}`).join(' ') + (q.length > 4 ? ` … (+${q.length - 4})` : '');
    tb.addRow([String(d), shown]);
    if (done) {
      g.tone(String(done[0]), 'ok');
      v.line(2).counter(`distance ${d}`).eq(`(${done[0]}, ${bin(full)}) reached after ${d} steps`, 'ok').say(`After ${words(d)} steps, a state with every bit set appears: all nodes visited, ending at node ${words(done[0])}. BFS reaches it first, so ${words(d)} is the answer.`);
      break;
    }
    v.line(1).counter(`distance ${d}`).eq(`layer ${d}: ${q.length} states`);
    if (d === 0) v.say('Distance zero: five states, one per starting node, each having visited only itself.');
    else if (d === 1) v.say('One step: every state moves to each neighbour and adds it to its visited set. The number of states grows, but each pair of node and mask is queued only once.');
    else v.hold(1100);
    const nq: [number, number][] = [];
    for (const [u, m] of q) for (const w of G[u]) { const nm = m | (1 << w); const k = `${w}:${nm}`; if (!seen.has(k)) { seen.add(k); nq.push([w, nm]); } }
    q = nq;
  }
  v.answer(ans);

  recap(v, [{ name: 'All orders', time: 'O(n! · n)', space: 'O(n²)' }, { name: 'Held–Karp DP', time: 'O(2ⁿ · n²)', space: 'O(2ⁿ · n)' }, { name: 'BFS over (node, mask)', time: 'O(2ⁿ · n · deg)', space: 'O(2ⁿ · n)' }], 'State = (where I am, what I have seen).', ['Unweighted shortest walk covering all nodes → BFS over (node, mask)'], 'Multi-source start: the walk can begin anywhere.');
  return v.build();
}

const problem: Problem = {
  slug: 'shortest-path-visiting-all-nodes',
  statement: 'You have an undirected, connected graph of `n` nodes labelled 0 to n − 1, given as adjacency lists `graph`. Return the length of the shortest path that visits every node. You may start and stop at any node, revisit nodes, and reuse edges.',
  examples: [{ input: 'graph = [[1,2,3],[0],[0],[0]]', output: '4' }, { input: 'graph = [[1],[0,2,4],[1,3,4],[2],[1,2]]', output: '4' }],
  constraints: ['1 ≤ n ≤ 12', 'the graph is connected and undirected'],
  hints: ['State = (current node, visited mask).', 'BFS from all nodes at once.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All orders', idea: 'Try every order, joining nodes with shortest paths.', time: 'O(n! · n)', space: 'O(n²)', bottleneck: 'Factorial.' },
    { id: 'better', kind: 'better', name: 'Held–Karp', idea: 'dp[mask][last] with all-pairs distances.', time: 'O(2ⁿ · n²)', space: 'O(2ⁿ · n)', bottleneck: 'Extra n factor.' },
    { id: 'optimal', kind: 'optimal', name: 'BFS on states', idea: 'Multi-source BFS over (node, mask).', time: 'O(2ⁿ · n · deg)', space: 'O(2ⁿ · n)' },
  ],
  takeaway: 'BFS over **(node, mask)**.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'shortestPathLength', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[1, 2, 3], [0], [0], [0]]], out: 4 }, { args: [[[1], [0, 2, 4], [1, 3, 4], [2], [1, 2]]], out: 4 }, { args: [[[]]], out: 0 }, { args: [G], out: shortest(G) }],
    gen: (r: Rng) => {
      const n = r.int(1, 7);
      const adj = Array.from({ length: n }, () => new Set<number>());
      for (let i = 1; i < n; i++) { const p = r.int(0, i - 1); adj[i].add(p); adj[p].add(i); }
      for (let e = r.int(0, n); e > 0; e--) { const a = r.int(0, n - 1), b = r.int(0, n - 1); if (a !== b) { adj[a].add(b); adj[b].add(a); } }
      return [adj.map((s) => [...s].sort((x, y) => x - y))];
    },
    ref: (g: number[][]) => shortest(g),
  },
};

export default problem;
