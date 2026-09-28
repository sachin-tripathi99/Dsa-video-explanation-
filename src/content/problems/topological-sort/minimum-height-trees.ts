import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { andList } from '../../topoviz';

const N = 8;
const ED = [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [5, 6], [4, 7]];
const POS = [[6, 18], [22, 50], [6, 82], [42, 50], [62, 50], [80, 26], [96, 26], [80, 80]];

function heights(n: number, edges: number[][]) {
  const adj = Array.from({ length: n }, () => [] as number[]);
  edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  return [...Array(n).keys()].map((s) => { const d = Array(n).fill(-1); d[s] = 0; const q = [s]; for (let k = 0; k < q.length; k++) for (const w of adj[q[k]]) if (d[w] < 0) { d[w] = d[q[k]] + 1; q.push(w); } return Math.max(...d); });
}
function roots(n: number, edges: number[][]) { const h = heights(n, edges); const m = Math.min(...h); return [...Array(n).keys()].filter((i) => h[i] === m); }

function video() {
  const v = new Video('minimum-height-trees', 'Minimum Height Trees');
  const nodes = POS.map(([x, y], i) => ({ id: String(i), label: String(i), x, y }));
  const edges = ED.map(([a, b]) => ({ a: String(a), b: String(b) }));
  const adj = Array.from({ length: N }, () => [] as number[]);
  ED.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  const ans = roots(N, ED);

  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: 'an undirected tree' });
  v.say('A tree of n nodes, given as undirected edges. Hanging it from any node as the root gives a rooted tree with some height. Return every root that gives the smallest possible height.');
  v.eq(`answer: [${ans.join(', ')}]`);

  v.chapter('brute', 'Brute force: BFS from every node to measure its height', { cx: 'O(n²)', code: ['for each node r: height[r] = BFS depth from r', 'return nodes with the minimum height'] });
  v.clear();
  const b = v.graph('g', nodes, edges, { label: 'badge = height when rooted here' });
  const h = heights(N, ED);
  v.say('The direct way: root the tree at each node in turn and measure the height with a BFS.');
  for (let r = 0; r < N; r++) {
    b.clearTones(); b.tone(String(r), 'active').badge(String(r), `h ${h[r]}`);
    v.line(0).counter(`root ${r}`).eq(`root ${r}: height ${h[r]}`);
    if (r === 0) v.say(`Rooted at zero, the farthest node is ${words(h[0])} edges away, so the height is ${words(h[0])}.`); else v.hold(500);
  }
  b.clearTones(); ans.forEach((r) => b.tone(String(r), 'ok'));
  v.line(1).eq(`min height ${Math.min(...h)} at ${ans.join(', ')}`, 'ok').say(`The smallest height is ${words(Math.min(...h))}, at ${andList(ans.map((x) => words(x)))}. Correct, but that is one full BFS per node: quadratic.`);

  v.chapter('insight', 'The best roots are the middle of the longest path');
  const LP = [0, 1, 3, 4, 5, 6];
  b.clearTones();
  LP.forEach((x, i) => { b.tone(String(x), ans.includes(x) ? 'ok' : 'path'); if (i) b.edge(String(LP[i - 1]), String(x), 'path'); });
  v.eq(`longest path ${LP.join(' – ')} (${LP.length - 1} edges) · middle: ${ans.join(', ')}`);
  v.say('Where is the best root? A far-out leaf is a terrible root: everything else hangs far from it. The best roots sit in the middle of the tree, at the middle of its longest path. A path has one middle node or two, so there are always one or two answers.');

  v.chapter('optimal', 'Peel the leaves, layer by layer', { cx: 'O(n)', code: ['deg[x] = number of neighbours; leaves = nodes with deg 1', 'while more than 2 nodes remain:', '  remove every leaf; each neighbour loses a degree', '  neighbours that drop to degree 1 are the next leaves', 'return the nodes that are left'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'badge = current degree' });
  const deg = adj.map((a) => a.length);
  for (let i = 0; i < N; i++) g.badge(String(i), `deg ${deg[i]}`);
  let leaves = [...Array(N).keys()].filter((i) => deg[i] === 1);
  leaves.forEach((x) => g.tone(String(x), 'active'));
  v.line(0).eq(`leaves: ${leaves.join(', ')}`).say(`Find the middle by trimming from the outside, like peeling an onion. It is Kahn’s algorithm on an undirected tree, using degree instead of indegree. Start with every leaf, the nodes of degree one: ${andList(leaves.map((x) => words(x)))}.`);
  let left = N;
  const gone = new Set<number>();
  let layer = 0;
  while (left > 2) {
    layer++;
    const next: number[] = [];
    for (const x of leaves) {
      gone.add(x);
      g.tone(String(x), 'dim').badge(String(x), null);
      for (const w of adj[x]) if (!gone.has(w)) { g.edge(String(x), String(w), 'dim'); deg[w]--; g.badge(String(w), `deg ${deg[w]}`); if (deg[w] === 1) next.push(w); }
    }
    left -= leaves.length;
    v.line(2).counter(`layer ${layer} · ${left} left`).eq(`remove ${leaves.join(', ')} → ${left} nodes remain`);
    if (layer === 1) v.say(`Remove all ${words(leaves.length)} leaves at once. Removing a leaf takes one degree from its neighbour. ${cap(words(left))} nodes are left, still more than two.`);
    else v.say(`Remove this layer of leaves too. ${cap(words(left))} nodes remain.`);
    next.forEach((x) => g.tone(String(x), 'active'));
    v.line(3).eq(`new leaves: ${next.join(', ')}`);
    if (layer === 1) v.say(`${cap(andList(next.map((x) => words(x))))} dropped to degree one: they are the next layer of leaves.`); else v.hold(800);
    leaves = next;
  }
  leaves.forEach((x) => g.tone(String(x), 'ok'));
  v.line(4).eq(`answer: [${leaves.sort((a, b) => a - b).join(', ')}]`, 'ok').say(`Only ${words(left)} nodes remain, ${andList(leaves.map((x) => words(x)))}. They are the middle of the longest path, so they are the answer. Every node and edge was removed once: linear time.`);
  v.answer(leaves);

  recap(v, [{ name: 'BFS from every node', time: 'O(n²)', space: 'O(n)' }, { name: 'Peel leaves (Kahn on degrees)', time: 'O(n)', space: 'O(n)' }], 'Trim leaves until one or two nodes remain.', ['Centre of a tree → repeatedly remove leaves'], 'Stop at ≤ 2 nodes, not at an empty queue.');
  return v.build();
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const problem: Problem = {
  slug: 'minimum-height-trees',
  statement: 'A tree of `n` nodes labelled 0 to n − 1 is given by `n − 1` undirected `edges`. Rooting the tree at any node gives a height. Return the labels of all roots that give the minimum height, in any order.',
  examples: [{ input: 'n = 4, edges = [[1,0],[1,2],[1,3]]', output: '[1]' }, { input: 'n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]', output: '[3,4]' }],
  constraints: ['1 ≤ n ≤ 2 · 10⁴', 'edges.length = n − 1', 'the input is a tree'],
  hints: ['There are at most two answers.', 'Remove all leaves repeatedly.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'BFS from every node', idea: 'Measure the height of each rooting.', time: 'O(n²)', space: 'O(n)', bottleneck: 'One BFS per node.' },
    { id: 'optimal', kind: 'optimal', name: 'Peel leaves', idea: 'Remove leaf layers until at most 2 nodes remain.', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'The centre is what is left after **peeling leaves**.',
  video,
  videoArgs: [N, ED],
  judge: {
    type: 'fn', fn: 'findMinHeightTrees', params: ['int', 'int[][]'], ret: 'List<Integer>', cmp: 'sorted',
    tests: [{ args: [4, [[1, 0], [1, 2], [1, 3]]], out: [1] }, { args: [6, [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]]], out: [3, 4] }, { args: [1, []], out: [0] }, { args: [2, [[0, 1]]], out: [0, 1] }, { args: [N, ED], out: roots(N, ED) }],
    gen: (r: Rng) => { const n = r.int(1, 10); const edges: number[][] = []; for (let i = 1; i < n; i++) edges.push(r.chance(0.5) ? [r.int(0, i - 1), i] : [i, r.int(0, i - 1)]); return [n, edges]; },
    ref: (n: number, edges: number[][]) => roots(n, edges),
  },
};

export default problem;
