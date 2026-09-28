import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const AMT = 5, COINS = [1, 2, 5];
function combos(amount: number, coins: number[]) { const d = Array(amount + 1).fill(0); d[0] = 1; for (const c of coins) for (let a = c; a <= amount; a++) d[a] += d[a - c]; return d[amount]; }

function video() {
  const v = new Video('coin-change-ii', 'Coin Change II');
  v.chapter('intro', 'The problem');
  v.array('c', COINS, { label: 'coins (unlimited)' });
  v.say(`Count the combinations of coins that make ${words(AMT)}. Order does not matter: two plus one plus one plus one is the same combination as one plus two plus one plus one.`);
  v.eq(`${combos(AMT, COINS)} combinations: 5 · 2+2+1 · 2+1+1+1 · 1+1+1+1+1`);

  v.chapter('brute', 'Brute force: decide how many of each coin', { cx: 'exponential', code: ['count(i, remaining): remaining == 0 → 1; i == n → 0', '  skip coin i: count(i+1, remaining)', '  use coin i again: count(i, remaining − coins[i])'] });
  v.eq('branches for every coin and every remaining amount', 'bad').say('To avoid counting the same combination twice in different orders, decide coin by coin: either we are done with this coin, or we use one more of it. Without caching it is exponential.');

  v.chapter('better', 'Better: memoise (coin index, remaining)', { cx: 'O(n · amount)', code: ['cache count(i, remaining)'] });
  v.eq('n × (amount + 1) states', 'warn').say('The state is which coin we are on and how much is left: n times the amount.');

  v.chapter('optimal', 'One row, one pass per coin, left to right', { cx: 'O(n · amount) time, O(amount) space', code: ['dp[0] = 1', 'for coin in coins:                 (coins outer!)', '  for a from coin to amount: dp[a] += dp[a − coin]', 'return dp[amount]'] });
  v.clear();
  const d = Array(AMT + 1).fill(0); d[0] = 1;
  const row = v.array('dp', d, { label: 'dp[a] = combinations making a with the coins so far' });
  const cs = v.array('c', COINS, { label: 'coins' });
  v.line(0).say('dp of a counts the combinations for amount a. Before any coin, only zero can be made, in exactly one way: take nothing.');
  COINS.forEach((c, k) => {
    cs.clearTones().tone(k, 'active');
    for (let a = c; a <= AMT; a++) {
      const before = d[a];
      d[a] += d[a - c];
      row.clearTones().set(a, d[a]).tone(a, 'active').tone(a - c, 'cmp');
      v.line(2).counter(`coin ${c}`).eq(`dp[${a}] = ${before} + dp[${a - c}] = ${before} + ${d[a - c]} = ${d[a]}`);
      if (k === 0 && a === 1) v.say('With only one-coins, every amount has exactly one combination.');
      else if (k === 1 && a === 2) v.say('Now allow twos. Amount two adds the ways to make zero, then add a two. Going left to right lets the same coin be used again: dp of zero already includes this pass.');
      else if (k === 1 && a === 4) v.say('Amount four: the one-only way, plus every way to make two using ones and twos, followed by one more two. Three.');
      else if (k === 2 && a === 5) v.say('Finally fives: amount five gains the single way to make zero. Four in total.');
      else v.hold(420);
    }
  });
  cs.clearTones(); row.clearTones().tone(AMT, 'ok');
  v.line(3).eq(`dp[${AMT}] = ${d[AMT]}`, 'ok').say(`Four combinations. Because the coins are the outer loop, every combination is built in one fixed order, ones first, then twos, then fives, so it is counted once. Swapping the loops would count orders too, which is Combination Sum IV.`);
  v.answer(combos(AMT, COINS));

  recap(v, [{ name: 'Recursion', time: 'exponential', space: 'O(amount)' }, { name: 'Memoisation', time: 'O(n · amount)', space: 'O(n · amount)' }, { name: 'One row, coins outer', time: 'O(n · amount)', space: 'O(amount)' }], 'Coins outer, amounts inner (forward) → combinations.', ['Count combinations with unlimited items → unbounded knapsack count'], 'Loop order = combinations vs permutations.');
  return v.build();
}

const problem: Problem = {
  slug: 'coin-change-ii',
  statement: 'Given an integer `amount` and an array of coin denominations `coins` (unlimited supply), return the number of combinations that make up that amount. If it cannot be made, return 0.',
  examples: [{ input: 'amount = 5, coins = [1,2,5]', output: '4' }, { input: 'amount = 3, coins = [2]', output: '0' }, { input: 'amount = 10, coins = [10]', output: '1' }],
  constraints: ['1 ≤ coins.length ≤ 300', '1 ≤ coins[i] ≤ 5000, all distinct', '0 ≤ amount ≤ 5000', 'answer fits in a 32-bit signed integer'],
  hints: ['Process one coin type at a time.', 'Coins in the outer loop count each combination once.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Skip this coin or use it once more.', time: 'exponential', space: 'O(amount)', bottleneck: 'Repeated states.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache (coin index, remaining).', time: 'O(n · amount)', space: 'O(n · amount)', bottleneck: '2D memo.' },
    { id: 'optimal', kind: 'optimal', name: 'One row', idea: 'For each coin, dp[a] += dp[a − coin] left to right.', time: 'O(n · amount)', space: 'O(amount)' },
  ],
  takeaway: '**Coins outer** → combinations, not orders.',
  video,
  videoArgs: [AMT, COINS],
  judge: {
    type: 'fn', fn: 'change', params: ['int', 'int[]'], ret: 'int',
    tests: [{ args: [5, [1, 2, 5]], out: 4 }, { args: [3, [2]], out: 0 }, { args: [10, [10]], out: 1 }, { args: [0, [7]], out: 1 }, { args: [500, [3, 5, 7, 8, 9, 10, 11]], out: combos(500, [3, 5, 7, 8, 9, 10, 11]), big: true }],
    gen: (r: Rng) => [r.int(0, 14), [...new Set(Array.from({ length: r.int(1, 4) }, () => r.int(1, 8)))]],
    ref: (a: number, c: number[]) => combos(a, c),
  },
};

export default problem;
