import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree, fill1D } from '../../dpviz';

const N = 7;
function trib(n: number) { const t = [0, 1, 1]; for (let i = 3; i <= n; i++) t.push(t[i - 1] + t[i - 2] + t[i - 3]); return t[n]; }

function video() {
  const v = new Video('n-th-tribonacci-number', 'N-th Tribonacci Number');
  v.chapter('intro', 'The problem');
  v.say('Tribonacci numbers start zero, one, one, and each next one is the sum of the previous three. Return the n-th.');
  v.eq(`T(${N}) = ${trib(N)}`);

  v.chapter('brute', 'Brute force: recursion with three branches', { cx: 'O(3ⁿ)', code: ['T(n): if n == 0: return 0; if n ≤ 2: return 1', 'return T(n − 1) + T(n − 2) + T(n − 3)'] });
  v.clear();
  const r = callTree<number>(v, 'rt', 'calls for T(4)', 4, {
    kids: (n) => (n <= 2 ? [] : [n - 1, n - 2, n - 3]), key: String, text: (n) => `T(${n})`,
    lines: { call: [1], base: [0] },
    say: (n, i) => (i.calls === 1 ? 'Each call branches three ways.' : i.repeat && n === 2 ? 'Small values repeat everywhere.' : undefined),
  });
  v.eq(`${r.calls} calls for T(4) · ~3ⁿ`, 'bad').say('Three branches per call makes it grow even faster than Fibonacci.');

  v.chapter('better', 'Better: memoise', { cx: 'O(n)', code: ['cache T(k) the first time it is computed'] });
  v.eq('each T(k) computed once', 'warn').say('Caching makes every value computed once: linear time, linear memory.');

  v.chapter('optimal', 'Optimal: roll three variables', { cx: 'O(n) time, O(1) space', code: ['a, b, c = 0, 1, 1', 'repeat n − 2 times: a, b, c = b, c, a + b + c', 'return c (or n itself for n < 3)'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: N + 1 }, (_, i) => (i <= 2 ? trib(i) : '')), { label: 'T(i)' });
  v.line(0).say('Build up from the three known values. Each new value reads only the last three, so three variables are enough.');
  fill1D(v, a, [...Array(N - 2).keys()].map((k) => k + 3), {
    base: [0, 1, 2], deps: (i) => [i - 1, i - 2, i - 3], val: trib, line: [1],
    eq: (i) => `T(${i}) = ${trib(i - 1)} + ${trib(i - 2)} + ${trib(i - 3)} = ${trib(i)}`,
    say: (i) => (i === 3 ? 'T of three is one plus one plus zero: two.' : undefined),
  });
  a.tone(N, 'ok');
  v.line(2).eq(`T(${N}) = ${trib(N)}`, 'ok').say(`T of ${words(N)} is ${words(trib(N))}.`);
  v.answer(trib(N));

  recap(v, [{ name: 'Recursion', time: 'O(3ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n)', space: 'O(n)' }, { name: 'Three variables', time: 'O(n)', space: 'O(1)' }], 'Keep a window of the last three values.', ['Fixed-width recurrence → rolling variables'], 'The window size equals how far back the recurrence reads.');
  return v.build();
}

const problem: Problem = {
  slug: 'n-th-tribonacci-number',
  statement: 'The Tribonacci sequence is T0 = 0, T1 = 1, T2 = 1, and Tn+3 = Tn + Tn+1 + Tn+2. Given `n`, return Tn.',
  examples: [{ input: 'n = 4', output: '4' }, { input: 'n = 25', output: '1389537' }],
  constraints: ['0 ≤ n ≤ 37'],
  hints: ['Keep the last three values.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Direct recurrence.', time: 'O(3ⁿ)', space: 'O(n)', bottleneck: 'Exponential repeats.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache each T(k).', time: 'O(n)', space: 'O(n)', bottleneck: 'Memo storage.' },
    { id: 'optimal', kind: 'optimal', name: 'Rolling variables', idea: 'Slide a window of three values.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Window of the **last three**.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'tribonacci', params: ['int'], ret: 'int',
    tests: [{ args: [0], out: 0 }, { args: [1], out: 1 }, { args: [2], out: 1 }, { args: [4], out: 4 }, { args: [25], out: 1389537, big: true }, { args: [37], out: trib(37), big: true }],
    gen: (r: Rng) => [r.int(0, 18)],
    ref: (n: number) => trib(n),
  },
};

export default problem;
