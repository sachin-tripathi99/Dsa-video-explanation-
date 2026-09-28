import type { Lesson } from '../../types';
import { Video, words } from '../../helpers';
import { stateTable, type StateRow } from '../../stateviz';

const P = [1, 2, 3, 0, 2];

function video() {
  const v = new Video('dp-state-machines', 'State machine DP (the stock problems)');

  v.chapter('intro', 'When one number per day is not enough');
  v.array('p', P, { label: 'price on each day' });
  v.say('You trade one stock: buy, sell, buy again, as often as you like, but you must sell before buying again, and after selling you must wait one day, a cooldown, before the next buy. What is the most profit?');
  v.eq('answer: 3 (buy 1, sell 2, cooldown, buy 0, sell 2)');
  v.say('The trouble: whether you can act today depends on what you did before. Holding a share, just sold, or free to buy. The trick is to make that situation part of the state.');

  v.chapter('states', 'Draw the states and the moves between them');
  v.clear();
  const g = v.graph('m', [{ id: 'h', label: 'HOLD', x: 50, y: 12 }, { id: 's', label: 'SOLD', x: 88, y: 85 }, { id: 'r', label: 'REST', x: 12, y: 85 }], [{ a: 'r', b: 'h', w: 'buy −p' }, { a: 'h', b: 's', w: 'sell +p' }, { a: 's', b: 'r', w: 'wait' }], { label: 'one day = one move', directed: true });
  v.say('Three states at the end of each day. Hold: you own a share. Sold: you sold today. Rest: you own nothing and are free. From rest you may buy, paying today’s price, and move to hold. From hold you may sell, earning the price, and move to sold. From sold, the only move is to wait a day into rest. And hold and rest may also simply stay where they are.');
  g.tone('s', 'warn');
  v.eq('the cooldown is just the SOLD → REST edge', 'warn').say('The cooldown rule is not special code at all: it is the fact that sold has no buy edge. The rules of the problem become the edges of the machine.');

  v.chapter('table', 'Fill one column per day', { cx: 'O(n · states)', code: ['hold = max(hold, rest − p)', 'sold = hold + p', 'rest = max(rest, sold)', 'answer = max(sold, rest) on the last day'] });
  v.clear();
  const rows: StateRow[] = [
    { name: 'HOLD', init: (p) => -p, step: (prev, p) => (prev[0] >= prev[2] - p ? [prev[0], 0] : [prev[2] - p, 2]), eq: (prev, p, val) => `hold = max(${prev[0]}, rest ${prev[2]} − ${p}) = ${val}` },
    { name: 'SOLD', init: () => 0, step: (prev, p) => [prev[0] + p, 0], eq: (prev, p, val) => `sold = hold ${prev[0]} + ${p} = ${val}` },
    { name: 'REST', init: () => 0, step: (prev) => (prev[2] >= prev[1] ? [prev[2], 2] : [prev[1], 1]), eq: (prev, _p, val) => `rest = max(${prev[2]}, sold ${prev[1]}) = ${val}` },
  ];
  v.line(0, 1, 2);
  const { t } = stateTable(v, P, rows, {
    line: (r) => [r],
    initSay: 'On day zero: buying costs one, so hold is minus one. Sold and rest are zero.',
    say: (r, d) => (d === 1 && r === 1 ? 'Selling on day one turns the minus one into plus one: sold is one.' : d === 3 && r === 0 ? 'Day three, price zero. Buying from rest, which is one, gives one: better than keeping the old hold. The arrow comes from rest: buying is only allowed from rest, never straight from sold.' : d === 4 && r === 1 ? 'Selling that share at two gives three.' : undefined),
    hold: 450,
  });
  const n = P.length;
  const ans = Math.max(t[1][n - 1], t[2][n - 1]);
  v.line(3).eq(`answer = max(sold ${t[1][n - 1]}, rest ${t[2][n - 1]}) = ${ans}`, 'ok').say(`On the last day we should not be holding, so the answer is the better of sold and rest: ${words(ans)}. Each day only reads the previous day, so three variables are enough.`);

  v.chapter('family', 'Every stock problem is a small machine');
  v.clear();
  v.table('t', ['Rule', 'States', 'Transitions'], [
    ['unlimited trades', 'hold, cash', 'cash = max(cash, hold + p); hold = max(hold, cash − p)'],
    ['transaction fee f', 'hold, cash', 'sell pays the fee: hold + p − f'],
    ['cooldown 1 day', 'hold, sold, rest', 'buy only from rest'],
    ['at most 2 trades', 'buy1, sell1, buy2, sell2', 'buy2 starts from sell1'],
    ['at most k trades', 'buy[j], sell[j] for j = 1..k', 'buy[j] = max(buy[j], sell[j−1] − p)'],
  ]);
  v.say('The recipe: list the situations you can be in at the end of a day, draw the allowed moves, and write one max per state. The table is just those states over the days.');
  return v.build();
}

const body = String.raw`
## The idea

When the allowed action depends on **what happened before** (holding a share, cooling down, trades used), add that situation to the DP state. Draw a small **state machine**: nodes are situations at the end of a day, edges are allowed actions. Each day, every state takes the best incoming edge.

> Real-life picture: a traffic light. What it can do next depends only on which colour it is now, not on the whole history.

## Cooldown (hold / sold / rest)

\`\`\`java
int maxProfit(int[] prices) {
    int hold = -prices[0], sold = 0, rest = 0;
    for (int i = 1; i < prices.length; i++) {
        int p = prices[i], h = hold, s = sold, r = rest;
        hold = Math.max(h, r - p);                     // keep, or buy from REST
        sold = h + p;                                  // sell today
        rest = Math.max(r, s);                         // stay free, or cool down
    }
    return Math.max(sold, rest);
}
\`\`\`

\`\`\`python
def max_profit(prices):
    hold, sold, rest = -prices[0], 0, 0
    for p in prices[1:]:
        hold, sold, rest = max(hold, rest - p), hold + p, max(rest, sold)
    return max(sold, rest)
\`\`\`

\`\`\`cpp
int maxProfit(vector<int>& prices) {
    int hold = -prices[0], sold = 0, rest = 0;
    for (int i = 1; i < (int)prices.size(); i++) {
        int p = prices[i], h = hold, s = sold, r = rest;
        hold = max(h, r - p);                          // keep, or buy from REST
        sold = h + p;                                  // sell today
        rest = max(r, s);                              // stay free, or cool down
    }
    return max(sold, rest);
}
\`\`\`

## Variations

| Rule | Change |
|---|---|
| Fee per trade | subtract the fee when selling |
| At most k trades | \`buy[j] = max(buy[j], sell[j−1] − p)\`, \`sell[j] = max(sell[j], buy[j] + p)\` |
| k ≥ n / 2 | unlimited: just add every rise |

## Pitfalls

- Update states from **yesterday's** values: copy them first, or order updates carefully.
- The final answer is a **not-holding** state.
- Initial "holding" states start at \`−prices[0]\`, not 0.
`;

const lesson: Lesson = {
  slug: 'dp-state-machines',
  video,
  body,
  quiz: [
    { q: 'With a 1-day cooldown, you may buy today only from…', options: ['SOLD', 'REST', 'HOLD', 'any state'], answer: 1, why: 'Yesterday’s sale forces a day of rest.' },
    { q: 'Initial value of a HOLD state on day 0?', options: ['0', '−prices[0]', 'prices[0]', '−∞ always'], answer: 1, why: 'You paid for the share.' },
    { q: 'At most k trades needs how many state variables?', options: ['2', 'k', '2k', 'k²'], answer: 2, why: 'buy[j] and sell[j] for each j.' },
    { q: 'The final answer comes from…', options: ['a holding state', 'a not-holding state', 'day 0', 'the maximum price'], answer: 1, why: 'Holding a share at the end never beats selling or not buying.' },
  ],
};

export default lesson;
