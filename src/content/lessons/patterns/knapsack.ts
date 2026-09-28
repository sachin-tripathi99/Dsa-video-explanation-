import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { callTree, fill2D } from '../../dpviz';

const W = [1, 3, 4, 5];
const V = [1, 4, 5, 7];
const CAP = 7;

function video() {
  const v = new Video('knapsack', '0/1 and unbounded knapsack');
  const n = W.length;
  const T = Array.from({ length: n + 1 }, () => Array(CAP + 1).fill(0));
  for (let i = 1; i <= n; i++) for (let c = 0; c <= CAP; c++) T[i][c] = Math.max(T[i - 1][c], c >= W[i - 1] ? T[i - 1][c - W[i - 1]] + V[i - 1] : -1);

  v.chapter('intro', 'Take it or leave it');
  v.table('items', ['item', 'weight', 'value'], W.map((w, i) => [String.fromCharCode(65 + i), String(w), String(V[i])]));
  v.say(`A backpack holds at most ${words(CAP)} kilos. Each item has a weight and a value, and each can be packed at most once. Which items give the most value?`);
  v.eq(`best = ${T[n][CAP]} (B + C: weight 3 + 4, value 4 + 5)`);
  v.say('Greedy by value per kilo does not work in general. This is the 0/1 knapsack: for every item, a yes or no decision. A whole family of problems, like subset sums and coin combinations, are this problem in disguise.');

  v.chapter('recursion', 'Decide the last item: skip it or take it', { cx: 'O(2ⁿ)', code: ['best(i, cap): items 0..i−1 with capacity cap', '  skip:  best(i − 1, cap)', '  take:  value[i−1] + best(i − 1, cap − weight[i−1])  (if it fits)', '  return the max'] });
  v.clear();
  v.say('Look at the last item. Either we leave it, and solve the same problem with one item fewer, or we pack it, gaining its value and losing its weight from the capacity. The state is two numbers: how many items are left, and how much room.');
  const t = callTree<[number, number]>(v, 'rt', 'best(items, capacity) for the first 3 items, cap 4', [3, 4], {
    kids: ([i, c]) => (i === 0 ? [] : [[i - 1, c], ...(c >= W[i - 1] ? [[i - 1, c - W[i - 1]] as [number, number]] : [])]),
    key: String, text: ([i, c]) => `${i},${c}`, lines: { call: [1, 2], base: [0] }, hold: 330,
    say: ([i, c], info) => (info.calls === 1 ? 'Each call branches into skip and take.' : info.repeat ? 'The same pair of items-left and capacity shows up from different branches.' : undefined),
  });
  v.eq(`${t.calls} calls · 2ⁿ in general, but only n × (cap + 1) distinct states`, 'warn').say('Two branches per item is exponential, but there are only items times capacity distinct states. That is the table.');

  v.chapter('table', 'The table: rows = items, columns = capacity', { cx: 'O(n · cap)', code: ['dp[0][*] = 0', 'dp[i][c] = dp[i−1][c]                      (skip)', '        or dp[i−1][c−w] + value, if bigger (take)', 'answer = dp[n][cap]'] });
  v.clear();
  const g = v.grid('dp', T.map((row, i) => row.map((x) => (i === 0 ? 0 : ''))), { label: 'dp[i][c] = best value using the first i items with capacity c' });
  g.heads(['—', ...W.map((w, i) => `${String.fromCharCode(65 + i)} w${w} v${V[i]}`)], [...Array(CAP + 1).keys()].map(String));
  v.line(0).say('Row zero, no items, is all zeros. Each new row considers one more item. A cell looks straight up, which means skipping the item, and up and to the left by the item’s weight, which means taking it.');
  const cells: [number, number][] = [];
  for (let i = 1; i <= n; i++) for (let c = 0; c <= CAP; c++) cells.push([i, c]);
  fill2D(v, g, cells, {
    deps: (i, c) => [[i - 1, c], ...(c >= W[i - 1] ? [[i - 1, c - W[i - 1]] as [number, number]] : [])],
    val: (i, c) => T[i][c], line: (i, c) => (c >= W[i - 1] ? [2] : [1]),
    eq: (i, c) => (c >= W[i - 1] ? `dp[${i}][${c}] = max(skip ${T[i - 1][c]}, take ${T[i - 1][c - W[i - 1]]} + ${V[i - 1]}) = ${T[i][c]}` : `dp[${i}][${c}]: item too heavy → skip = ${T[i][c]}`),
    say: (i, c) => (i === 2 && c === 3 ? 'Item B weighs three. At capacity three we can take it: four, from zero plus four, beats one from skipping.' : i === 2 && c === 4 ? 'At capacity four, taking B leaves one kilo, where item A fits: four plus one, five.' : i === 3 && c === 7 ? 'Taking C at capacity seven leaves three kilos, worth four from the row above: nine.' : undefined),
    hold: 180,
  });
  g.tone(n, CAP, 'ok');
  v.line(3).eq(`dp[${n}][${CAP}] = ${T[n][CAP]}`, 'ok').say(`The bottom-right cell is the answer, ${words(T[n][CAP])}. Items times capacity cells, each constant work.`);

  v.chapter('rolling', 'One row, filled right to left', { code: ['dp = [0] * (cap + 1)', 'for each item (w, v):', '  for c from cap down to w:', '    dp[c] = max(dp[c], dp[c − w] + v)'] });
  v.clear();
  v.text('tx', { title: 'Why backwards?', lines: ['Each row only reads the row above: keep one array', 'dp[c − w] must still hold the OLD value (item not yet used)', 'Going right to left, cells on the left are updated later', 'Going left to right would let one item be packed twice'], shown: 4 });
  v.say('Every row only reads the row above, so one array is enough. But the take option reads dp of c minus w, which must still be the value from before this item. Updating capacities from high to low guarantees that. Going low to high would reuse the same item again, which is exactly the unbounded knapsack.');

  v.chapter('family', 'The knapsack family');
  v.clear();
  v.table('fam', ['Problem', 'Items used', 'Cell holds', 'Loop'], [
    ['0/1 knapsack', 'once', 'max value', 'capacity high → low'],
    ['subset sum / partition', 'once', 'reachable? (bool)', 'high → low'],
    ['count subsets with sum (target sum)', 'once', 'count', 'high → low'],
    ['coin change (min coins)', 'unlimited', 'min count', 'low → high'],
    ['coin change II (combinations)', 'unlimited', 'count', 'coins outer, low → high'],
    ['two capacities (ones and zeroes)', 'once', 'max items', '2D, both high → low'],
  ]);
  v.say('Spot the pattern: a set of items, a budget or target, and a yes or no choice per item. Then decide: can an item be reused, and is the cell a maximum, a count, or a yes or no?');
  return v.build();
}

const body = String.raw`
## The idea

You have items with a **cost** (weight) and a **gain** (value) and a **budget** (capacity). Each item is either taken or not. \`dp[c]\` = best result using budget \`c\` with the items considered so far.

> Real-life picture: packing a carry-on. Every item is in or out, and the bag has a weight limit.

## 0/1 knapsack

\`\`\`java
int knapsack(int[] w, int[] v, int cap) {
    int[] dp = new int[cap + 1];
    for (int i = 0; i < w.length; i++)
        for (int c = cap; c >= w[i]; c--)              // high → low: each item once
            dp[c] = Math.max(dp[c], dp[c - w[i]] + v[i]);
    return dp[cap];
}
\`\`\`

\`\`\`python
def knapsack(w, v, cap):
    dp = [0] * (cap + 1)
    for wi, vi in zip(w, v):
        for c in range(cap, wi - 1, -1):               # high → low: each item once
            dp[c] = max(dp[c], dp[c - wi] + vi)
    return dp[cap]
\`\`\`

\`\`\`cpp
int knapsack(vector<int>& w, vector<int>& v, int cap) {
    vector<int> dp(cap + 1, 0);
    for (int i = 0; i < (int)w.size(); i++)
        for (int c = cap; c >= w[i]; c--)              // high → low: each item once
            dp[c] = max(dp[c], dp[c - w[i]] + v[i]);
    return dp[cap];
}
\`\`\`

## Unbounded knapsack

Same loop, but capacity goes **low → high**, so an item can be taken again in the same pass.

## Recognising variants

| Question | Cell type | Combine |
|---|---|---|
| Max value | int | \`max(skip, take + v)\` |
| Can we hit sum S exactly? | bool | \`skip OR take\` |
| How many subsets hit S? | count | \`skip + take\` |
| Fewest items to hit S | int (∞ = impossible) | \`min(skip, take + 1)\` |
| Combinations (order doesn't matter) | count | items in the **outer** loop |
| Permutations (order matters) | count | sums in the **outer** loop |

## Pitfalls

- 0/1 → iterate capacity **downwards**; unbounded → **upwards**.
- For counting, \`dp[0] = 1\` (the empty choice); for min, others start at ∞.
- Many problems hide the target: partition → \`total / 2\`; target sum → \`(total + target) / 2\`; last stone weight II → closest to \`total / 2\`.
`;

const lesson: Lesson = {
  slug: 'knapsack',
  video,
  body,
  quiz: [
    { q: 'In the 1D 0/1 knapsack, capacity is iterated…', options: ['low → high', 'high → low', 'in any order', 'twice'], answer: 1, why: 'So dp[c − w] still holds the value from before this item.' },
    { q: 'Coin Change II counts combinations. Which loop is outer?', options: ['amounts', 'coins', 'either', 'neither: use recursion'], answer: 1, why: 'Coins outside means each combination is counted in one fixed order.' },
    { q: 'Partition Equal Subset Sum reduces to…', options: ['sorting', 'subset sum to total / 2', 'two pointers', 'max subarray'], answer: 1, why: 'One half must sum to exactly half the total.' },
    { q: 'Size of the 2D knapsack table for n items and capacity C?', options: ['n + C', '(n + 1) × (C + 1)', '2ⁿ', 'C²'], answer: 1, why: 'One cell per (items used, capacity).' },
  ],
};

export default lesson;
