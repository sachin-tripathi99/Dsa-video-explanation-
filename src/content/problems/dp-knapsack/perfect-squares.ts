import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { fill1D } from '../../dpviz';

const N = 12;
function tbl(n: number) { const d = Array(n + 1).fill(Infinity); d[0] = 0; for (let i = 1; i <= n; i++) for (let s = 1; s * s <= i; s++) d[i] = Math.min(d[i], d[i - s * s] + 1); return d; }
function squares(n: number) { return tbl(n)[n]; }

function video() {
  const v = new Video('perfect-squares', 'Perfect Squares');
  const d = tbl(N);
  v.chapter('intro', 'The problem');
  v.array('sq', [1, 4, 9], { label: `perfect squares ≤ ${N}` });
  v.say(`Write ${words(N)} as a sum of perfect squares, one, four, nine and so on, using as few squares as possible.`);
  v.eq(`${N} = 4 + 4 + 4 → ${squares(N)}`);
  v.say('Greedy fails: taking nine first leaves three, which needs three ones: four squares instead of three.');

  v.chapter('brute', 'Brute force: try every square as the last one', { cx: 'O(√n ^ n)', code: ['fewest(n) = 1 + min over squares s² ≤ n of fewest(n − s²)', 'fewest(0) = 0'] });
  v.eq('√n branches at every level', 'bad').say('This is Coin Change where the coins are the perfect squares. Plain recursion branches square-root-of-n ways at every level.');

  v.chapter('better', 'Better: memoise fewest(n)', { cx: 'O(n √n)', code: ['cache fewest(k) for k ≤ n'] });
  v.eq('n states × √n squares', 'warn').say('There are only n different amounts, each trying up to the square root of n squares.');

  v.chapter('optimal', 'Bottom-up unbounded knapsack', { cx: 'O(n √n) time, O(n) space', code: ['dp[0] = 0; others ∞', 'for i in 1..n:', '  for s with s² ≤ i: dp[i] = min(dp[i], dp[i − s²] + 1)', 'return dp[n]'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: N + 1 }, (_, i) => (i === 0 ? 0 : '')), { label: 'dp[i] = fewest squares summing to i' });
  v.line(0).say('Fill every amount from one up to n. Each amount tries every square that fits as its last piece.');
  const sq = (i: number) => { const r: number[] = []; for (let s = 1; s * s <= i; s++) r.push(s * s); return r; };
  fill1D(v, a, [...Array(N).keys()].map((k) => k + 1), {
    base: [0], deps: (i) => { const m = Math.min(...sq(i).map((q) => d[i - q])); return [i - sq(i).find((q) => d[i - q] === m)!]; }, val: (i) => d[i], line: [2],
    eq: (i) => `dp[${i}] = 1 + min(${sq(i).map((q) => `dp[${i - q}]`).join(', ')}) = 1 + min(${sq(i).map((q) => d[i - q]).join(', ')}) = ${d[i]}`,
    say: (i) => (i === 4 ? 'Four is itself a square: one, from dp of zero.' : i === 9 ? 'Nine is a square too.' : i === N ? `Twelve: minus one leaves eleven, which needs three; minus four leaves eight, which needs two; minus nine leaves three, which needs three. The best is two plus one: three squares.` : undefined),
    hold: 380,
  });
  a.tone(N, 'ok');
  v.line(3).eq(`dp[${N}] = ${d[N]}`, 'ok').say(`Three squares. A math fact, Lagrange’s four-square theorem, says the answer is never more than four, which is also a nice sanity check.`);
  v.answer(squares(N));

  recap(v, [{ name: 'Recursion', time: 'O(√n ^ n)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n √n)', space: 'O(n)' }, { name: 'Bottom-up', time: 'O(n √n)', space: 'O(n)' }], 'Coin Change with square coins.', ['Fewest pieces from an unlimited set → unbounded min knapsack'], 'Answer ≤ 4 always (Lagrange).');
  return v.build();
}

const problem: Problem = {
  slug: 'perfect-squares',
  statement: 'Given an integer `n`, return the least number of perfect square numbers (1, 4, 9, 16, …) that sum to `n`.',
  examples: [{ input: 'n = 12', output: '3' }, { input: 'n = 13', output: '2' }],
  constraints: ['1 ≤ n ≤ 10⁴'],
  hints: ['It is Coin Change with coins 1, 4, 9, …'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try every square as the last one.', time: 'O(√n ^ n)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache fewest(k).', time: 'O(n √n)', space: 'O(n)', bottleneck: 'Recursion depth.' },
    { id: 'optimal', kind: 'optimal', name: 'Bottom-up', idea: 'dp[i] = 1 + min dp[i − s²].', time: 'O(n √n)', space: 'O(n)' },
  ],
  takeaway: '**Coin Change** with square coins.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'numSquares', params: ['int'], ret: 'int',
    tests: [{ args: [12], out: 3 }, { args: [13], out: 2 }, { args: [1], out: 1 }, { args: [7], out: 4 }, { args: [1999], out: squares(1999), big: true }],
    gen: (r: Rng) => [r.int(1, 40)],
    ref: (n: number) => squares(n),
  },
};

export default problem;
