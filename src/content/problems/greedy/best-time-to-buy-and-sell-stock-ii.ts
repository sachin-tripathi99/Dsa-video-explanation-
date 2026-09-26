import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const P = [7, 1, 5, 3, 6, 4, 8];
function mp(p: number[]) { let s = 0; for (let i = 1; i < p.length; i++) s += Math.max(0, p[i] - p[i - 1]); return s; }

function video() {
  const v = new Video('stock-ii', 'Best Time to Buy and Sell Stock II');
  v.chapter('intro', 'The problem');
  v.array('p', P, { label: 'price on each day', bars: true });
  v.say('You may buy and sell as many times as you like, but you can hold at most one share at a time. You can sell and buy again on the same day. What is the maximum profit?');
  v.eq(`answer: ${mp(P)}`);

  v.chapter('brute', 'Brute force: try every buy/sell decision', { cx: 'O(2ⁿ)', code: ['best(day, holding):', '  skip the day, or buy (if not holding), or sell (if holding)', '  take the max of the options'] });
  v.eq('two choices per day → exponential', 'bad').say('Recursively try, on every day, doing nothing or trading. Two choices a day gives exponential time. Dynamic programming could fix that, but there is a much simpler view.');

  v.chapter('better', 'Better: buy every valley, sell every peak', { cx: 'O(n)', code: ['while i < n:', '  walk down to a valley; buy', '  walk up to a peak; sell; profit += peak − valley'] });
  v.clear();
  const b = v.array('p', P, { label: 'prices', bars: true });
  v.say('Look at the price chart. Any rising run from a valley to a peak should be captured in full: buy at the bottom, sell at the top.');
  let i = 0, total = 0;
  while (i < P.length - 1) {
    while (i < P.length - 1 && P[i + 1] <= P[i]) i++;
    const lo = i;
    while (i < P.length - 1 && P[i + 1] > P[i]) i++;
    const hi = i;
    if (hi > lo) { total += P[hi] - P[lo]; b.tone(lo, 'cmp').tone(hi, 'ok').win(lo, hi, 'ok', `+${P[hi] - P[lo]}`); v.counter(`profit: ${total}`).eq(`buy at ${P[lo]} (day ${lo}), sell at ${P[hi]} (day ${hi}) → +${P[hi] - P[lo]}`, 'ok').hold(1000); }
  }
  v.eq(`total = ${total}`, 'ok').say(`Three rising runs, total ${words(total)}.`);

  v.chapter('optimal', 'Optimal: add every positive daily gain', { cx: 'O(n)', code: ['profit = 0', 'for i in 1..n−1:', '  profit += max(0, p[i] − p[i−1])'] });
  v.clear();
  const c = v.array('p', P, { label: 'prices', bars: true });
  const gains = v.array('d', P.map((x, k) => (k ? x - P[k - 1] : null)), { label: 'daily change' });
  let s = 0;
  v.say('Even simpler: a rising run from valley to peak is the sum of its daily increases. So just add up every day-to-day increase and ignore the decreases. It is like buying today and selling tomorrow whenever tomorrow is higher.');
  for (let k = 1; k < P.length; k++) {
    const d = P[k] - P[k - 1];
    c.clearTones().tone(k - 1, 'cmp').tone(k, d > 0 ? 'ok' : 'bad');
    gains.clearTones().tone(k, d > 0 ? 'ok' : 'dim');
    if (d > 0) s += d;
    v.line(2).counter(`profit: ${s}`).eq(d > 0 ? `${P[k]} − ${P[k - 1]} = +${d} → take it` : `${P[k]} − ${P[k - 1]} = ${d} → skip`, d > 0 ? 'ok' : undefined).hold(700);
  }
  c.clearTones();
  v.eq(`profit = ${s}`, 'ok').say(`Same answer, ${words(s)}, in one line of logic. Selling and buying on the same day makes the chained one-day trades equal to one long trade.`);
  v.answer(mp(P));

  recap(v, [{ name: 'Try every decision', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Valleys and peaks', time: 'O(n)', space: 'O(1)' }, { name: 'Sum of positive gains', time: 'O(n)', space: 'O(1)' }], 'Profit = sum of max(0, p[i] − p[i−1]).', ['Unlimited transactions → collect every upward move'], 'A long rise is just many small rises added together.');
  return v.build();
}

const problem: Problem = {
  slug: 'best-time-to-buy-and-sell-stock-ii',
  statement: 'You are given `prices[i]`, the price of a stock on day `i`. You may complete as many transactions as you like, holding at most one share at a time (you may sell and buy on the same day). Return the maximum profit.',
  examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '7' }, { input: 'prices = [1,2,3,4,5]', output: '4' }, { input: 'prices = [7,6,4,3,1]', output: '0' }],
  constraints: ['1 ≤ n ≤ 3 · 10⁴', '0 ≤ prices[i] ≤ 10⁴'],
  hints: ['A rise from day a to day b equals the sum of the daily rises in between.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every decision', idea: 'Recurse over days with a holding flag.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Valleys and peaks', idea: 'Buy at each local minimum, sell at the next local maximum.', time: 'O(n)', space: 'O(1)', bottleneck: 'More code than needed.' },
    { id: 'optimal', kind: 'optimal', name: 'Sum of positive gains', idea: 'Add every positive day-to-day difference.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Collect **every upward move**.',
  video,
  videoArgs: [P],
  judge: {
    type: 'fn', fn: 'maxProfit', params: ['int[]'], ret: 'int',
    tests: [{ args: [[7, 1, 5, 3, 6, 4]], out: 7 }, { args: [[1, 2, 3, 4, 5]], out: 4 }, { args: [[7, 6, 4, 3, 1]], out: 0 }, { args: [P], out: mp(P) }],
    gen: (r: Rng) => [r.ints(r.int(1, 12), 0, 10)],
    ref: (p: number[]) => mp(p),
  },
};

export default problem;
