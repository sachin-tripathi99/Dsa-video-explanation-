import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'cbaebabacd';
const P = 'abc';

function anagrams(s: string, p: string) {
  const k = p.length;
  const key = (x: string) => [...x].sort().join('');
  const want = key(p);
  const out: number[] = [];
  for (let i = 0; i + k <= s.length; i++) if (key(s.slice(i, i + k)) === want) out.push(i);
  return out;
}

function video() {
  const v = new Video('find-all-anagrams', 'Find All Anagrams in a String');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: `s · p = "${P}"` });
  v.say('Return every start index in s where an anagram of p begins. An anagram uses the same letters the same number of times.');

  v.chapter('brute', 'Brute force: sort every window', { cx: 'O(n · k log k)', code: ['for i in 0..n−k: if sorted(s[i..i+k−1]) == sorted(p): record i'] });
  v.eq('re-sorting overlapping windows', 'warn').say('Sorting each window of length three works but repeats work.');

  v.chapter('optimal', 'Optimal: sliding counts with a match counter', { cx: 'O(n)', code: ['need = counts of p; matches = letters whose counts already agree', 'for r: add s[r], update matches', '  if r >= k: remove s[r − k], update matches', '  if matches == 26: record r − k + 1'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: `p = "${P}"` });
  const res = v.array('res', [], { label: 'start indices found' });
  const need = new Map<string, number>();
  for (const c of P) need.set(c, (need.get(c) ?? 0) + 1);
  const have = new Map<string, number>();
  const k = P.length;
  v.say('Slide a window of length three with letter counts, exactly like Permutation in String. This time, instead of stopping at the first match, record every window whose counts match.');
  let firstHit = true;
  for (let r = 0; r < S.length; r++) {
    have.set(S[r], (have.get(S[r]) ?? 0) + 1);
    if (r >= k) have.set(S[r - k], have.get(S[r - k])! - 1);
    if (r < k - 1) continue;
    const letters = new Set([...need.keys(), ...have.keys()]);
    const eq = [...letters].every((c) => (need.get(c) ?? 0) === (have.get(c) ?? 0));
    const i = r - k + 1;
    a.clearTones().win(i, r, eq ? 'ok' : 'win');
    if (eq) res.push(i).tone(res.length - 1, 'ok');
    v.line(3).eq(`window "${S.slice(i, r + 1)}" ${eq ? `→ anagram at ${i}` : ''}`, eq ? 'ok' : undefined);
    if (eq && firstHit) { v.say(`The first window, c, b, a, is an anagram of a, b, c. Record index ${i}.`); firstHit = false; }
    else if (eq) v.say(`b, a, c at index ${i} is another anagram. Record it.`);
    else v.hold(500);
  }
  a.noWin();
  const out = anagrams(S, P);
  v.eq(`[${out.join(', ')}]`, 'ok').say('A faster check keeps a counter of how many letters currently have the right count, so each slide costs constant time, not twenty-six compares.');
  v.answer(out);

  recap(v, [{ name: 'Sort every window', time: 'O(n · k log k)', space: 'O(k)' }, { name: 'Sliding counts', time: 'O(n)', space: 'O(26)' }], 'Same as Permutation in String, but collect every match.', ['All anagram positions → fixed window + counts'], 'Fixed window plus counts finds every anagram position in one pass.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-all-anagrams-in-a-string',
  statement: 'Given two strings `s` and `p`, return an array of all the start indices of `p`’s anagrams in `s`, in any order.',
  examples: [{ input: 's = "cbaebabacd", p = "abc"', output: '[0,6]' }, { input: 's = "abab", p = "ab"', output: '[0,1,2]' }],
  constraints: ['1 ≤ s.length, p.length ≤ 3 · 10⁴', 'lowercase letters'],
  hints: ['This is Permutation in String, reporting every match.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Sort every window', idea: 'Compare sorted windows with sorted p.', time: 'O(n · k log k)', space: 'O(k)', bottleneck: 'Re-sorting.' },
    { id: 'optimal', kind: 'optimal', name: 'Sliding counts + match counter', idea: 'Track counts and how many of the 26 letters agree with p; record r − k + 1 when all 26 agree.', time: 'O(n)', space: 'O(26)' },
  ],
  takeaway: 'Fixed window + **count matching**, reporting every hit.',
  video,
  videoArgs: [S, P],
  judge: {
    type: 'fn', fn: 'findAnagrams', params: ['String', 'String'], ret: 'List<Integer>', cmp: 'sorted',
    tests: [{ args: ['cbaebabacd', 'abc'], out: [0, 6] }, { args: ['abab', 'ab'], out: [0, 1, 2] }, { args: ['a', 'ab'], out: [] }],
    gen: (r: Rng) => [r.str(r.int(1, 12), 'abc'), r.str(r.int(1, 3), 'abc')],
    ref: (s: string, p: string) => anagrams(s, p),
  },
};

export default problem;
