import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { dijkstraViz, graphView } from '../../dijkstraviz';

const N = 5, K = 1;
const T = [[1, 2, 2], [1, 3, 5], [2, 3, 1], [2, 4, 6], [3, 4, 2], [4, 5, 1], [3, 5, 7]];
const POS = [[6, 50], [36, 14], [36, 86], [66, 50], [94, 50]];
function delay(times: number[][], n: number, k: number) {
  const d = Array(n + 1).fill(Infinity); d[k] = 0;
  for (let r = 1; r < n; r++) for (const [u, v, w] of times) if (d[u] + w < d[v]) d[v] = d[u] + w;
  const m = Math.max(...d.slice(1));
  return m === Infinity ? -1 : m;
}

function video() {
  const v = new Video('network-delay-time', 'Network Delay Time');
  const nodes = POS.map(([x, y], i) => ({ id: String(i), label: String(i + 1), x, y }));
  const edges = T.map(([a, b, w]) => ({ a: String(a - 1), b: String(b - 1), w }));
  const adj = Array.from({ length: N }, () => [] as [number, number][]);
  T.forEach(([a, b, w]) => adj[a - 1].push([b - 1, w]));
  const ans = delay(T, N, K);

  v.chapter('intro', 'The problem');
  v.graph('g', nodes, edges, { label: 'signal travel times', directed: true });
  v.say(`A signal starts at node ${words(K)} and travels along directed links, each with a delay. How long until every node has received it? If some node never gets it, return minus one.`);
  v.eq(`answer: ${ans}`);
  v.say('A node hears the signal at its shortest travel time from the source. Everyone has heard it once the farthest node has, so the answer is the largest shortest-path distance.');

  v.chapter('brute', 'Brute force: Bellman-Ford, relax every link n − 1 times', { cx: 'O(V · E)', code: ['dist[k] = 0, others ∞', 'repeat n − 1 times: for each (u, v, w): relax', 'answer = max dist, or −1 if any ∞'] });
  v.eq('n − 1 passes over all links', 'warn').say('Without any cleverness, relax every link again and again. After n minus one passes all distances are correct. That is n times the number of links.');

  v.chapter('optimal', 'Dijkstra from node k, then take the maximum', { cx: 'O(E log V)', code: ['dist[k] = 0; heap = [(0, k)]', 'pop (d, u): skip stale; u is final', 'for (w, t) in adj[u]: relax d + t', '  push improved nodes', 'answer = max(dist), or −1 if unreachable'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'badge = earliest arrival known', directed: true });
  v.layout('row').weight('g', 2.2);
  const res = dijkstraViz(v, graphView(g), N, adj, K - 1, {
    name: (i) => String(i + 1),
    lines: { init: [0], pop: [1], relax: [2, 3], done: [4] },
    what: 'time',
    narrate: 3,
    sayInit: `All delays are non-negative, so Dijkstra applies. Node ${words(K)} hears the signal at time zero.`,
  });
  const far = res.dist.indexOf(Math.max(...res.dist));
  g.clearTones(); g.tone(String(far), 'ok');
  v.line(4).eq(`arrival times ${res.dist.join(', ')} → max = ${ans}`, 'ok').say(`All nodes are reached. The last to hear is node ${words(far + 1)}, at time ${words(ans)}, so that is the answer.`);
  v.answer(ans);

  recap(v, [{ name: 'Bellman-Ford', time: 'O(V · E)', space: 'O(V)' }, { name: 'Dijkstra + heap', time: 'O(E log V)', space: 'O(V + E)' }], 'Time for everyone = the largest shortest distance.', ['“How long until all nodes receive it” → single-source shortest paths, then max'], 'Unreached node → −1.');
  return v.build();
}

const problem: Problem = {
  slug: 'network-delay-time',
  statement: 'You are given a network of `n` nodes labelled 1 to n and `times[i] = (u, v, w)`: a signal takes `w` time to travel from `u` to `v`. A signal is sent from node `k`. Return the minimum time for all nodes to receive it, or -1 if that is impossible.',
  examples: [{ input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', output: '2' }, { input: 'times = [[1,2,1]], n = 2, k = 1', output: '1' }, { input: 'times = [[1,2,1]], n = 2, k = 2', output: '-1' }],
  constraints: ['1 ≤ k ≤ n ≤ 100', '1 ≤ times.length ≤ 6000', '0 ≤ w ≤ 100', 'all (u, v) pairs are distinct'],
  hints: ['Each node hears the signal at its shortest distance from k.', 'The answer is the largest of those.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Bellman-Ford', idea: 'Relax every edge n − 1 times, then take the max.', time: 'O(V · E)', space: 'O(V)', bottleneck: 'Relaxes every edge in every pass.' },
    { id: 'optimal', kind: 'optimal', name: 'Dijkstra', idea: 'Heap-based shortest paths from k; answer is the max distance.', time: 'O(E log V)', space: 'O(V + E)' },
  ],
  takeaway: 'Answer = **max of shortest distances**.',
  video,
  videoArgs: [T, N, K],
  judge: {
    type: 'fn', fn: 'networkDelayTime', params: ['int[][]', 'int', 'int'], ret: 'int',
    tests: [{ args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], out: 2 }, { args: [[[1, 2, 1]], 2, 1], out: 1 }, { args: [[[1, 2, 1]], 2, 2], out: -1 }, { args: [T, N, K], out: delay(T, N, K) }],
    gen: (r: Rng) => {
      const n = r.int(2, 7);
      const seen = new Set<string>();
      const times: number[][] = [];
      for (let i = r.int(1, n * 3); i > 0; i--) {
        const a = r.int(1, n), b = r.int(1, n);
        if (a === b || seen.has(`${a},${b}`)) continue;
        seen.add(`${a},${b}`);
        times.push([a, b, r.int(0, 20)]);
      }
      if (!times.length) times.push([1, 2, 3]);
      return [times, n, r.int(1, n)];
    },
    ref: (times: number[][], n: number, k: number) => delay(times, n, k),
  },
};

export default problem;
