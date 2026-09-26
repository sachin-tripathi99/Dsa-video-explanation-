import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { dsuViz } from '../../dsuviz';

const M = [
  [1, 1, 0, 0, 0],
  [1, 1, 1, 0, 0],
  [0, 1, 1, 0, 0],
  [0, 0, 0, 1, 1],
  [0, 0, 0, 1, 1],
];
const POS: [number, number][] = [[12, 30], [40, 12], [40, 78], [78, 30], [92, 82]];

function provinces(m: number[][]) {
  const n = m.length;
  const p = Array.from({ length: n }, (_, i) => i);
  const f = (x: number): number => (p[x] === x ? x : (p[x] = f(p[x])));
  let c = n;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (m[i][j] && f(i) !== f(j)) { p[f(j)] = f(i); c--; }
  return c;
}

function video() {
  const v = new Video('number-of-provinces', 'Number of Provinces');
  const n = M.length;
  const pairs: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (M[i][j]) pairs.push([i, j]);
  const nodes = POS.map(([x, y], i) => ({ id: String(i), label: String(i), x, y }));
  const es = pairs.map(([a, b]) => ({ a: String(a), b: String(b) }));

  v.chapter('intro', 'The problem');
  v.layout('row');
  const g = v.grid('m', M, { label: 'isConnected[i][j] = 1 → cities i and j are directly connected', rowHead: M.map((_, i) => String(i)), colHead: M.map((_, i) => String(i)) });
  v.graph('g', nodes, es, { label: 'the same thing as a graph' });
  v.say('There are n cities. The matrix says which pairs are directly connected. A province is a group of cities connected directly or through others. How many provinces are there?');
  pairs.forEach(([a, b]) => g.tone(a, b, 'active').tone(b, a, 'active'));
  v.eq('the matrix is an adjacency matrix → count connected components').say('The matrix is just an adjacency matrix. Each province is a connected component, so we are counting components.');

  v.chapter('brute', 'Brute force: relabel groups', { cx: 'O(n³)', code: ['group[i] = i', 'for each connected pair (i, j):', '  if group[i] != group[j]: relabel all of group[j] to group[i]', 'answer = number of distinct labels'] });
  v.clear();
  const grp = v.array('grp', M.map((_, i) => i), { label: 'group label of each city' });
  const G = M.map((_, i) => i);
  v.say('The first idea: give every city its own label, and whenever two connected cities have different labels, relabel one whole group.');
  pairs.forEach(([a, b]) => {
    grp.clearTones().tone(a, 'active').tone(b, 'cmp');
    if (G[a] !== G[b]) {
      const old = G[b];
      for (let k = 0; k < n; k++) if (G[k] === old) { G[k] = G[a]; grp.set(k, G[a]).tone(k, 'visit'); }
      v.line(2).eq(`(${a}, ${b}): relabel group ${old} → ${G[a]} (scan all ${n})`).hold(700);
    } else v.line(1).eq(`(${a}, ${b}): same label already`).hold(600);
  });
  grp.clearTones();
  v.line(3).eq(`distinct labels: {${[...new Set(G)].join(', ')}} → ${new Set(G).size}`, 'ok');
  v.say(`Two distinct labels remain, so two provinces. But there are up to n squared pairs, and each relabel scans all n cities: O of n cubed.`);

  v.chapter('dfs', 'Optimal: DFS flood fill', { cx: 'O(n²)', code: ['for each city c not yet seen:', '  provinces += 1', '  dfs(c): mark c; for every j with M[c][j] == 1 and not seen: dfs(j)'] });
  v.clear();
  const gd = v.graph('g', nodes, es, { label: 'flood fill each unvisited city' });
  const seen = new Set<number>();
  let prov = 0;
  const tones = ['visit', 'ok'] as const;
  v.say('A graph traversal counts components directly. Start at any unvisited city, flood through everything reachable, and count one province.');
  for (let c = 0; c < n; c++) {
    if (seen.has(c)) continue;
    prov++;
    const stack = [c];
    seen.add(c);
    const got: number[] = [];
    while (stack.length) {
      const x = stack.pop()!;
      got.push(x);
      for (let j = 0; j < n; j++) if (M[x][j] && !seen.has(j)) { seen.add(j); stack.push(j); gd.edge(String(x), String(j), tones[(prov - 1) % 2]); }
    }
    got.forEach((x) => gd.tone(String(x), tones[(prov - 1) % 2]));
    v.line(1, 2).counter(`provinces: ${prov}`).eq(`start at ${c}: reaches {${got.sort((a, b) => a - b).join(', ')}}`);
    v.say(prov === 1 ? `Start at city ${c}. The fill reaches ${got.join(', ')}. That is province one.` : `Cities up to ${c - 1} are already visited. City ${c} is new, so province ${prov} begins, reaching ${got.join(' and ')}.`);
  }
  v.eq(`${prov} provinces · each matrix cell read once → O(n²)`, 'ok').say('Every city is visited once, and each visit scans its row of the matrix. O of n squared, which is the size of the input, so we cannot do better.');

  v.chapter('optimal', 'Optimal: Union-Find', { cx: 'O(n² · α(n))', code: ['provinces = n', 'for i < j with M[i][j] == 1:', '  if union(i, j): provinces -= 1', 'return provinces'] });
  v.clear().layout('row');
  const gu = v.grid('m', M, { label: 'scan the upper triangle', rowHead: M.map((_, i) => String(i)), colHead: M.map((_, i) => String(i)) });
  const D = dsuViz(v, n, { arr: false });
  let cnt = n;
  v.line(0).counter(`provinces: ${cnt}`).say(`Union find gives the same answer and is the tool of choice when connections arrive one by one. Start with ${n} provinces, one per city.`);
  pairs.forEach(([a, b], k) => {
    gu.clearTones().tone(a, b, 'active');
    const r = D.union(a, b);
    D.t.clearTones();
    if (r) {
      cnt--;
      D.t.tone(D.ID(r.child), 'visit').tone(D.ID(r.root), 'ok');
    }
    v.line(1, 2).counter(`provinces: ${cnt}`).eq(r ? `union(${a}, ${b}) merges two groups → ${cnt}` : `${a} and ${b} already together`);
    if (k === 0) v.say('Each 1 above the diagonal is a connection. Union zero and one: two different groups merge, so the count drops to four.');
    else v.hold(750);
  });
  gu.clearTones();
  D.t.clearTones();
  v.eq(`${cnt} roots → ${cnt} provinces`, 'ok').say(`Every successful union removes one province. ${cnt} roots remain, so the answer is ${cnt}.`);
  v.answer(cnt);

  recap(v, [
    { name: 'Relabel groups', time: 'O(n³)', space: 'O(n)' },
    { name: 'DFS / BFS flood fill', time: 'O(n²)', space: 'O(n)' },
    { name: 'Union-Find', time: 'O(n² · α(n))', space: 'O(n)' },
  ], 'Provinces are connected components: count them with DFS or union-find.', ['“How many groups?” → count components', 'Union-find: count = n − successful unions'], 'Counting groups is counting connected components. DFS and union-find both do it in one pass.');
  return v.build();
}

const problem: Problem = {
  slug: 'number-of-provinces',
  statement: 'There are `n` cities. `isConnected[i][j] = 1` if city `i` and city `j` are directly connected. A **province** is a group of cities connected directly or indirectly, with no other cities outside the group. Return the number of provinces.',
  examples: [
    { input: 'isConnected = [[1,1,0],[1,1,0],[0,0,1]]', output: '2' },
    { input: 'isConnected = [[1,0,0],[0,1,0],[0,0,1]]', output: '3' },
  ],
  constraints: ['1 ≤ n ≤ 200', 'isConnected[i][i] = 1, and the matrix is symmetric'],
  hints: ['This is an adjacency matrix. What is a province in graph terms?', 'Count connected components: DFS from each unvisited node, or union-find.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Relabel groups', idea: 'Give each city a label; for every connected pair with different labels, relabel all cities of one group. Count distinct labels.', time: 'O(n³)', space: 'O(n)', bottleneck: 'Each merge rescans all n labels.' },
    { id: 'dfs', kind: 'optimal', name: 'DFS flood fill', idea: 'For each unvisited city, start a DFS that marks its whole component, and count one province.', time: 'O(n²)', space: 'O(n)' },
    { id: 'optimal', kind: 'optimal', name: 'Union-Find', idea: 'Start with n provinces; union every connected pair and subtract one for each union that merges two groups.', time: 'O(n² · α(n))', space: 'O(n)' },
  ],
  pitfalls: ['The matrix includes `isConnected[i][i] = 1`; that is not an edge to count.', 'Counting edges instead of components.'],
  takeaway: 'Groups = **connected components**. With union-find, components = n − successful unions.',
  video,
  videoArgs: [M],
  judge: {
    type: 'fn', fn: 'findCircleNum', params: ['int[][]'], ret: 'int',
    tests: [
      { args: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], out: 2 },
      { args: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], out: 3 },
      { args: [[[1]]], out: 1 },
    ],
    gen: (r: Rng) => {
      const n = r.int(1, 9);
      const m = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (r.chance(0.2)) m[i][j] = m[j][i] = 1;
      return [m];
    },
    ref: (m: number[][]) => provinces(m),
  },
};

export default problem;
