import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { callTree, fill1D } from '../../dpviz';

const N = 5;
function ways(n: number) { let a = 1, b = 1; for (let i = 2; i <= n; i++) [a, b] = [b, a + b]; return b; }

function video() {
  const v = new Video('dp-introduction', 'Dynamic programming from scratch');
  const f = (n: number) => ways(n);

  v.chapter('intro', 'A counting question');
  v.array('st', Array.from({ length: N + 1 }, (_, i) => (i === 0 ? 'start' : `step ${i}`)), { label: 'a staircase' });
  v.say(`You climb a staircase of ${words(N)} steps, taking one or two steps at a time. In how many different ways can you reach the top?`);
  v.eq(`answer: ${f(N)} ways`);
  v.say('Listing every way works for five steps, but for fifty there are more than twenty billion. Dynamic programming gets the answer by solving small versions of the problem once and reusing them. It always follows the same four steps.');

  v.chapter('recursion', 'Step 1: write the recursion', { cx: 'O(2ⁿ)', code: ['ways(n):', '  if n ≤ 1: return 1', '  return ways(n − 1) + ways(n − 2)'] });
  v.clear();
  v.say('Think about the very last move. You arrived at step n either from step n minus one, with a single step, or from step n minus two, with a double step. So the ways to reach n are the ways to reach n minus one plus the ways to reach n minus two.');
  const r = callTree<number>(v, 'rt', 'calls made by ways(5)', N, {
    kids: (n) => (n <= 1 ? [] : [n - 1, n - 2]),
    key: String,
    text: (n) => `w(${n})`,
    lines: { call: [2], base: [1] },
    eq: (n, i) => (i.repeat ? `ways(${n}) again: computed from scratch` : n <= 1 ? `ways(${n}) = 1 (base case)` : `ways(${n}) = ways(${n - 1}) + ways(${n - 2})`),
    say: (n, i) => (i.calls === 1 ? 'Ways of five calls ways of four and ways of three.' : n === 3 && i.repeat ? 'Here is the problem: ways of three is being computed a second time, from scratch, with its entire subtree. Amber marks every repeated call.' : undefined),
  });
  v.eq(`${r.calls} calls for n = ${N} · grows like 2ⁿ`, 'bad').say(`${words(r.calls)} calls just for five steps, and the tree roughly doubles with every extra step. The same few subproblems are solved over and over. That repetition is the signal for dynamic programming.`);

  v.chapter('memo', 'Step 2: remember answers (memoisation)', { cx: 'O(n)', code: ['memo = {}', 'ways(n): if n in memo: return memo[n]', '  memo[n] = ways(n − 1) + ways(n − 2)', '  return memo[n]'] });
  v.clear();
  v.say('Fix it with a notebook. The first time a subproblem is solved, write the answer down; every later call just reads it.');
  const m = callTree<number>(v, 'rt', 'calls with a memo', N, {
    kids: (n) => (n <= 1 ? [] : [n - 1, n - 2]),
    key: String,
    text: (n) => `w(${n})`,
    memo: true,
    lines: { call: [2], base: [1], cached: [1] },
    eq: (n, i) => (i.cached ? `ways(${n}) → from memo` : n <= 1 ? `ways(${n}) = 1` : `ways(${n}) = ways(${n - 1}) + ways(${n - 2})`),
    say: (n, i) => (i.cached && n === 2 ? 'Ways of two was already solved while computing ways of three, so this call returns immediately. Green means answered from the memo.' : undefined),
  });
  v.eq(`${m.calls} calls instead of ${r.calls} · O(n)`, 'ok').say(`Now there are only ${words(m.calls)} calls: each subproblem is solved once, so the work is linear. This top-down version is usually the easiest to write in an interview: recursion plus a cache.`);

  v.chapter('table', 'Step 3: fill a table bottom-up (tabulation)', { cx: 'O(n) time, O(n) space', code: ['dp[0] = dp[1] = 1', 'for i in 2..n:', '  dp[i] = dp[i − 1] + dp[i − 2]', 'return dp[n]'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: N + 1 }, (_, i) => (i <= 1 ? 1 : '')), { label: 'dp[i] = ways to reach step i' });
  v.line(0).say('The recursion only ever needs smaller subproblems, so we can skip it and solve them in increasing order. A table dp, where dp of i is the number of ways to reach step i. The base cases, steps zero and one, have one way each.');
  fill1D(v, a, [2, 3, 4, 5], {
    base: [0, 1],
    deps: (i) => [i - 1, i - 2],
    val: (i) => f(i),
    line: [2],
    eq: (i) => `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${f(i - 1)} + ${f(i - 2)} = ${f(i)}`,
    say: (i) => (i === 2 ? 'Dp of two reads the two cells before it: one plus one, two ways.' : i === 3 ? 'Each cell is the sum of the two before it. No recursion, no cache lookups, just a loop.' : undefined),
  });
  a.tone(N, 'ok');
  v.line(3).eq(`dp[${N}] = ${f(N)}`, 'ok').say(`The last cell is the answer, ${words(f(N))}. Same linear time, and no deep recursion that could overflow the stack.`);

  v.chapter('space', 'Step 4: keep only what you need', { cx: 'O(n) time, O(1) space', code: ['prev2, prev1 = 1, 1', 'for i in 2..n:', '  prev2, prev1 = prev1, prev1 + prev2', 'return prev1'] });
  v.clear();
  const vs = v.vars('vars', { i: 1, prev2: 1, prev1: 1 });
  v.line(0).say('Each cell only looks two cells back, so the whole table is not needed. Two variables are enough: the last two answers.');
  for (let i = 2; i <= N; i++) {
    vs.set({ i, prev2: f(i - 1), prev1: f(i) });
    v.line(2).eq(`i = ${i}: prev2, prev1 = ${f(i - 1)}, ${f(i)}`);
    if (i === 2) v.say('Each step slides the window forward: the old prev1 becomes prev2, and the new value is their sum.'); else v.hold(700);
  }
  v.line(3).eq(`answer ${f(N)} · O(1) extra space`, 'ok').say('The final answer with constant memory. Not every problem allows this, but whenever a cell only depends on a fixed number of previous rows or cells, you can roll them.');

  v.chapter('recipe', 'The recipe for every DP problem');
  v.clear();
  v.table('rc', ['Step', 'Question to ask', 'Stairs'], [
    ['state', 'what does one subproblem mean?', 'dp[i] = ways to reach step i'],
    ['transition', 'how does it use smaller ones?', 'dp[i] = dp[i−1] + dp[i−2]'],
    ['base cases', 'what is known directly?', 'dp[0] = dp[1] = 1'],
    ['order', 'which cells must come first?', 'i increasing'],
    ['answer', 'which cell is the result?', 'dp[n]'],
  ]);
  v.say('Every DP problem is these five decisions. Define the state in words, write the transition by thinking about the last choice, set the base cases, fill in an order where dependencies come first, and read the answer.');
  v.say('Spot DP when a problem asks for a count of ways, a minimum or a maximum, involves choices at each step, and a natural recursion keeps revisiting the same arguments.');
  return v.build();
}

const body = String.raw`
## The idea

**Dynamic programming** = recursion + remembering answers to subproblems. It applies when the problem breaks into **overlapping subproblems** (the same smaller question comes up many times) with **optimal substructure** (the answer is built from answers to smaller questions).

> Real-life picture: working out 1 + 1 + 1 + 1 + 1 = 5, then being asked for one more "+ 1". You don't recount; you remember 5.

## The four steps

1. **Recursion**: define the function in words, and write it by thinking about the **last choice**.
2. **Memoisation** (top-down): cache every result. Each state is solved once.
3. **Tabulation** (bottom-up): fill a table in an order where dependencies come first.
4. **Space optimisation**: keep only the rows or cells the transition still reads.

## Climbing stairs, all four ways

\`\`\`java
// 1. recursion: O(2^n)
int ways(int n) { return n <= 1 ? 1 : ways(n - 1) + ways(n - 2); }

// 2. memoisation: O(n)
int ways(int n, int[] memo) {
    if (n <= 1) return 1;
    if (memo[n] != 0) return memo[n];
    return memo[n] = ways(n - 1, memo) + ways(n - 2, memo);
}

// 3 + 4. tabulation with two variables: O(n) time, O(1) space
int climb(int n) {
    int prev2 = 1, prev1 = 1;
    for (int i = 2; i <= n; i++) { int cur = prev1 + prev2; prev2 = prev1; prev1 = cur; }
    return prev1;
}
\`\`\`

\`\`\`python
from functools import cache

@cache                                   # 2. memoisation in one line
def ways(n):
    return 1 if n <= 1 else ways(n - 1) + ways(n - 2)

def climb(n):                            # 3 + 4. bottom-up, O(1) space
    prev2 = prev1 = 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1
\`\`\`

\`\`\`cpp
int ways(int n, vector<int>& memo) {     // 2. memoisation
    if (n <= 1) return 1;
    if (memo[n]) return memo[n];
    return memo[n] = ways(n - 1, memo) + ways(n - 2, memo);
}
int climb(int n) {                       // 3 + 4. bottom-up, O(1) space
    int prev2 = 1, prev1 = 1;
    for (int i = 2; i <= n; i++) { int cur = prev1 + prev2; prev2 = prev1; prev1 = cur; }
    return prev1;
}
\`\`\`

## Designing the state

| Decision | Ask yourself |
|---|---|
| State | What is the smallest description of "where I am"? (index, remaining capacity, …) |
| Transition | What was the **last** choice? Combine the subproblems it leads to. |
| Base cases | Which states have an obvious answer? |
| Order | Which states must be computed before others? |
| Answer | Which state is the full problem? |

## Two kinds of transitions

- **Counting**: add up the ways from each choice (\`+\`).
- **Optimising**: take the best choice (\`min\` / \`max\`).

## Pitfalls

- A wrong state definition makes the transition impossible: write it in a sentence first.
- Memoisation on deep inputs can overflow the call stack; switch to tabulation.
- Initialise "impossible" states with ∞ (for min) or −∞ (for max), not 0.
`;

const lesson: Lesson = {
  slug: 'dp-introduction',
  video,
  body,
  quiz: [
    { q: 'What makes a recursion a good candidate for DP?', options: ['it has no base case', 'the same subproblems are solved repeatedly', 'it uses a loop', 'it returns a string'], answer: 1, why: 'Overlapping subproblems can be cached.' },
    { q: 'Climbing stairs with memoisation runs in…', options: ['O(2ⁿ)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 1, why: 'Each of the n states is computed once.' },
    { q: 'A cell only reads the previous two cells. The table can shrink to…', options: ['O(n) still', 'two variables', 'nothing at all', 'a hash map'], answer: 1, why: 'Keep only what the transition reads.' },
    { q: 'For a “minimum cost” DP, impossible states should start at…', options: ['0', '−1', '∞', 'any value'], answer: 2, why: 'So that min() never picks them.' },
  ],
};

export default lesson;
