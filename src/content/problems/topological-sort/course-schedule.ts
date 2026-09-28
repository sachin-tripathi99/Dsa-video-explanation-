import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { layered, kahnViz, andList } from '../../topoviz';

const N = 6;
const PRE = [[1, 0], [2, 1], [3, 2], [1, 3], [4, 0], [5, 4]];
function can(n: number, pre: number[][]) { const adj = Array.from({ length: n }, () => [] as number[]); const deg = Array(n).fill(0); for (const [a, b] of pre) { adj[b].push(a); deg[a]++; } const q = [...Array(n).keys()].filter((i) => !deg[i]); let k = 0; while (k < q.length) { const x = q[k++]; for (const y of adj[x]) if (--deg[y] === 0) q.push(y); } return k === n; }

function video() {
  const v = new Video('course-schedule', 'Course Schedule');
  const E = PRE.map(([a, b]) => [b, a] as [number, number]);
  const nodes = layered(N, E);
  const edges = E.map(([a, b]) => ({ a: String(a), b: String(b) }));
  const adj = Array.from({ length: N }, () => [] as number[]);
  E.forEach(([a, b]) => adj[a].push(b));

  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: 'b → a: take b before a', directed: true });
  v.say(`There are ${words(N)} courses. A pair a, b means you must take course b before course a. Can you finish every course? Draw an arrow from each prerequisite to the course that needs it.`);
  v.eq(`prerequisites = ${JSON.stringify(PRE)}`);
  v.say('Everything can be finished exactly when there is some order that respects every arrow, which means the graph has no cycle. So this is cycle detection in a directed graph.');

  v.chapter('brute', 'Brute force: DFS from every course looking for a way back', { cx: 'O(V · (V + E))', code: ['for each course s:', '  DFS from s, remembering the current path', '  reaching a course already on the path → cycle'] });
  v.eq('one full DFS per start course', 'bad').say('A direct check: from every course, walk forward along arrows while remembering the current path. Stepping onto a course already on the path means we went around a loop. That is correct, but it repeats a whole search for every start course.');

  v.chapter('optimal', 'Kahn’s algorithm: count what can actually be taken', { cx: 'O(V + E)', code: ['indeg[a] = # prerequisites of a', 'queue = courses with indeg 0', 'take c: for each next course: indeg--, 0 → queue', 'return taken == numCourses'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'badge = prerequisites not yet taken', directed: true });
  v.say('Instead, simulate taking courses. A course is available once all its prerequisites are taken. Keep a count per course and a queue of available ones.');
  const { order, stuck } = kahnViz(v, g, N, adj, {
    lines: { init: [0, 1], pop: [2], done: [3] },
    popSay: (x) => `Take course ${x}.`,
    finalEq: (o, s) => `taken ${o.length} of ${N} → ${s.length === 0}`,
    finalSay: (o, s) => s.length
      ? `No course is available any more, but only ${words(o.length)} of ${words(N)} were taken. Courses ${andList(s.map(String))} each wait on another one in the same loop, so they can never start. The answer is false.`
      : `All ${words(N)} courses were taken, so the answer is true.`,
  });
  v.say(`Every course enters the queue at most once and every arrow is followed once, so this is linear. ${stuck.length ? 'The count of taken courses alone tells us about the cycle.' : ''}`);
  v.answer(order.length === N);

  recap(v, [{ name: 'DFS from every course', time: 'O(V · (V + E))', space: 'O(V + E)' }, { name: 'Kahn’s algorithm', time: 'O(V + E)', space: 'O(V + E)' }], 'Can finish ⇔ Kahn places every course ⇔ no cycle.', ['Prerequisites + “is it possible?” → cycle check by topological sort'], 'Arrow direction: prerequisite → course.');
  return v.build();
}

const problem: Problem = {
  slug: 'course-schedule',
  statement: 'There are `numCourses` courses labelled 0 to numCourses − 1. `prerequisites[i] = [a, b]` means you must take course `b` before course `a`. Return `true` if you can finish all courses.',
  examples: [{ input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' }, { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false' }],
  constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ 5000', 'all pairs are distinct'],
  hints: ['Draw an arrow b → a.', 'You can finish everything exactly when the graph has no cycle.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS from every course', idea: 'From each course, DFS with the current path; a course seen again on the path is a cycle.', time: 'O(V · (V + E))', space: 'O(V + E)', bottleneck: 'Repeats the search per start.' },
    { id: 'optimal', kind: 'optimal', name: 'Kahn’s algorithm', idea: 'Take courses with no remaining prerequisites; count how many get taken.', time: 'O(V + E)', space: 'O(V + E)' },
  ],
  takeaway: 'Possible ⇔ **no cycle** ⇔ Kahn takes all n.',
  video,
  videoArgs: [N, PRE],
  judge: {
    type: 'fn', fn: 'canFinish', params: ['int', 'int[][]'], ret: 'boolean',
    tests: [{ args: [2, [[1, 0]]], out: true }, { args: [2, [[1, 0], [0, 1]]], out: false }, { args: [1, []], out: true }, { args: [N, PRE], out: can(N, PRE) }, { args: [3, [[0, 1], [0, 2], [1, 2]]], out: true }],
    gen: (r: Rng) => {
      const n = r.int(1, 7);
      const seen = new Set<string>();
      const pre: number[][] = [];
      const m = r.int(0, n * 2);
      const perm = r.shuffle([...Array(n).keys()]);
      for (let k = 0; k < m; k++) {
        let a = r.int(0, n - 1), b = r.int(0, n - 1);
        if (a === b) continue;
        if (r.chance(0.8) && perm.indexOf(b) > perm.indexOf(a)) [a, b] = [b, a]; // mostly acyclic
        const key = `${a},${b}`;
        if (seen.has(key)) continue;
        seen.add(key);
        pre.push([a, b]);
      }
      return [n, pre];
    },
    ref: (n: number, pre: number[][]) => can(n, pre),
  },
};

export default problem;
