import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { stateTable, type StateRow } from '../../stateviz';

const K = 2, P = [3, 2, 6, 5, 0, 3];
function profit(k: number, p: number[]) { if (!p.length || !k) return 0; const buy = Array(k).fill(-p[0]), sell = Array(k).fill(0); for (const x of p) for (let j = 0; j < k; j++) { buy[j] = Math.max(buy[j], (j ? sell[j - 1] : 0) - x); sell[j] = Math.max(sell[j], buy[j] + x); } return sell[k - 1]; }

function video() {
  const v = new Video('best-time-to-buy-and-sell-stock-iv', 'Best Time to Buy and Sell Stock IV');
  const n = P.length;
  const pick = (a: number, ai: number, b: number, bi: number): [number, number] => (a >= b ? [a, ai] : [b, bi]);
  const rows: StateRow[] = [];
  for (let j = 0; j < K; j++) {
    const bi = 2 * j, si = 2 * j + 1;
    rows.push({ name: `BUY${j + 1}`, init: (p) => -p, step: (pr, p) => (j ? pick(pr[bi], bi, pr[si - 2] - p, si - 2) : pick(pr[bi], bi, -p, bi)), eq: (pr, p, val) => `buy${j + 1} = max(${pr[bi]}, ${j ? `sell${j} ${pr[si - 2]}` : '0'} − ${p}) = ${val}` });
    rows.push({ name: `SELL${j + 1}`, init: () => 0, step: (pr, p) => pick(pr[si], si, pr[bi] + p, bi), eq: (pr, p, val) => `sell${j + 1} = max(${pr[si]}, buy${j + 1} ${pr[bi]} + ${p}) = ${val}` });
  }
  v.chapter('intro', 'The problem');
  v.array('p', P, { label: 'prices' });
  v.say(`At most k transactions, here k is ${words(K)}. Find the maximum profit.`);
  v.eq(`answer: ${profit(K, P)} (buy 2 sell 6, buy 0 sell 3)`);

  v.chapter('brute', 'Brute force: recursion over days and trades left', { cx: 'O(2ⁿ)', code: ['best(day, left, holding): wait, or buy / sell (sell uses one trade)'] });
  v.eq('exponential', 'bad').say('Trying every action sequence is exponential.');

  v.chapter('better', 'Better: memoise (day, left, holding)', { cx: 'O(n · k)', code: ['cache the triple'] });
  v.eq('n × k × 2 states', 'warn').say('Only n times k times two states: caching gives n times k.');

  v.chapter('optimal', 'Optimal: 2k states per day', { cx: 'O(n · k) time, O(k) space', code: ['buy[j] = max(buy[j], sell[j−1] − p)   (sell[−1] = 0)', 'sell[j] = max(sell[j], buy[j] + p)', 'if k ≥ n/2: unlimited → add every rise', 'answer = sell[k−1]'] });
  v.clear();
  v.line(0, 1);
  const { t } = stateTable(v, P, rows, {
    line: (r) => [r % 2],
    initSay: 'Generalise the four-state chain to k pairs: buy j starts from the profit of sell j minus one.',
    say: (r, d) => (d === 2 && r === 1 ? 'Selling at six after buying at two: four.' : d === 4 && r === 2 ? 'Price zero: the second buy carries the four from the first trade.' : d === 5 && r === 3 ? 'Selling the second share at three: seven.' : undefined),
    hold: 260,
  });
  v.line(3).eq(`answer = sell${K} = ${t[2 * K - 1][n - 1]}`, 'ok').say(`The answer is ${words(t[2 * K - 1][n - 1])}. One more trick: if k is at least half the number of days, the limit never binds, so just add up every price rise.`);
  v.answer(profit(K, P));

  recap(v, [{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n · k)', space: 'O(n · k)' }, { name: '2k rolling states', time: 'O(n · k)', space: 'O(k)' }], 'buy[j] from sell[j−1], sell[j] from buy[j].', ['At most k trades → arrays buy[k], sell[k]'], 'k ≥ n/2 → unlimited trades.');
  return v.build();
}

const problem: Problem = {
  slug: 'best-time-to-buy-and-sell-stock-iv',
  statement: 'You are given an integer `k` and `prices[i]`. Find the maximum profit with at most `k` transactions, holding at most one share at a time.',
  examples: [{ input: 'k = 2, prices = [2,4,1]', output: '2' }, { input: 'k = 2, prices = [3,2,6,5,0,3]', output: '7' }],
  constraints: ['1 ≤ k ≤ 100', '1 ≤ prices.length ≤ 1000', '0 ≤ prices[i] ≤ 1000'],
  hints: ['Generalise the four states of Stock III to 2k states.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try every action with trades left.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache (day, left, holding).', time: 'O(n · k)', space: 'O(n · k)', bottleneck: 'Memo table.' },
    { id: 'optimal', kind: 'optimal', name: '2k states', idea: 'buy[j], sell[j] arrays rolled over days.', time: 'O(n · k)', space: 'O(k)' },
  ],
  takeaway: '**buy[j], sell[j]** chains.',
  video,
  videoArgs: [K, P],
  judge: {
    type: 'fn', fn: 'maxProfit', params: ['int', 'int[]'], ret: 'int',
    tests: [{ args: [2, [2, 4, 1]], out: 2 }, { args: [K, P], out: 7 }, { args: [1, [5]], out: 0 }, { args: [3, [1, 2, 4, 2, 5, 7, 2, 4, 9, 0]], out: profit(3, [1, 2, 4, 2, 5, 7, 2, 4, 9, 0]) }],
    gen: (r: Rng) => [r.int(1, 4), Array.from({ length: r.int(1, 12) }, () => r.int(0, 12))],
    ref: (k: number, p: number[]) => profit(k, p),
  },
};

export default problem;
