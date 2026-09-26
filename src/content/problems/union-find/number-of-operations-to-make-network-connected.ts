import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { dsuViz } from '../../dsuviz';

const N = 6;
const C = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3]];
const POS: [number, number][] = [[12, 50], [40, 12], [40, 88], [66, 50], [92, 18], [92, 82]];

function ops(n: number, conns: number[][]) {
  if (conns.length < n - 1) return -1;
  const p = Array.from({ length: n }, (_, i) => i);
  const f = (x: number): number => (p[x] === x ? x : (p[x] = f(p[x])));
  let comps = n;
  for (const [a, b] of conns) if (f(a) !== f(b)) { p[f(a)] = f(b); comps--; }
  return comps - 1;
}

function video() {
  const v = new Video('network-connected', 'Number of Operations to Make Network Connected');
  const nodes = POS.map(([x, y], i) => ({ id: String(i), label: String(i), x, y }));
  const es = C.map(([a, b]) => ({ a: String(a), b: String(b) }));

  v.chapter('intro', 'The problem');
  v.graph('g', nodes, es, { label: `n = ${N} computers, ${C.length} cables` });
  v.say('We have n computers and some cables. In one operation we can unplug a cable and plug it between any two computers. What is the fewest operations to connect every computer, or minus one if it is impossible?');
  v.say('Computers four and five are isolated, and the first four have more cables than they need.');

  v.chapter('insight', 'Think before coding', { code: ['if cables < n − 1: return −1', 'k = number of connected components', 'return k − 1'] });
  v.clear();
  v.text('t', { title: 'Two facts decide everything', lines: [`Connecting n computers needs at least n − 1 = ${N - 1} cables. We have ${C.length}.`, 'With k separate groups, k − 1 cables join them into one.', 'If there are enough cables in total, some cable inside a group is spare and can be moved.'], shown: 3 });
  v.line(0).say(`First, n computers need at least n minus one cables, whatever the layout. We have ${C.length}, which is enough, so an answer exists.`);
  v.line(1, 2).say('Second, if the network is split into k groups, we need exactly k minus one moves to join them. And when the total is at least n minus one, there is always a spare cable to move. So the whole problem is counting components.');

  v.chapter('dfs', 'Optimal: count components with DFS', { cx: 'O(n + m)', code: ['build adjacency list', 'for each computer not yet seen: k += 1, DFS from it', 'return k − 1'] });
  v.clear();
  const gd = v.graph('g', nodes, es, { label: 'components' });
  const adj: number[][] = Array.from({ length: N }, () => []);
  for (const [a, b] of C) { adj[a].push(b); adj[b].push(a); }
  const seen = new Set<number>();
  let k = 0;
  const cols = ['visit', 'ok', 'warn', 'cmp'] as const;
  for (let s = 0; s < N; s++) {
    if (seen.has(s)) continue;
    k++;
    const st = [s];
    seen.add(s);
    const got: number[] = [];
    while (st.length) { const x = st.pop()!; got.push(x); for (const y of adj[x]) if (!seen.has(y)) { seen.add(y); st.push(y); } }
    got.forEach((x) => gd.tone(String(x), cols[(k - 1) % cols.length]));
    v.line(1).counter(`components: ${k}`).eq(`DFS from ${s}: {${got.sort((a, b) => a - b).join(', ')}}`);
    if (k === 1) v.say(`A DFS from zero reaches ${got.join(', ')}. That is one component.`);
    else v.hold(800);
  }
  v.line(2).eq(`${k} components → ${k - 1} moves`, 'ok').say(`${k} components in total, so we need ${k - 1} moves.`);

  v.chapter('optimal', 'Optimal: Union-Find, counting spare cables', { cx: 'O(n + m · α(n))', code: ['components = n; spare = 0', 'for (a, b) in cables:', '  if union(a, b): components −= 1', '  else: spare += 1   (a and b already connected)', 'return components − 1 if spare ≥ components − 1 else −1'] });
  v.clear().layout('row');
  const gu = v.graph('g', nodes, es, { label: 'cables' });
  const D = dsuViz(v, N, { arr: false });
  let comps = N;
  let spare = 0;
  v.line(0).counter(`components: ${comps} · spare: ${spare}`).say('Union find counts the same thing, and it also shows us which cables are spare: a cable whose ends were already connected.');
  C.forEach(([a, b]) => {
    gu.clearTones(['bad', 'done']);
    const r = D.union(a, b);
    D.t.clearTones();
    if (r) { comps--; gu.edge(String(a), String(b), 'done'); D.t.tone(D.ID(r.child), 'visit'); }
    else { spare++; gu.edge(String(a), String(b), 'bad'); }
    v.line(r ? 2 : 3).counter(`components: ${comps} · spare: ${spare}`).eq(r ? `cable ${a}–${b}: joins two groups` : `cable ${a}–${b}: already connected → spare`, r ? undefined : 'warn');
    if (!r && spare === 1) v.say(`Cable ${a} to ${b} joins computers that are already connected, so it is spare. We can move it.`);
    else v.hold(700);
  });
  const ans = ops(N, C);
  v.line(4).eq(`${spare} spare ≥ ${comps} − 1 → answer ${ans}`, 'ok').say(`${comps} components need ${comps - 1} moves, and we have ${spare} spare cables. Move one cable to computer four and one to computer five. The answer is ${ans}.`);
  v.answer(ans);

  recap(v, [
    { name: 'DFS component count', time: 'O(n + m)', space: 'O(n + m)' },
    { name: 'Union-Find', time: 'O(n + m · α(n))', space: 'O(n)' },
  ], 'Answer = components − 1, if there are at least n − 1 cables.', ['“Minimum links to connect everything” → components − 1', 'union() returning false marks a spare edge'], 'Reason about the counts first: once you see it is components minus one, the code is short.');
  return v.build();
}

const problem: Problem = {
  slug: 'number-of-operations-to-make-network-connected',
  statement: 'There are `n` computers numbered `0…n−1` connected by ethernet cables `connections[i] = [a, b]`. In one operation you may remove a cable between two directly connected computers and place it between any pair of disconnected computers. Return the minimum number of operations needed to make all computers connected, or `-1` if impossible.',
  examples: [
    { input: 'n = 4, connections = [[0,1],[0,2],[1,2]]', output: '1' },
    { input: 'n = 6, connections = [[0,1],[0,2],[0,3],[1,2],[1,3]]', output: '2' },
    { input: 'n = 6, connections = [[0,1],[0,2],[0,3],[1,2]]', output: '-1', why: 'Only 4 cables; 6 computers need at least 5.' },
  ],
  constraints: ['1 ≤ n ≤ 10⁵', '1 ≤ connections.length ≤ min(n(n−1)/2, 10⁵)', 'no repeated connections'],
  hints: ['How many cables does it take to connect n computers at minimum?', 'If there are k separate groups, how many moves join them?'],
  approaches: [
    { id: 'dfs', kind: 'optimal', name: 'DFS component count', idea: 'If fewer than n − 1 cables, return −1. Otherwise count connected components k with DFS and return k − 1.', time: 'O(n + m)', space: 'O(n + m)' },
    { id: 'optimal', kind: 'optimal', name: 'Union-Find', idea: 'Union every cable; unions that fail are spare cables. Return components − 1 if there are enough spares, else −1.', time: 'O(n + m · α(n))', space: 'O(n)' },
  ],
  pitfalls: ['Forgetting the −1 case when `connections.length < n − 1`.', 'Recursive DFS on 10⁵ nodes can overflow the stack; iterate or use union-find.'],
  takeaway: 'Minimum links to connect everything = **components − 1**, given enough edges.',
  video,
  videoArgs: [N, C],
  judge: {
    type: 'fn', fn: 'makeConnected', params: ['int', 'int[][]'], ret: 'int',
    tests: [
      { args: [4, [[0, 1], [0, 2], [1, 2]]], out: 1 },
      { args: [6, [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3]]], out: 2 },
      { args: [6, [[0, 1], [0, 2], [0, 3], [1, 2]]], out: -1 },
      { args: [1, []], out: 0 },
    ],
    gen: (r: Rng) => {
      const n = r.int(1, 9);
      const conns: number[][] = [];
      for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (r.chance(0.25)) conns.push([a, b]);
      return [n, r.shuffle(conns)];
    },
    ref: (n: number, c: number[][]) => ops(n, c),
  },
};

export default problem;
