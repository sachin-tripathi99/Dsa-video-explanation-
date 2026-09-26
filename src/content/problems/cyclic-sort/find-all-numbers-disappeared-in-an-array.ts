import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';

const A = [4, 3, 2, 7, 8, 2, 3, 1];
const gone = (a: number[]) => { const s = new Set(a); return Array.from({ length: a.length }, (_, i) => i + 1).filter((x) => !s.has(x)); };

function video() {
  const v = new Video('disappeared-numbers', 'Find All Numbers Disappeared in an Array');
  v.chapter('intro', 'The problem');
  v.array('a', A, { label: `n = ${A.length} · values in 1..n` });
  v.say(`The array has n numbers, each between one and n. Some appear twice and others not at all. Return every number from one to n that does not appear. Try for linear time and no extra space besides the output.`);
  v.eq(`missing: [${gone(A).join(', ')}]`);

  v.chapter('brute', 'Brute force: a hash set', { cx: 'O(n) · O(n) extra', code: ['seen = set(a)', 'return [x for x in 1..n if x not in seen]'] });
  v.eq('linear time, but a whole extra set', 'warn').say('A set of the values makes it easy, with n extra memory.');

  v.chapter('optimal', 'Optimal: cyclic sort, then read the misfits', { cx: 'O(n) · O(1) extra', code: ['i = 0; while i < n:', '  home = a[i] − 1', '  if a[i] != a[home]: swap(a[i], a[home]) else: i += 1', 'return [i + 1 for i if a[i] != i + 1]'] });
  v.clear();
  const a = v.array('a', [...A], { label: 'send each value to index value − 1' });
  const c = [...A];
  let i = 0;
  let told = 0;
  v.say('Use the array as its own hash table: send every value x to index x minus one. If that home already holds x, this copy is a duplicate, so leave it.');
  while (i < c.length) {
    const h = c[i] - 1;
    a.clearTones().ptr('i', i);
    for (let k = 0; k < c.length; k++) if (c[k] === k + 1) a.tone(k, 'ok');
    if (c[i] !== c[h]) {
      a.tone(i, 'active').tone(h, 'cmp');
      v.line(2).eq(`${c[i]} → index ${h}`);
      if (told === 0) { v.say(`Four goes to index three. Seven comes back and will be sent home next.`); told++; }
      else v.hold(420);
      [c[i], c[h]] = [c[h], c[i]];
      a.swap(i, h);
    } else {
      if (c[i] !== i + 1) { a.tone(i, 'bad'); v.line(2).eq(`${c[i]}'s home already holds ${c[i]} → duplicate, move on`, 'warn'); if (told === 1) { v.say(`This ${words(c[i])} finds its home already occupied by another ${words(c[i])}. It is a duplicate, so i moves on.`); told++; } else v.hold(420); }
      else v.hold(250);
      i++;
    }
  }
  a.noPtr().clearTones();
  const miss: number[] = [];
  c.forEach((x, k) => { if (x !== k + 1) { a.tone(k, 'bad'); miss.push(k + 1); } else a.tone(k, 'ok'); });
  a.subs(c.map((x, k) => (x !== k + 1 ? `needs ${k + 1}` : '')));
  v.line(3).eq(`misfit indices ${miss.map((x) => x - 1).join(', ')} → missing [${miss.join(', ')}]`, 'ok').say(`Now scan: indices ${miss.map((x) => words(x - 1)).join(' and ')} do not hold their own numbers, so ${miss.map(words).join(' and ')} never appeared.`);
  v.answer(gone(A));

  recap(v, [{ name: 'Hash set', time: 'O(n)', space: 'O(n)' }, { name: 'Cyclic sort (or sign marking)', time: 'O(n)', space: 'O(1) extra' }], 'Values 1..n → the array is its own hash table.', ['Values in 1..n + O(1) space → cyclic sort or sign marking'], 'Index-as-hash turns “which numbers are missing” into one scan for misfits.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-all-numbers-disappeared-in-an-array',
  statement: 'Given an array `nums` of `n` integers where `nums[i]` is in the range `[1, n]`, return an array of all the integers in the range `[1, n]` that do not appear in `nums`. Can you do it without extra space (the returned list does not count) and in O(n) time?',
  examples: [{ input: 'nums = [4,3,2,7,8,2,3,1]', output: '[5,6]' }, { input: 'nums = [1,1]', output: '[2]' }],
  constraints: ['1 ≤ n ≤ 10⁵', '1 ≤ nums[i] ≤ n'],
  hints: ['Value x belongs at index x − 1.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Hash set', idea: 'Collect values in a set; report absent 1..n.', time: 'O(n)', space: 'O(n)', bottleneck: 'Extra set.' },
    { id: 'optimal', kind: 'optimal', name: 'Cyclic sort', idea: 'Swap each value home (skip duplicates); indices with a[i] ≠ i + 1 are missing numbers.', time: 'O(n)', space: 'O(1) extra' },
  ],
  takeaway: 'Index as hash: **misfits = missing numbers**.',
  video,
  videoArgs: [A],
  judge: {
    type: 'fn', fn: 'findDisappearedNumbers', params: ['int[]'], ret: 'List<Integer>', cmp: 'sorted',
    tests: [{ args: [[4, 3, 2, 7, 8, 2, 3, 1]], out: [5, 6] }, { args: [[1, 1]], out: [2] }],
    gen: (r: Rng) => { const n = r.int(1, 10); return [r.ints(n, 1, n)]; },
    ref: (a: number[]) => gone(a),
  },
};

export default problem;
