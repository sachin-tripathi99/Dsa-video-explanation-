import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [2, 7, 4, 1, 8, 1];
function least(a: number[]) { const s = a.reduce((x, y) => x + y, 0); const h = Math.floor(s / 2); const d = Array(h + 1).fill(false); d[0] = true; for (const x of a) for (let c = h; c >= x; c--) d[c] = d[c] || d[c - x]; let b = h; while (!d[b]) b--; return s - 2 * b; }

function video() {
  const v = new Video('last-stone-weight-ii', 'Last Stone Weight II');
  const S = A.reduce((x, y) => x + y, 0), H = Math.floor(S / 2);
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'stones' });
  v.say('Smash two stones together: if they weigh x and y with x at most y, x is destroyed and y becomes y minus x. Repeat until at most one stone is left. What is the smallest weight it can have?');
  v.eq(`answer: ${least(A)}`);

  v.chapter('insight', 'Every smash is a plus or a minus');
  v.clear();
  v.text('t', { title: 'The final stone is a signed sum', lines: ['Each smash subtracts one stone from another', 'In the end every stone is added or subtracted once', 'final = (sum of group A) − (sum of group B), with A ≥ B', 'Make B as close to total / 2 as possible'], shown: 4 });
  v.say('Follow the arithmetic. Every smash subtracts one stone from another, so the last stone is some stones added and the others subtracted: group A minus group B. And any split into two groups can actually be produced by smashing. To make the difference small, make group B as large as possible without passing half the total.');

  v.chapter('brute', 'Brute force: try every split', { cx: 'O(2ⁿ)', code: ['for each subset B: if sum(B) ≤ total / 2: best = max(best, sum(B))', 'answer = total − 2 · best'] });
  v.eq(`2^${A.length} = ${2 ** A.length} subsets`, 'bad').say('Trying every subset works for six stones, not for thirty.');

  v.chapter('better', 'Better: memoise (i, sum so far)', { cx: 'O(n · total)', code: ['cache the best reachable sum for (index, current sum)'] });
  v.eq('n × total states', 'warn').say('The state is the index and the sum so far: n times the total.');

  v.chapter('optimal', 'Subset sums up to total / 2', { cx: 'O(n · total) time, O(total) space', code: ['dp[s] = some subset sums to s (s ≤ total/2)', 'for x: for c from half down to x: dp[c] |= dp[c − x]', 'best = largest reachable s', 'answer = total − 2 · best'] });
  v.clear();
  const a = v.array('a', A, { label: 'stones' });
  const d = Array(H + 1).fill(false); d[0] = true;
  const row = v.array('dp', d.map((x) => (x ? 'T' : '·')), { label: `reachable sums 0..${H} (half of ${S})` });
  v.line(0).say(`The total is ${words(S)}, so half is ${words(H)}. Find all subset sums up to ${words(H)}.`);
  A.forEach((x, k) => {
    a.clearTones().tone(k, 'active');
    const newly: number[] = [];
    for (let c = H; c >= x; c--) if (!d[c] && d[c - x]) { d[c] = true; newly.push(c); }
    row.clearTones();
    d.forEach((b, s) => { row.set(s, b ? 'T' : '·'); if (b) row.tone(s, 'done'); });
    newly.forEach((c) => row.tone(c, 'ok'));
    v.line(1).counter(`after stone ${x}`).eq(`add ${x}: ${newly.length ? `new sums ${newly.sort((p, q) => p - q).join(', ')}` : 'nothing new'}`);
    if (k === 0) v.say('The first stone, two, makes sum two reachable.'); else v.hold(800);
  });
  a.clearTones();
  let b = H; while (!d[b]) b--;
  row.tone(b, 'ok');
  v.line(2, 3).eq(`best B = ${b} → ${S} − 2·${b} = ${S - 2 * b}`, 'ok').say(`Sum ${words(b)} is reachable, so the groups weigh ${words(S - b)} and ${words(b)}, and the last stone weighs ${words(S - 2 * b)}.`);
  v.answer(least(A));

  recap(v, [{ name: 'All splits', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n · total)', space: 'O(n · total)' }, { name: 'Subset sums to half', time: 'O(n · total)', space: 'O(total)' }], 'Smashing = signed sum; minimise |A − B|.', ['Minimise the difference of two groups → subset sum closest to half'], 'Answer = total − 2 · best.');
  return v.build();
}

const problem: Problem = {
  slug: 'last-stone-weight-ii',
  statement: 'You are given stone weights `stones`. Each turn choose two stones x ≤ y: if equal both are destroyed, otherwise x is destroyed and y becomes y − x. At the end at most one stone is left. Return the smallest possible weight of the remaining stone (0 if none).',
  examples: [{ input: 'stones = [2,7,4,1,8,1]', output: '1' }, { input: 'stones = [31,26,33,21,40]', output: '5' }],
  constraints: ['1 ≤ stones.length ≤ 30', '1 ≤ stones[i] ≤ 100'],
  hints: ['The result is a signed sum of the stones.', 'Split into two groups as equal as possible.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'All splits', idea: 'Try every subset as one group.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache (index, sum).', time: 'O(n · total)', space: 'O(n · total)', bottleneck: '2D memo.' },
    { id: 'optimal', kind: 'optimal', name: 'Subset sums to half', idea: 'Largest reachable sum ≤ total/2.', time: 'O(n · total)', space: 'O(total)' },
  ],
  takeaway: 'It is **partition as evenly as possible**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'lastStoneWeightII', params: ['int[]'], ret: 'int',
    tests: [{ args: [A], out: 1 }, { args: [[31, 26, 33, 21, 40]], out: 5 }, { args: [[1]], out: 1 }, { args: [[1, 1]], out: 0 }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 14) }, () => r.int(1, 20))],
    ref: (a: number[]) => least(a),
  },
};

export default problem;
