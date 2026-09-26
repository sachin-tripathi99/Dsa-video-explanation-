import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const N = 19;
const step = (x: number) => String(x).split('').reduce((s, d) => s + Number(d) ** 2, 0);
const happy = (n: number) => { const seen = new Set<number>(); while (n !== 1 && !seen.has(n)) { seen.add(n); n = step(n); } return n === 1; };

function video() {
  const v = new Video('happy-number', 'Happy Number');
  v.chapter('intro', 'The problem');
  const seq = [N];
  while (seq[seq.length - 1] !== 1) seq.push(step(seq[seq.length - 1]));
  v.array('s', seq, { label: 'replace n by the sum of the squares of its digits' });
  v.say(`Replace a number by the sum of the squares of its digits, and repeat. If you reach one, the number is happy. Otherwise the sequence loops forever without reaching one. Here ${words(N)} becomes one squared plus nine squared, eighty-two, and so on, until it reaches one.`);
  const bad = [2];
  while (bad.length < 10) bad.push(step(bad[bad.length - 1]));
  v.clear();
  v.array('b', bad, { label: 'n = 2 never reaches 1: it enters the loop 4 → 16 → 37 → … → 4' });
  v.say('Two is not happy. Its sequence falls into a loop, four, sixteen, thirty-seven, and back to four, and never reaches one. So the question is really: does this sequence reach one, or does it cycle?');

  v.chapter('brute', 'Brute force: remember every value seen', { cx: 'O(log n) steps · O(k) space', code: ['seen = set()', 'while n != 1 and n not in seen: seen.add(n); n = step(n)', 'return n == 1'] });
  v.eq('a repeat means a cycle that will never contain 1', 'ok').say('Store every value. If a value repeats, we are in a loop that does not contain one. This uses memory for the whole sequence.');

  v.chapter('optimal', "Optimal: Floyd's cycle detection on the sequence", { cx: 'O(log n) steps · O(1) space', code: ['slow = n; fast = step(n)', 'while fast != 1 and slow != fast:', '  slow = step(slow); fast = step(step(fast))', 'return fast == 1'] });
  v.clear();
  const vars = v.vars('v', { slow: 2, fast: step(2) });
  const t = v.table('t', ['slow', 'fast'], []);
  let s = 2;
  let f = step(2);
  v.say('The sequence is a linked list in disguise: each value points to the next one. Run the tortoise and the hare on n equals two, with no memory at all.');
  t.addRow([String(s), String(f)]);
  v.line(0).hold(700);
  while (f !== 1 && s !== f) {
    s = step(s);
    f = step(step(f));
    t.addRow([String(s), String(f)]).clearTones().tone(t.p.rows.length - 1, s === f ? 'bad' : 'active');
    vars.set({ slow: s, fast: f });
    v.line(2).eq(`slow → ${s}, fast → ${f}${s === f ? ' · meet at ' + s + ' ≠ 1 → not happy' : ''}`, s === f ? 'bad' : undefined).hold(600);
  }
  v.say(`They meet at ${words(s)}, which is not one, so two is not happy. For ${words(N)}, fast would reach one first and the answer would be true.`);
  v.answer(happy(N));

  recap(v, [{ name: 'Hash set of values', time: 'O(log n) per step', space: 'O(k)' }, { name: "Floyd's cycle detection", time: 'O(log n) per step', space: 'O(1)' }], 'Any “next value” function forms a linked list; Floyd finds its loop.', ['Repeated function application that may loop → fast / slow'], 'Fast and slow pointers work on any sequence where each value determines the next.');
  return v.build();
}

const problem: Problem = {
  slug: 'happy-number',
  statement: 'A **happy number** is defined by: starting with any positive integer, replace the number by the sum of the squares of its digits, and repeat until the number equals 1 (where it stays), or it loops endlessly in a cycle that does not include 1. Return `true` if `n` is happy.',
  examples: [{ input: 'n = 19', output: 'true', why: '1² + 9² = 82 → 68 → 100 → 1' }, { input: 'n = 2', output: 'false' }],
  constraints: ['1 ≤ n ≤ 2³¹ − 1'],
  hints: ['Either you reach 1 or you revisit a number.', 'Detect the loop without storing values.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Hash set of values', idea: 'Iterate; stop at 1 or at a repeated value.', time: 'O(log n) per step', space: 'O(k)', bottleneck: 'Stores the sequence.' },
    { id: 'optimal', kind: 'optimal', name: "Floyd's cycle detection", idea: 'slow = step(slow), fast = step(step(fast)); happy iff fast reaches 1.', time: 'O(log n) per step', space: 'O(1)' },
  ],
  takeaway: 'A sequence x → f(x) is an **implicit linked list**.',
  video,
  videoArgs: [N],
  judge: {
    type: 'fn', fn: 'isHappy', params: ['int'], ret: 'boolean',
    tests: [{ args: [19], out: true }, { args: [2], out: false }, { args: [1], out: true }, { args: [7], out: true }, { args: [2147483647], out: false }],
    gen: (r: Rng) => [r.int(1, 1000)],
    ref: (n: number) => happy(n),
  },
};

export default problem;
