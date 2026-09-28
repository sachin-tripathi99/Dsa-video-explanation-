import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const G = [[1, 3], [0, 2], [1, 3], [0, 2, 4], [3, 5], [4]];
const G2 = [[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]];
function bip(g: number[][]) { const col = g.map(() => -1); for (let s = 0; s < g.length; s++) { if (col[s] >= 0) continue; col[s] = 0; const q = [s]; while (q.length) { const x = q.shift()!; for (const y of g[x]) { if (col[y] < 0) { col[y] = 1 - col[x]; q.push(y); } else if (col[y] === col[x]) return false; } } } return true; }

function video() {
  const v = new Video('is-graph-bipartite', 'Is Graph Bipartite?');
  const pos = [[15, 20], [50, 10], [85, 20], [50, 50], [30, 85], [70, 85]];
  const nodes = G.map((_, i) => ({ id: String(i), label: String(i), x: pos[i][0], y: pos[i][1] }));
  const edges: { a: string; b: string }[] = [];
  G.forEach((ns, i) => ns.forEach((j) => { if (i < j) edges.push({ a: String(i), b: String(j) }); }));
  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: 'undirected graph' });
  v.say('A graph is bipartite if its nodes can be split into two groups so that every edge goes between the groups, never inside one. Equivalently: can you colour every node with one of two colours so that neighbours always differ?');
  v.eq(`answer: ${bip(G)}`);

  v.chapter('brute', 'Brute force: try every 2-colouring', { cx: 'O(2ⁿ · E)', code: ['for each of the 2ⁿ colourings:', '  if every edge joins different colours: true'] });
  v.eq('2ⁿ colourings', 'bad').say('Trying every assignment of two colours is exponential. But one choice forces all the others.');

  v.chapter('optimal', 'BFS colouring: every choice is forced', { cx: 'O(V + E)', code: ['for each uncoloured node s: colour s red; queue = [s]', '  pop x; for each neighbour y:', '    uncoloured → give y the other colour; push', '    same colour as x → not bipartite'] });
  v.clear();
  const run = (graph: number[][], P: number[][], first: boolean) => {
    const ns = graph.map((_, i) => ({ id: String(i), label: String(i), x: P[i][0], y: P[i][1] }));
    const es: { a: string; b: string }[] = [];
    graph.forEach((xs, i) => xs.forEach((j) => { if (i < j) es.push({ a: String(i), b: String(j) }); }));
    const g = v.graph('g', ns, es, { label: first ? 'red / blue = the two colours' : 'a graph with a triangle' });
    const col = graph.map(() => -1);
    const paint = () => { g.clearTones(); col.forEach((c, i) => { if (c === 0) g.tone(String(i), 'bad'); else if (c === 1) g.tone(String(i), 'active'); }); col.forEach((c, i) => g.badge(String(i), c < 0 ? null : c === 0 ? 'R' : 'B')); };
    col[0] = 0; paint();
    v.line(0).eq('colour node 0 red');
    if (first) v.say('Colour node zero red. Its neighbours are then forced to be blue, their neighbours red, and so on. BFS spreads these forced colours.'); else v.hold(700);
    const q = [0];
    while (q.length) {
      const x = q.shift()!;
      for (const y of graph[x]) {
        if (col[y] < 0) { col[y] = 1 - col[x]; q.push(y); paint(); g.edge(String(x), String(y), 'ok'); v.line(2).eq(`${y} gets ${col[y] ? 'blue' : 'red'} (opposite of ${x})`).hold(500); }
        else if (col[y] === col[x]) {
          paint(); g.edge(String(x), String(y), 'bad'); g.edge(String(y), String(x), 'bad');
          v.line(3).eq(`edge ${x}–${y}: both ${col[x] ? 'blue' : 'red'} → not bipartite`, 'bad').say(`Nodes ${words(x)} and ${words(y)} were both forced to the same colour, yet they are joined by an edge. No colouring can work: the graph contains an odd cycle. Answer: false.`);
          return false;
        }
      }
    }
    v.eq('every edge joins red and blue → true', 'ok');
    if (first) v.say('Every edge connects a red node and a blue node. The graph is bipartite. For disconnected graphs, start a new BFS from every node that is still uncoloured.'); else v.hold(800);
    return true;
  };
  run(G, pos, true);
  v.clear();
  run(G2, [[20, 50], [50, 15], [80, 50], [50, 85]], false);
  v.answer(bip(G));

  recap(v, [{ name: 'Every colouring', time: 'O(2ⁿ · E)', space: 'O(n)' }, { name: 'BFS colouring', time: 'O(V + E)', space: 'O(V)' }], 'Colour, force neighbours to the opposite colour, stop at a conflict.', ['Two groups / two teams with conflicts → bipartite check'], 'Bipartite ⇔ no odd cycle.');
  return v.build();
}

const problem: Problem = {
  slug: 'is-graph-bipartite',
  statement: 'Given an undirected graph as an adjacency list `graph` (graph[u] lists u’s neighbours), return `true` if it is bipartite: its nodes can be split into two sets so that every edge connects a node in one set to a node in the other. The graph may be disconnected.',
  examples: [{ input: 'graph = [[1,2,3],[0,2],[0,1,3],[0,2]]', output: 'false' }, { input: 'graph = [[1,3],[0,2],[1,3],[0,2]]', output: 'true' }],
  constraints: ['1 ≤ n ≤ 100', 'no self-loops or parallel edges; symmetric'],
  hints: ['One colour choice forces its neighbours.', 'Remember disconnected components.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every colouring', idea: 'Test all 2ⁿ two-colourings.', time: 'O(2ⁿ · E)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'optimal', kind: 'optimal', name: 'BFS colouring', idea: 'Colour each component by BFS; a same-colour edge means false.', time: 'O(V + E)', space: 'O(V)' },
  ],
  takeaway: 'Bipartite ⇔ **2-colourable** ⇔ no odd cycle.',
  video,
  videoArgs: [G],
  judge: {
    type: 'fn', fn: 'isBipartite', params: ['int[][]'], ret: 'boolean',
    tests: [{ args: [G2], out: false }, { args: [[[1, 3], [0, 2], [1, 3], [0, 2]]], out: true }, { args: [G], out: bip(G) }, { args: [[[], [2], [1]]], out: true }],
    gen: (r: Rng) => { const n = r.int(1, 8); const adj: number[][] = Array.from({ length: n }, () => []); for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (r.chance(0.3)) { adj[a].push(b); adj[b].push(a); } return [adj]; },
    ref: (g: number[][]) => bip(g),
  },
};

export default problem;
