import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const N = 4, SRC = 0, DST = 3, K = 1;
const F = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]];
const POS = [[8, 50], [42, 12], [42, 88], [92, 50]];
function cheapest(n: number, flights: number[][], src: number, dst: number, k: number) {
  let d = Array(n).fill(Infinity); d[src] = 0;
  for (let r = 0; r <= k; r++) { const nd = [...d]; for (const [a, b, w] of flights) if (d[a] + w < nd[b]) nd[b] = d[a] + w; d = nd; }
  return d[dst] === Infinity ? -1 : d[dst];
}

function video() {
  const v = new Video('cheapest-flights-within-k-stops', 'Cheapest Flights Within K Stops');
  const nodes = POS.map(([x, y], i) => ({ id: String(i), label: String(i), x, y }));
  const edges = F.map(([a, b, w]) => ({ a: String(a), b: String(b), w }));
  const ans = cheapest(N, F, SRC, DST, K);
  const f = (x: number) => (x === Infinity ? '∞' : String(x));

  v.chapter('intro', 'The problem');
  const g0 = v.graph('g', nodes, edges, { label: 'flights and prices', directed: true });
  v.say(`Find the cheapest trip from city ${words(SRC)} to city ${words(DST)} using at most ${words(K)} stop${K === 1 ? '' : 's'} in between, so at most ${words(K + 1)} flights. Return minus one if there is none.`);
  g0.edge('0', '1', 'bad').edge('1', '2', 'bad').edge('2', '3', 'bad');
  v.eq('0 → 1 → 2 → 3 costs 400 but has 2 stops', 'bad').say('The cheapest route overall is zero, one, two, three for four hundred. But it stops at both one and two: two stops, one too many. Plain Dijkstra would find it and be wrong.');
  g0.clearTones(); g0.edge('0', '1', 'ok').edge('1', '3', 'ok');
  v.eq(`0 → 1 → 3 costs 700 with 1 stop → answer ${ans}`, 'ok').say('With at most one stop, the best is zero, one, three for seven hundred. The limit on the number of flights is what makes this problem different.');

  v.chapter('brute', 'Brute force: try every route with at most k + 1 flights', { cx: 'O(bᵏ⁺¹)', code: ['dfs(city, cost, flightsLeft):', '  city == dst → record cost', '  flightsLeft == 0 → stop', '  for each flight out: dfs(next, cost + price, flightsLeft − 1)'] });
  v.eq('branching factor ^ (k + 1) routes', 'bad').say('Exploring every route of up to k plus one flights is exponential: each city can branch into many flights at every step.');

  v.chapter('optimal', 'Bellman-Ford with exactly k + 1 rounds', { cx: 'O(k · E)', code: ['cost[src] = 0, others ∞', 'repeat k + 1 times: prev = copy of cost', '  for each flight (a, b, p): cost[b] = min(cost[b], prev[a] + p)', 'return cost[dst] (or −1)'] });
  v.clear();
  const g = v.graph('g', nodes, edges, { label: 'badge = cheapest with the flights used so far', directed: true });
  const tb = v.table('tb', ['flights', ...nodes.map((x) => x.label)], [['0', ...Array.from({ length: N }, (_, i) => (i === SRC ? '0' : '∞'))]]);
  v.layout('row').weight('g', 2.2).weight('tb', 1);
  let d = Array(N).fill(Infinity); d[SRC] = 0;
  g.badge(String(SRC), '0');
  v.line(0).say('Bellman-Ford has exactly the property we need: after round r, every city holds the cheapest price using at most r flights. So run exactly k plus one rounds.');
  for (let r = 1; r <= K + 1; r++) {
    const prev = [...d];
    const nd = [...d];
    v.line(1).counter(`round ${r}`).eq(`round ${r}: prev = [${prev.map(f).join(', ')}]`);
    if (r === 1) v.say('The one subtle point: each round must read from a copy of the previous round’s prices. Otherwise a price updated earlier in the same round could be extended again, sneaking in an extra flight.');
    else v.hold(700);
    for (const [a, b, w] of F) {
      g.clearTones(); g.edge(String(a), String(b), 'cmp');
      const cand = prev[a] + w;
      if (cand < nd[b]) {
        const old = nd[b];
        nd[b] = cand;
        g.badge(String(b), cand).tone(String(b), 'ok');
        v.line(2).eq(`${a} → ${b}: prev[${a}] + ${w} = ${cand} < ${f(old)} → cost[${b}] = ${cand}`, 'ok');
        if (r === 2 && b === DST) v.say(`Round two: city three can now be reached through city ${words(a)}: ${words(cand)}. This is a trip with two flights, so it is allowed.`);
        else v.hold(800);
      } else {
        v.line(2).eq(`${a} → ${b}: prev[${a}] + ${w} = ${f(cand)} → no improvement`);
        if (r === 1 && a === 1 && b === 2) v.say('Round one: city one was just updated to one hundred, but prev still says infinity for it. So the flight from one to two is not used yet. Without the copy, we would have taken two flights in one round.');
        else v.hold(600);
      }
    }
    d = nd;
    g.clearTones();
    tb.addRow([String(r), ...d.map(f)]);
    v.line(1).eq(`after round ${r}: [${d.map(f).join(', ')}]`);
    v.hold(900);
  }
  g.tone(String(DST), 'ok');
  v.line(3).eq(`cost[${DST}] after ${K + 1} rounds = ${ans}`, 'ok').say(`After ${words(K + 1)} rounds, city three costs ${words(ans)}. The four hundred route would only appear in round three, which we never run.`);
  v.answer(ans);

  recap(v, [{ name: 'All routes (DFS)', time: 'O(bᵏ⁺¹)', space: 'O(k)' }, { name: 'Bellman-Ford, k + 1 rounds', time: 'O(k · E)', space: 'O(V)' }, { name: 'Dijkstra on (city, stops)', time: 'O(k · E log(k · V))', space: 'O(k · V)' }], 'Round r of Bellman-Ford = best with at most r edges.', ['“At most k stops / edges” → Bellman-Ford rounds with a copy'], 'Copy the previous round, or edges chain within a round.');
  return v.build();
}

const problem: Problem = {
  slug: 'cheapest-flights-within-k-stops',
  statement: 'There are `n` cities and `flights[i] = [from, to, price]`. Given `src`, `dst` and `k`, return the cheapest price from `src` to `dst` with at most `k` stops. If there is no such route, return -1.',
  examples: [{ input: 'n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1', output: '700' }, { input: 'n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1', output: '200' }, { input: 'n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 0', output: '500' }],
  constraints: ['1 ≤ n ≤ 100', '0 ≤ flights.length ≤ n(n − 1)/2', '1 ≤ price ≤ 10⁴', 'no repeated flights', '0 ≤ k < n', 'src ≠ dst'],
  hints: ['k stops = k + 1 flights.', 'Bellman-Ford round r = best price with at most r edges.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'DFS over routes', idea: 'Try every route with at most k + 1 flights.', time: 'O(bᵏ⁺¹)', space: 'O(k)', bottleneck: 'Exponential.' },
    { id: 'optimal', kind: 'optimal', name: 'Bellman-Ford, k + 1 rounds', idea: 'Relax every flight from a copy of the previous round, k + 1 times.', time: 'O(k · E)', space: 'O(V)' },
  ],
  takeaway: 'Limit the edges → **Bellman-Ford rounds**, reading a copy.',
  video,
  videoArgs: [N, F, SRC, DST, K],
  judge: {
    type: 'fn', fn: 'findCheapestPrice', params: ['int', 'int[][]', 'int', 'int', 'int'], ret: 'int',
    tests: [{ args: [N, F, SRC, DST, K], out: 700 }, { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1], out: 200 }, { args: [3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0], out: 500 }, { args: [3, [[0, 1, 5]], 0, 2, 1], out: -1 }],
    gen: (r: Rng) => {
      const n = r.int(2, 6);
      const seen = new Set<string>();
      const fl: number[][] = [];
      for (let i = r.int(0, n * 2); i > 0; i--) { const a = r.int(0, n - 1), b = r.int(0, n - 1); if (a === b || seen.has(`${a},${b}`)) continue; seen.add(`${a},${b}`); fl.push([a, b, r.int(1, 50)]); }
      const src = r.int(0, n - 1);
      let dst = r.int(0, n - 1);
      if (dst === src) dst = (dst + 1) % n;
      return [n, fl, src, dst, r.int(0, n - 1)];
    },
    ref: (n: number, fl: number[][], s: number, t: number, k: number) => cheapest(n, fl, s, t, k),
  },
};

export default problem;
