import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { layered, kahnViz } from '../../topoviz';

const N = 6;
const PRE = [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3], [5, 2]];
function order(n: number, pre: number[][]) { const adj = Array.from({ length: n }, () => [] as number[]); const deg = Array(n).fill(0); for (const [a, b] of pre) { adj[b].push(a); deg[a]++; } const q = [...Array(n).keys()].filter((i) => !deg[i]); let k = 0; while (k < q.length) { const x = q[k++]; for (const y of adj[x]) if (--deg[y] === 0) q.push(y); } return q.length === n ? q : []; }

function video() {
  const v = new Video('course-schedule-ii', 'Course Schedule II');
  const E = PRE.map(([a, b]) => [b, a] as [number, number]);
  const nodes = layered(N, E);
  const edges = E.map(([a, b]) => ({ a: String(a), b: String(b) }));
  const adj = Array.from({ length: N }, () => [] as number[]);
  E.forEach(([a, b]) => adj[a].push(b));

  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: 'b → a: take b before a', directed: true });
  v.say('Same courses and prerequisites as Course Schedule, but now return an actual order to take them in, or an empty list if it is impossible. Any valid order is accepted.');
  v.eq(`prerequisites = ${JSON.stringify(PRE)}`);

  v.chapter('brute', 'Brute force: scan for any course whose prerequisites are done', { cx: 'O(V · (V + E))', code: ['repeat n times:', '  scan all courses for one not taken with every prerequisite taken', '  none found → return []'] });
  v.eq('each pick rescans everything', 'bad').say('The simplest plan: again and again, scan every course for one that is not taken yet and whose prerequisites are all taken. Each pick needs a full scan of courses and their prerequisite lists, and there are n picks.');

  v.chapter('optimal', 'Kahn’s algorithm: the queue order is the answer', { cx: 'O(V + E)', code: ['indeg[a]++ for each pair; queue courses with 0', 'c = pop; order.append(c)', '  for next in adj[c]: indeg--, 0 → queue', 'return order if len == n else []'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'badge = prerequisites not yet taken', directed: true });
  v.say('The scan keeps rediscovering the same information. Kahn’s algorithm keeps it up to date instead: a count per course, and a queue of courses whose count is zero. The order in which courses leave the queue is the schedule.');
  const res = kahnViz(v, g, N, adj, {
    lines: { init: [0], pop: [1, 2], done: [3] },
    popSay: (x) => `Take course ${x}.`,
    finalEq: (o) => `order = [${o.join(', ')}]`,
    finalSay: (o) => `All ${words(N)} courses are placed, so the order ${o.join(', ')} is returned. Check any arrow: its start comes earlier in the list than its end.`,
  });
  v.answer(res.order);

  recap(v, [{ name: 'Rescan for a ready course', time: 'O(V · (V + E))', space: 'O(V + E)' }, { name: 'Kahn’s algorithm', time: 'O(V + E)', space: 'O(V + E)' }], 'The pop order of Kahn’s queue is a topological order.', ['Return an order of dependent tasks → Kahn; short order → []'], 'Remember the empty result when a cycle exists.');
  return v.build();
}

const problem: Problem = {
  slug: 'course-schedule-ii',
  statement: 'There are `numCourses` courses labelled 0 to numCourses − 1. `prerequisites[i] = [a, b]` means you must take `b` before `a`. Return an ordering of courses that lets you finish them all. If there are many, return any; if it is impossible, return an empty array.',
  examples: [{ input: 'numCourses = 2, prerequisites = [[1,0]]', output: '[0,1]' }, { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: '[0,2,1,3]' }, { input: 'numCourses = 1, prerequisites = []', output: '[0]' }],
  constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ numCourses · (numCourses − 1)', 'all pairs are distinct'],
  hints: ['Kahn’s algorithm returns the order directly.', 'If fewer than n courses come out, there is a cycle.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Repeated scan', idea: 'n times, find any untaken course whose prerequisites are all taken.', time: 'O(V · (V + E))', space: 'O(V + E)', bottleneck: 'Full rescan per pick.' },
    { id: 'optimal', kind: 'optimal', name: 'Kahn’s algorithm', idea: 'Queue of ready courses; the pop order is the schedule.', time: 'O(V + E)', space: 'O(V + E)' },
  ],
  takeaway: 'Kahn’s **pop order** is the answer.',
  video,
  videoArgs: [N, PRE],
  judge: {
    type: 'fn', fn: 'findOrder', params: ['int', 'int[][]'], ret: 'int[]', cmp: { checker: 'topoOrder' },
    tests: [{ args: [2, [[1, 0]]], out: [0, 1] }, { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], out: [0, 1, 2, 3] }, { args: [1, []], out: [0] }, { args: [2, [[0, 1], [1, 0]]], out: [] }, { args: [N, PRE], out: order(N, PRE) }],
    gen: (r: Rng) => {
      const n = r.int(1, 7);
      const perm = r.shuffle([...Array(n).keys()]);
      const seen = new Set<string>();
      const pre: number[][] = [];
      for (let k = r.int(0, n * 2); k > 0; k--) {
        let a = r.int(0, n - 1), b = r.int(0, n - 1);
        if (a === b) continue;
        if (r.chance(0.85) && perm.indexOf(b) > perm.indexOf(a)) [a, b] = [b, a];
        if (seen.has(`${a},${b}`)) continue;
        seen.add(`${a},${b}`);
        pre.push([a, b]);
      }
      return [n, pre];
    },
    ref: (n: number, pre: number[][]) => order(n, pre),
  },
};

export default problem;
