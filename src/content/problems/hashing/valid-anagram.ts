import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'anagram';
const T = 'nagaram';

function video() {
  const v = new Video('valid-anagram', 'Valid Anagram');
  v.chapter('intro', 'The problem');
  v.array('s', [...S], { label: 's' });
  v.array('t', [...T], { label: 't' });
  v.say('Is t an anagram of s: the same letters, the same number of times, in any order?');

  v.chapter('brute', 'Sort both strings', { cx: 'O(n log n)', code: ['return sorted(s) == sorted(t)'] });
  v.clear();
  v.array('s', [...S].sort(), { label: 'sorted(s)' }).toneRange(0, S.length - 1, 'ok');
  v.array('t', [...T].sort(), { label: 'sorted(t)' }).toneRange(0, T.length - 1, 'ok');
  v.line(0).eq('a a a g m n r == a a a g m n r ✓', 'ok').say('Sorted anagrams are identical. Simple, but sorting costs n log n.');

  v.chapter('optimal', 'Count letters', { cx: 'O(n)', code: ['count = [0] * 26', 'for c in s: count[c]++', 'for c in t: count[c]−−', 'return all counts == 0'] });
  v.clear();
  const cnt = v.array('cnt', Array(26).fill(0), { label: 'count[a..z]', showIdx: false });
  cnt.subs('abcdefghijklmnopqrstuvwxyz'.split(''));
  const src = v.array('src', [...S], { label: 's: add' });
  [...S].forEach((c, i) => {
    const k = c.charCodeAt(0) - 97;
    cnt.set(k, (cnt.get(k) as number) + 1).clearTones().tone(k, 'active');
    src.clearTones().tone(i, 'active');
    v.line(1);
    if (i === 0) v.say('Count each letter of s, plus one each.');
    else v.hold(280);
  });
  src.setAll([...T]).label('t: subtract').clearTones();
  [...T].forEach((c, i) => {
    const k = c.charCodeAt(0) - 97;
    cnt.set(k, (cnt.get(k) as number) - 1).clearTones().tone(k, (cnt.get(k) as number) === 0 ? 'ok' : 'warn');
    src.clearTones().tone(i, 'active');
    v.line(2);
    if (i === 0) v.say('Then subtract for each letter of t.');
    else v.hold(280);
  });
  cnt.clearTones();
  v.line(3).eq('every count is 0 → anagram', 'ok').say('If everything is back to zero, both strings used exactly the same letters. Linear time, and only twenty-six counters.');
  v.answer(true);

  recap(v, [{ name: 'Sort both', time: 'O(n log n)', space: 'O(n)' }, { name: 'Letter counts', time: 'O(n)', space: 'O(1) (26 counters)' }], 'Counting avoids the sort.', ['Same multiset of characters → compare counts', 'Fixed alphabet → int[26] instead of a hash map'], 'Anagram means equal letter counts. Count, do not sort.');
  return v.build();
}

const problem: Problem = {
  slug: 'valid-anagram',
  statement: 'Given two strings `s` and `t`, return `true` if `t` is an **anagram** of `s` (the same letters with the same counts, possibly rearranged).',
  examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }, { input: 's = "rat", t = "car"', output: 'false' }],
  constraints: ['1 ≤ s.length, t.length ≤ 5 · 10⁴', 'lowercase English letters'],
  hints: ['What do two anagrams look like after sorting?', 'Can you compare letter counts instead?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort both strings', idea: 'Anagrams are equal after sorting.', time: 'O(n log n)', space: 'O(n)', bottleneck: 'Sorting is more than we need.' },
    { id: 'optimal', kind: 'optimal', name: 'Count letters', idea: 'Increment counts for `s`, decrement for `t`; all counts must end at zero. Check lengths first.', time: 'O(n)', space: 'O(1)' },
  ],
  pitfalls: ['Different lengths can never be anagrams: check first.'],
  takeaway: 'Anagram = **same letter counts**. Use an `int[26]` for a fixed alphabet.',
  video,
  videoArgs: [S, T],
  judge: {
    type: 'fn', fn: 'isAnagram', params: ['String', 'String'], ret: 'boolean',
    tests: [{ args: ['anagram', 'nagaram'], out: true }, { args: ['rat', 'car'], out: false }, { args: ['a', 'ab'], out: false }],
    gen: (r) => { const s = r.str(r.int(1, 8), 'abc'); return [s, r.chance(0.5) ? r.shuffle([...s]).join('') : r.str(r.int(1, 8), 'abc')]; },
    ref: (s: string, t: string) => [...s].sort().join('') === [...t].sort().join(''),
  },
};

export default problem;
