import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { layered, kahnViz, andList } from '../../topoviz';

const N = 5;
const PRE = [[0, 1], [1, 2], [0, 3], [3, 2], [2, 4]];
const QS = [[0, 4], [4, 0], [3, 1], [1, 4]];
function answer(n: number, pre: number[][], qs: number[][]) {
  const adj = Array.from({ length: n }, () => [] as number[]); const deg = Array(n).fill(0);
  for (const [a, b] of pre) { adj[a].push(b); deg[b]++; }
  const before = Array.from({ length: n }, () => new Set<number>());
  const q = [...Array(n).keys()].filter((i) => !deg[i]);
  for (let k = 0; k < q.length; k++) { const u = q[k]; for (const w of adj[u]) { before[u].forEach((x) => before[w].add(x)); before[w].add(u); if (--deg[w] === 0) q.push(w); } }
  return qs.map(([u, v]) => before[v].has(u));
}

function video() {
  const v = new Video('course-schedule-iv', 'Course Schedule IV');
  const E = PRE.map(([a, b]) => [a, b] as [number, number]);
  const nodes = layered(N, E);
  const edges = E.map(([a, b]) => ({ a: String(a), b: String(b) }));
  const adj = Array.from({ length: N }, () => [] as number[]);
  E.forEach(([a, b]) => adj[a].push(b));
  const res = answer(N, PRE, QS);

  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: 'a → b: a is a prerequisite of b', directed: true });
  v.say('Here a pair a, b means a must be taken before b, and prerequisites chain: if a comes before b and b before c, then a is a prerequisite of c too. Answer many queries of the form: is u a prerequisite of v?');
  v.eq(`queries ${QS.map(([a, b]) => `${a}→${b}`).join(', ')} → [${res.join(', ')}]`);

  v.chapter('brute', 'Brute force: a fresh search for every query', { cx: 'O(Q · (V + E))', code: ['for each query (u, v):', '  DFS from u; answer = did we reach v?'] });
  v.eq('up to 10⁴ queries × a full DFS', 'bad').say('Each query is reachability: is there a path of arrows from u to v? One DFS per query answers it, but with up to ten thousand queries we would repeat the same searches over and over.');

  v.chapter('optimal', 'Kahn’s order: pass along everything that comes before', { cx: 'O(V · E + Q)', code: ['before[x] = set of all prerequisites of x', 'Kahn: pop u', '  for w in adj[u]: before[w] |= before[u] ∪ {u}; indeg--', 'query (u, v) → is u in before[v]?'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'arrows handled in topological order', directed: true });
  const m = v.map('m', { label: 'before[x]' });
  for (let i = 0; i < N; i++) m.put(i, '{}');
  v.layout('row').weight('g', 2.4).weight('m', 1);
  const before = Array.from({ length: N }, () => new Set<number>());
  const fmt = (s: Set<number>) => `{${[...s].sort((a, b) => a - b).join(',')}}`;
  v.say('Precompute, for every course, the full set of courses that must come before it. In topological order, when u is taken, everything before u is already known, so u can hand its whole set, plus itself, to each course it points to.');
  let told = 0;
  kahnViz(v, g, N, adj, {
    lines: { init: [0], pop: [1, 2], done: [3] },
    afterPop: (u) => {
      m.clearTones();
      for (const w of adj[u]) { before[u].forEach((x) => before[w].add(x)); before[w].add(u); m.put(w, fmt(before[w])).tone(w, 'ok'); }
      if (adj[u].length && told++ === 0) return `Course ${words(u)} passes on its set plus itself: ${andList(adj[u].map((w) => `before[${w}] becomes ${fmt(before[w])}`))}.`;
      if (u === 3) return `Course three hands ${fmt(before[3])} plus three to course two, which already had zero and one: before[2] is now ${fmt(before[2])}.`;
    },
    finalEq: () => 'every before[x] is complete',
    finalSay: () => `Every course is done and every set is complete. Course four, the last, has all of ${andList([...before[4]].sort((a, b) => a - b).map(String))} before it.`,
  });
  m.clearTones();

  v.chapter('queries', 'Each query is now one lookup', { code: ['query (u, v) → u in before[v]'] });
  QS.forEach(([a, b], i) => {
    m.clearTones().tone(b, res[i] ? 'ok' : 'bad');
    g.clearTones(); g.tone(String(a), 'active').tone(String(b), res[i] ? 'ok' : 'bad');
    v.line(0).counter(`query ${i + 1}/${QS.length}`).eq(`${a} before ${b}? ${a} ${res[i] ? '∈' : '∉'} before[${b}] = ${fmt(before[b])} → ${res[i]}`, res[i] ? 'ok' : 'bad');
    if (i === 0) v.say(`Is ${words(a)} a prerequisite of ${words(b)}? Look it up: ${words(a)} is in the set for ${words(b)}, so true.`);
    else if (i === 2) v.say(`Is three a prerequisite of one? They sit on different branches, so three is not in before of one: false.`);
    else v.hold(900);
  });
  v.answer(res);

  recap(v, [{ name: 'DFS per query', time: 'O(Q · (V + E))', space: 'O(V + E)' }, { name: 'Sets in topological order', time: 'O(V · E + Q)', space: 'O(V²)' }, { name: 'Floyd–Warshall on booleans', time: 'O(V³ + Q)', space: 'O(V²)' }], 'In topological order, a node’s ancestors are final when it is popped.', ['Many reachability queries on a DAG → precompute ancestor sets in topo order'], 'Process a DAG in topological order and every “parent” fact is ready in time.');
  return v.build();
}

const problem: Problem = {
  slug: 'course-schedule-iv',
  statement: 'There are `numCourses` courses. `prerequisites[i] = [a, b]` means course `a` must be taken before course `b`, and prerequisites are transitive. For each query `[u, v]`, answer whether `u` is a prerequisite of `v`. The prerequisite graph has no cycles.',
  examples: [{ input: 'numCourses = 2, prerequisites = [[1,0]], queries = [[0,1],[1,0]]', output: '[false,true]' }, { input: 'numCourses = 3, prerequisites = [[1,2],[1,0],[2,0]], queries = [[1,0],[1,2]]', output: '[true,true]' }],
  constraints: ['2 ≤ numCourses ≤ 100', '0 ≤ prerequisites.length ≤ n(n − 1)/2', 'no cycles', '1 ≤ queries.length ≤ 10⁴'],
  hints: ['Precompute every course’s set of ancestors.', 'Build the sets in topological order.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS per query', idea: 'For each query, search from u and see whether v is reached.', time: 'O(Q · (V + E))', space: 'O(V + E)', bottleneck: 'Repeated searches.' },
    { id: 'optimal', kind: 'optimal', name: 'Ancestor sets in topological order', idea: 'Kahn; when u is popped, give each child before[u] ∪ {u}.', time: 'O(V · E + Q)', space: 'O(V²)' },
  ],
  takeaway: 'Topological order makes **ancestor sets** ready just in time.',
  video,
  videoArgs: [N, PRE, QS],
  judge: {
    type: 'fn', fn: 'checkIfPrerequisite', params: ['int', 'int[][]', 'int[][]'], ret: 'List<Boolean>',
    tests: [{ args: [2, [[1, 0]], [[0, 1], [1, 0]]], out: [false, true] }, { args: [2, [], [[1, 0], [0, 1]]], out: [false, false] }, { args: [3, [[1, 2], [1, 0], [2, 0]], [[1, 0], [1, 2]]], out: [true, true] }, { args: [N, PRE, QS], out: res0() }],
    gen: (r: Rng) => {
      const n = r.int(2, 7);
      const perm = r.shuffle([...Array(n).keys()]);
      const seen = new Set<string>();
      const pre: number[][] = [];
      for (let k = r.int(0, n * 2); k > 0; k--) {
        const i = r.int(0, n - 2), j = r.int(i + 1, n - 1);
        const a = perm[i], b = perm[j];
        if (seen.has(`${a},${b}`)) continue;
        seen.add(`${a},${b}`);
        pre.push([a, b]);
      }
      const qs: number[][] = [];
      for (let k = r.int(1, 6); k > 0; k--) { const a = r.int(0, n - 1); let b = r.int(0, n - 1); if (a === b) b = (b + 1) % n; qs.push([a, b]); }
      return [n, pre, qs];
    },
    ref: (n: number, pre: number[][], qs: number[][]) => answer(n, pre, qs),
  },
};

function res0() { return answer(N, PRE, QS); }

export default problem;
