import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const TR = [[2, 1, 5], [3, 3, 7]];
const CAP = 4;

function ok(trips: number[][], cap: number) {
  const d = Array(1002).fill(0);
  for (const [p, f, t] of trips) { d[f] += p; d[t] -= p; }
  let run = 0;
  for (const x of d) { run += x; if (run > cap) return false; }
  return true;
}

function video() {
  const v = new Video('car-pooling', 'Car Pooling');
  v.chapter('intro', 'The problem');
  v.table('t', ['passengers', 'pick up at', 'drop off at'], TR.map((t) => t.map(String)));
  v.say(`A car with ${CAP} seats drives east only. Each trip picks up some passengers at one kilometre mark and drops them off at a later one. Can the car complete every trip without ever carrying more than ${CAP} people?`);

  v.chapter('brute', 'Brute force: count riders at every kilometre', { cx: 'O(trips × distance)', code: ['for each km x: riders = sum of p over trips with from ≤ x < to', '  if riders > capacity: return false'] });
  v.eq('each km scans every trip', 'warn').say('For every kilometre we could add up everyone in the car. That scans all trips at every position.');

  v.chapter('optimal', 'Optimal: difference array of boardings', { cx: 'O(trips + distance)', code: ['d[from] += p; d[to] −= p     # for each trip', 'riders = running sum of d', 'if riders > capacity anywhere: return false'] });
  v.clear();
  const L = 8;
  const d = Array(L).fill(0);
  const dv = v.array('d', [...d], { label: 'change in riders at each km' });
  v.say('Each trip is a range update: plus p people from pick up until drop off. That is a difference array: add p at the pick-up mark, subtract p at the drop-off mark.');
  TR.forEach(([p, f, t]) => {
    d[f] += p;
    d[t] -= p;
    dv.set(f, d[f]).set(t, d[t]).clearTones().tone(f, 'ok').tone(t, 'bad');
    v.line(0).eq(`trip ${p} passengers ${f}→${t}: d[${f}] += ${p}, d[${t}] −= ${p}`).hold(900);
  });
  dv.clearTones();
  const rv = v.array('run', Array(L).fill(null), { label: 'riders in the car' });
  let run = 0;
  let fail = -1;
  for (let x = 0; x < L; x++) {
    run += d[x];
    const over = run > CAP;
    rv.set(x, run).clearTones().tone(x, over ? 'bad' : 'ok');
    dv.clearTones().tone(x, 'active');
    v.line(1, 2).eq(`km ${x}: riders ${run}${over ? ` > ${CAP}` : ''}`, over ? 'bad' : undefined);
    if (over) { fail = x; v.say(`At kilometre ${x}, the second group boards before the first group has left: ${run} riders, more than ${CAP} seats. Return false.`); break; }
    v.hold(450);
  }
  dv.clearTones();
  v.answer(ok(TR, CAP));
  v.eq(fail < 0 ? 'never over capacity → true' : 'd[to] −= p: riders leave before new ones board at the same km', fail < 0 ? 'ok' : undefined);
  v.say('Drop-offs happen before pick-ups at the same mark, which the difference array handles naturally: the minus p lands exactly at the drop-off kilometre.');

  recap(v, [{ name: 'Count at every km', time: 'O(T · D)', space: 'O(1)' }, { name: 'Difference array', time: 'O(T + D)', space: 'O(D)' }], 'Intervals adding a load → +p at start, −p at end, then a running sum.', ['Maximum overlap / load of intervals → difference array or sweep line'], 'Interval loads become two point updates and one running sum.');
  return v.build();
}

const problem: Problem = {
  slug: 'car-pooling',
  statement: 'A car has `capacity` empty seats and only drives east. `trips[i] = [numPassengers, from, to]` means `numPassengers` must be picked up at kilometre `from` and dropped off at kilometre `to`. Return `true` if it is possible to pick up and drop off all passengers for all trips.',
  examples: [{ input: 'trips = [[2,1,5],[3,3,7]], capacity = 4', output: 'false' }, { input: 'trips = [[2,1,5],[3,3,7]], capacity = 5', output: 'true' }],
  constraints: ['1 ≤ trips.length ≤ 1000', '1 ≤ numPassengers ≤ 100', '0 ≤ from < to ≤ 1000', '1 ≤ capacity ≤ 10⁵'],
  hints: ['Each trip adds passengers over a range of kilometres.', 'Record changes at the endpoints only.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count at every km', idea: 'For each kilometre, sum the passengers of trips covering it.', time: 'O(T · D)', space: 'O(1)', bottleneck: 'Rescans all trips per position.' },
    { id: 'optimal', kind: 'optimal', name: 'Difference array', idea: 'd[from] += p, d[to] −= p; a running sum gives the riders at each kilometre.', time: 'O(T + D)', space: 'O(D)' },
  ],
  pitfalls: ['Passengers leave at `to`, so subtract at `to`, not `to + 1`.'],
  takeaway: 'Range loads → **+p at start, −p at end**, then prefix sum.',
  video,
  videoArgs: [TR, CAP],
  judge: {
    type: 'fn', fn: 'carPooling', params: ['int[][]', 'int'], ret: 'boolean',
    tests: [{ args: [[[2, 1, 5], [3, 3, 7]], 4], out: false }, { args: [[[2, 1, 5], [3, 3, 7]], 5], out: true }, { args: [[[2, 1, 5], [3, 5, 7]], 3], out: true }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 5) }, () => { const f = r.int(0, 8); return [r.int(1, 4), f, r.int(f + 1, 10)]; }), r.int(1, 8)],
    ref: (t: number[][], c: number) => ok(t, c),
  },
};

export default problem;
