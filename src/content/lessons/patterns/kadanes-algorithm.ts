import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const A = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
const say = (x: number) => (x < 0 ? `minus ${words(-x)}` : words(x));

function video() {
  const v = new Video('kadanes-algorithm', "Kadane's algorithm");
  v.chapter('intro', 'The best contiguous stretch');
  v.array('a', A, { label: 'find the contiguous subarray with the largest sum' });
  v.say('Find the contiguous subarray with the largest sum. Think of daily profit and loss: which stretch of consecutive days made the most money?');
  v.eq('n² / 2 subarrays if we try them all', 'warn').say('There are about n squared over two subarrays. Kadane’s algorithm finds the best one in a single pass, and it is our first taste of dynamic programming.');

  v.chapter('idea', 'Best subarray ending here', { code: ['cur = best sum of a subarray that ENDS at i', 'cur = max(a[i], cur + a[i])   # start fresh or extend', 'best = max(best, cur)'] });
  v.clear();
  const a = v.array('a', A, { label: 'a' });
  const cv = v.array('cur', A.map(() => null), { label: 'cur: best sum ending exactly here' });
  v.say('Ask a smaller question at each index: what is the best sum of a subarray that ends exactly here? Such a subarray either is just a of i by itself, or it extends the best subarray ending at the previous index. So cur is the larger of a of i, and cur plus a of i.');
  let cur = 0;
  let best = -Infinity;
  let bl = 0;
  let br = 0;
  let start = 0;
  const num = (x: number) => (x < 0 ? `(${x})` : String(x));
  A.forEach((x, i) => {
    const prev = cur;
    const extend = i > 0 && prev + x > x;
    if (!extend) start = i;
    cur = extend ? prev + x : x;
    const nb = cur > best;
    if (nb) { best = cur; bl = start; br = i; }
    cv.set(i, cur).clearTones().tone(i, extend ? 'ok' : 'warn');
    a.clearTones().win(start, i, 'win', `cur ${cur}`);
    const why = i === 0 ? `cur = a[0] = ${x}` : extend ? `extend: ${prev} + ${num(x)} = ${cur} > ${x}` : `start fresh: ${x} ≥ ${prev} + ${num(x)}`;
    v.line(1, 2).counter(`best: ${best}`).eq(why, nb ? 'ok' : undefined);
    if (i === 1) v.say(`At index one, the previous best ending was ${say(prev)}. Carrying a negative sum only hurts, so start fresh: cur is ${say(cur)}.`);
    else if (i === 3) v.say(`At ${say(x)}, the previous cur is ${say(prev)}, negative again. Start fresh at ${say(x)}.`);
    else if (i === 4) v.say(`At ${say(x)}, extending gives ${say(prev)} ${x < 0 ? 'minus' : 'plus'} ${words(Math.abs(x))}, ${say(cur)}, better than ${say(x)} alone. Extend.`);
    else if (i === 6) v.say(`At index six, extending reaches ${say(cur)}, the best so far: ${A.slice(start, i + 1).map(say).join(', ')}.`);
    else v.hold(600);
  });
  a.noWin().clearTones().win(bl, br, 'ok', `sum ${best}`);
  cv.clearTones();
  v.eq(`best = ${best} (indices ${bl}–${br}) · one pass, O(1) memory`, 'ok').say(`The answer is ${say(best)}. The rule is simple: if the running sum has become negative, drop it and start again, because a negative prefix can only drag down whatever comes next.`);

  v.chapter('dp', 'Why this is dynamic programming');
  v.clear();
  v.text('d', { title: 'The DP view', lines: ['State: dp[i] = best sum of a subarray ending at i', 'Transition: dp[i] = max(a[i], dp[i−1] + a[i])', 'Answer: max over all dp[i]', 'Only dp[i−1] is needed → keep one variable'], shown: 4 });
  v.say('This is dynamic programming in miniature. Define the state as the best answer ending at i. Write how it depends on the previous state. And since each state needs only the one before it, we keep a single variable instead of an array. You will see this state, transition and space-saving pattern again and again.');

  v.chapter('variants', 'Variants');
  v.clear();
  v.table('t', ['Problem', 'Twist'], [
    ['Maximum product subarray', 'a negative flips min and max: track both'],
    ['Maximum absolute sum', 'run Kadane for the max and for the min'],
    ['Circular array', 'wrap-around answer = total − minimum subarray'],
    ['Best time to buy and sell stock', 'best profit ending today = price − min so far'],
  ]);
  v.say('The same “best ending here” idea adapts. For products, a negative number turns the smallest product into the largest, so track both. For circular arrays, the best wrapping subarray is everything except the worst middle part.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: "Kadane's algorithm", lines: ['cur = max(a[i], cur + a[i]); best = max(best, cur)', 'Initialise with a[0] so all-negative arrays work', 'O(n) time, O(1) space', 'Pattern: “best ending here” → DP with one variable'], shown: 4 });
  v.say('Extend or restart, track the best, and initialise with the first element so an all-negative array still returns its largest element.');
  return v.build();
}

const body = String.raw`
## The idea

Let \`cur\` be the best sum of a subarray **ending exactly at i**. Such a subarray is either \`a[i]\` alone or the best subarray ending at \`i − 1\` extended by \`a[i]\`:

$$cur_i = \max(a_i,\ cur_{i-1} + a_i)$$

The answer is the maximum \`cur\` seen.

> Real-life picture: a streak of daily profits. If your running total has gone negative, it is better to forget it and start a new streak today.

\`\`\`java
int cur = a[0], best = a[0];
for (int i = 1; i < a.length; i++) {
    cur = Math.max(a[i], cur + a[i]);   // start fresh or extend
    best = Math.max(best, cur);
}
\`\`\`

\`\`\`python
cur = best = a[0]
for x in a[1:]:
    cur = max(x, cur + x)                # start fresh or extend
    best = max(best, cur)
\`\`\`

\`\`\`cpp
int cur = a[0], best = a[0];
for (size_t i = 1; i < a.size(); i++) {
    cur = max(a[i], cur + a[i]);        // start fresh or extend
    best = max(best, cur);
}
\`\`\`

## Why it is DP

| DP ingredient | Kadane |
|---|---|
| State | \`dp[i]\` = best sum ending at \`i\` |
| Transition | \`dp[i] = max(a[i], dp[i−1] + a[i])\` |
| Answer | \`max(dp)\` |
| Space trick | only \`dp[i−1]\` is needed → one variable |

## Variants

| Problem | Change |
|---|---|
| Maximum product subarray | track \`maxEnd\` and \`minEnd\`; a negative swaps them |
| Maximum absolute sum | \`max(maxSubarray, −minSubarray)\` |
| Maximum circular subarray | \`max(maxSubarray, total − minSubarray)\`, unless all numbers are negative |
| Return the subarray itself | remember where the current run started |

## Pitfalls

- Initialising \`best = 0\` breaks all-negative inputs; start from \`a[0]\`.
- Circular variant: if every number is negative, \`total − minSubarray\` is 0 (the empty array), which is not allowed.
`;

const lesson: Lesson = {
  slug: 'kadanes-algorithm',
  video,
  body,
  quiz: [
    { q: 'cur = −3 and the next value is 5. New cur?', options: ['2', '5', '−3', '8'], answer: 1, why: 'max(5, −3 + 5) = 5: start fresh.' },
    { q: 'Why initialise best with a[0] instead of 0?', options: ['Speed', 'All-negative arrays must return their largest element, not 0', 'It does not matter', 'To avoid overflow'], answer: 1, why: 'The subarray must be non-empty.' },
    { q: 'In maximum product subarray, why track the minimum product too?', options: ['For the answer', 'Multiplying by a negative turns the smallest product into the largest', 'To handle zeros only', 'It is not needed'], answer: 1, why: 'Signs flip under negative multiplication.' },
    { q: 'Kadane’s time and extra space?', options: ['O(n²), O(1)', 'O(n), O(n)', 'O(n), O(1)', 'O(n log n), O(1)'], answer: 2, why: 'One pass, two variables.' },
  ],
};

export default lesson;
