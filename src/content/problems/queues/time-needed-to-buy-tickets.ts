import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const T = [2, 3, 2];
const K = 2;

function video() {
  const v = new Video('buy-tickets', 'Time Needed to Buy Tickets');
  v.chapter('intro', 'The problem');
  const a = v.array('t', T, { label: `tickets each person wants · we track person k = ${K}` });
  a.tone(K, 'pivot');
  v.say('People stand in a line. Each second, the person at the front buys one ticket. If they still want more, they go to the back of the line; otherwise they leave. How many seconds until person k has all their tickets?');

  v.chapter('brute', 'Simulate the queue', { cx: 'O(n · max t)', code: ['q = queue of (person, remaining)', 'repeat: front buys one; time += 1', '  if it is k and done: return time', '  if they still need tickets: push to back'] });
  v.clear();
  const q = v.queue('q', T.map((x, i) => `P${i}:${x}`), { label: 'line (person:tickets left)', ends: ['front', 'back'] });
  const vv = v.vars('v', { time: 0 });
  const line = T.map((x, i) => [i, x]);
  let time = 0;
  let first = true;
  for (;;) {
    const [p, left] = line.shift()!;
    time++;
    const rem = left - 1;
    q.clearTones().tone(0, p === K ? 'pivot' : 'active');
    v.line(1).eq(`P${p} buys one (${rem} left) · time ${time}`).hold(300);
    q.shift();
    vv.set({ time });
    if (p === K && rem === 0) {
      v.eq(`P${K} done at ${time}`, 'ok').say(`Person ${K} finishes at second ${time}.`);
      break;
    }
    if (rem > 0) {
      line.push([p, rem]);
      q.push(`P${p}:${rem}`).clearTones().tone(q.size - 1, 'warn');
    }
    if (first) v.say('Simulate it: the front buys one ticket, and goes to the back if they need more. Each purchase is one second.');
    else v.hold(550);
    first = false;
  }
  v.note('slow when ticket counts are large');

  v.chapter('optimal', 'Optimal: count each person’s contribution', { cx: 'O(n)', code: ['for i, x in enumerate(tickets):', '  if i <= k: time += min(x, tickets[k])', '  else:      time += min(x, tickets[k] − 1)'] });
  v.clear();
  const b = v.array('t', T, { label: 'tickets' });
  b.tone(K, 'pivot');
  let total = 0;
  T.forEach((x, i) => {
    const c = i <= K ? Math.min(x, T[K]) : Math.min(x, T[K] - 1);
    total += c;
    b.sub(i, `+${c}`).clearTones().tone(K, 'pivot').tone(i, 'active');
    v.line(i <= K ? 1 : 2).eq(`P${i} buys ${c} tickets before k finishes`);
    if (i === 0) v.say('We do not need to simulate. Person k needs t of k rounds. Anyone standing at or before k buys in each of those rounds, up to their own need: the minimum of their tickets and t of k.');
    else v.hold(700);
  });
  v.eq(`total = ${total}`, 'ok').say(`People after k only get t of k minus one rounds, because k finishes first in the last round. Summing gives ${total}, in a single pass.`);
  v.answer(total);
  recap(v, [{ name: 'Simulate the line', time: 'O(n · max t)', space: 'O(n)' }, { name: 'Sum each person’s purchases', time: 'O(n)', space: 'O(1)' }], 'Counting how many times each person buys replaces the simulation.', ['Round-robin simulation → count per item instead', 'Items before vs after k differ by one round'], 'Simulate first to understand, then ask: can I count each item’s contribution directly?');
  return v.build();
}

const problem: Problem = {
  slug: 'time-needed-to-buy-tickets',
  statement: '`n` people stand in a line; person `i` wants `tickets[i]` tickets. Each second, the person at the front buys **one** ticket and, if they need more, goes to the back of the line; otherwise they leave. Return the number of seconds until person `k` has bought all their tickets.',
  examples: [{ input: 'tickets = [2,3,2], k = 2', output: '6' }, { input: 'tickets = [5,1,1,1], k = 0', output: '8' }],
  constraints: ['1 ≤ n ≤ 100', '1 ≤ tickets[i] ≤ 100', '0 ≤ k < n'],
  hints: ['Simulating with a queue works.', 'How many tickets does each person buy before k is finished?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Simulate with a queue', idea: 'Pop the front, decrement, push back if needed, until person k finishes.', time: 'O(n · max tickets)', space: 'O(n)', bottleneck: 'One step per ticket bought.' },
    { id: 'optimal', kind: 'optimal', name: 'Count each person’s purchases', idea: 'Person i buys `min(tickets[i], tickets[k])` if `i ≤ k`, else `min(tickets[i], tickets[k] − 1)`. Sum them.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Replace a round-robin **simulation** with a **per-item count**.',
  video,
  videoArgs: [T, K],
  judge: {
    type: 'fn', fn: 'timeRequiredToBuy', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[2, 3, 2], 2], out: 6 }, { args: [[5, 1, 1, 1], 0], out: 8 }, { args: [[1], 0], out: 1 }],
    gen: (r) => { const t = r.ints(r.int(1, 10), 1, 10); return [t, r.int(0, t.length - 1)]; },
    ref: (t: number[], k: number) => t.reduce((a, x, i) => a + (i <= k ? Math.min(x, t[k]) : Math.min(x, t[k] - 1)), 0),
  },
};

export default problem;
