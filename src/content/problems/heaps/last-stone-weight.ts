import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const S = [2, 7, 4, 1, 8, 1];

function video() {
  const v = new Video('last-stone', 'Last Stone Weight');
  v.chapter('intro', 'The problem');
  v.array('s', S, { label: 'stone weights', bars: true });
  v.say('Each turn, smash the two heaviest stones together. If they are equal, both are destroyed. Otherwise the lighter one is destroyed and the heavier one loses that much weight. Return the weight of the last stone, or zero.');

  v.chapter('brute', 'Brute force: sort every turn', { cx: 'O(n² log n)', code: ['while more than one stone:', '  sort; take the two largest; put back the difference'] });
  v.eq('re-sorting n times').say('We could sort before every smash to find the two heaviest. Sorting each turn is n log n, repeated up to n times.');

  v.chapter('optimal', 'Optimal: a max-heap', { cx: 'O(n log n)', code: ['heap = max-heap of stones', 'while size > 1:', '  y = pop(); x = pop()', '  if y != x: push(y − x)', 'return top or 0'] });
  v.clear();
  const h = v.heap('h', { label: 'max-heap', min: false });
  S.forEach((x) => h.push(x));
  v.line(0).say('A max-heap always hands us the heaviest stone in O of log n.');
  let first = true;
  while (h.size > 1) {
    const y = h.pop() as number;
    const x = h.pop() as number;
    v.line(2).eq(`smash ${y} and ${x}`);
    if (y !== x) {
      h.push(y - x, false);
      const idx = h.values.indexOf(y - x);
      h.clearTones().tone(idx, 'warn');
      v.line(3).eq(`${y} − ${x} = ${y - x} goes back`, 'warn');
    } else {
      h.clearTones();
      v.eq(`${y} = ${x} → both destroyed`, 'bad');
    }
    if (first) v.say('Pop the two heaviest, eight and seven. They differ, so a stone of weight one goes back into the heap.');
    else v.hold(900);
    first = false;
  }
  const last = h.size ? (h.peek() as number) : 0;
  h.clearTones().tone(0, 'ok');
  v.line(4).eq(`last stone: ${last}`, 'ok').say(`Each smash is a few heap operations, O of log n, and there are at most n smashes: O of n log n. The last stone weighs ${last}.`);
  v.answer(last);
  recap(v, [{ name: 'Sort every turn', time: 'O(n² log n)', space: 'O(n)' }, { name: 'Max-heap', time: 'O(n log n)', space: 'O(n)' }], 'The heap gives the two heaviest instantly and accepts the leftover.', ['Repeatedly take the largest while adding new items → heap'], 'Repeatedly taking the best item while new items arrive is exactly what heaps are for.');
  return v.build();
}

const problem: Problem = {
  slug: 'last-stone-weight',
  statement: 'You have stones with weights `stones[i]`. Each turn, take the two heaviest stones `y ≥ x` and smash them: if `x == y` both are destroyed; otherwise `x` is destroyed and `y` becomes `y − x`. Return the weight of the last remaining stone, or `0` if none remain.',
  examples: [{ input: 'stones = [2,7,4,1,8,1]', output: '1' }, { input: 'stones = [1]', output: '1' }],
  constraints: ['1 ≤ stones.length ≤ 30', '1 ≤ stones[i] ≤ 1000'],
  hints: ['You need the two largest repeatedly, and new stones keep appearing.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort every turn', idea: 'Sort, smash the last two, put the remainder back, repeat.', time: 'O(n² log n)', space: 'O(n)', bottleneck: 'Full re-sort after every smash.' },
    { id: 'optimal', kind: 'optimal', name: 'Max-heap', idea: 'Pop two, push the difference if non-zero, until at most one stone remains.', time: 'O(n log n)', space: 'O(n)' },
  ],
  takeaway: 'Repeatedly need the **largest** while items change → **max-heap**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'lastStoneWeight', params: ['int[]'], ret: 'int',
    tests: [{ args: [[2, 7, 4, 1, 8, 1]], out: 1 }, { args: [[1]], out: 1 }, { args: [[3, 3]], out: 0 }],
    gen: (r) => [r.ints(r.int(1, 15), 1, 30)],
    ref: (s: number[]) => { const a = [...s]; while (a.length > 1) { a.sort((x, y) => x - y); const y = a.pop()!; const x = a.pop()!; if (y !== x) a.push(y - x); } return a[0] ?? 0; },
  },
};

export default problem;
