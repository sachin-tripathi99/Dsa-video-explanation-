import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { intervalViz, intervalTable } from '../../intervalviz';

const V = [1, 3, 1, 4, 1, 5];
function score(v: number[]) { return intervalTable(v.length, (i, k, j) => v[i] * v[k] * v[j], 'min').d[0][v.length - 1]; }

function video() {
  const v = new Video('minimum-score-triangulation-of-polygon', 'Minimum Score Triangulation of Polygon');
  const n = V.length;
  const pos = V.map((_, i) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / n; return [50 + 40 * Math.cos(a), 50 + 45 * Math.sin(a)]; });
  const nodes = V.map((x, i) => ({ id: String(i), label: String(x), x: pos[i][0], y: pos[i][1], sub: `v${i}` }));
  const ring = V.map((_, i) => ({ a: String(i), b: String((i + 1) % n) }));
  const T = intervalTable(n, (i, k, j) => V[i] * V[k] * V[j], 'min');
  v.chapter('intro', 'The problem');
  v.graph('g', nodes, ring, { label: 'convex polygon, vertex values' });
  v.say('A convex polygon has a value on every vertex. Cut it into triangles using non-crossing diagonals. A triangle scores the product of its three vertex values. Minimise the total score.');
  v.eq(`answer: ${score(V)}`);

  v.chapter('brute', 'Brute force: try every triangulation', { cx: 'Catalan(n)', code: ['best(i, j) = min over k of best(i, k) + best(k, j) + v[i]·v[k]·v[j]', 'without caching'] });
  v.eq('the number of triangulations grows like 4ⁿ', 'bad').say('Every triangulation of the polygon from vertex i to vertex j contains exactly one triangle on the edge i, j, with some third vertex k. That triangle splits the rest into two smaller polygons. Trying every k recursively without caching explores every triangulation: the Catalan numbers, roughly four to the n.');

  v.chapter('better', 'Better: memoise best(i, j)', { cx: 'O(n³)', code: ['cache best(i, j)'] });
  v.eq('n² ranges × n choices of k', 'warn').say('The sub-polygons are just ranges of vertices, i to j. Caching makes it n cubed.');

  v.chapter('optimal', 'Optimal: interval table by length', { cx: 'O(n³) time, O(n²) space', code: ['dp[i][j] = 0 if j − i < 2', 'dp[i][j] = min over i < k < j of', '  dp[i][k] + dp[k][j] + v[i]·v[k]·v[j]', 'answer = dp[0][n−1]'] });
  v.clear();
  const g = v.grid('dp', V.map((_, i) => V.map((__, j) => (j <= i + 1 ? (j < i ? '·' : 0) : ''))), { label: 'dp[i][j] = best triangulation of vertices i..j' });
  g.heads(V.map((x, i) => `v${i}=${x}`), V.map((x, j) => `v${j}=${x}`));
  v.line(0).say('Fill ranges of vertices by length. The edge from i to j must belong to a triangle i, k, j. Its score plus the two sides is one candidate; keep the smallest.');
  intervalViz(v, g, n, (i, k, j) => V[i] * V[k] * V[j], 'min', {
    line: [1, 2],
    eq: (i, j, k, val) => `triangle (v${i}, v${k}, v${j}) = ${V[i] * V[k] * V[j]} + ${T.d[i][k]} + ${T.d[k][j]} = ${val}`,
    say: (i, j, k) => (i === 0 && j === 2 ? 'Three vertices are a single triangle: one times three times one.' : i === 0 && j === n - 1 ? `For the whole polygon, the best triangle on the edge from the first to the last vertex uses vertex ${words(k)}.` : undefined),
    hold: 380,
  });
  g.tone(0, n - 1, 'ok');
  v.clear();
  const tri: [number, number, number][] = [];
  const collect = (i: number, j: number) => { if (j - i < 2) return; const k = T.split[i][j]; tri.push([i, k, j]); collect(i, k); collect(k, j); };
  collect(0, n - 1);
  const diag = new Set<string>();
  tri.forEach(([a, b, c]) => [[a, b], [b, c], [a, c]].forEach(([x, y]) => { if (Math.abs(x - y) !== 1 && !(Math.min(x, y) === 0 && Math.max(x, y) === n - 1)) diag.add(`${x}-${y}`); }));
  const g2 = v.graph('g', nodes, [...ring, ...[...diag].map((d) => { const [a, b] = d.split('-'); return { a, b }; })], { label: 'the best triangulation' });
  [...diag].forEach((d) => { const [a, b] = d.split('-'); g2.edge(a, b, 'ok'); });
  v.eq(`${tri.map(([a, b, c]) => `${V[a]}·${V[b]}·${V[c]}`).join(' + ')} = ${score(V)}`, 'ok').say(`Following the chosen splits back gives the triangulation: ${words(tri.length)} triangles, total ${words(score(V))}. The small values end up shared by many triangles.`);
  v.answer(score(V));

  recap(v, [{ name: 'All triangulations', time: 'Catalan(n)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n³)', space: 'O(n²)' }, { name: 'Interval table', time: 'O(n³)', space: 'O(n²)' }], 'Edge (i, j) belongs to one triangle (i, k, j): try every k.', ['Split a polygon / range recursively → interval DP'], 'Ranges shorter than 3 vertices cost 0.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-score-triangulation-of-polygon',
  statement: 'You have a convex polygon with `n` vertices; `values[i]` is the value of the i-th vertex (clockwise). Triangulate it into n − 2 triangles. Each triangle scores the product of its vertex values. Return the smallest possible total score.',
  examples: [{ input: 'values = [1,2,3]', output: '6' }, { input: 'values = [3,7,4,5]', output: '144' }, { input: 'values = [1,3,1,4,1,5]', output: '13' }],
  constraints: ['3 ≤ n ≤ 50', '1 ≤ values[i] ≤ 100'],
  hints: ['Edge (0, n−1) is in exactly one triangle (0, k, n−1).', 'dp over ranges of vertices.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try every third vertex k, uncached.', time: 'Catalan(n)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache best(i, j).', time: 'O(n³)', space: 'O(n²)', bottleneck: 'Recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Interval table', idea: 'Fill dp[i][j] by length.', time: 'O(n³)', space: 'O(n²)' },
  ],
  takeaway: 'Edge (i, j) + **one triangle (i, k, j)**.',
  video,
  videoArgs: [V],
  judge: {
    type: 'fn', fn: 'minScoreTriangulation', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 2, 3]], out: 6 }, { args: [[3, 7, 4, 5]], out: 144 }, { args: [V], out: 13 }],
    gen: (r: Rng) => [Array.from({ length: r.int(3, 9) }, () => r.int(1, 9))],
    ref: (v: number[]) => score(v),
  },
};

export default problem;
