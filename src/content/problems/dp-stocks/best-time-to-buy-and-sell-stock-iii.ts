import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { stateTable, type StateRow } from '../../stateviz';

const P = [3, 3, 5, 0, 0, 3, 1, 4];
function profit(p: number[]) { let b1 = -p[0], s1 = 0, b2 = -p[0], s2 = 0; for (let i = 1; i < p.length; i++) { const x = p[i]; [b1, s1, b2, s2] = [Math.max(b1, -x), Math.max(s1, b1 + x), Math.max(b2, s1 - x), Math.max(s2, b2 + x)]; } return s2; }

function video() {
  const v = new Video('best-time-to-buy-and-sell-stock-iii', 'Best Time to Buy and Sell Stock III');
  const n = P.length;
  const pick = (a: number, ai: number, b: number, bi: number): [number, number] => (a >= b ? [a, ai] : [b, bi]);
  const rows: StateRow[] = [
    { name: 'BUY1', init: (p) => -p, step: (pr, p) => pick(pr[0], 0, -p, 0), eq: (pr, p, val) => `buy1 = max(${pr[0]}, −${p}) = ${val}` },
    { name: 'SELL1', init: () => 0, step: (pr, p) => pick(pr[1], 1, pr[0] + p, 0), eq: (pr, p, val) => `sell1 = max(${pr[1]}, buy1 ${pr[0]} + ${p}) = ${val}` },
    { name: 'BUY2', init: (p) => -p, step: (pr, p) => pick(pr[2], 2, pr[1] - p, 1), eq: (pr, p, val) => `buy2 = max(${pr[2]}, sell1 ${pr[1]} − ${p}) = ${val}` },
    { name: 'SELL2', init: () => 0, step: (pr, p) => pick(pr[3], 3, pr[2] + p, 2), eq: (pr, p, val) => `sell2 = max(${pr[3]}, buy2 ${pr[2]} + ${p}) = ${val}` },
  ];
  v.chapter('intro', 'The problem');
  v.array('p', P, { label: 'prices' });
  v.say('Now you may complete at most two transactions, and must sell before buying again. Find the maximum profit.');
  v.eq(`answer: ${profit(P)} (buy 0 sell 3, buy 1 sell 4)`);

  v.chapter('brute', 'Brute force: split the days into two halves', { cx: 'O(n²)', code: ['for each split day k:', '  best single trade in days 0..k + best single trade in days k..n−1'] });
  v.eq('n splits × O(n) each', 'bad').say('Two trades never overlap, so some day separates them. For each possible split, find the best single trade on each side. That is quadratic. With prefix and suffix arrays it drops to linear, but the state machine is simpler and generalises.');

  v.chapter('better', 'Better: memoise (day, trades left, holding)', { cx: 'O(n · k)', code: ['best(day, left, holding)', '  sell uses up one transaction'] });
  v.eq('n × 3 × 2 states', 'warn').say('The recursion over day, transactions left and holding has only a handful of states per day.');

  v.chapter('optimal', 'Optimal: four states in a chain', { cx: 'O(n) time, O(1) space', code: ['buy1 = max(buy1, −p)', 'sell1 = max(sell1, buy1 + p)', 'buy2 = max(buy2, sell1 − p)', 'sell2 = max(sell2, buy2 + p)'] });
  v.clear();
  v.line(0, 1, 2, 3);
  const { t } = stateTable(v, P, rows, {
    line: (r) => [r],
    initSay: 'Four states form a chain: after the first buy, after the first sell, after the second buy, after the second sell. The second buy starts from the profit of the first sell.',
    say: (r, d) => (d === 2 && r === 1 ? 'Selling at five after buying at three: two.' : d === 3 && r === 2 ? 'Price zero: the second buy uses the first trade’s two, leaving two.' : d === 5 && r === 1 ? 'A better first trade appears: buy at zero, sell at three.' : d === 7 && r === 3 ? 'The last day: buy2 already includes a first trade worth three and a second buy at one; selling at four gives six.' : undefined),
    hold: 220,
  });
  v.eq(`answer = sell2 = ${t[3][n - 1]}`, 'ok').say(`The best with at most two trades is ${words(t[3][n - 1])}. Four variables, one pass.`);
  v.answer(profit(P));

  recap(v, [{ name: 'Try every split', time: 'O(n²)', space: 'O(1)' }, { name: 'Memoise (day, left, holding)', time: 'O(n)', space: 'O(n)' }, { name: 'Four states', time: 'O(n)', space: 'O(1)' }], 'buy1 → sell1 → buy2 → sell2, each a running max.', ['At most k transactions → a chain of 2k states'], 'Updating in order within a day is safe here.');
  return v.build();
}

const problem: Problem = {
  slug: 'best-time-to-buy-and-sell-stock-iii',
  statement: 'You are given `prices[i]`. Find the maximum profit with at most two transactions. You may not hold more than one share at a time.',
  examples: [{ input: 'prices = [3,3,5,0,0,3,1,4]', output: '6' }, { input: 'prices = [1,2,3,4,5]', output: '4' }, { input: 'prices = [7,6,4,3,1]', output: '0' }],
  constraints: ['1 ≤ prices.length ≤ 10⁵', '0 ≤ prices[i] ≤ 10⁵'],
  hints: ['Four states: after buy1, sell1, buy2, sell2.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every split', idea: 'Best single trade left of k + right of k, for every k.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache (day, trades left, holding).', time: 'O(n)', space: 'O(n)', bottleneck: 'Memo table.' },
    { id: 'optimal', kind: 'optimal', name: 'Four states', idea: 'Chain of running maxima.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'A **chain of four states**.',
  video,
  videoArgs: [P],
  judge: {
    type: 'fn', fn: 'maxProfit', params: ['int[]'], ret: 'int',
    tests: [{ args: [P], out: 6 }, { args: [[1, 2, 3, 4, 5]], out: 4 }, { args: [[7, 6, 4, 3, 1]], out: 0 }, { args: [[1]], out: 0 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 14) }, () => r.int(0, 12))],
    ref: (p: number[]) => profit(p),
  },
};

export default problem;
