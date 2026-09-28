import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { stateTable, type StateRow } from '../../stateviz';

const P = [1, 3, 2, 8, 4, 9], FEE = 2;
function profit(p: number[], fee: number) { let hold = -p[0], cash = 0; for (let i = 1; i < p.length; i++) [hold, cash] = [Math.max(hold, cash - p[i]), Math.max(cash, hold + p[i] - fee)]; return cash; }

function video() {
  const v = new Video('best-time-to-buy-and-sell-stock-with-transaction-fee', 'Best Time to Buy and Sell Stock with Transaction Fee');
  const n = P.length;
  const rows: StateRow[] = [
    { name: 'HOLD', init: (p) => -p, step: (prev, p) => (prev[0] >= prev[1] - p ? [prev[0], 0] : [prev[1] - p, 1]), eq: (prev, p, val) => `hold = max(${prev[0]}, cash ${prev[1]} − ${p}) = ${val}` },
    { name: 'CASH', init: () => 0, step: (prev, p) => (prev[1] >= prev[0] + p - FEE ? [prev[1], 1] : [prev[0] + p - FEE, 0]), eq: (prev, p, val) => `cash = max(${prev[1]}, hold ${prev[0]} + ${p} − ${FEE}) = ${val}` },
  ];
  v.chapter('intro', 'The problem');
  v.array('p', P, { label: 'prices' });
  v.say(`Trade as often as you like, holding at most one share, but every completed trade costs a fee of ${words(FEE)}. Find the maximum profit.`);
  v.eq(`answer: ${profit(P, FEE)} (buy 1 sell 8, buy 4 sell 9: 7 − 2 + 5 − 2)`);
  v.say('Without a fee you would take every small rise. With a fee, small rises are not worth a trade, so the decisions interact.');

  v.chapter('brute', 'Brute force: buy, sell or wait every day', { cx: 'O(2ⁿ)', code: ['best(day, holding): wait, or buy / sell (paying the fee)'] });
  v.eq('two choices per day', 'bad').say('Trying every sequence of actions is exponential.');

  v.chapter('better', 'Better: memoise (day, holding)', { cx: 'O(n)', code: ['cache best(day, holding)'] });
  v.eq('2n states', 'warn').say('Only the day and whether we hold matter.');

  v.chapter('optimal', 'Optimal: two states, hold and cash', { cx: 'O(n) time, O(1) space', code: ['hold = max(hold, cash − p)', 'cash = max(cash, hold + p − fee)', 'answer = cash'] });
  v.clear();
  v.line(0, 1);
  const { t } = stateTable(v, P, rows, {
    line: (r) => [r],
    initSay: 'Two states: hold, owning a share, and cash, not owning one. The fee is paid when selling.',
    say: (r, d) => (d === 2 && r === 1 ? 'Day two: selling at two earns one over the buy price, but the fee is two, so it would lose money. Cash stays at zero: the fee makes small rises not worth a trade.' : d === 3 && r === 1 ? 'Day three: selling at eight gives eight minus one minus two: five.' : d === 4 && r === 0 ? 'Day four: buying at four from the five in cash leaves one, better than the old hold.' : undefined),
    hold: 380,
  });
  v.line(2).eq(`answer = cash = ${t[1][n - 1]}`, 'ok').say(`The final cash is ${words(t[1][n - 1])}. Two variables, one pass.`);
  v.answer(profit(P, FEE));

  recap(v, [{ name: 'Try every action', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoise (day, holding)', time: 'O(n)', space: 'O(n)' }, { name: 'hold / cash', time: 'O(n)', space: 'O(1)' }], 'Subtract the fee on the sell edge.', ['Unlimited trades with a cost per trade → two-state DP'], 'Pay the fee once per trade: on buy or on sell, not both.');
  return v.build();
}

const problem: Problem = {
  slug: 'best-time-to-buy-and-sell-stock-with-transaction-fee',
  statement: 'You are given `prices[i]` and a transaction `fee`. Find the maximum profit with as many transactions as you like, holding at most one share, paying the fee for each transaction.',
  examples: [{ input: 'prices = [1,3,2,8,4,9], fee = 2', output: '8' }, { input: 'prices = [1,3,7,5,10,3], fee = 3', output: '6' }],
  constraints: ['1 ≤ prices.length ≤ 5 · 10⁴', '1 ≤ prices[i] < 5 · 10⁴', '0 ≤ fee < 5 · 10⁴'],
  hints: ['Two states: holding or not.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Buy / sell / wait each day.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache (day, holding).', time: 'O(n)', space: 'O(n)', bottleneck: 'Memo + stack.' },
    { id: 'optimal', kind: 'optimal', name: 'hold / cash', idea: 'Two rolling states.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Fee on the **sell edge**.',
  video,
  videoArgs: [P, FEE],
  judge: {
    type: 'fn', fn: 'maxProfit', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [P, FEE], out: 8 }, { args: [[1, 3, 7, 5, 10, 3], 3], out: 6 }, { args: [[5], 1], out: 0 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 14) }, () => r.int(1, 15)), r.int(0, 4)],
    ref: (p: number[], f: number) => profit(p, f),
  },
};

export default problem;
