import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const N = 5;
const K = 2;

function video() {
  const v = new Video('circular-game', 'Find the Winner of the Circular Game');
  v.chapter('intro', 'The problem');
  const a = v.array('circle', [1, 2, 3, 4, 5], { label: 'friends sitting in a circle · k = 2' });
  v.say('Five friends sit in a circle. Starting from friend one, count k friends clockwise, including where you start. The friend you land on leaves. Keep going from the next friend until one is left.');
  a.ptr('start', 0).tone(0, 'active');
  v.eq('count 2 → friend 2 leaves').say('With k equals two: count one, two. Friend two leaves.');

  v.chapter('brute', 'Simulate with a list', { cx: 'O(n²)', code: ['list = [1..n], idx = 0', 'while size > 1:', '  idx = (idx + k − 1) % size', '  remove list[idx]', 'return list[0]'] });
  v.clear();
  const s = v.array('s', [1, 2, 3, 4, 5], { label: 'remaining friends' });
  const vars = v.vars('v', { idx: 0, size: 5 });
  let list = [1, 2, 3, 4, 5];
  let idx = 0;
  s.ptr('idx', 0);
  v.line(0).say('The direct approach: keep a list and simulate. From position idx, the person k minus one steps ahead, wrapping around with modulo, leaves.');
  while (list.length > 1) {
    idx = (idx + K - 1) % list.length;
    s.clearTones().ptr('idx', idx).tone(idx, 'bad');
    vars.set({ idx, size: list.length });
    v.line(2).eq(`idx = (idx + ${K} − 1) % ${list.length} = ${idx} → friend ${list[idx]} leaves`, 'bad');
    if (list.length === 5) v.say('Index one, friend two, leaves.');
    else v.hold(900);
    s.remove(idx).clearTones();
    list = [...list.slice(0, idx), ...list.slice(idx + 1)];
    if (idx >= list.length) idx = 0;
    s.ptr('idx', idx);
    vars.set({ idx, size: list.length });
    v.line(3).eq('the next count starts from the friend who took their place').hold(700);
  }
  s.tone(0, 'ok');
  v.eq(`winner: friend ${list[0]}`, 'ok').note('each removal shifts the list: O(n)');
  v.say(`Friend ${list[0]} wins. This is correct, but each removal shifts the list, so it is O of n squared. Can we skip the simulation?`);

  v.chapter('optimal', 'Optimal: recursion on a smaller circle', { cx: 'O(n)', code: ['f(1) = 0            (0-based position)', 'f(i) = (f(i−1) + k) % i', 'answer = f(n) + 1'] });
  v.clear();
  v.text('idea', { title: 'After the first person leaves…', lines: ['…the other n − 1 people form a smaller circle of the same game', 'It just starts k positions further along', 'So winner(n) = (winner(n − 1) + k) mod n'], shown: 3 });
  v.say('Here is the insight. After the first person leaves, the rest play the exact same game with n minus one people, just starting k seats further along. So if we know the winner of the smaller circle, shift it by k and wrap around.');
  v.clear();
  const tb = v.table('t', ['circle size i', 'f(i) = (f(i−1) + k) % i', 'winner (1-based)'], [['1', '0 (base case)', '1']]);
  tb.tone(0, 'ok');
  v.line(0).say('With one person, the winner is at position zero.');
  let f = 0;
  for (let i = 2; i <= N; i++) {
    const prev = f;
    f = (f + K) % i;
    tb.addRow([String(i), `(${prev} + ${K}) % ${i} = ${f}`, String(f + 1)]);
    tb.clearTones().tone(i - 1, 'active');
    v.line(1);
    if (i === 2) v.say('Two people: zero plus two, mod two, is zero.');
    else v.hold(900);
  }
  tb.clearTones().tone(N - 1, 'ok');
  v.line(2).eq(`f(${N}) + 1 = ${f + 1}`, 'ok').note('O(n) time · O(1) space');
  v.say(`Five people: position ${f}, which is friend ${f + 1}. The same answer as the simulation, in one simple loop: O of n time and constant space.`);
  v.answer(f + 1);

  recap(
    v,
    [
      { name: 'Simulate with a list', time: 'O(n²)', space: 'O(n)' },
      { name: 'Josephus recurrence', time: 'O(n)', space: 'O(1)' },
    ],
    'Simulation is quadratic because of the removals. The recurrence reuses the answer for a smaller circle.',
    ['Removing one element leaves a smaller copy of the same problem → recursion', 'Circular positions → work 0-based and use modulo'],
    'Look for a smaller copy of the same problem after one step. That is the recursive mindset.',
  );
  return v.build();
}

const problem: Problem = {
  slug: 'find-the-winner-of-the-circular-game',
  statement: '`n` friends sit in a circle, numbered `1` to `n` clockwise. Starting at friend 1, count `k` friends clockwise **including the one you start on**. The friend you land on leaves the circle, and counting restarts from the friend immediately clockwise of them. Repeat until one friend remains and return that friend’s number.',
  examples: [
    { input: 'n = 5, k = 2', output: '3', why: 'Friends leave in the order 2, 4, 1, 5.' },
    { input: 'n = 6, k = 5', output: '1' },
  ],
  constraints: ['1 ≤ k ≤ n ≤ 500'],
  hints: ['Simulate it first with a list and modulo arithmetic.', 'After one friend leaves, what is left is the same game with n − 1 friends, just rotated.', 'Work with 0-based positions: f(1) = 0, f(i) = (f(i − 1) + k) mod i.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Simulate with a list', idea: 'Keep the remaining friends in a list. The next to leave is at `(idx + k − 1) % size`; remove them and continue from the same index.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Each removal from the middle of a list shifts O(n) elements.' },
    {
      id: 'optimal', kind: 'optimal', name: 'Josephus recurrence',
      idea: 'After the first removal the remaining `i − 1` friends play the same game, shifted by `k`. So the 0-based winner position satisfies `f(i) = (f(i − 1) + k) % i` with `f(1) = 0`.',
      steps: ['`pos = 0` (winner of a circle of 1)', 'For `i` from 2 to `n`: `pos = (pos + k) % i`', 'Return `pos + 1`'],
      time: 'O(n)', space: 'O(1)',
    },
  ],
  pitfalls: ['Mixing 1-based friend numbers with 0-based indices: convert once, at the end.', 'Forgetting that counting includes the starting friend (so step `k − 1` ahead).'],
  takeaway: 'If one step of the process leaves a **smaller copy of the same problem**, express the answer recursively in terms of that copy.',
  video,
  videoArgs: [N, K],
  judge: {
    type: 'fn', fn: 'findTheWinner', params: ['int', 'int'], ret: 'int',
    tests: [{ args: [5, 2], out: 3 }, { args: [6, 5], out: 1 }, { args: [1, 1], out: 1 }, { args: [7, 3], out: 4 }],
    gen: (r) => { const n = r.int(1, 60); return [n, r.int(1, n)]; },
    ref: (n: number, k: number) => { const a = Array.from({ length: n }, (_, i) => i + 1); let i = 0; while (a.length > 1) { i = (i + k - 1) % a.length; a.splice(i, 1); } return a[0]; },
  },
};

export default problem;
