import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const F = [1, 2, 3, 2, 2, 3, 1];

function total(f: number[]) {
  const cnt = new Map<number, number>();
  let l = 0, b = 0;
  for (let r = 0; r < f.length; r++) {
    cnt.set(f[r], (cnt.get(f[r]) ?? 0) + 1);
    while (cnt.size > 2) { cnt.set(f[l], cnt.get(f[l])! - 1); if (cnt.get(f[l]) === 0) cnt.delete(f[l]); l++; }
    b = Math.max(b, r - l + 1);
  }
  return b;
}

function video() {
  const v = new Video('fruit-into-baskets', 'Fruit Into Baskets');
  v.chapter('intro', 'The problem');
  v.array('f', F, { label: 'fruit type on each tree' });
  v.say('Trees stand in a row, each with one type of fruit. You have two baskets, and each basket holds one type. Starting at any tree, you pick one fruit from every tree moving right, and stop when a third type appears. What is the most fruit you can pick?');
  v.eq('rephrase: longest window with at most 2 distinct values', 'ok');

  v.chapter('brute', 'Brute force: every start', { cx: 'O(n²)', code: ['for i: types = {}', '  for j from i: add f[j]; stop when 3 types'] });
  v.eq('restart from every tree', 'warn').say('Trying every start is n squared.');

  v.chapter('optimal', 'Optimal: window with at most two types', { cx: 'O(n)', code: ['count = {}', 'for r: count[f[r]] += 1', '  while len(count) > 2:', '    count[f[l]] −= 1; drop the type at 0; l += 1', '  best = max(best, r − l + 1)'] });
  v.clear();
  const a = v.array('f', F, { label: 'trees' });
  const m = v.map('cnt', { label: 'types in the baskets → count' });
  const cnt = new Map<number, number>();
  let l = 0;
  let b = 0;
  let told = false;
  v.say('Keep a count of each fruit type in the window. When a third type enters, shrink from the left until one type disappears completely.');
  for (let r = 0; r < F.length; r++) {
    cnt.set(F[r], (cnt.get(F[r]) ?? 0) + 1);
    m.put(F[r], cnt.get(F[r])!).clearTones().tone(F[r], 'active');
    a.clearTones().tone(r, 'ok').win(l, r, 'win');
    if (cnt.size > 2) {
      v.line(2).eq(`${cnt.size} types → shrink`, 'bad');
      if (!told) { v.say('Type three is a third type. Shrink: the one on the left leaves, and type one disappears, so we are back to two types.'); told = true; }
      else v.hold(500);
      while (cnt.size > 2) {
        cnt.set(F[l], cnt.get(F[l])! - 1);
        if (cnt.get(F[l]) === 0) { cnt.delete(F[l]); m.del(F[l]); } else m.put(F[l], cnt.get(F[l])!);
        l++;
      }
      a.win(l, r, 'win');
    }
    b = Math.max(b, r - l + 1);
    v.line(4).counter(`best: ${b}`).eq(`window [${F.slice(l, r + 1).join(', ')}] → ${r - l + 1} fruits`);
    v.hold(500);
  }
  a.clearTones().noWin();
  v.eq(`best = ${b}`, 'ok').say(`The best run is ${b} fruits: two, three, two, two, three.`);
  v.answer(total(F));

  recap(v, [{ name: 'Every start', time: 'O(n²)', space: 'O(1)' }, { name: 'Window, at most 2 distinct', time: 'O(n)', space: 'O(1)' }], 'Longest window with at most k distinct values.', ['“At most k distinct” → count map, shrink when the map has k + 1 keys'], 'Strip the story away: it is the longest window with at most two distinct values.');
  return v.build();
}

const problem: Problem = {
  slug: 'fruit-into-baskets',
  statement: 'You visit a row of fruit trees; `fruits[i]` is the type of fruit tree `i` produces. You have **two** baskets, each holding only one type (unlimited amount). Starting from any tree, you must pick exactly one fruit from every tree while moving right, stopping when a fruit does not fit in your baskets. Return the maximum number of fruits you can pick.',
  examples: [{ input: 'fruits = [1,2,1]', output: '3' }, { input: 'fruits = [0,1,2,2]', output: '3' }, { input: 'fruits = [1,2,3,2,2]', output: '4' }],
  constraints: ['1 ≤ n ≤ 10⁵', '0 ≤ fruits[i] < n'],
  hints: ['What subarrays are allowed?', 'Longest subarray with at most 2 distinct values.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every start', idea: 'For each start, extend until a third type appears.', time: 'O(n²)', space: 'O(1)', bottleneck: 'Restarts.' },
    { id: 'optimal', kind: 'optimal', name: 'Sliding window', idea: 'Count types in the window; shrink while more than 2 types; track the longest window.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Story problems hide templates: this is **at most 2 distinct**.',
  video,
  videoArgs: [F],
  judge: {
    type: 'fn', fn: 'totalFruit', params: ['int[]'], ret: 'int',
    tests: [{ args: [[1, 2, 1]], out: 3 }, { args: [[0, 1, 2, 2]], out: 3 }, { args: [[1, 2, 3, 2, 2]], out: 4 }, { args: [[3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]], out: 5 }],
    gen: (r: Rng) => [r.ints(r.int(1, 14), 0, 3)],
    ref: (f: number[]) => total(f),
  },
};

export default problem;
