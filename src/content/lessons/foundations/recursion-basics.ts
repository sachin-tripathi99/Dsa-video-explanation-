import type { Lesson } from '../../types';
import { Video, bullets } from '../../helpers';

function video() {
  const v = new Video('recursion-basics', 'Recursion and the call stack');
  v.chapter('intro', 'What is recursion?');
  v.text('t', { title: 'A function that calls itself', subtitle: 'on a smaller version of the same problem', big: true });
  v.say('Recursion is when a function solves a problem by calling itself on a smaller version of the same problem. Think of Russian dolls: to count them, open one, and count the dolls inside it the same way.');
  v.clear();
  bullets(v, 'parts', 'Every recursive function has two parts', ['**Base case**: a problem so small you answer it directly', '**Recursive case**: shrink the problem, call yourself, combine the result'], [
    'Every recursive function has a base case: an input so small the answer is obvious, like an empty doll, or zero factorial equals one.',
    'And a recursive case: make the problem smaller, call yourself, and use the answer. Forget the base case and the function never stops.',
  ]);

  v.chapter('stack', 'The call stack', { code: ['fact(n):', '  if n <= 1: return 1', '  return n * fact(n - 1)'] });
  v.clear().layout('row');
  const st = v.stack('calls', [], { label: 'call stack', ends: ['running', ''] });
  const info = v.vars('v', { depth: 0 }, { label: 'state' });
  v.say("Let's watch factorial of four run. Factorial of n is n times factorial of n minus one.");
  for (let k = 4; k >= 1; k--) {
    st.push(`fact(${k}) waits`);
    st.clearTones().toneTop('active');
    info.set({ depth: 5 - k, n: k });
    v.line(k === 1 ? 1 : 2).counter(`frames: ${5 - k}`);
    if (k === 4) v.say('Calling fact of four pushes a frame onto the call stack. It needs fact of three before it can finish, so it waits.');
    else if (k === 3) v.say('Fact of three waits for fact of two. Each waiting call keeps its own n.');
    else if (k === 1) {
      st.set(st.size - 1, 'fact(1) = 1');
      st.toneTop('ok');
      v.eq('base case: fact(1) = 1', 'ok').say('Fact of one is the base case. It returns one straight away, without another call.');
    } else v.hold(700);
  }
  let res = 1;
  for (let k = 2; k <= 4; k++) {
    st.pop();
    res *= k;
    st.set(st.size - 1, `fact(${k}) = ${k}×${res / k} = ${res}`);
    st.clearTones().toneTop('ok');
    info.set({ depth: st.size, n: k, result: res });
    v.line(2).eq(`fact(${k}) = ${k} × ${res / k} = ${res}`, 'ok');
    if (k === 2) v.say('Now the stack unwinds. Fact of two gets its answer and returns two times one, which is two.');
    else if (k === 4) v.say('And fact of four returns four times six: twenty-four. The deepest call finishes first. That is the call stack: last in, first out.');
    else v.hold(900);
  }

  v.chapter('faith', 'The leap of faith');
  v.clear();
  bullets(v, 'lf', "Don't trace every call in your head", ['1. Define what the function returns, in words', '2. Handle the base case', '3. **Assume** the call on the smaller input already works', '4. Use that answer to finish the current level'], [
    'When writing recursion, do not try to trace every call in your head. Instead, first say in words what the function returns.',
    'Handle the smallest input directly.',
    'Then take a leap of faith: assume the call on the smaller input already returns the right answer.',
    'Your only job is to turn that answer into the answer for the current input. If each level is right, the whole thing is right. That is just proof by induction.',
  ]);
  v.clear();
  const arr = [3, 1, 4, 1, 5];
  const a = v.array('a', arr, { label: 'sum(a, i) = a[i] + sum(a, i + 1)' });
  a.toneRange(1, 4, 'win').tone(0, 'active').win(1, 4, 'win', 'trust: = 11');
  v.eq('sum(a, 0) = 3 + sum(a, 1) = 3 + 11 = 14', 'ok');
  v.say('Example: to sum an array from index i, add a of i to the sum of the rest. Trust that the sum of the rest is eleven, and you are done: fourteen.');

  v.chapter('tree', 'Recursion trees', { code: ['fib(n):', '  if n < 2: return n', '  return fib(n-1) + fib(n-2)'] });
  v.clear();
  const t = v.tree('t', { binary: false, label: 'fib(4): each call shows its return value' });
  const ret: Record<string, number> = {};
  const order: string[] = [];
  const mk = (k: number, parent: string | null): string => {
    const id = t.add(parent, `f(${k})`);
    order.push(id);
    if (k >= 2) {
      const l = mk(k - 1, id);
      const r = mk(k - 2, id);
      ret[id] = ret[l] + ret[r];
    } else ret[id] = k;
    return id;
  };
  mk(4, null);
  const full = JSON.parse(JSON.stringify(t.p.nodes));
  // Reveal calls in the order they happen (pre-order), then fill return values post-order.
  const shown = new Set<string>();
  const post: string[] = [];
  const walkPost = (id: string) => {
    for (const k of full[id].kids) walkPost(k);
    post.push(id);
  };
  walkPost(order[0]);
  const render = () => {
    const nodes: typeof t.p.nodes = {};
    for (const id of shown) nodes[id] = { v: full[id].v, kids: full[id].kids.filter((k: string) => shown.has(k)) };
    t.p.nodes = nodes;
  };
  let firstShown = false;
  for (const id of order) {
    shown.add(id);
    render();
    t.clearTones().tone(id, 'active');
    v.counter(`calls: ${shown.size}`).line(t.val(id) === 'f(1)' || t.val(id) === 'f(0)' ? 1 : 2);
    if (!firstShown) {
      v.say('Fibonacci makes two calls each time, so the calls form a tree. Watch the order: it goes deep first.');
      firstShown = true;
    } else v.hold(450);
  }
  t.clearTones();
  for (const id of post) {
    t.badge(id, `=${ret[id]}`);
  }
  const dup = order.filter((id) => t.val(id) === 'f(2)');
  t.tone(dup, 'warn');
  v.eq(`fib(4) = ${ret[order[0]]} · ${order.length} calls · fib(2) computed ${dup.length} times`, 'warn');
  v.say(`Answers flow back up the tree. Fib of four is three. But look: fib of two is computed ${dup.length === 2 ? 'twice' : `${dup.length} times`}. For bigger n this repetition explodes to about two to the n calls. Remembering answers, called memoisation, fixes it. You will do exactly that in the first homework problem.`);

  v.chapter('bugs', 'Common bugs');
  v.clear();
  v.table('b', ['Bug', 'Symptom', 'Fix'], [
    ['No base case, or it is never reached', 'Stack overflow', 'Make sure every path shrinks toward the base case'],
    ['Input does not shrink', 'Infinite recursion', 'Call on n − 1, n / 2, or a smaller slice'],
    ['Forgot to return the recursive result', 'Wrong answer / null', '`return f(n - 1)`, not just `f(n - 1)`'],
    ['Recomputing the same calls', 'Too slow (exponential)', 'Memoise: store answers in a map or array'],
  ]);
  v.say('Four bugs cause almost every recursion problem: a missing base case, an input that never shrinks, forgetting to return the result, and recomputing the same calls. Keep this table in mind.');

  v.chapter('recap', 'Recap');
  v.clear();
  v.text('r', { title: 'Recursion in one breath', lines: ['Base case + recursive case on a smaller input', 'Calls stack up, then unwind in reverse order', 'Trust the smaller call; only solve the current level', 'Time = number of calls × work per call; space = max depth', 'Repeated calls? Memoise.'] });
  v.say('Base case, smaller call, trust it, combine. Recursion is the foundation for trees, backtracking, divide and conquer, and dynamic programming, so we will use it constantly.');
  return v.build();
}

const body = String.raw`
## The idea

A recursive function solves a problem by calling **itself on a smaller input**, then using that answer.

> Real-life picture: you're in a long queue and want to know your position. You ask the person in front of you. They ask the person in front of them, and so on, until the first person says "I'm number 1" (the base case). Each person then adds one and passes the answer back.

Every recursive function has:

1. **A base case** that answers the smallest inputs directly.
2. **A recursive case** that shrinks the input, calls itself, and combines the result.

## How to write one: the leap of faith

1. Say in words what \`f(input)\` returns.
2. Write the base case.
3. **Assume \`f(smaller input)\` already works.** Don't trace it.
4. Build the answer for the current input from it.

\`\`\`java
// n! = n × (n-1)!
long factorial(int n) {
    if (n <= 1) return 1;            // base case
    return n * factorial(n - 1);     // trust factorial(n - 1)
}

// Sum of a[i..end]
int sum(int[] a, int i) {
    if (i == a.length) return 0;     // empty suffix
    return a[i] + sum(a, i + 1);
}
\`\`\`

\`\`\`python
def factorial(n):
    if n <= 1:                       # base case
        return 1
    return n * factorial(n - 1)      # trust factorial(n - 1)

def total(a, i=0):
    if i == len(a):                  # empty suffix
        return 0
    return a[i] + total(a, i + 1)
\`\`\`

\`\`\`cpp
long long factorial(int n) {
    if (n <= 1) return 1;            // base case
    return n * factorial(n - 1);     // trust factorial(n - 1)
}

int sum(vector<int>& a, int i) {
    if (i == (int)a.size()) return 0; // empty suffix
    return a[i] + sum(a, i + 1);
}
\`\`\`

## The call stack

Each call gets a **frame** on the call stack holding its parameters and local variables. A call can't finish until the calls it made finish, so frames pile up and then unwind in reverse (last in, first out). That's why:

- **Space** of a recursive function = **maximum depth** of the recursion.
- Very deep recursion overflows the stack. Python stops at ~1000 levels by default (\`sys.setrecursionlimit\` raises it); Java and C++ usually handle ~10⁴–10⁵ frames.

## Recursion trees and memoisation

When a function makes more than one recursive call, the calls form a **tree**. Time = number of nodes × work per node.

\`fib(n) = fib(n-1) + fib(n-2)\` makes about 2ⁿ calls, because the same subproblems repeat. Store each answer the first time you compute it (**memoisation**) and every subproblem is solved once: O(n).

\`\`\`java
Map<Integer, Integer> memo = new HashMap<>();
int fib(int n) {
    if (n < 2) return n;
    if (memo.containsKey(n)) return memo.get(n);
    int r = fib(n - 1) + fib(n - 2);
    memo.put(n, r);
    return r;
}
\`\`\`

\`\`\`python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
\`\`\`

\`\`\`cpp
unordered_map<int, int> memo;
int fib(int n) {
    if (n < 2) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}
\`\`\`

This is the first step towards [dynamic programming](#/learn/dp-1d).

## Recursion vs iteration

Anything recursive can be written with a loop and an explicit stack. Use recursion when the problem is naturally recursive (trees, nested structures, backtracking, divide and conquer). Use a loop when the recursion is a simple chain, to save stack space.

## Common bugs

| Bug | Fix |
|---|---|
| Missing or unreachable base case → stack overflow | Check every path shrinks toward the base case |
| Input doesn't shrink | Call on n − 1, n / 2, a shorter slice… |
| Forgetting \`return\` on the recursive call | \`return f(n - 1)\` |
| Exponential time from repeated calls | Memoise |
| Copying arrays or strings at every level | Pass indices instead of slices |
`;

const lesson: Lesson = {
  slug: 'recursion-basics',
  video,
  body,
  quiz: [
    { q: 'What happens if a recursive function has no reachable base case?', options: ['It returns 0', 'It recurses until the call stack overflows', 'The compiler adds one', 'It becomes iterative'], answer: 1, why: 'Every call adds a frame; without a base case they never stop.' },
    { q: 'fact(4) calls fact(3), fact(2), fact(1). Which call **returns first**?', options: ['fact(4)', 'fact(3)', 'fact(1)', 'They return together'], answer: 2, why: 'The call stack is last-in, first-out: the deepest call finishes first.' },
    { q: 'Space complexity of a recursion that goes n levels deep (O(1) work per call)?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(2ⁿ)'], answer: 2, why: 'At the deepest point n frames are on the stack.' },
    { q: 'Why is naive recursive Fibonacci slow?', options: ['Recursion is always slow', 'It recomputes the same subproblems many times', 'It uses floating point', 'It has no base case'], answer: 1, why: 'The call tree has about 2ⁿ nodes with lots of repeats. Memoisation fixes it.' },
    { q: 'The "leap of faith" means…', options: ['Skip the base case', 'Assume the recursive call on a smaller input is correct and use it', 'Guess the answer', 'Always use memoisation'], answer: 1, why: 'Focus on one level; induction guarantees the rest.' },
  ],
};

export default lesson;
