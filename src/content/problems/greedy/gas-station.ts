import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const G = [1, 2, 3, 4, 5];
const C = [3, 4, 5, 1, 2];
function starts(g: number[], c: number[]) { const n = g.length, ok: number[] = []; for (let s = 0; s < n; s++) { let t = 0, good = true; for (let k = 0; k < n; k++) { const i = (s + k) % n; t += g[i] - c[i]; if (t < 0) { good = false; break; } } if (good) ok.push(s); } return ok; }
function gs(g: number[], c: number[]) { const o = starts(g, c); return o.length ? o[0] : -1; }

function video() {
  const v = new Video('gas-station', 'Gas Station');
  const n = G.length;
  v.chapter('intro', 'The problem');
  v.array('g', G, { label: 'gas[i]: fuel you get at station i' });
  v.array('c', C, { label: 'cost[i]: fuel to drive from i to i + 1' });
  v.say('Stations sit on a circle. At station i you pick up gas of i, and driving to the next station burns cost of i. Starting with an empty tank, from which station can you drive all the way around? The answer is unique if it exists; otherwise return minus one.');
  v.eq(`answer: ${gs(G, C)}`);

  v.chapter('brute', 'Brute force: simulate from every start', { cx: 'O(n²)', code: ['for each start s:', '  tank = 0; drive n legs', '  if the tank ever goes negative: s fails'] });
  v.eq('n starts × n legs', 'warn').say('Try each station as the start and drive the whole circle. Quadratic.');

  v.chapter('insight', 'Two facts that make one pass enough');
  v.clear();
  const d = v.array('d', G.map((g, i) => g - C[i]), { label: 'net gain gas[i] − cost[i]' });
  v.text('t', { title: 'Why greedy works', lines: ['If total gain < 0, no start can work', 'If the tank goes negative on the way from s to j, then no station between s and j can be the start either', 'So restart right after j'], shown: 3 });
  v.say('Two facts. First, if the total gas is less than the total cost, it is impossible from anywhere. Second, if starting from s we run dry arriving at j, then starting from any station between s and j is also hopeless: we reached each of those with a tank of at least zero, and still failed. So we can skip all of them and restart after j.');
  void d;

  v.chapter('optimal', 'Optimal: one pass with restarts', { cx: 'O(n)', code: ['total = tank = 0, start = 0', 'for i: gain = gas[i] − cost[i]', '  total += gain; tank += gain', '  if tank < 0: start = i + 1; tank = 0', 'return total ≥ 0 ? start : −1'] });
  v.clear();
  const a = v.array('d', G.map((g, i) => g - C[i]), { label: 'net gain at each station' });
  let total = 0, tank = 0, start = 0;
  let told = 0;
  v.say('Walk once around the stations with a running tank. Whenever the tank drops below zero, the current start fails, and so does everything up to here. Restart just after this station with an empty tank.');
  for (let i = 0; i < n; i++) {
    const gain = G[i] - C[i];
    total += gain; tank += gain;
    a.clearTones().noWin().win(start, i, 'win', `start ${start}`).tone(i, 'active');
    if (tank < 0) {
      a.tone(i, 'bad');
      v.line(3).counter(`total ${total} · tank ${tank}`).eq(`tank ${tank} < 0 → start = ${i + 1}, tank = 0`, 'bad');
      if (told === 0) { v.say(`At station ${words(i)} the tank falls to ${words(tank)}. ${start === i ? `Starting at ${words(start)} fails.` : `Starting at ${words(start)} fails, and so would starting anywhere up to ${words(i)}.`} Restart at ${words(i + 1)}.`); told++; } else v.hold(700);
      start = i + 1; tank = 0;
    } else {
      v.line(2).counter(`total ${total} · tank ${tank}`).eq(`gain ${gain >= 0 ? '+' : ''}${gain} → tank ${tank}`, gain >= 0 ? 'ok' : undefined);
      if (told === 1 && gain > 0) { v.say(`From station ${words(start)} the tank stays positive: ${words(tank)} after station ${words(i)}.`); told++; } else v.hold(600);
    }
  }
  a.clearTones().noWin().tone(start, 'ok');
  v.line(4).eq(`total = ${total} ≥ 0 → start at ${start}`, 'ok').say(`The total gain is ${words(total)}, not negative, so a solution exists, and it is the last restart point: station ${words(start)}. The deficit before it is covered by the surplus collected after it.`);
  v.answer(gs(G, C));

  recap(v, [{ name: 'Simulate every start', time: 'O(n²)', space: 'O(1)' }, { name: 'One pass with restarts', time: 'O(n)', space: 'O(1)' }], 'Restart after any station where the tank goes negative; check the total at the end.', ['Circular route with a running balance → restart when negative'], 'A failed stretch rules out every start inside it.');
  return v.build();
}

function uniqueGen(r: Rng) { for (;;) { const n = r.int(1, 7); const g = r.ints(n, 0, 6), c = r.ints(n, 0, 6); if (starts(g, c).length <= 1) return [g, c]; } }

const problem: Problem = {
  slug: 'gas-station',
  statement: 'There are `n` gas stations on a circular route; station `i` has `gas[i]`, and travelling to station `i + 1` costs `cost[i]`. Starting with an empty tank, return the starting station index from which you can travel around the circuit once clockwise, or `-1` if impossible. The answer is unique if it exists.',
  examples: [{ input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', output: '3' }, { input: 'gas = [2,3,4], cost = [3,4,3]', output: '-1' }],
  constraints: ['1 ≤ n ≤ 10⁵', '0 ≤ gas[i], cost[i] ≤ 10⁴'],
  hints: ['If sum(gas) < sum(cost), it is impossible.', 'If you run dry at j starting from s, no station in [s, j] works.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Simulate every start', idea: 'Drive the full circle from each station.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Repeats most of the drive.' },
    { id: 'optimal', kind: 'optimal', name: 'One pass', idea: 'Running tank; restart after a negative; total decides feasibility.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'A failed stretch rules out **every start inside it**.',
  video,
  videoArgs: [G, C],
  judge: {
    type: 'fn', fn: 'canCompleteCircuit', params: ['int[]', 'int[]'], ret: 'int',
    tests: [{ args: [G, C], out: 3 }, { args: [[2, 3, 4], [3, 4, 3]], out: -1 }, { args: [[5], [4]], out: 0 }],
    gen: (r: Rng) => uniqueGen(r),
    ref: (g: number[], c: number[]) => gs(g, c),
  },
};

export default problem;
