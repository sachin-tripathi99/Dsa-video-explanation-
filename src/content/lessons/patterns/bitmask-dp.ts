import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { fill2D } from '../../dpviz';

const D = [[0, 2, 9, 4], [2, 0, 6, 3], [9, 6, 0, 1], [4, 3, 1, 0]];
const NAMES = ['A', 'B', 'C', 'D'];

function video() {
  const v = new Video('bitmask-dp', 'Bitmask DP');
  const n = D.length;
  const bin = (m: number) => m.toString(2).padStart(n, '0');

  v.chapter('intro', 'A set as a number');
  const b = v.bits('b', [{ label: 'mask = 11', bits: '1011', note: 'items 0, 1 and 3 are used' }]);
  v.say('When there are only a few items, twenty or fewer, a whole subset fits in one integer: bit i is one if item i is in the set. Eleven in binary is one zero one one: items zero, one and three. Every subset of n items is a number from zero to two to the n minus one, so subsets can index an array.');
  b.update({ rows: [{ label: 'mask', bits: '1011' }, { label: '1 << 2', bits: '0100', note: 'item 2' }, { label: 'mask | (1 << 2)', bits: '1111', note: 'add item 2' }, { label: 'mask & (1 << 2)', bits: '0000', note: 'is item 2 in? no' }] });
  v.say('The basic moves are single operations: one shifted left by i is the set containing only item i. OR adds it, AND tests it. Counting the ones tells the size of the set.');

  v.chapter('tsp', 'State = (which are used, where am I)', { cx: 'O(2ⁿ · n²)', code: ['dp[mask][last]: visited mask, standing at last', 'dp[{A}][A] = 0', 'dp[m | nx][nx] = min(…, dp[m][last] + d[last][nx])', 'answer = min over last of dp[all][last]'] });
  v.clear();
  v.table('d', ['', ...NAMES], D.map((row, i) => [NAMES[i], ...row.map(String)]));
  v.say('A classic: visit four cities starting at A, each exactly once, as cheaply as possible. Trying every order is n factorial. But to extend a partial route, we only need to know which cities it has visited and where it currently is, not the order it took.');
  v.clear();
  const masks = [...Array(1 << n).keys()].filter((m) => m & 1);
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: 1 << n }, () => Array(n).fill(INF));
  const from: number[][] = Array.from({ length: 1 << n }, () => Array(n).fill(-1));
  dp[1][0] = 0;
  for (const m of masks) for (let last = 0; last < n; last++) { if (dp[m][last] === INF) continue; for (let nx = 0; nx < n; nx++) { if (m & (1 << nx)) continue; const nm = m | (1 << nx); if (dp[m][last] + D[last][nx] < dp[nm][nx]) { dp[nm][nx] = dp[m][last] + D[last][nx]; from[nm][nx] = last; } } }
  const f = (x: number) => (x === INF ? '∞' : String(x));
  const g = v.grid('dp', masks.map((m) => NAMES.map((_, c) => (m === 1 && c === 0 ? 0 : ''))), { label: 'dp[mask][last]' });
  g.heads(masks.map((m) => `${bin(m)} {${NAMES.filter((_, i) => m & (1 << i)).join('')}}`), NAMES.map((x) => `end ${x}`));
  v.line(0, 1).say('Rows are visited sets, all containing A, written as bits with A on the right. Columns are the city we stand in. Only A alone, standing at A, starts at zero. A cell is filled from the row without its own city: the route came from some last city and took one road.');
  const cells: [number, number][] = [];
  masks.forEach((m, ri) => NAMES.forEach((_, c) => { if (m !== 1 && m & (1 << c) && c !== 0) cells.push([ri, c]); }));
  fill2D(v, g, cells, {
    deps: (ri, c) => { const m = masks[ri]; const p = from[m][c]; if (p < 0) return []; return [[masks.indexOf(m & ~(1 << c)), p]]; },
    val: (ri, c) => f(dp[masks[ri]][c]),
    line: [2],
    eq: (ri, c) => { const m = masks[ri], p = from[m][c]; return p < 0 ? `{${bin(m)}} ending ${NAMES[c]}: unreachable` : `${NAMES[p]} → ${NAMES[c]}: ${dp[m & ~(1 << c)][p]} + ${D[p][c]} = ${dp[m][c]}`; },
    say: (ri, c) => { const m = masks[ri]; return m === 3 && c === 1 ? 'Visited A and B, standing at B: the road from A costs two.' : m === 15 && c === 2 ? 'All four visited, ending at C: the best predecessor is the set without C, ending at D, plus the road from D to C.' : undefined; },
    hold: 280,
  });
  const full = (1 << n) - 1;
  const bestEnd = [...Array(n).keys()].reduce((a, c) => (dp[full][c] < dp[full][a] ? c : a), 1);
  g.tone(masks.indexOf(full), bestEnd, 'ok');
  v.line(3).eq(`best route cost = ${dp[full][bestEnd]} (ending at ${NAMES[bestEnd]})`, 'ok').say(`The cheapest way to visit everyone costs ${words(dp[full][bestEnd])}. There are two to the n times n states, each trying n next cities: for twenty cities about four hundred million steps, instead of twenty factorial.`);

  v.chapter('family', 'Where bitmask DP appears');
  v.clear();
  v.table('t', ['Problem', 'State'], [
    ['visit every node / city once', 'dp[mask][last]'],
    ['assign items to positions (beautiful arrangement)', 'dp[mask], position = popcount(mask)'],
    ['split into k equal groups', 'dp[mask] = fill of the current group'],
    ['shortest path visiting all nodes', 'BFS over (node, mask)'],
  ]);
  v.say('The signal is a small n with the requirement to use or visit everything exactly once. The mask remembers exactly which ones are done.');
  return v.build();
}

const body = String.raw`
## The idea

For small n (≤ 20), a **subset** is an integer \`mask\`: bit i set ⇔ item i is in the set. That lets a DP be indexed by "which items are already used", with 2ⁿ states.

> Real-life picture: a row of light switches. The pattern of on/off switches is a binary number.

## Bit operations

| Operation | Code |
|---|---|
| is i in mask? | \`(mask >> i) & 1\` |
| add i | \`mask | (1 << i)\` |
| remove i | \`mask & ~(1 << i)\` |
| size of set | \`popcount(mask)\` |
| all items | \`(1 << n) − 1\` |

## Template: visit everything once

\`\`\`java
int[][] dp = new int[1 << n][n];
for (int[] row : dp) Arrays.fill(row, INF);
dp[1][0] = 0;                                          // start at node 0
for (int mask = 1; mask < (1 << n); mask++)
    for (int last = 0; last < n; last++) {
        if (dp[mask][last] == INF) continue;
        for (int nx = 0; nx < n; nx++) {
            if ((mask >> nx & 1) == 1) continue;
            int nm = mask | (1 << nx);
            dp[nm][nx] = Math.min(dp[nm][nx], dp[mask][last] + d[last][nx]);
        }
    }
\`\`\`

\`\`\`python
dp = [[INF] * n for _ in range(1 << n)]
dp[1][0] = 0                                           # start at node 0
for mask in range(1, 1 << n):
    for last in range(n):
        if dp[mask][last] == INF:
            continue
        for nx in range(n):
            if not mask >> nx & 1:
                nm = mask | 1 << nx
                dp[nm][nx] = min(dp[nm][nx], dp[mask][last] + d[last][nx])
\`\`\`

\`\`\`cpp
vector<vector<int>> dp(1 << n, vector<int>(n, INF));
dp[1][0] = 0;                                          // start at node 0
for (int mask = 1; mask < (1 << n); mask++)
    for (int last = 0; last < n; last++) {
        if (dp[mask][last] == INF) continue;
        for (int nx = 0; nx < n; nx++) {
            if (mask >> nx & 1) continue;
            int nm = mask | (1 << nx);
            dp[nm][nx] = min(dp[nm][nx], dp[mask][last] + d[last][nx]);
        }
    }
\`\`\`

## Pitfalls

- 2ⁿ grows fast: n = 20 → 10⁶ masks; with an extra n dimension, 2·10⁷.
- Process masks in increasing order: adding a bit always makes a larger number.
- Use \`1 << i\` with care for i ≥ 31 (use 64-bit if needed).
`;

const lesson: Lesson = {
  slug: 'bitmask-dp',
  video,
  body,
  quiz: [
    { q: 'How many subsets does a mask over n items represent?', options: ['n', 'n²', '2ⁿ', 'n!'], answer: 2, why: 'Each item is in or out.' },
    { q: 'Add item i to mask:', options: ['mask & (1 << i)', 'mask | (1 << i)', 'mask ^ i', 'mask + i'], answer: 1, why: 'OR sets the bit.' },
    { q: 'For "visit all nodes once", the state is…', options: ['dp[last]', 'dp[mask]', 'dp[mask][last]', 'dp[n]'], answer: 2, why: 'You need both the visited set and your position.' },
    { q: 'Bitmask DP is practical for n up to about…', options: ['10', '20', '1000', '10⁶'], answer: 1, why: '2²⁰ ≈ one million.' },
  ],
};

export default lesson;
