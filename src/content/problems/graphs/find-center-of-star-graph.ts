import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const E = [[1, 2], [2, 3], [4, 2]];

function video() {
  const v = new Video('star-center', 'Find Center of Star Graph');
  v.chapter('intro', 'The problem');
  const nodes = [
    { id: '2', label: '2', x: 50, y: 50 }, { id: '1', label: '1', x: 15, y: 20 }, { id: '3', label: '3', x: 85, y: 20 }, { id: '4', label: '4', x: 50, y: 92 },
  ];
  const g = v.graph('g', nodes, E.map(([a, b]) => ({ a: String(a), b: String(b) })), { label: 'edges [[1,2],[2,3],[4,2]]' });
  v.say('A star graph has one centre node connected to every other node, and no other edges. Given the edges, find the centre.');
  g.tone('2', 'ok');
  v.eq('centre: 2', 'ok').hold(700);
  g.clearTones();

  v.chapter('brute', 'Count degrees', { cx: 'O(n)', code: ['deg[x] += 1 for every edge endpoint', 'return the node with degree n − 1'] });
  v.eq('deg: 1→1, 2→3, 3→1, 4→1 → centre 2').say('The centre is the only node touching every edge, so it has degree n minus one. Counting degrees finds it, in O of n.');

  v.chapter('optimal', 'Look at just two edges', { cx: 'O(1)', code: ['a, b = edges[0]', 'return a if a in edges[1] else b'] });
  v.clear();
  const t = v.table('e', ['edge', 'endpoints'], E.map((e, i) => [`edges[${i}]`, `${e[0]}, ${e[1]}`]));
  t.tone(0, 'active').tone(1, 'active');
  const [a, b] = E[0];
  const c = E[1].includes(a) ? a : b;
  v.line(1).eq(`${c} appears in both of the first two edges → centre`, 'ok');
  v.say(`Every edge contains the centre. So the centre is the one node shared by the first two edges. Edges zero and one both contain ${c}.`);
  v.answer(c);
  recap(v, [{ name: 'Count degrees', time: 'O(n)', space: 'O(n)' }, { name: 'Compare two edges', time: 'O(1)', space: 'O(1)' }], 'A structural guarantee lets you answer from two edges.', ['Know your graph’s shape guarantees', 'Degree = number of edges touching a node'], 'Always ask what the input guarantees. Here, every edge touches the centre.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-center-of-star-graph',
  statement: 'An undirected **star graph** has `n` nodes labelled `1…n`: one centre node connected to every other node, and no other edges. Given `edges`, return the centre.',
  examples: [{ input: 'edges = [[1,2],[2,3],[4,2]]', output: '2' }, { input: 'edges = [[1,2],[5,1],[1,3],[1,4]]', output: '1' }],
  constraints: ['3 ≤ n ≤ 10⁵', 'edges.length == n − 1', 'the input is a valid star graph'],
  hints: ['Which node appears in every edge?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count degrees', idea: 'Count how many edges touch each node; the centre has degree n − 1.', time: 'O(n)', space: 'O(n)', bottleneck: 'Reads every edge when two are enough.' },
    { id: 'optimal', kind: 'optimal', name: 'Compare the first two edges', idea: 'The centre is the node common to `edges[0]` and `edges[1]`.', time: 'O(1)', space: 'O(1)' },
  ],
  takeaway: 'Use the **shape guarantee**: every edge of a star touches the centre.',
  video,
  videoArgs: [E],
  judge: {
    type: 'fn', fn: 'findCenter', params: ['int[][]'], ret: 'int',
    tests: [{ args: [[[1, 2], [2, 3], [4, 2]]], out: 2 }, { args: [[[1, 2], [5, 1], [1, 3], [1, 4]]], out: 1 }],
    gen: (r) => { const n = r.int(3, 10); const c = r.int(1, n); const edges = r.shuffle(Array.from({ length: n }, (_, i) => i + 1).filter((x) => x !== c).map((x) => (r.chance(0.5) ? [c, x] : [x, c]))); return [edges]; },
    ref: (e: number[][]) => (e[1].includes(e[0][0]) ? e[0][0] : e[0][1]),
  },
};

export default problem;
