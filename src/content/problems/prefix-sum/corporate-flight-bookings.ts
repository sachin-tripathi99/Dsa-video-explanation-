import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const B = [[1, 2, 10], [2, 3, 20], [2, 5, 25]];
const N = 5;

function book(bookings: number[][], n: number) {
  const d = Array(n + 1).fill(0);
  for (const [f, l, s] of bookings) { d[f - 1] += s; d[l] -= s; }
  const out: number[] = [];
  let run = 0;
  for (let i = 0; i < n; i++) { run += d[i]; out.push(run); }
  return out;
}

function video() {
  const v = new Video('corporate-flight-bookings', 'Corporate Flight Bookings');
  v.chapter('intro', 'The problem');
  v.table('b', ['first flight', 'last flight', 'seats'], B.map((b) => b.map(String)));
  v.say(`There are ${N} flights, numbered one to ${N}. Each booking reserves the same number of seats on every flight from first to last. Return the total seats reserved on each flight.`);

  v.chapter('brute', 'Brute force: add to every flight in each range', { cx: 'O(q · n)', code: ['for (first, last, seats) in bookings:', '  for f in first..last: ans[f − 1] += seats'] });
  v.eq('each booking can touch n flights', 'warn').say('Adding seats to every flight in each range costs up to n per booking.');

  v.chapter('optimal', 'Optimal: difference array', { cx: 'O(q + n)', code: ['d[first − 1] += seats; d[last] −= seats', 'ans = running sum of d'] });
  v.clear();
  const d = Array(N + 1).fill(0);
  const dv = v.array('d', [...d], { label: 'difference array (0-indexed flights, one extra slot)' });
  v.say('Each booking is a range update, so record it at the two ends: plus seats where it starts, minus seats just after it ends. Flights are numbered from one, so flight f lives at index f minus one.');
  B.forEach(([f, l, s], k) => {
    d[f - 1] += s;
    d[l] -= s;
    dv.set(f - 1, d[f - 1]).set(l, d[l]).clearTones().tone(f - 1, 'ok').tone(l, 'bad');
    v.line(0).eq(`flights ${f}–${l} +${s}: d[${f - 1}] += ${s}, d[${l}] −= ${s}`);
    if (k === 0) v.say(`Booking one to two with ten seats: plus ten at index zero, minus ten at index two.`);
    else v.hold(800);
  });
  dv.clearTones();
  const out = book(B, N);
  const ov = v.array('ans', Array(N).fill(null), { label: 'seats per flight' });
  ov.subs(Array.from({ length: N }, (_, i) => `flight ${i + 1}`));
  let run = 0;
  for (let i = 0; i < N; i++) {
    run += d[i];
    ov.set(i, run).clearTones().tone(i, 'ok');
    dv.clearTones().tone(i, 'active');
    v.line(1).eq(`running sum → flight ${i + 1}: ${run}`).hold(500);
  }
  dv.clearTones();
  v.eq(`[${out.join(', ')}]`, 'ok').say('One running sum turns the endpoint records into the seats on every flight. Each booking cost two writes.');
  v.answer(out);

  recap(v, [{ name: 'Update every flight', time: 'O(q · n)', space: 'O(n)' }, { name: 'Difference array', time: 'O(q + n)', space: 'O(n)' }], 'Range add → two point updates; read with a prefix sum.', ['Many range increments, one final read → difference array'], 'Difference arrays are prefix sums in reverse: cheap range updates, one final pass.');
  return v.build();
}

const problem: Problem = {
  slug: 'corporate-flight-bookings',
  statement: 'There are `n` flights labelled `1…n`. `bookings[i] = [first, last, seats]` reserves `seats` on every flight from `first` to `last` inclusive. Return an array `answer` of length `n` where `answer[i]` is the total number of seats reserved for flight `i + 1`.',
  examples: [{ input: 'bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5', output: '[10,55,45,25,25]' }, { input: 'bookings = [[1,2,10],[2,2,15]], n = 2', output: '[10,25]' }],
  constraints: ['1 ≤ n ≤ 2 · 10⁴', '1 ≤ bookings.length ≤ 2 · 10⁴', '1 ≤ first ≤ last ≤ n', '1 ≤ seats ≤ 10⁴'],
  hints: ['Each booking adds to a contiguous range.', 'Mark where each range starts and where it stops.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Update every flight', idea: 'Loop over each booking’s range.', time: 'O(q · n)', space: 'O(n)', bottleneck: 'Ranges can be long.' },
    { id: 'optimal', kind: 'optimal', name: 'Difference array', idea: 'd[first−1] += seats, d[last] −= seats; prefix sums give the answer.', time: 'O(q + n)', space: 'O(n)' },
  ],
  takeaway: '**Difference array**: O(1) range add, one prefix pass to read.',
  video,
  videoArgs: [B, N],
  judge: {
    type: 'fn', fn: 'corpFlightBookings', params: ['int[][]', 'int'], ret: 'int[]',
    tests: [{ args: [[[1, 2, 10], [2, 3, 20], [2, 5, 25]], 5], out: [10, 55, 45, 25, 25] }, { args: [[[1, 2, 10], [2, 2, 15]], 2], out: [10, 25] }],
    gen: (r: Rng) => { const n = r.int(1, 8); return [Array.from({ length: r.int(1, 5) }, () => { const f = r.int(1, n); return [f, r.int(f, n), r.int(1, 20)]; }), n]; },
    ref: (b: number[][], n: number) => book(b, n),
  },
};

export default problem;
