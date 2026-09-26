import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { answerSearch } from '../../bsviz';

const W = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const D = 5;
function days(w: number[], cap: number) { let d = 1, load = 0; for (const x of w) { if (load + x > cap) { d++; load = 0; } load += x; } return d; }
function groups(w: number[], cap: number) { const g: number[] = []; let d = 0, load = 0; for (const x of w) { if (load + x > cap) { d++; load = 0; } load += x; g.push(d); } return g; }
const solve = (w: number[], D2: number) => { let lo = Math.max(...w), hi = w.reduce((a, b) => a + b, 0); while (lo < hi) { const m = (lo + hi) >> 1; if (days(w, m) <= D2) hi = m; else lo = m + 1; } return lo; };

function video() {
  const v = new Video('ship-within-days', 'Capacity To Ship Packages Within D Days');
  v.chapter('intro', 'The problem');
  v.array('w', W, { label: `package weights, in order · D = ${D} days` });
  v.say(`Packages must ship in the given order. Each day, the ship takes packages from the front as long as the total stays within its capacity. Find the smallest capacity that ships everything within ${words(D)} days.`);

  v.chapter('brute', 'Brute force: try every capacity', { cx: 'O(n · Σw)', code: ['for cap in max(w)..sum(w): if days(cap) <= D: return cap'] });
  v.eq(`up to ${W.reduce((a, b) => a + b, 0) - Math.max(...W) + 1} capacities here, 10⁷+ in general`, 'warn').say('Every capacity from the heaviest package up to the total weight is a candidate. Trying them one by one is too slow in general.');

  v.chapter('optimal', 'Optimal: binary search the capacity', { cx: 'O(n log Σw)', code: ['lo, hi = max(w), sum(w)', 'days(cap): greedy, start a new day when the next package does not fit', 'if days(mid) <= D: hi = mid', 'else: lo = mid + 1'] });
  v.clear();
  const a = v.array('w', W, { label: 'colour = which day ships it' });
  const tones = ['ok', 'active', 'warn', 'cmp', 'pivot', 'path', 'visit', 'bad'] as const;
  const paint = (cap: number) => { const g = groups(W, cap); a.clearTones(); g.forEach((d, i) => a.tone(i, tones[d % tones.length])); a.subs(g.map((d) => `d${d + 1}`)); };
  v.say(`Bounds: the capacity must hold the heaviest package, ${words(Math.max(...W))}, and the total, ${words(W.reduce((x, y) => x + y, 0))}, surely works. A bigger ship never needs more days, so binary search.`);
  const ans = answerSearch(v, {
    lo: Math.max(...W), hi: W.reduce((x, y) => x + y, 0), name: 'cap', lines: { ok: [2], bad: [3] },
    check: (cap) => { paint(cap); const d = days(W, cap); return { ok: d <= D, info: `${d} days ${d <= D ? '≤' : '>'} ${D}` }; },
    firstSay: (cap, ok) => `Try capacity ${words(cap)}. Load greedily: keep adding packages until the next one would exceed ${words(cap)}, then start a new day. The colours show each day. That takes ${words(days(W, cap))} days, ${ok ? 'within the limit, so try smaller.' : 'too many, so we need a bigger ship.'}`,
  });
  paint(ans);
  v.line(2).eq(`smallest capacity = ${ans}`, 'ok').say(`The smallest capacity is ${words(ans)}, shipping in ${words(days(W, ans))} days.`);
  v.answer(ans);

  recap(v, [{ name: 'Try every capacity', time: 'O(n · Σw)', space: 'O(1)' }, { name: 'Binary search + greedy check', time: 'O(n log Σw)', space: 'O(1)' }], 'Greedy loading answers “is this capacity enough?” in O(n).', ['Minimise the maximum load over ordered groups → binary search + greedy'], 'Greedy decides feasibility; binary search decides the value.');
  return v.build();
}

const problem: Problem = {
  slug: 'capacity-to-ship-packages-within-d-days',
  statement: 'A conveyor belt has packages that must be shipped within `days` days. The i-th package has weight `weights[i]`. Each day, we load the ship with packages in the given order, never exceeding the ship’s capacity. Return the least weight capacity that ships all packages within `days` days.',
  examples: [{ input: 'weights = [1,2,3,4,5,6,7,8,9,10], days = 5', output: '15' }, { input: 'weights = [3,2,2,4,1,4], days = 3', output: '6' }, { input: 'weights = [1,2,3,1,1], days = 4', output: '3' }],
  constraints: ['1 ≤ days ≤ n ≤ 5 · 10⁴', '1 ≤ weights[i] ≤ 500'],
  hints: ['Lowest possible capacity? Highest needed?', 'Given a capacity, count days greedily.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every capacity', idea: 'From max(weights) upward, return the first capacity whose greedy day count ≤ days.', time: 'O(n · Σw)', space: 'O(1)', bottleneck: 'Huge candidate range.' },
    { id: 'optimal', kind: 'optimal', name: 'Binary search + greedy', idea: 'Binary search capacity in [max, sum]; feasibility by greedy loading.', time: 'O(n log Σw)', space: 'O(1)' },
  ],
  takeaway: '**Greedy check + binary search** on the capacity.',
  video,
  videoArgs: [W, D],
  judge: {
    type: 'fn', fn: 'shipWithinDays', params: ['int[]', 'int'], ret: 'int',
    tests: [{ args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5], out: 15 }, { args: [[3, 2, 2, 4, 1, 4], 3], out: 6 }, { args: [[1, 2, 3, 1, 1], 4], out: 3 }],
    gen: (r: Rng) => { const w = r.ints(r.int(1, 10), 1, 12); return [w, r.int(1, w.length)]; },
    ref: (w: number[], d: number) => solve(w, d),
  },
};

export default problem;
