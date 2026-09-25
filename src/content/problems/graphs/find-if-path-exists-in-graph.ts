import type { Problem } from '../../types';
import type { Rng } from '../../types';
import { Video, recap } from '../../helpers';

const N = 8;
const EDGES = [[3, 5], [2, 3], [1, 2], [0, 1], [0, 4], [4, 3], [6, 7]];
const SRC = 0;
const DST = 5;
const POS: [number, number][] = [[8, 50], [30, 16], [55, 16], [55, 84], [30, 84], [80, 84], [78, 22], [96, 48]];

function reach(n: number, edges: number[][], s: number, d: number) {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  const seen = new Set([s]);
  const q = [s];
  while (q.length) {
    const x = q.shift()!;
    if (x === d) return true;
    for (const y of adj[x]) if (!seen.has(y)) { seen.add(y); q.push(y); }
  }
  return false;
}

function video() {
  const v = new Video('path-exists', 'Find if Path Exists in Graph');
  const nodes = POS.map(([x, y], i) => ({ id: String(i), label: String(i), x, y }));
  const es = EDGES.map(([a, b]) => ({ a: String(a), b: String(b) }));

  v.chapter('intro', 'The problem');
  const g = v.graph('g', nodes, es, { label: `n = ${N}, source = ${SRC}, destination = ${DST}` });
  g.tone(String(SRC), 'active').tone(String(DST), 'warn');
  v.say(`We get an undirected graph as a list of edges, a source and a destination. Is there any path from ${SRC} to ${DST}? We do not need the path itself, just yes or no.`);
  v.say('Notice the graph can have separate pieces. Nodes six and seven are an island that nothing else reaches.');

  v.chapter('brute', 'Brute force: sweep the edge list until nothing changes', { cx: 'O(V · E)', code: ['reached = {source}', 'repeat until no change:', '  for (a, b) in edges:', '    if exactly one end is reached: reach the other'] });
  v.clear().layout('row');
  const gb = v.graph('g', nodes, es, { label: 'edge list order: [3,5] [2,3] [1,2] [0,1] [0,4] [4,3] [6,7]' });
  const r = v.array('r', Array(N).fill(0), { label: 'reached?' });
  r.set(SRC, 1).tone(SRC, 'ok');
  gb.tone(String(SRC), 'ok');
  v.line(0).say('Without building anything, we could keep a set of reached nodes and sweep the edge list again and again. Any edge with one reached end reaches the other end.');
  const reached = new Set([SRC]);
  let sweep = 0;
  let changed = true;
  while (changed) {
    changed = false;
    sweep++;
    const got: number[] = [];
    for (const [a, b] of EDGES) {
      if (reached.has(a) !== reached.has(b)) {
        const nw = reached.has(a) ? b : a;
        reached.add(nw);
        got.push(nw);
        changed = true;
        r.set(nw, 1).tone(nw, 'ok');
        gb.tone(String(nw), 'ok').edge(String(a), String(b), 'ok');
      }
    }
    v.line(2, 3).counter(`sweeps: ${sweep}`).eq(got.length ? `sweep ${sweep}: reached ${got.join(', ')}` : `sweep ${sweep}: nothing new → stop`, got.length ? undefined : 'warn');
    if (sweep === 1) v.say(`The first sweep reaches ${got.join(', ')}. But the edge from three to five came first in the list, before three was reached, so it was missed.`);
    else if (got.length) v.say(`So a second sweep is needed, and it reaches ${got.join(' and ')}.`);
    else v.say(`Sweep ${sweep} adds nothing, so we stop. ${DST} is reached, so the answer is true.`);
  }
  v.eq(`up to V sweeps × E edges = O(V · E)`, 'bad').say('In the worst case each sweep reaches only one new node, so this can take V sweeps over all E edges. Too slow for a hundred thousand nodes.');

  v.chapter('optimal', 'Optimal: adjacency list + BFS', { cx: 'O(V + E)', code: ['build adj from edges (both directions)', 'queue = [source]; seen = {source}', 'while queue: node = pop front', '  if node == destination: return true', '  for nb in adj[node]: if not seen → mark, push', 'return false'] });
  v.clear().layout('row');
  const go = v.graph('g', nodes, es, { label: `BFS from ${SRC}` });
  const q = v.queue('q', [SRC], { label: 'queue', ends: ['front', 'back'] });
  const adj: number[][] = Array.from({ length: N }, () => []);
  for (const [a, b] of EDGES) { adj[a].push(b); adj[b].push(a); }
  go.tone(String(SRC), 'visit');
  v.line(0, 1).say('The sweeps waste time re-reading edges that lead nowhere new. Instead, build an adjacency list once, then run breadth-first search from the source. Each node enters the queue at most once.');
  const seen = new Set([SRC]);
  const queue = [SRC];
  let found = false;
  let first = true;
  while (queue.length) {
    const x = queue.shift()!;
    q.shift();
    go.tone(String(x), 'active');
    if (x === DST) {
      go.tone(String(x), 'ok');
      v.line(3).eq(`pop ${x} = destination → true`, 'ok').say(`We pop ${x}, which is the destination. Return true.`);
      found = true;
      break;
    }
    const added: number[] = [];
    for (const y of adj[x]) {
      if (seen.has(y)) continue;
      seen.add(y);
      queue.push(y);
      q.push(y);
      added.push(y);
      go.tone(String(y), 'visit').edge(String(x), String(y), 'visit');
    }
    v.line(4).eq(`pop ${x}: push ${added.length ? added.join(', ') : 'nothing new'} · queue [${queue.join(', ')}]`);
    if (first) v.say(`Pop ${x}. Its unvisited neighbours ${added.join(' and ')} are marked and pushed.`);
    else v.hold(900);
    first = false;
    go.tone(String(x), 'done');
  }
  v.say('Nodes six and seven were never touched: BFS only explores what is reachable. If the queue had emptied first, the answer would be false.');
  v.note('each node pushed once, each edge read twice');
  v.eq('O(V + E) time · O(V + E) space', 'ok').say('Building the list reads every edge once, and BFS processes each node once and each edge twice. That is O of V plus E. Depth-first search, or union find, would work just as well here.');
  v.answer(found);

  recap(v, [
    { name: 'Sweep edges until stable', time: 'O(V · E)', space: 'O(V)' },
    { name: 'Adjacency list + BFS / DFS', time: 'O(V + E)', space: 'O(V + E)' },
  ], 'Build the adjacency list once, then traverse from the source.', ['“Can A reach B?” → BFS / DFS from A', 'Many connectivity queries → union-find'], 'Reachability is the simplest graph question, and BFS or DFS answers it in linear time.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-if-path-exists-in-graph',
  statement: 'There is an undirected graph with `n` vertices labelled `0…n−1` and edges `edges[i] = [u, v]`. Return `true` if there is a valid path from `source` to `destination`, otherwise `false`.',
  examples: [
    { input: 'n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2', output: 'true' },
    { input: 'n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5', output: 'false', why: '0, 1, 2 and 3, 4, 5 are separate components.' },
  ],
  constraints: ['1 ≤ n ≤ 2 · 10⁵', '0 ≤ edges.length ≤ 2 · 10⁵', 'no duplicate edges, no self-loops'],
  hints: ['Turn the edge list into an adjacency list.', 'Start a BFS or DFS at `source`; do you ever reach `destination`?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sweep edges until stable', idea: 'Keep a reached set. Sweep the edge list; any edge with exactly one reached end reaches the other. Repeat until a sweep changes nothing.', time: 'O(V · E)', space: 'O(V)', bottleneck: 'Each sweep re-reads every edge, even ones that lead nowhere new.' },
    { id: 'optimal', kind: 'optimal', name: 'Adjacency list + BFS', idea: 'Build the adjacency list, BFS from `source` with a visited array, and return true when `destination` is popped.', steps: ['Build `adj` in both directions.', 'Queue the source and mark it seen.', 'Pop a node; if it is the destination return true.', 'Push every unseen neighbour, marking it when pushed.', 'Queue empty → false.'], time: 'O(V + E)', space: 'O(V + E)' },
  ],
  pitfalls: ['Mark nodes as seen when you **push** them, not when you pop, or a node can be queued many times.', 'Recursive DFS can overflow the stack on a 2 · 10⁵-node path; prefer iterative BFS/DFS.', '`source == destination` is true even with no edges.'],
  takeaway: '“Can A reach B?” is a single BFS/DFS from A in **O(V + E)**.',
  video,
  videoArgs: [N, EDGES, SRC, DST],
  judge: {
    type: 'fn', fn: 'validPath', params: ['int', 'int[][]', 'int', 'int'], ret: 'boolean',
    tests: [
      { args: [3, [[0, 1], [1, 2], [2, 0]], 0, 2], out: true },
      { args: [6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5], out: false },
      { args: [1, [], 0, 0], out: true },
      { args: [2, [], 0, 1], out: false },
    ],
    gen: (r: Rng) => {
      const n = r.int(1, 10);
      const edges: number[][] = [];
      for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (r.chance(0.2)) edges.push(r.chance(0.5) ? [a, b] : [b, a]);
      return [n, r.shuffle(edges), r.int(0, n - 1), r.int(0, n - 1)];
    },
    ref: (n: number, e: number[][], s: number, d: number) => reach(n, e, s, d),
  },
};

export default problem;
