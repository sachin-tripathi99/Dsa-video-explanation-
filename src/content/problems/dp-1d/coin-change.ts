import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree, fill1D } from '../../dpviz';

const COINS = [1, 2, 5], AMT = 11;
function tbl(coins: number[], amt: number) { const d = Array(amt + 1).fill(Infinity); d[0] = 0; for (let a = 1; a <= amt; a++) for (const c of coins) if (c <= a && d[a - c] + 1 < d[a]) d[a] = d[a - c] + 1; return d; }
function change(coins: number[], amt: number) { const d = tbl(coins, amt)[amt]; return d === Infinity ? -1 : d; }

function video() {
  const v = new Video('coin-change', 'Coin Change');
  const d = tbl(COINS, AMT);
  const f = (x: number) => (x === Infinity ? '∞' : String(x));
  v.chapter('intro', 'The problem');
  v.array('c', COINS, { label: 'coin values (unlimited supply)' });
  v.say(`Make exactly ${words(AMT)} using as few coins as possible, from coins worth ${COINS.join(', ')}. If it cannot be done, return minus one.`);
  v.eq(`${AMT} = 5 + 5 + 1 → ${change(COINS, AMT)} coins`);
  v.say('Greedy, always taking the biggest coin, happens to work here but fails in general: with coins one, three and four, making six greedily takes four, then one, then one: three coins, while three plus three needs only two.');

  v.chapter('brute', 'Brute force: try every coin as the last one', { cx: 'O(kᵃ)', code: ['fewest(a):', '  if a == 0: return 0; if a < 0: impossible', '  return 1 + min over coins c of fewest(a − c)'] });
  v.clear();
  const r = callTree<number>(v, 'rt', 'calls for fewest(4) with coins 1, 2', 4, {
    kids: (a) => (a <= 0 ? [] : [a - 1, a - 2].filter((x) => x >= 0)), key: String, text: (a) => `f(${a})`,
    lines: { call: [2], base: [1] },
    say: (a, i) => (i.calls === 1 ? 'Think about the last coin used. If it was c, the rest must make a minus c as cheaply as possible. So try every coin and take the best.' : i.repeat && a === 2 ? 'The same amounts come up again and again.' : undefined),
  });
  v.eq(`${r.calls} calls even for amount 4 · exponential in the amount`, 'bad').say('With k coin types the tree branches k ways at every level, so it grows exponentially with the amount.');

  v.chapter('better', 'Better: memoise fewest(a)', { cx: 'O(amount · k)', code: ['cache fewest(a) for each amount 0..A'] });
  v.eq('A + 1 states × k coins each', 'warn').say('There are only amount plus one different subproblems, each trying k coins. Memoising makes it amount times k, though deep recursion can overflow for large amounts.');

  v.chapter('optimal', 'Optimal: fill dp[0..amount] from small to large', { cx: 'O(amount · k) time, O(amount) space', code: ['dp[0] = 0; dp[a] = ∞ for a > 0', 'for a in 1..amount:', '  for c in coins: if c ≤ a: dp[a] = min(dp[a], dp[a − c] + 1)', 'return dp[amount] if finite else −1'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: AMT + 1 }, (_, i) => (i === 0 ? 0 : '∞')), { label: 'dp[a] = fewest coins to make a' });
  v.line(0).say('Build every amount from zero up. Zero needs zero coins; every other amount starts at infinity, meaning not yet possible.');
  fill1D(v, a, [...Array(AMT).keys()].map((k) => k + 1), {
    base: [0], deps: (x) => COINS.filter((c) => c <= x).map((c) => x - c), val: (x) => f(d[x]), line: [2],
    eq: (x) => `dp[${x}] = 1 + min(${COINS.filter((c) => c <= x).map((c) => `dp[${x - c}]`).join(', ')}) = 1 + min(${COINS.filter((c) => c <= x).map((c) => f(d[x - c])).join(', ')}) = ${f(d[x])}`,
    say: (x) => (x === 1 ? 'Amount one: only the one-coin fits, one plus dp of zero: one coin.' : x === 5 ? 'Amount five: the five-coin reaches dp of zero, so one coin, beating everything built from ones and twos.' : x === AMT ? `Amount eleven looks back at ten, nine and six: dp of ten is two, so eleven needs three.` : undefined),
    hold: 450,
  });
  a.tone(AMT, 'ok');
  v.line(3).eq(`dp[${AMT}] = ${d[AMT]}`, 'ok').say(`${words(d[AMT])[0].toUpperCase()}${words(d[AMT]).slice(1)} coins. Each amount tries each coin once: amount times k.`);
  v.answer(change(COINS, AMT));

  recap(v, [{ name: 'Recursion', time: 'O(kᵃ)', space: 'O(a)' }, { name: 'Memoisation', time: 'O(a · k)', space: 'O(a)' }, { name: 'Bottom-up', time: 'O(a · k)', space: 'O(a)' }], 'dp[a] = 1 + min over coins of dp[a − c].', ['Fewest items to reach an exact total, unlimited use → unbounded min DP'], 'Greedy fails for arbitrary coin systems.');
  return v.build();
}

const problem: Problem = {
  slug: 'coin-change',
  statement: 'You are given coin denominations `coins` and a total `amount`. Return the fewest number of coins needed to make up that amount, or -1 if it cannot be made. You have an unlimited number of each coin.',
  examples: [{ input: 'coins = [1,2,5], amount = 11', output: '3' }, { input: 'coins = [2], amount = 3', output: '-1' }, { input: 'coins = [1], amount = 0', output: '0' }],
  constraints: ['1 ≤ coins.length ≤ 12', '1 ≤ coins[i] ≤ 2³¹ − 1', '0 ≤ amount ≤ 10⁴'],
  hints: ['Think about the last coin.', 'dp[a] = 1 + min(dp[a − c]).'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try every coin as the last one, recursively.', time: 'O(kᵃ)', space: 'O(a)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache fewest(a).', time: 'O(a · k)', space: 'O(a)', bottleneck: 'Deep recursion.' },
    { id: 'optimal', kind: 'optimal', name: 'Bottom-up', idea: 'Fill dp[0..amount].', time: 'O(a · k)', space: 'O(a)' },
  ],
  takeaway: '**1 + min** over the last coin.',
  video,
  videoArgs: [COINS, AMT],
  judge: {
    type: 'fn', fn: 'coinChange', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [COINS, AMT], out: 3 }, { args: [[2], 3], out: -1 }, { args: [[1], 0], out: 0 }, { args: [[1, 3, 4], 6], out: 2 }, { args: [[186, 419, 83, 408], 6249], out: 20, big: true }],
    gen: (r: Rng) => [[...new Set(Array.from({ length: r.int(1, 3) }, () => r.int(1, 7)))], r.int(0, 14)],
    ref: (c: number[], a: number) => change(c, a),
  },
};

export default problem;
