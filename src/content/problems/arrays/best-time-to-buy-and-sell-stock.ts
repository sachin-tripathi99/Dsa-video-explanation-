import type { Problem } from '../../types';
import { Video, recap, words } from '../../helpers';

const P = [7, 1, 5, 3, 6, 4];

function video() {
  const v = new Video('stock-1', 'Best Time to Buy and Sell Stock');
  v.chapter('intro', 'The problem');
  const a = v.array('prices', P, { label: 'price on each day', bars: true });
  v.say('You get the stock price for each day. Buy on one day and sell on a later day. What is the maximum profit? If no profit is possible, return zero.');
  a.tone(1, 'ok').tone(4, 'ok');
  v.eq('buy at 1 (day 1), sell at 6 (day 4) → profit 5', 'ok').say('Here, buy at one and sell at six for a profit of five.');

  v.chapter('brute', 'Brute force: every buy/sell pair', { cx: 'O(n²)', code: ['for i in 0..n-1:', '  for j in i+1..n-1:', '    best = max(best, p[j] − p[i])'] });
  a.clearTones();
  let best = 0;
  let c = 0;
  for (let i = 0; i < 2; i++) {
    for (let j = i + 1; j < P.length; j++) {
      c++;
      best = Math.max(best, P[j] - P[i]);
      a.clearTones().ptrs({ buy: i, sell: j }).tone(i, 'cmp').tone(j, 'cmp');
      v.counter(`pairs: ${c}`).line(2).eq(`${P[j]} − ${P[i]} = ${P[j] - P[i]} · best = ${best}`);
      if (c === 1) v.say('Try every pair: buy on day i, sell on a later day j, and keep the best difference.');
      else v.hold(350);
    }
  }
  a.noPtr().clearTones();
  v.eq('n(n−1)/2 pairs → O(n²)', 'bad').say('That checks every pair, about n squared over two. With a hundred thousand days, five billion pairs. Too slow.');

  v.chapter('optimal', 'Optimal: remember the cheapest day so far', { cx: 'O(n)', code: ['minPrice = ∞, best = 0', 'for p in prices:', '  minPrice = min(minPrice, p)', '  best = max(best, p − minPrice)'] });
  v.clear();
  const b = v.array('prices', P, { label: 'prices', bars: true });
  const vv = v.vars('v', { minPrice: '∞', best: 0 });
  v.say('Flip the question. If I sell today, the best day to have bought is simply the cheapest day before today. So walk once, remembering the lowest price so far.');
  let mn = Infinity;
  best = 0;
  let minIdx = -1;
  P.forEach((p, i) => {
    if (p < mn) {
      mn = p;
      minIdx = i;
    }
    best = Math.max(best, p - mn);
    b.clearTones().ptr('day', i).tone(minIdx, 'pivot').tone(i, i === minIdx ? 'pivot' : 'active');
    vv.set({ minPrice: mn, best });
    v.line(2, 3).eq(`sell at ${p}: profit ${p - mn} · best = ${best}`);
    if (i === 0) v.say('Day zero: price seven. The cheapest so far is seven, profit zero.');
    else if (i === 1) v.say('Day one: price one, a new minimum. Selling today gives nothing, but it is a great day to have bought.');
    else if (i === 4) v.say(`Day four: price six. Six minus one is five, the best so far.`);
    else v.hold(700);
  });
  b.clearTones().tone(1, 'ok').tone(4, 'ok').noPtr();
  v.eq(`answer: ${best}`, 'ok').say(`One pass, two variables: O of n time and constant space. The answer is ${words(best)}.`);
  v.answer(best);

  recap(v, [{ name: 'Every pair', time: 'O(n²)', space: 'O(1)' }, { name: 'Track the minimum so far', time: 'O(n)', space: 'O(1)' }], 'Instead of trying every buy day for each sell day, we remember the only buy day that matters: the cheapest so far.', ['Best pair (i < j) → fix j, remember the best i so far', 'This is Kadane-style thinking: carry the best state forward'], 'Fix the second element of the pair and remember the best first element seen so far. This one idea solves many array problems.');
  return v.build();
}

const problem: Problem = {
  slug: 'best-time-to-buy-and-sell-stock',
  statement: 'You are given `prices[i]`, the price of a stock on day `i`. Choose one day to **buy** and a **later** day to **sell**. Return the maximum profit, or `0` if no profit is possible.',
  examples: [
    { input: 'prices = [7,1,5,3,6,4]', output: '5', why: 'Buy at 1, sell at 6.' },
    { input: 'prices = [7,6,4,3,1]', output: '0', why: 'Prices only fall.' },
  ],
  constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁴'],
  hints: ['Try all pairs first. What does it cost?', 'If you sell on day j, which buy day is best?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Check every pair', idea: 'For each buy day i and later sell day j, compute `prices[j] − prices[i]` and keep the maximum.', time: 'O(n²)', space: 'O(1)', bottleneck: 'For each sell day we re-scan all earlier days, but only the cheapest one matters.' },
    { id: 'optimal', kind: 'optimal', name: 'Track the minimum so far', idea: 'Walk once. Keep `minPrice` (cheapest day so far) and `best = max(best, price − minPrice)`.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Selling before buying: the minimum must come from an earlier (or the same) day.', 'Returning a negative profit instead of 0.'],
  takeaway: 'For the best pair `i < j`, **fix j and remember the best i seen so far**.',
  video,
  videoArgs: [P],
  judge: {
    type: 'fn', fn: 'maxProfit', params: ['int[]'], ret: 'int',
    tests: [{ args: [[7, 1, 5, 3, 6, 4]], out: 5 }, { args: [[7, 6, 4, 3, 1]], out: 0 }, { args: [[2]], out: 0 }, { args: [[2, 4, 1]], out: 2 }],
    gen: (r) => [r.ints(r.int(1, 40), 0, 100)],
    ref: (p: number[]) => { let b = 0; for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) b = Math.max(b, p[j] - p[i]); return b; },
  },
};

export default problem;
