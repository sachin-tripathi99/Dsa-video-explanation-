import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const PINGS = [1, 100, 3001, 3002, 7000];

function video() {
  const v = new Video('recent-calls', 'Number of Recent Calls');
  v.chapter('intro', 'The problem');
  v.text('p', { title: 'Count requests in the last 3000 ms', lines: ['ping(t) is called with strictly increasing times', 'return how many pings happened in [t − 3000, t]'] });
  v.say('Each call to ping adds a request at time t, in increasing order. Return how many requests happened in the last three thousand milliseconds, including this one.');

  v.chapter('brute', 'Brute force: keep everything, count each time', { cx: 'O(n) per ping', code: ['all.append(t)', 'return count of x in all with x >= t − 3000'] });
  v.eq('rescans the whole history on every ping', 'bad').say('Storing every ping and counting the recent ones each time works, but every ping rescans the whole history, which only grows.');

  v.chapter('optimal', 'Optimal: a queue that forgets old pings', { cx: 'amortised O(1)', code: ['q.append(t)', 'while q.front < t − 3000: q.popleft()', 'return len(q)'] });
  v.clear();
  const q = v.queue('q', [], { label: 'recent pings', ends: ['oldest', 'newest'] });
  const out: number[] = [];
  PINGS.forEach((t, i) => {
    q.push(t).clearTones().tone(q.size - 1, 'active');
    v.line(0).eq(`ping(${t}): window [${t - 3000}, ${t}]`);
    v.hold(500);
    let popped = 0;
    while ((q.front() as number) < t - 3000) {
      q.clearTones().tone(0, 'bad');
      v.line(1).eq(`${q.front()} < ${t - 3000} → too old, drop it`, 'bad').hold(500);
      q.shift();
      popped++;
    }
    out.push(q.size);
    q.clearTones().tone(q.size - 1, 'ok');
    v.line(2).eq(`ping(${t}) → ${q.size}`, 'ok');
    if (i === 0) v.say('Times arrive in order, so the oldest pings are always at the front. Push the new time at the back.');
    else if (i === 2) v.say('At three thousand and one, the window starts at one, so nothing is too old yet: three pings.');
    else if (popped) v.say(`At ${t}, the window starts at ${t - 3000}. Everything older falls off the front. The queue length is the answer.`);
    else v.hold(700);
  });
  v.note('each ping is pushed once and popped once').say('Each ping enters once and leaves once, so the work is amortised O of one per call.');
  v.answer(out);
  recap(v, [{ name: 'Rescan all pings', time: 'O(n) per ping', space: 'O(n)' }, { name: 'Queue of recent pings', time: 'amortised O(1)', space: 'O(window)' }], 'Sorted arrival times make expiry happen at the front.', ['Sliding time window with in-order arrivals → queue; expire from the front'], 'In-order timestamps plus a queue give you a sliding time window for free.');
  return v.build();
}

const problem: Problem = {
  slug: 'number-of-recent-calls',
  statement: 'Implement `RecentCounter` with `ping(t)`, which records a request at time `t` (milliseconds) and returns the number of requests in the inclusive range `[t − 3000, t]`. Each call uses a strictly larger `t` than the previous one.',
  examples: [{ input: 'ping(1), ping(100), ping(3001), ping(3002)', output: '1, 2, 3, 3' }],
  constraints: ['1 ≤ t ≤ 10⁹', 'strictly increasing t', 'at most 10⁴ calls'],
  hints: ['Which requests can never count again?', 'Old requests are always the earliest ones.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Store all, rescan', idea: 'Keep every time; count those ≥ t − 3000 on every call.', time: 'O(n) per call', space: 'O(n)', bottleneck: 'The history only grows, and we rescan it every time.' },
    { id: 'optimal', kind: 'optimal', name: 'Queue with expiry', idea: 'Append t; pop from the front while the front is < t − 3000; return the size.', time: 'amortised O(1)', space: 'O(pings in window)' },
  ],
  takeaway: 'In-order timestamps + a **queue** = a sliding time window: expire from the front.',
  video,
  judge: {
    type: 'design', cls: 'RecentCounter', ctor: [],
    methods: { ping: { params: ['int'], ret: 'int' } },
    tests: [{ ops: ['RecentCounter', 'ping', 'ping', 'ping', 'ping'], args: [[], [1], [100], [3001], [3002]], out: [null, 1, 2, 3, 3] }],
    gen: (r) => { const ops = ['RecentCounter']; const args: unknown[][] = [[]]; let t = 0; for (let k = 0; k < 25; k++) { t += r.int(1, 1500); ops.push('ping'); args.push([t]); } return { ops, args }; },
    ref: (ops, args) => { const q: number[] = []; return ops.map((op, i) => { if (op === 'RecentCounter') return null; const t = args[i][0] as number; q.push(t); while (q[0] < t - 3000) q.shift(); return q.length; }); },
  },
};

export default problem;
