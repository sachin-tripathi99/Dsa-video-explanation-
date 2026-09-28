import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { stateTable, stateValues, type StateRow } from '../../stateviz';

const P = [1, 2, 4, 1, 3, 0, 5];
const ROWS: StateRow[] = [
  { name: 'HOLD', init: (p) => -p, step: (prev, p) => (prev[0] >= prev[2] - p ? [prev[0], 0] : [prev[2] - p, 2]), eq: (prev, p, val) => `hold = max(${prev[0]}, rest ${prev[2]} − ${p}) = ${val}` },
  { name: 'SOLD', init: () => 0, step: (prev, p) => [prev[0] + p, 0], eq: (prev, p, val) => `sold = hold ${prev[0]} + ${p} = ${val}` },
  { name: 'REST', init: () => 0, step: (prev) => (prev[2] >= prev[1] ? [prev[2], 2] : [prev[1], 1]), eq: (prev, _p, val) => `rest = max(${prev[2]}, sold ${prev[1]}) = ${val}` },
];
function profit(p: number[]) { let h = -p[0], s = 0, r = 0; for (let i = 1; i < p.length; i++) [h, s, r] = [Math.max(h, r - p[i]), h + p[i], Math.max(r, s)]; return Math.max(s, r); }

function video() {
  const v = new Video('best-time-to-buy-and-sell-stock-with-cooldown', 'Best Time to Buy and Sell Stock with Cooldown');
  const n = P.length;
  v.chapter('intro', 'The problem');
  v.array('p', P, { label: 'prices' });
  v.say('Trade as many times as you like, holding at most one share, but after every sale you must skip one day before buying again. Find the maximum profit.');
  v.eq(`answer: ${profit(P)}`);

  v.chapter('brute', 'Brute force: try every action every day', { cx: 'O(2ⁿ)', code: ['best(day, holding):', '  holding: sell (then skip a day) or keep', '  not holding: buy or skip'] });
  v.eq('two choices per day', 'bad').say('Each day we either act or wait, and the options depend on whether we hold a share. Exploring every sequence of decisions is exponential.');

  v.chapter('better', 'Better: memoise (day, holding)', { cx: 'O(n)', code: ['cache best(day, holding)'] });
  v.eq('2n states', 'warn').say('The future only depends on the day and whether we hold a share, so there are just two n states.');

  v.chapter('optimal', 'Optimal: three states per day', { cx: 'O(n) time, O(1) space', code: ['hold = max(hold, rest − p)', 'sold = hold + p', 'rest = max(rest, sold)', 'answer = max(sold, rest)'] });
  v.clear();
  v.line(0, 1, 2);
  const { t } = stateTable(v, P, ROWS, {
    line: (r) => [r],
    initSay: 'Hold, sold and rest, as in the state machine. Day zero: holding costs the first price.',
    say: (r, d) => (d === 2 && r === 1 ? 'Selling on day two at four gives three.' : d === 3 && r === 0 ? 'Day three: we cannot buy with the three from yesterday’s sale, because of the cooldown. Buying must come from rest, which is only one.' : d === 5 && r === 0 ? 'Price zero on day five: buy from rest, which now holds the three from the first trade.' : undefined),
    hold: 330,
  });
  const ans = Math.max(t[1][n - 1], t[2][n - 1]);
  v.line(3).eq(`answer = ${ans}`, 'ok').say(`The best is ${words(ans)}: buy at one, sell at four, cool down, buy at zero, sell at five. Only yesterday’s three numbers are needed.`);
  v.answer(profit(P));
  void stateValues;

  recap(v, [{ name: 'Try every action', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoise (day, holding)', time: 'O(n)', space: 'O(n)' }, { name: 'Three states', time: 'O(n)', space: 'O(1)' }], 'hold / sold / rest; buy only from rest.', ['Trading with a cooldown → state machine DP'], 'Answer = max of the non-holding states.');
  return v.build();
}

const problem: Problem = {
  slug: 'best-time-to-buy-and-sell-stock-with-cooldown',
  statement: 'You are given `prices[i]`, the price of a stock on day i. Find the maximum profit with as many transactions as you like, holding at most one share, where after you sell you cannot buy on the next day (cooldown one day).',
  examples: [{ input: 'prices = [1,2,3,0,2]', output: '3' }, { input: 'prices = [1]', output: '0' }],
  constraints: ['1 ≤ prices.length ≤ 5000', '0 ≤ prices[i] ≤ 1000'],
  hints: ['Three states: holding, just sold, resting.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try buy/sell/wait each day.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache (day, holding).', time: 'O(n)', space: 'O(n)', bottleneck: 'Memo + stack.' },
    { id: 'optimal', kind: 'optimal', name: 'Three states', idea: 'hold / sold / rest variables.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Buy only from **REST**.',
  video,
  videoArgs: [P],
  judge: {
    type: 'fn', fn: 'maxProfit', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 2, 3, 0, 2]], out: 3 }, { args: [[1]], out: 0 }, { args: [P], out: profit(P) }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 14) }, () => r.int(0, 12))],
    ref: (p: number[]) => profit(p),
  },
};

export default problem;
