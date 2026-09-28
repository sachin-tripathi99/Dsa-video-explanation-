import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { brow, ones } from '../../bitviz';

const A = [4, 1, 2, 1, 2];
const single = (a: number[]) => a.reduce((x, y) => x ^ y, 0);

function video() {
  const v = new Video('single-number', 'Single Number');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: 'nums' });
  v.say('Every number appears exactly twice, except one number that appears once. Find it, in linear time and constant extra space.');
  v.eq(`answer: ${single(A)}`);

  v.chapter('brute', 'Brute force: count each number', { cx: 'O(n²) or O(n) with O(n) space', code: ['for each x: count how often x appears', 'return the x with count 1'] });
  v.eq('nested scan O(n²), or a hash map with O(n) memory', 'bad').say('Counting occurrences with a nested loop is quadratic; a hash map makes it linear but costs memory proportional to n.');

  v.chapter('better', 'Better: a set that toggles', { cx: 'O(n) time, O(n) space', code: ['seen = set()', 'x in seen → remove it, else add it', 'the one left is the answer'] });
  v.eq('pairs cancel in the set', 'warn').say('Add a number the first time, remove it the second. Pairs cancel out and only the loner remains. Still linear memory.');

  v.chapter('optimal', 'Optimal: XOR everything', { cx: 'O(n) time, O(1) space', code: ['result = 0', 'for x in nums: result ^= x', 'return result'] });
  v.clear();
  const arr = v.array('a', A, { label: 'nums' });
  const b = v.bits('b', [brow('result', 0, 4, { note: '= 0' })]);
  v.line(0).say('The toggling set can be replaced by XOR. XOR flips the bits of the running result: adding a number once turns its bits on, adding it again turns them back off.');
  let r = 0;
  A.forEach((x, i) => {
    r ^= x;
    arr.clearTones().tone(i, 'active');
    b.update({ rows: [brow(`^ ${x}`, x, 4, { tone: ones('cmp') }), brow('result', r, 4, { note: `= ${r}`, tone: ones('ok') })] });
    v.line(1).eq(`result ^= ${x} → ${r}`);
    if (i === 2) v.say('After four, one and two, the result holds all three: seven.');
    else if (i === 4) v.say('The second one and the second two switch their bits back off, leaving four.');
    else v.hold(700);
  });
  arr.clearTones().tone(A.indexOf(r), 'ok');
  v.line(2).eq(`answer = ${r}`, 'ok').say(`The single number is ${words(r)}, with one variable of memory.`);
  v.answer(single(A));

  recap(v, [{ name: 'Count each number', time: 'O(n²)', space: 'O(1)' }, { name: 'Toggle set', time: 'O(n)', space: 'O(n)' }, { name: 'XOR all', time: 'O(n)', space: 'O(1)' }], 'x ^ x = 0: pairs cancel.', ['Everything twice except one → XOR'], 'XOR order does not matter.');
  return v.build();
}

const problem: Problem = {
  slug: 'single-number',
  statement: 'Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one, in linear time and constant extra space.',
  examples: [{ input: 'nums = [2,2,1]', output: '1' }, { input: 'nums = [4,1,2,1,2]', output: '4' }, { input: 'nums = [1]', output: '1' }],
  constraints: ['1 ≤ nums.length ≤ 3 · 10⁴', '−3 · 10⁴ ≤ nums[i] ≤ 3 · 10⁴'],
  hints: ['What is x XOR x?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count each', idea: 'Nested loop counting occurrences.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Quadratic.' },
    { id: 'better', kind: 'better', name: 'Toggle set', idea: 'Add on first sight, remove on second.', time: 'O(n)', space: 'O(n)', bottleneck: 'Linear memory.' },
    { id: 'optimal', kind: 'optimal', name: 'XOR', idea: 'XOR all numbers; pairs cancel.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: '**XOR** cancels pairs.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'singleNumber', params: ['int[]'], ret: 'int',
    tests: [{ args: [[2, 2, 1]], out: 1 }, { args: [A], out: 4 }, { args: [[1]], out: 1 }, { args: [[-3, 5, -3]], out: 5 }],
    gen: (r: Rng) => { const k = r.int(0, 6); const vals = r.distinct(k + 1, -50, 50); const a = [...vals.slice(0, k), ...vals.slice(0, k), vals[k]]; return [r.shuffle(a)]; },
    ref: (a: number[]) => single(a),
  },
};

export default problem;
