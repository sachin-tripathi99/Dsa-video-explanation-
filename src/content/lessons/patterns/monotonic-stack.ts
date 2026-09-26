import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';

const A = [2, 1, 5, 3, 4, 6, 1];

function video() {
  const v = new Video('monotonic-stack', 'Monotonic stack');
  v.chapter('intro', 'Who is the next taller one?');
  v.array('a', A, { label: 'for each bar: the next bar to its right that is taller', bars: true });
  v.say('People stand in a line, and each wants to know: who is the first person to my right who is taller than me? Checking everyone to the right for every person is n squared. A monotonic stack answers all of them in one pass.');

  v.chapter('run', 'Waiting list, kept in decreasing order', { code: ['stack = []   # indices still waiting for a taller bar', 'for i in 0..n−1:', '  while stack and a[stack.top] < a[i]:', '    ans[stack.pop()] = a[i]     # a[i] is their answer', '  stack.push(i)'] });
  v.clear();
  const a = v.array('a', A, { label: 'heights', bars: true });
  const ans = v.array('ans', A.map(() => null), { label: 'next greater' });
  const st = v.stack('st', [], { label: 'waiting indices (heights decrease upward)' });
  const stack: number[] = [];
  const res = A.map(() => -1);
  let told = 0;
  v.say('Walk left to right. Keep a stack of people still waiting for a taller person. The stack is always decreasing from bottom to top: if a shorter person were below a taller one, the taller one would already have answered them.');
  A.forEach((x, i) => {
    a.clearTones().tone(i, 'active');
    stack.forEach((j) => a.tone(j, 'cmp'));
    let popped = 0;
    while (stack.length && A[stack[stack.length - 1]] < x) {
      const j = stack.pop()!;
      st.pop();
      res[j] = x;
      ans.set(j, x).tone(j, 'ok');
      a.tone(j, 'ok');
      popped++;
      v.line(2, 3).eq(`${A[j]} < ${x} → answer for index ${j} is ${x}`, 'ok');
      if (told === 0) { v.say(`${words(x)} arrives. The top of the stack, ${words(A[j])}, is shorter, so ${words(x)} is the first taller bar to its right. Record it and pop.`); told++; }
      else if (told === 1 && popped > 1) { v.say(`${words(x)} keeps popping: it also answers ${words(A[j])}. One arrival can resolve many waiting bars.`); told++; }
      else v.hold(550);
    }
    stack.push(i);
    st.push(`${i}:${x}`);
    v.line(4).eq(`push index ${i} (height ${x})`).hold(450);
  });
  a.clearTones();
  stack.forEach((j) => { ans.set(j, -1).tone(j, 'dim'); a.tone(j, 'dim'); });
  v.eq('still waiting at the end → −1 · each index pushed once, popped once → O(n)', 'ok').say('Bars left on the stack never met anyone taller: their answer is minus one. Every index is pushed once and popped at most once, so the whole thing is linear, even with the inner while loop.');

  v.chapter('variants', 'Four directions');
  v.clear();
  v.table('t', ['Want', 'Scan', 'Stack order', 'Pop while'], [
    ['next greater', 'left → right', 'decreasing', 'a[top] < a[i]'],
    ['next smaller', 'left → right', 'increasing', 'a[top] > a[i]'],
    ['previous greater', 'left → right', 'decreasing', 'a[top] ≤ a[i]; answer = new top'],
    ['previous smaller', 'left → right', 'increasing', 'a[top] ≥ a[i]; answer = new top'],
  ]);
  v.say('The same loop answers four questions: next or previous, greater or smaller. Popped elements get their “next” answer from the arriving element, and the arriving element gets its “previous” answer from whatever is left on top.');

  v.chapter('uses', 'Where it shows up');
  v.clear();
  v.table('u', ['Problem', 'Idea'], [
    ['Daily temperatures', 'next greater, store the distance'],
    ['Circular arrays', 'loop twice over indices mod n'],
    ['Stock span', 'previous greater, online'],
    ['Remove k digits', 'keep an increasing stack of digits'],
    ['Largest rectangle', 'previous and next smaller bars bound each rectangle'],
    ['Sum of subarray minimums', 'how many subarrays each element is the minimum of'],
  ]);
  v.say('Whenever a question asks about the nearest bigger or smaller element, or how far an element’s influence reaches, think monotonic stack.');
  return v.build();
}

const body = String.raw`
## The idea

A **monotonic stack** keeps indices whose values are in increasing or decreasing order. When a new element breaks the order, the elements it pops have just found their **next greater (or smaller)** element. Each index is pushed and popped once: **O(n)**.

> Real-life picture: people in a queue looking to the right for someone taller. Short people who get "covered" by a taller newcomer have their answer and leave the waiting list.

## Next greater element

\`\`\`java
int[] ans = new int[n];
Arrays.fill(ans, -1);
Deque<Integer> st = new ArrayDeque<>();            // indices, values decreasing
for (int i = 0; i < n; i++) {
    while (!st.isEmpty() && a[st.peek()] < a[i]) ans[st.pop()] = a[i];
    st.push(i);
}
\`\`\`

\`\`\`python
ans = [-1] * n
st = []                                            # indices, values decreasing
for i, x in enumerate(a):
    while st and a[st[-1]] < x:
        ans[st.pop()] = x
    st.append(i)
\`\`\`

\`\`\`cpp
vector<int> ans(n, -1), st;                        // indices, values decreasing
for (int i = 0; i < n; i++) {
    while (!st.empty() && a[st.back()] < a[i]) { ans[st.back()] = a[i]; st.pop_back(); }
    st.push_back(i);
}
\`\`\`

## Choosing the variant

| Want | Stack keeps | Pop condition |
|---|---|---|
| next greater | decreasing values | \`a[top] < a[i]\` |
| next smaller | increasing values | \`a[top] > a[i]\` |
| previous greater | decreasing | pop \`a[top] <= a[i]\`, answer = new top |
| previous smaller | increasing | pop \`a[top] >= a[i]\`, answer = new top |

Store **indices** so you can compute distances and widths.

## Common extensions

- **Circular array:** iterate \`i\` from 0 to \`2n − 1\` using \`i % n\`.
- **Contribution counting:** for each element, previous-smaller and next-smaller distances tell how many subarrays it is the minimum of (use \`<\` on one side and \`<=\` on the other to avoid double counting equal values).
- **Largest rectangle in a histogram:** the bar being popped is the height; the new top and the current index bound its width.

## Pitfalls

- Strict vs non-strict comparisons change how equal values are handled.
- Remember to process the elements still on the stack at the end (their answer is "none", or the array end).
`;

const lesson: Lesson = {
  slug: 'monotonic-stack',
  video,
  body,
  quiz: [
    { q: 'For “next greater element”, the stack holds values in which order (bottom → top)?', options: ['increasing', 'decreasing', 'random', 'sorted by index only'], answer: 1, why: 'A taller arrival pops every shorter bar on top.' },
    { q: 'Why is the algorithm O(n) despite a while loop inside a for loop?', options: ['It is not', 'Each index is pushed once and popped at most once', 'The stack is small', 'Hashing'], answer: 1, why: 'Total pops ≤ total pushes = n.' },
    { q: 'How do you handle a circular array?', options: ['Sort it', 'Loop i over 0..2n−1 and use i % n', 'Use two stacks', 'Reverse it'], answer: 1, why: 'The second lap lets elements near the end see elements near the start.' },
    { q: 'What should the stack store to compute distances like “days until warmer”?', options: ['values', 'indices', 'counts', 'booleans'], answer: 1, why: 'The distance is the difference of indices.' },
  ],
};

export default lesson;
