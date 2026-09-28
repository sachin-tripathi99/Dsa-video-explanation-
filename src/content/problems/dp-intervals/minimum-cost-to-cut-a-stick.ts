import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { intervalViz, intervalTable } from '../../intervalviz';

const N = 7, CUTS = [1, 3, 4, 5];
function cost(n: number, cuts: number[]) { const c = [0, ...[...cuts].sort((a, b) => a - b), n]; return intervalTable(c.length, (i, _k, j) => c[j] - c[i], 'min').d[0][c.length - 1]; }

function video() {
  const v = new Video('minimum-cost-to-cut-a-stick', 'Minimum Cost to Cut a Stick');
  const C = [0, ...[...CUTS].sort((a, b) => a - b), N];
  const m = C.length;
  const T = intervalTable(m, (i, _k, j) => C[j] - C[i], 'min');
  v.chapter('intro', 'The problem');
  v.array('s', Array.from({ length: N }, (_, i) => `${i}–${i + 1}`), { label: `a stick of length ${N}, marks at ${CUTS.join(', ')}` });
  v.say(`A wooden stick of length ${words(N)} must be cut at the marks ${CUTS.join(', ')}. Each cut costs the length of the piece being cut. Choose the order of cuts to minimise the total cost.`);
  v.eq(`answer: ${cost(N, CUTS)}`);
  v.say('Cutting in the given order costs seven, then six, then four, then three: twenty. A better order is sixteen.');

  v.chapter('brute', 'Brute force: try every order of cuts', { cx: 'O(k!)', code: ['for each remaining cut: pay the piece length, recurse on both pieces'] });
  v.eq(`${CUTS.length}! = 24 orders`, 'bad').say('Trying all orders of k cuts is k factorial.');

  v.chapter('better', 'Better: memoise by the piece between two cut positions', { cx: 'O(k³)', code: ['c = [0] + sorted(cuts) + [n]', 'best(i, j) = c[j] − c[i] + min over i < k < j of best(i, k) + best(k, j)'] });
  v.eq('pieces are ranges of the sorted cut list', 'warn').say('Any piece that appears during the process runs from one cut position to another. Add the stick ends as positions zero and n, sort, and a piece is a range i to j in that list. The first cut inside it, at some k, costs the piece length and leaves two independent pieces.');

  v.chapter('optimal', 'Optimal: interval table over cut positions', { cx: 'O(k³) time, O(k²) space', code: ['c = [0] + sorted(cuts) + [n]', 'dp[i][j] = 0 if no cut lies between', 'dp[i][j] = c[j] − c[i] + min over k of dp[i][k] + dp[k][j]', 'answer = dp[0][k+1]'] });
  v.clear();
  const g = v.grid('dp', C.map((_, i) => C.map((__, j) => (j <= i + 1 ? (j < i ? '·' : 0) : ''))), { label: 'dp[i][j] = cheapest way to make every cut between positions c[i] and c[j]' });
  g.heads(C.map((x) => `@${x}`), C.map((x) => `@${x}`));
  v.line(0).say(`The positions are ${C.join(', ')}. A piece between two neighbouring positions needs no cuts. Wider pieces try every cut inside as the first one.`);
  intervalViz(v, g, m, (i, _k, j) => C[j] - C[i], 'min', {
    line: [2],
    eq: (i, j, k, val) => `piece ${C[i]}..${C[j]}: first cut @${C[k]} → ${C[j] - C[i]} + ${T.d[i][k]} + ${T.d[k][j]} = ${val}`,
    say: (i, j, k) => (i === 0 && j === 2 ? 'The piece from zero to three has one mark inside, at one: cutting it costs the piece length, three.' : i === 0 && j === m - 1 ? `For the whole stick, the best first cut is at ${words(C[k])}: seven, plus the best for the two pieces.` : undefined),
    hold: 380,
  });
  g.tone(0, m - 1, 'ok');
  v.line(3).eq(`dp[0][${m - 1}] = ${T.d[0][m - 1]}`, 'ok').say(`The minimum total is ${words(T.d[0][m - 1])}. With k cuts, the table is k squared cells each trying k splits, independent of the stick length.`);
  v.answer(cost(N, CUTS));

  recap(v, [{ name: 'All orders', time: 'O(k!)', space: 'O(k)' }, { name: 'Memoisation', time: 'O(k³)', space: 'O(k²)' }, { name: 'Interval table', time: 'O(k³)', space: 'O(k²)' }], 'Sort cuts, add 0 and n, split at the first cut.', ['Order of cuts / splits with length costs → interval DP over positions'], 'Index by cut positions, not by stick length.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-cost-to-cut-a-stick',
  statement: 'A wooden stick of length `n` has marks at positions `cuts`. You may perform the cuts in any order; each cut costs the length of the stick being cut. Return the minimum total cost.',
  examples: [{ input: 'n = 7, cuts = [1,3,4,5]', output: '16' }, { input: 'n = 9, cuts = [5,6,1,4,2]', output: '22' }],
  constraints: ['2 ≤ n ≤ 10⁶', '1 ≤ cuts.length ≤ min(n − 1, 100)', 'cuts are distinct, 1 ≤ cuts[i] ≤ n − 1'],
  hints: ['Sort the cuts and add 0 and n.', 'dp over pairs of cut positions.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try every first cut for every piece, uncached.', time: 'exponential', space: 'O(k)', bottleneck: 'Recomputes pieces.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache best(i, j) over positions.', time: 'O(k³)', space: 'O(k²)', bottleneck: 'Recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Interval table', idea: 'Fill by range width.', time: 'O(k³)', space: 'O(k²)' },
  ],
  takeaway: 'Positions **0, sorted cuts, n**; first cut splits the piece.',
  video,
  videoArgs: [N, CUTS],
  judge: {
    type: 'fn', fn: 'minCost', params: ['int', 'int[]'], ret: 'int',
    tests: [{ args: [N, CUTS], out: 16 }, { args: [9, [5, 6, 1, 4, 2]], out: 22 }, { args: [2, [1]], out: 2 }],
    gen: (r: Rng) => { const n = r.int(2, 20); const s = new Set<number>(); for (let i = r.int(1, Math.min(n - 1, 7)); i > 0; i--) s.add(r.int(1, n - 1)); return [n, [...s]]; },
    ref: (n: number, c: number[]) => cost(n, c),
  },
};

export default problem;
