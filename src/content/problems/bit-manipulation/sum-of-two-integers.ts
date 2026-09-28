import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { brow, ones } from '../../bitviz';

const A = 13, B = 11;

function video() {
  const v = new Video('sum-of-two-integers', 'Sum of Two Integers');
  const W = 6;
  v.chapter('intro', 'The problem');
  v.say('Add two integers without using the plus or minus operators.');
  v.eq(`${A} + ${B} = ${A + B}`);

  v.chapter('brute', 'Brute force: count up one at a time', { cx: 'O(|b|)', code: ['repeat |b| times: a = increment(a) using bit tricks'] });
  v.eq('up to 1000 increments', 'warn').say('Adding one at a time, where even the increment is done with bit operations, takes as many steps as the size of b.');

  v.chapter('optimal', 'Optimal: XOR adds, AND finds the carries', { cx: 'O(32)', code: ['while b ≠ 0:', '  carry = (a & b) << 1', '  a = a ^ b          (sum without carries)', '  b = carry', 'return a  (mask to 32 bits in Python)'] });
  v.clear();
  const bb = v.bits('b', [brow('a', A, W), brow('b', B, W)]);
  v.line(0).say('Column addition in binary: in each column, the sum digit is one when exactly one of the two bits is one, which is XOR. A carry appears where both are one, which is AND, and it moves one column left: a shift.');
  let a = A, b = B, step = 0;
  while (b) {
    const carry = (a & b) << 1;
    const sum = a ^ b;
    step++;
    bb.update({ rows: [brow('a', a, W), brow('b', b, W), brow('a ^ b', sum, W, { note: `= ${sum}`, tone: ones('ok') }), brow('(a & b) << 1', carry, W, { note: `= ${carry} carry`, tone: ones('warn') })] });
    v.line(1, 2, 3).counter(`round ${step}`).eq(`a = ${sum}, b = ${carry}`);
    if (step === 1) v.say(`XOR gives ${words(sum)}, the sum ignoring carries. AND marks the columns where both have a one, and shifting it left gives the carries: ${words(carry)}. Now we must add ${words(sum)} and ${words(carry)}: the same problem again, with the carries one column further left.`);
    else v.hold(900);
    a = sum; b = carry;
  }
  bb.update({ rows: [brow('a', a, W, { note: `= ${a}`, tone: ones('ok') }), brow('b', 0, W, { note: 'no carries left' })] });
  v.line(4).eq(`${A} + ${B} = ${a}`, 'ok').say(`When no carries remain, a holds the sum: ${words(a)}. Each round pushes the carries at least one position left, so at most thirty-two rounds. In Python, mask to thirty-two bits because its integers never overflow.`);
  v.answer(A + B);

  recap(v, [{ name: 'Increment |b| times', time: 'O(|b|)', space: 'O(1)' }, { name: 'XOR + carry loop', time: 'O(32)', space: 'O(1)' }], 'sum = a ^ b, carry = (a & b) << 1, repeat.', ['Arithmetic without + → XOR and AND with shifts'], 'Python needs a 32-bit mask for negatives.');
  return v.build();
}

const problem: Problem = {
  slug: 'sum-of-two-integers',
  statement: 'Given two integers `a` and `b`, return their sum without using the operators + and −.',
  examples: [{ input: 'a = 1, b = 2', output: '3' }, { input: 'a = 2, b = 3', output: '5' }],
  constraints: ['−1000 ≤ a, b ≤ 1000'],
  hints: ['XOR is addition without carry.', 'AND shifted left is the carry.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Repeated increment', idea: 'Move b toward 0, adjusting a by one each step (bitwise increments).', time: 'O(|b|)', space: 'O(1)', bottleneck: 'Linear in b.' },
    { id: 'optimal', kind: 'optimal', name: 'XOR and carry', idea: 'Repeat a ^ b and (a & b) << 1 until no carry.', time: 'O(32)', space: 'O(1)' },
  ],
  takeaway: '**XOR** sums, **AND << 1** carries.',
  video,
  videoArgs: [A, B],
  judge: {
    type: 'fn', fn: 'getSum', params: ['int', 'int'], ret: 'int',
    tests: [{ args: [1, 2], out: 3 }, { args: [2, 3], out: 5 }, { args: [-1, 1], out: 0 }, { args: [-12, -8], out: -20 }, { args: [A, B], out: A + B }],
    gen: (r: Rng) => [r.int(-1000, 1000), r.int(-1000, 1000)],
    ref: (a: number, b: number) => a + b,
  },
};

export default problem;
