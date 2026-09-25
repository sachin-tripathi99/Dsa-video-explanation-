import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'paper';
const T = 'title';

function video() {
  const v = new Video('isomorphic', 'Isomorphic Strings');
  v.chapter('intro', 'The problem');
  const a = v.array('s', [...S], { label: 's' });
  const b = v.array('t', [...T], { label: 't' });
  v.say('Two strings are isomorphic if you can replace each character of s with a character of t, consistently, to get t. No two different characters may map to the same one.');
  v.eq('p→t, a→i, e→l, r→e ✓');

  v.chapter('brute', 'Brute force: compare every pair of positions', { cx: 'O(n²)', code: ['for i, j pairs:', '  (s[i] == s[j]) must equal (t[i] == t[j])'] });
  a.tone([0, 2], 'cmp');
  b.tone([0, 2], 'cmp');
  v.line(1).eq('s[0] == s[2] and t[0] == t[2] ✓', 'ok').say('One way: for every pair of positions, s has equal characters exactly when t does. Correct, but n squared pairs.');
  a.clearTones();
  b.clearTones();

  v.chapter('optimal', 'Optimal: two maps, both directions', { cx: 'O(n)', code: ['for i in 0..n-1:', '  if s→t has s[i] and it is not t[i]: false', '  if t→s has t[i] and it is not s[i]: false', '  record s[i]→t[i] and t[i]→s[i]', 'return true'] });
  const m1 = v.map('st', { label: 's → t' });
  const m2 = v.map('ts', { label: 't → s' });
  v.layout('grid');
  [...S].forEach((c, i) => {
    const d = T[i];
    a.clearTones().ptr('i', i).tone(i, 'active');
    b.clearTones().ptr('i', i).tone(i, 'active');
    const had = m1.has(c);
    m1.put(c, d).clearTones().tone(c, had ? 'ok' : 'active');
    m2.put(d, c).clearTones().tone(d, had ? 'ok' : 'active');
    v.line(had ? 1 : 3).eq(had ? `${c} already maps to ${d} ✓` : `new pair ${c} → ${d}`);
    if (i === 0) v.say('Walk both strings together, recording the mapping in both directions.');
    else if (i === 2) v.say('p appears again, and it already maps to t. t is exactly what we see. Consistent.');
    else v.hold(650);
  });
  v.eq('all consistent → true', 'ok');
  v.say('Why two maps? With only s to t, the strings b a d c and b a b a would pass: b goes to b, a to a, d to b. But then two characters map to b. The reverse map catches that.');
  v.answer(true);

  recap(v, [{ name: 'Compare all pairs', time: 'O(n²)', space: 'O(1)' }, { name: 'Two hash maps', time: 'O(n)', space: 'O(k)' }], 'k is the alphabet size. Checking both directions makes the mapping one-to-one.', ['One-to-one mapping → check both directions', 'Consistent mapping as you scan → hash map'], 'Bijections need two maps, one for each direction.');
  return v.build();
}

const problem: Problem = {
  slug: 'isomorphic-strings',
  statement: 'Two strings `s` and `t` are **isomorphic** if the characters of `s` can be replaced to get `t`: every occurrence of a character is replaced by the same character, and no two different characters map to the same character (a character may map to itself). Return whether `s` and `t` are isomorphic.',
  examples: [
    { input: 's = "egg", t = "add"', output: 'true' },
    { input: 's = "foo", t = "bar"', output: 'false', why: 'o would need to map to both a and r.' },
    { input: 's = "paper", t = "title"', output: 'true' },
  ],
  constraints: ['1 ≤ s.length ≤ 5 · 10⁴', 't.length == s.length', 'any ASCII characters'],
  hints: ['Record which character each character of s maps to.', 'Is one map enough? Try s = "badc", t = "baba".'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Compare all pairs of positions', idea: 'For every pair `i < j`, check `(s[i] == s[j]) == (t[i] == t[j])`.', time: 'O(n²)', space: 'O(1)', bottleneck: 'n² pairs.' },
    { id: 'optimal', kind: 'optimal', name: 'Two maps', idea: 'Keep `s→t` and `t→s`. For each position, both existing mappings must agree with the current pair; otherwise record the new pair.', time: 'O(n)', space: 'O(k)' },
  ],
  pitfalls: ['Checking only one direction: "badc" / "baba" would wrongly pass.'],
  takeaway: 'A **one-to-one** mapping needs to be checked **in both directions**.',
  video,
  videoArgs: [S, T],
  judge: {
    type: 'fn', fn: 'isIsomorphic', params: ['String', 'String'], ret: 'boolean',
    tests: [{ args: ['egg', 'add'], out: true }, { args: ['foo', 'bar'], out: false }, { args: ['paper', 'title'], out: true }, { args: ['badc', 'baba'], out: false }, { args: ['ab', 'aa'], out: false }],
    gen: (r) => { const n = r.int(1, 10); return [r.str(n, 'abc'), r.str(n, 'xyz')]; },
    ref: (s: string, t: string) => { for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) if ((s[i] === s[j]) !== (t[i] === t[j])) return false; return true; },
  },
};

export default problem;
