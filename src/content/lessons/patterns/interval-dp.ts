import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { intervalViz, intervalTable } from '../../intervalviz';

const PILES = [4, 1, 3, 2];

function video() {
  const v = new Video('interval-dp', 'Interval DP');
  const n = PILES.length, m = n + 1;
  const pre = [0]; PILES.forEach((x) => pre.push(pre[pre.length - 1] + x));
  const sum = (i: number, j: number) => pre[j] - pre[i];

  v.chapter('intro', 'Problems about ranges');
  v.array('p', PILES, { label: 'piles of stones in a row' });
  v.say('Stones lie in piles in a row. You may merge two neighbouring piles into one, paying the total number of stones in the new pile. Keep merging until one pile is left. What is the cheapest order?');
  v.say('Greedily merging the two smallest neighbours is not always best. The order matters, and it shapes a tree of merges. Interval DP handles exactly this: the answer for a range depends on how the range is split.');

  v.chapter('idea', 'Think about the last merge');
  v.clear();
  v.text('t', { title: 'The last operation splits the range', lines: ['The final merge joins a left pile and a right pile', 'Left = piles i..k−1 merged, right = piles k..j−1 merged', 'cost(i, j) = min over k of cost(i, k) + cost(k, j) + sum(i..j)', 'Both halves are shorter ranges → fill by length'], shown: 4 });
  v.say('Look at the very last merge. It joins everything on the left of some split point with everything on the right. Those two sides were built independently, and each is the same problem on a shorter range. So the cost of a range is the best split, plus the stones in the whole range, which the last merge always pays.');

  v.chapter('table', 'Fill ranges from short to long', { cx: 'O(n³)', code: ['dp[i][i+1] = 0 (a single pile)', 'for len = 2..n: for i: j = i + len', '  dp[i][j] = min over i < k < j of dp[i][k] + dp[k][j]', '            + sum(piles i..j−1)'] });
  v.clear();
  const g = v.grid('dp', Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => (j <= i ? '·' : j === i + 1 ? 0 : ''))), { label: 'dp[i][j] = cheapest way to merge piles i..j−1' });
  g.heads([...Array(m).keys()].map((i) => `b${i}`), [...Array(m).keys()].map((j) => `b${j}`));
  v.line(0).say('Index the gaps between piles, zero to n. Cell i, j is the range of piles between gap i and gap j. A single pile costs nothing. Longer ranges try every split point k strictly inside, and both halves are already filled because they are shorter. Arrows show the two halves of the best split.');
  const D = intervalTable(m, (i, _k, j) => sum(i, j), 'min').d;
  const { d, split } = intervalViz(v, g, m, (i, _k, j) => sum(i, j), 'min', {
    line: [2, 3],
    eq: (i, j, k, val) => `[${PILES.slice(i, j).join(',')}]: split at b${k}: ${D[i][k]} + ${D[k][j]} + ${sum(i, j)} = ${val}`,
    say: (i, j, k) => (i === 0 && j === 2 ? 'Two piles, four and one: one merge costing five.' : i === 0 && j === 3 ? 'Three piles, four one three. Split after four: merge one and three first, then add four, or split after one. The table picks the cheaper split.' : i === 0 && j === m - 1 ? `The whole row: the best last merge splits at gap ${words(k)}.` : undefined),
  });
  g.tone(0, m - 1, 'ok');
  v.eq(`cheapest = ${d[0][m - 1]}`, 'ok').say(`The cheapest total is ${words(d[0][m - 1])}. There are n squared ranges, each trying up to n splits: n cubed.`);
  void split;

  v.chapter('family', 'The interval DP family');
  v.clear();
  v.table('t', ['Problem', 'Range', 'Last step'], [
    ['merge piles / matrix chain', 'piles i..j', 'the final merge splits at k'],
    ['polygon triangulation', 'vertices i..j', 'triangle (i, k, j)'],
    ['burst balloons', 'open interval (i, j)', 'balloon k bursts LAST'],
    ['cut a stick', 'between cuts i and j', 'the first cut k, costs the length'],
  ]);
  v.say('The recipe: define dp over a range, pick the one operation that splits it, often the first or the last one, and fill ranges from short to long. When choosing what happens first leaves the two sides dependent on each other, try choosing what happens last instead.');
  return v.build();
}

const body = String.raw`
## The idea

When the answer for a range \`[i, j]\` depends on how the range is **split**, define \`dp[i][j]\` and try every split point \`k\` inside it:

\`dp[i][j] = best over i < k < j of  dp[i][k] + dp[k][j] + cost(i, k, j)\`

Fill ranges in order of **increasing length**, so both halves are ready. Time is O(n³).

> Real-life picture: planning a tournament bracket. Whatever happens in the final, each half of the bracket was decided on its own.

## Template

\`\`\`java
int intervalDp(int m, int[][] cost) {                  // points 0..m−1
    int[][] dp = new int[m][m];
    for (int len = 2; len < m; len++)
        for (int i = 0; i + len < m; i++) {
            int j = i + len;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i + 1; k < j; k++)
                dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + costOf(i, k, j));
        }
    return dp[0][m - 1];
}
\`\`\`

\`\`\`python
def interval_dp(m, cost_of):
    dp = [[0] * m for _ in range(m)]
    for length in range(2, m):
        for i in range(m - length):
            j = i + length
            dp[i][j] = min(dp[i][k] + dp[k][j] + cost_of(i, k, j) for k in range(i + 1, j))
    return dp[0][m - 1]
\`\`\`

\`\`\`cpp
int intervalDp(int m, function<int(int,int,int)> costOf) {
    vector<vector<int>> dp(m, vector<int>(m, 0));
    for (int len = 2; len < m; len++)
        for (int i = 0; i + len < m; i++) {
            int j = i + len;
            dp[i][j] = INT_MAX;
            for (int k = i + 1; k < j; k++) dp[i][j] = min(dp[i][j], dp[i][k] + dp[k][j] + costOf(i, k, j));
        }
    return dp[0][m - 1];
}
\`\`\`

## Choosing the split

| Problem | Split k means | Cost |
|---|---|---|
| Polygon triangulation | triangle (i, k, j) | v[i]·v[k]·v[j] |
| Burst balloons | k bursts **last** in (i, j) | p[i]·p[k]·p[j] |
| Cut a stick | first cut at k | length c[j] − c[i] |

## Pitfalls

- Loop by length, not by i then j (or iterate i downwards and j upwards).
- Pad the ends (balloons with 1s, the stick with 0 and n) to make boundaries uniform.
- If choosing the first operation makes the halves interact, choose the **last** one.
`;

const lesson: Lesson = {
  slug: 'interval-dp',
  video,
  body,
  quiz: [
    { q: 'Interval DP fills ranges in what order?', options: ['left to right', 'by increasing length', 'random', 'by decreasing length'], answer: 1, why: 'A range depends on shorter sub-ranges.' },
    { q: 'Typical time complexity?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'], answer: 3, why: 'n² ranges × n split points.' },
    { q: 'In Burst Balloons, the split k is the balloon that bursts…', options: ['first', 'last', 'in the middle', 'never'], answer: 1, why: 'If k bursts last, the two sides are independent.' },
    { q: 'Why pad the stick with 0 and n in Cut a Stick?', options: ['to sort it', 'so every range has boundary cuts to measure length', 'to avoid recursion', 'no reason'], answer: 1, why: 'Lengths are differences between boundary positions.' },
  ],
};

export default lesson;
