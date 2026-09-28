import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { brow, ones } from '../../bitviz';

const XS = [16, 12];
const isPow = (n: number) => n > 0 && (n & (n - 1)) === 0;

function video() {
  const v = new Video('power-of-two', 'Power of Two');
  v.chapter('intro', 'The problem');
  v.say('Is n a power of two: one, two, four, eight, and so on?');
  v.eq('16 → true · 12 → false · 0 and negatives → false');

  v.chapter('brute', 'Brute force: keep dividing by two', { cx: 'O(log n)', code: ['if n ≤ 0: return false', 'while n % 2 == 0: n /= 2', 'return n == 1'] });
  v.eq('up to 31 divisions', 'warn').say('Halve n while it is even. A power of two ends at exactly one.');

  v.chapter('optimal', 'Optimal: exactly one bit is set', { cx: 'O(1)', code: ['return n > 0 and (n & (n − 1)) == 0'] });
  v.clear();
  const b = v.bits('b', []);
  v.line(0).say('A power of two in binary is a single one followed by zeros. Clearing the lowest one bit with n AND n minus one must then leave nothing.');
  for (const x of XS) {
    b.update({ rows: [brow(`n = ${x}`, x, 8, { tone: ones('ok') }), brow('n − 1', x - 1, 8), brow('n & (n−1)', x & (x - 1), 8, { note: isPow(x) ? '= 0 → true' : `= ${x & (x - 1)} → false`, tone: ones('bad') })] });
    v.line(0).eq(`${x} → ${isPow(x)}`, isPow(x) ? 'ok' : 'bad');
    v.say(isPow(x) ? 'Sixteen has a single one. Minus one flips it and fills ones below: the AND is zero. True.' : 'Twelve has two ones. Clearing the lowest still leaves eight: not a power of two.');
  }
  v.say('Remember the n greater than zero check: zero AND minus one is zero too, but zero is not a power of two.');
  v.answer(true);

  recap(v, [{ name: 'Divide by 2', time: 'O(log n)', space: 'O(1)' }, { name: 'n & (n − 1)', time: 'O(1)', space: 'O(1)' }], 'Power of two ⇔ n > 0 and a single set bit.', ['Powers of two → one set bit'], 'Guard n ≤ 0.');
  return v.build();
}

const problem: Problem = {
  slug: 'power-of-two',
  statement: 'Given an integer `n`, return `true` if it is a power of two, i.e. there exists an integer x with n = 2ˣ.',
  examples: [{ input: 'n = 1', output: 'true' }, { input: 'n = 16', output: 'true' }, { input: 'n = 3', output: 'false' }],
  constraints: ['−2³¹ ≤ n ≤ 2³¹ − 1'],
  hints: ['How many 1 bits does a power of two have?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Divide by 2', idea: 'Halve while even; check for 1.', time: 'O(log n)', space: 'O(1)', bottleneck: 'Loop.' },
    { id: 'optimal', kind: 'optimal', name: 'Bit trick', idea: 'n > 0 && (n & (n − 1)) == 0.', time: 'O(1)', space: 'O(1)' },
  ],
  takeaway: 'Exactly **one set bit**.',
  video,
  videoArgs: [16],
  judge: {
    type: 'fn', fn: 'isPowerOfTwo', params: ['int'], ret: 'boolean',
    tests: [{ args: [1], out: true }, { args: [16], out: true }, { args: [3], out: false }, { args: [0], out: false }, { args: [-16], out: false }, { args: [1073741824], out: true }, { args: [-2147483648], out: false }],
    gen: (r: Rng) => [r.chance(0.4) ? 2 ** r.int(0, 30) : r.int(-100, 5000)],
    ref: (n: number) => isPow(n),
  },
};

export default problem;
