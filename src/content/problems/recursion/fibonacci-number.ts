import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';

const N = 5;

function video() {
  const v = new Video('fibonacci-number', 'Fibonacci Number');
  v.chapter('intro', 'The problem');
  const seq = [0, 1, 1, 2, 3, 5];
  const a = v.array('fib', seq.map((x, i) => (i < 2 ? x : null)), { label: 'F(0) … F(5)' });
  a.tone([0, 1], 'ok');
  v.eq('F(0) = 0, F(1) = 1, F(n) = F(n−1) + F(n−2)');
  v.say('The Fibonacci numbers start with zero and one. Every next number is the sum of the two before it. Given n, return F of n.');
  for (let i = 2; i < seq.length; i++) {
    a.clearTones().set(i, seq[i]).tone(i, 'active').tone([i - 1, i - 2], 'cmp');
    v.eq(`F(${i}) = ${seq[i - 1]} + ${seq[i - 2]} = ${seq[i]}`);
    if (i === 2) v.say('One plus zero is one. One plus one is two. And so on.');
    else v.hold(650);
  }
  a.clearTones().tone(5, 'ok');
  v.eq('F(5) = 5', 'ok').say('So F of five is five.');

  v.chapter('brute', 'Brute force: plain recursion', { cx: 'O(2ⁿ)', code: ['fib(n):', '  if n < 2: return n', '  return fib(n-1) + fib(n-2)'] });
  v.clear();
  const t = v.tree('t', { binary: false, label: `calls made by fib(${N})` });
  const order: string[] = [];
  const val: Record<string, number> = {};
  const mk = (k: number, parent: string | null): string => {
    const id = t.add(parent, `f(${k})`);
    order.push(id);
    if (k >= 2) val[id] = val[mk(k - 1, id)] + val[mk(k - 2, id)];
    else val[id] = k;
    return id;
  };
  mk(N, null);
  const full = JSON.parse(JSON.stringify(t.p.nodes));
  const shown = new Set<string>();
  order.forEach((id, i) => {
    shown.add(id);
    const nodes: typeof t.p.nodes = {};
    for (const x of shown) nodes[x] = { v: full[x].v, kids: full[x].kids.filter((k: string) => shown.has(k)) };
    t.p.nodes = nodes;
    t.clearTones().tone(id, 'active');
    v.counter(`calls: ${i + 1}`).line(t.kids(id).length || /f\([01]\)/.test(String(t.val(id))) ? 1 : 2);
    if (i === 0) v.say('The definition translates straight into recursion: fib of n returns fib of n minus one plus fib of n minus two.');
    else if (i === 3) v.say('It dives down the left side until it hits the base cases, zero and one.');
    else v.hold(300);
  });
  t.clearTones();
  for (const id of order) t.badge(id, val[id]);
  const dups = order.filter((id) => t.val(id) === 'f(2)');
  t.tone(dups, 'warn');
  v.eq(`${order.length} calls for n = ${N}`, 'bad').note('same calls, again and again');
  v.say(`${words(order.length)} calls for n equals five. Fib of two alone is computed ${words(dups.length)} times. Each level roughly doubles the calls, so this is O of two to the n. At n equals forty that is over a billion calls.`);

  v.chapter('better', 'Better: memoisation', { cx: 'O(n)', code: ['fib(n):', '  if n < 2: return n', '  if n in memo: return memo[n]', '  memo[n] = fib(n-1) + fib(n-2)', '  return memo[n]'] });
  v.clear().layout('row');
  const t2 = v.tree('t2', { binary: false, label: 'calls with a memo' });
  const memo = v.map('memo', { label: 'memo' });
  const memoVals: Record<number, number> = {};
  let calls = 0;
  const run = (k: number, parent: string | null): number => {
    const id = t2.add(parent, `f(${k})`);
    calls++;
    t2.clearTones().tone(id, 'active');
    v.counter(`calls: ${calls}`);
    if (k < 2) {
      t2.badge(id, k).tone(id, 'done');
      v.line(1).hold(450);
      return k;
    }
    if (memoVals[k] !== undefined) {
      t2.badge(id, memoVals[k]).tone(id, 'ok');
      memo.clearTones().tone(k, 'ok');
      v.line(2).eq(`f(${k}) found in memo → ${memoVals[k]}`, 'ok');
      if (k === 3) v.say('Fib of three is already in the memo, so we return it instantly. No subtree at all.');
      else v.hold(700);
      memo.clearTones();
      return memoVals[k];
    }
    v.line(3).hold(350);
    const r = run(k - 1, id) + run(k - 2, id);
    memoVals[k] = r;
    memo.put(k, r).clearTones().tone(k, 'active');
    t2.badge(id, r).clearTones().tone(id, 'done');
    v.line(3).eq(`memo[${k}] = ${r}`);
    if (k === 2) v.say('The first time we finish fib of two, we write it down in the memo.');
    else v.hold(500);
    return r;
  };
  v.say('Better: remember every answer the first time we compute it. Keep a memo, a map from n to fib of n.');
  run(N, null);
  memo.clearTones();
  v.eq(`${calls} calls instead of ${order.length}`, 'ok').note('each n is computed once');
  v.say(`Only ${words(calls)} calls. Every value from zero to n is computed once, so time is O of n. The memo and the call stack cost O of n space.`);

  v.chapter('optimal', 'Optimal: two variables', { cx: 'O(n)', code: ['if n < 2: return n', 'prev, cur = 0, 1', 'for i in 2..n:', '  prev, cur = cur, prev + cur', 'return cur'] });
  v.clear();
  const b = v.array('b', [0, 1, null, null, null, null], { label: 'F(0) … F(5), but we only keep two' });
  const vars = v.vars('vars', { prev: 0, cur: 1 });
  b.ptrs({ prev: 0, cur: 1 });
  v.line(1).say('Look at the memo again: to compute the next number we only ever need the last two. So drop the map and keep two variables, prev and cur.');
  let p = 0;
  let c = 1;
  for (let i = 2; i <= N; i++) {
    [p, c] = [c, p + c];
    b.set(i, c);
    b.clearTones();
    for (let k = 0; k < i - 1; k++) b.tone(k, 'dim');
    b.tone(i, 'ok').ptrs({ prev: i - 1, cur: i });
    vars.set({ prev: p, cur: c, i });
    v.line(3).eq(`i=${i}: cur = ${p} + ${c - p} = ${c}`);
    if (i === 2) v.say('Each step, the new cur is prev plus cur, and prev moves up to the old cur.');
    else v.hold(700);
  }
  v.line(4).eq(`return ${c}`, 'ok').note('O(n) time · O(1) space');
  v.say('After the loop, cur is fib of five, which is five. Same O of n time, but now only constant extra space, and no recursion at all.');
  v.answer(c);

  recap(
    v,
    [
      { name: 'Plain recursion', time: 'O(2ⁿ)', space: 'O(n)' },
      { name: 'Memoised recursion', time: 'O(n)', space: 'O(n)' },
      { name: 'Two variables (bottom-up)', time: 'O(n)', space: 'O(1)' },
    ],
    'Plain recursion is exponential because it recomputes the same values. Memoisation makes it linear. And since each value depends only on the previous two, two variables are enough.',
    ['Repeated subproblems in a recursion tree → memoise', 'Only need the last k values → keep k variables', 'This recursion → memo → loop journey is how every DP problem is solved'],
    'Remember this journey: recursion, then memo, then a loop with just the state you need. It is exactly how we will solve every dynamic programming problem later.',
  );
  return v.build();
}

const problem: Problem = {
  slug: 'fibonacci-number',
  statement: 'The Fibonacci numbers are defined by `F(0) = 0`, `F(1) = 1` and `F(n) = F(n − 1) + F(n − 2)` for `n > 1`. Given `n`, return `F(n)`.',
  examples: [
    { input: 'n = 2', output: '1', why: 'F(2) = F(1) + F(0) = 1 + 0' },
    { input: 'n = 3', output: '2', why: 'F(3) = F(2) + F(1) = 1 + 1' },
    { input: 'n = 4', output: '3' },
  ],
  constraints: ['0 ≤ n ≤ 30'],
  hints: ['Write the definition directly as a recursive function. How many calls does it make for n = 5?', 'The same F(k) is computed many times. What if you stored each answer the first time?', 'To compute F(i) you only need F(i − 1) and F(i − 2). Do you need to store the rest?'],
  approaches: [
    {
      id: 'brute', kind: 'brute', name: 'Plain recursion',
      idea: 'Translate the definition directly: base cases `n < 2`, otherwise `fib(n − 1) + fib(n − 2)`.',
      time: 'O(2ⁿ)', space: 'O(n)',
      bottleneck: 'The call tree recomputes the same values over and over; it roughly doubles with every extra n.',
    },
    {
      id: 'better', kind: 'better', name: 'Memoised recursion (top-down DP)',
      idea: 'Same recursion, but store each result in a memo the first time. Every `n` is computed once.',
      time: 'O(n)', space: 'O(n)',
      bottleneck: 'Uses O(n) memory for the memo and the call stack, though we only ever read the last two values.',
    },
    {
      id: 'optimal', kind: 'optimal', name: 'Iterative with two variables (bottom-up)',
      idea: 'Walk from 2 up to n keeping only `prev` and `cur`. Each step: `prev, cur = cur, prev + cur`.',
      steps: ['If `n < 2` return `n`', '`prev = 0`, `cur = 1`', 'Repeat n − 1 times: `next = prev + cur`, `prev = cur`, `cur = next`', 'Return `cur`'],
      time: 'O(n)', space: 'O(1)',
    },
  ],
  pitfalls: ['Forgetting the base case `n == 0` (returns 0, not 1).', 'Using plain recursion for larger n: fine for n ≤ 30, far too slow beyond ~40.'],
  takeaway: 'When a recursion tree repeats subproblems, **memoise**; when each state only depends on the last few, **keep just those few variables**. This is the whole idea of dynamic programming in miniature.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'fib', params: ['int'], ret: 'int',
    tests: [
      { args: [0], out: 0 }, { args: [1], out: 1 }, { args: [2], out: 1 }, { args: [3], out: 2 }, { args: [4], out: 3 }, { args: [10], out: 55 }, { args: [20], out: 6765 }, { args: [30], out: 832040 },
    ],
    gen: (r) => [r.int(0, 25)],
    ref: (n: number) => { let a = 0, b = 1; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a; },
    genCount: 10,
  },
};

export default problem;
