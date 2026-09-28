import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { layered, kahnViz, andList } from '../../topoviz';

const GR = [[1, 2], [2, 3], [5], [0], [5], [], []];
function safe(graph: number[][]) { const n = graph.length; const rev = Array.from({ length: n }, () => [] as number[]); const out = graph.map((o) => o.length); graph.forEach((o, x) => o.forEach((y) => rev[y].push(x))); const q = [...Array(n).keys()].filter((i) => !out[i]); for (let k = 0; k < q.length; k++) for (const x of rev[q[k]]) if (--out[x] === 0) q.push(x); return [...q].sort((a, b) => a - b); }

function video() {
  const v = new Video('find-eventual-safe-states', 'Find Eventual Safe States');
  const n = GR.length;
  const E: [number, number][] = GR.flatMap((o, x) => o.map((y) => [x, y] as [number, number]));
  const rev = Array.from({ length: n }, () => [] as number[]);
  E.forEach(([x, y]) => rev[y].push(x));
  const nodes = layered(n, E.map(([x, y]) => [y, x] as [number, number]), { flip: true });
  const edges = E.map(([a, b]) => ({ a: String(a), b: String(b) }));

  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: 'directed graph', directed: true });
  v.say('A node with no outgoing arrows is terminal. A node is safe if every path starting from it ends at a terminal node, so no path can get trapped going around a cycle forever. Return all safe nodes in increasing order.');
  v.eq(`graph = ${JSON.stringify(GR)} → [${safe(GR).join(', ')}]`);

  v.chapter('brute', 'Brute force: explore every path from every node', { cx: 'O(V · (V + E))', code: ['for each node s:', '  DFS from s with the current path', '  safe if no path returns to the path'] });
  v.eq('one DFS per node', 'bad').say('For each node on its own, search every path forward; if any path loops back into itself, the node is unsafe. Each node repeats a search the others already did.');

  v.chapter('optimal', 'Kahn’s algorithm backwards: peel off terminal nodes', { cx: 'O(V + E)', code: ['out[x] = # arrows leaving x; reverse every arrow', 'queue = terminal nodes (out 0); they are safe', 'pop y: for each x with x → y: out[x]--, 0 → safe, queue', 'answer = everything that became safe, sorted'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'badge = arrows not yet known to lead somewhere safe', directed: true });
  v.say('Turn it around. Terminal nodes are safe. A node becomes safe once every one of its arrows is known to point at a safe node. That is Kahn’s algorithm, counting outgoing arrows instead of incoming ones and walking the arrows backwards.');
  const { order, stuck } = kahnViz(v, g, n, rev, {
    lines: { init: [0, 1], pop: [2], done: [3] },
    badge: (d) => `out ${d}`,
    unit: ['unchecked arrow', 'unchecked arrows'],
    arrow: (y, x) => [x, y],
    queueName: 'safe queue',
    leafEq: 'nothing points into it',
    leafSay: 'No arrow points into it, so nothing new is decided.',
    orderLabel: 'safe',
    sayInit: `Count each node’s outgoing arrows. Nodes ${andList(GR.map((o, i) => (o.length ? -1 : i)).filter((i) => i >= 0).map(String))} have none: they are terminal, so they are safe and go in the queue.`,
    popSay: (y) => `${y} is safe. Every arrow pointing into ${y} now points at something safe.`,
    finalOk: true,
    finalEq: (o) => `safe = [${[...o].sort((a, b) => a - b).join(', ')}]`,
    finalSay: (o, s) => `The queue is empty. Nodes ${andList(s.map(String))} still have an arrow that never led to safety: they can reach the cycle between ${andList(s.filter((x) => GR[x].some((y) => s.includes(y))).map(String))}. Sorted, the safe nodes are ${andList([...o].sort((a, b) => a - b).map(String))}.`,
  });
  void stuck;
  v.answer(order.sort((a, b) => a - b));

  recap(v, [{ name: 'DFS per node', time: 'O(V · (V + E))', space: 'O(V + E)' }, { name: 'Reverse Kahn on out-degrees', time: 'O(V + E)', space: 'O(V + E)' }, { name: 'DFS with 3 colours', time: 'O(V + E)', space: 'O(V)' }], 'Safe = peeled by Kahn on the reversed graph.', ['“Every path ends at a sink” → Kahn from the sinks backwards'], 'Reverse the arrows to count the other way.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-eventual-safe-states',
  statement: 'A directed graph of `n` nodes is given as `graph`, where `graph[i]` lists the nodes `i` has edges to. A node is **terminal** if it has no outgoing edges, and **safe** if every path starting at it leads to a terminal node. Return all safe nodes in ascending order.',
  examples: [{ input: 'graph = [[1,2],[2,3],[5],[0],[5],[],[]]', output: '[2,4,5,6]' }, { input: 'graph = [[1,2,3,4],[1,2],[3,4],[0,4],[]]', output: '[4]' }],
  constraints: ['1 ≤ n ≤ 10⁴', 'graph[i] is strictly increasing', 'total edges ≤ 4 · 10⁴'],
  hints: ['Terminal nodes are safe.', 'A node is safe when all its arrows point at safe nodes: Kahn on reversed arrows.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS per node', idea: 'From each node, look for a path that loops back.', time: 'O(V · (V + E))', space: 'O(V + E)', bottleneck: 'Repeated searches.' },
    { id: 'optimal', kind: 'optimal', name: 'Reverse Kahn', idea: 'Start from terminal nodes; a node is safe once all its out-arrows are resolved.', time: 'O(V + E)', space: 'O(V + E)' },
  ],
  takeaway: 'Run Kahn **backwards** from the sinks.',
  video,
  videoArgs: [GR],
  judge: {
    type: 'fn', fn: 'eventualSafeNodes', params: ['int[][]'], ret: 'List<Integer>',
    tests: [{ args: [GR], out: [2, 4, 5, 6] }, { args: [[[1, 2, 3, 4], [1, 2], [3, 4], [0, 4], []]], out: [4] }, { args: [[[]]], out: [0] }, { args: [[[0]]], out: [] }],
    gen: (r: Rng) => { const n = r.int(1, 8); return [Array.from({ length: n }, () => [...new Set(Array.from({ length: r.int(0, 3) }, () => r.int(0, n - 1)))].sort((a, b) => a - b))]; },
    ref: (g: number[][]) => safe(g),
  },
};

export default problem;
