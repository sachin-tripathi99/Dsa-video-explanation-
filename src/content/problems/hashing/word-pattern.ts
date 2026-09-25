import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const PAT = 'abba';
const S = 'dog cat cat dog';

function video() {
  const v = new Video('word-pattern', 'Word Pattern');
  v.chapter('intro', 'The problem');
  v.array('p', [...PAT], { label: 'pattern' });
  v.array('w', S.split(' '), { label: 's (words)' });
  v.say('Does the string follow the pattern? Each pattern letter must match exactly one word, and each word exactly one letter. It is isomorphic strings, with words instead of characters.');

  v.chapter('brute', 'Brute force: compare every pair of positions', { cx: 'O(n²)', code: ['for i < j:', '  (p[i] == p[j]) must equal (w[i] == w[j])'] });
  v.eq('n² pairs of positions').say('We can check every pair of positions: letters equal exactly when words are equal. That is n squared.');

  v.chapter('optimal', 'Optimal: two maps', { cx: 'O(n)', code: ['if len(words) != len(pattern): false', 'for c, w in zip(pattern, words):', '  if c→w or w→c conflicts: false', '  record both', 'true'] });
  v.clear();
  const words = S.split(' ');
  const pa = v.array('p', [...PAT], { label: 'pattern' });
  const wa = v.array('w', words, { label: 'words' });
  const m1 = v.map('pw', { label: 'letter → word' });
  const m2 = v.map('wp', { label: 'word → letter' });
  v.layout('grid');
  [...PAT].forEach((c, i) => {
    const w = words[i];
    const seen = m1.has(c);
    m1.put(c, w).clearTones().tone(c, seen ? 'ok' : 'active');
    m2.put(w, c).clearTones().tone(w, seen ? 'ok' : 'active');
    pa.clearTones().tone(i, 'active');
    wa.clearTones().tone(i, 'active');
    v.line(2).eq(seen ? `${c} → ${w} again ✓` : `new: ${c} ↔ ${w}`);
    if (i === 0) v.say('Map letters to words and words to letters, as we walk.');
    else if (i === 2) v.say('b appears again and maps to cat again. Consistent.');
    else v.hold(650);
  });
  v.eq('no conflicts → true', 'ok').say('No conflicts in either direction, so the string follows the pattern. Do not forget to check the lengths first.');
  v.answer(true);
  recap(v, [{ name: 'All pairs of positions', time: 'O(n²)', space: 'O(n)' }, { name: 'Two maps', time: 'O(n + total length)', space: 'O(n)' }], 'Same bijection idea as isomorphic strings.', ['Bijection → two maps', 'Different counts of letters and words → false immediately'], 'Recognising a problem as one you have solved before is half the battle. This is isomorphic strings in disguise.');
  return v.build();
}

const problem: Problem = {
  slug: 'word-pattern',
  statement: 'Given a `pattern` and a string `s` of words separated by single spaces, return `true` if `s` follows the pattern: there is a **one-to-one** mapping between pattern letters and words.',
  examples: [{ input: 'pattern = "abba", s = "dog cat cat dog"', output: 'true' }, { input: 'pattern = "abba", s = "dog cat cat fish"', output: 'false' }, { input: 'pattern = "aaaa", s = "dog cat cat dog"', output: 'false' }],
  constraints: ['1 ≤ pattern.length ≤ 300', '1 ≤ s.length ≤ 3000', 'single spaces, no leading/trailing spaces'],
  hints: ['This is Isomorphic Strings with words.', 'Check that the number of words equals the pattern length.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Compare all pairs', idea: 'For every pair of positions, letters are equal exactly when words are equal.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Quadratic pairs.' },
    { id: 'optimal', kind: 'optimal', name: 'Two maps', idea: 'Letter → word and word → letter; any conflict means false.', time: 'O(n + |s|)', space: 'O(n)' },
  ],
  pitfalls: ['Different number of words and letters.', 'Only checking one direction ("abba" vs "dog dog dog dog").'],
  takeaway: 'Spot the **same underlying problem**: bijection → two maps.',
  video,
  videoArgs: [PAT, S],
  judge: {
    type: 'fn', fn: 'wordPattern', params: ['String', 'String'], ret: 'boolean',
    tests: [{ args: ['abba', 'dog cat cat dog'], out: true }, { args: ['abba', 'dog cat cat fish'], out: false }, { args: ['aaaa', 'dog cat cat dog'], out: false }, { args: ['abba', 'dog dog dog dog'], out: false }, { args: ['aaa', 'aa aa aa aa'], out: false }],
    gen: (r) => { const n = r.int(1, 6); const vocab = ['x', 'yy', 'zz', 'x2']; return [r.str(n, 'ab'), Array.from({ length: r.chance(0.85) ? n : r.int(1, 6) }, () => r.pick(vocab)).join(' ')]; },
    ref: (p: string, s: string) => { const w = s.split(' '); if (w.length !== p.length) return false; for (let i = 0; i < w.length; i++) for (let j = i + 1; j < w.length; j++) if ((p[i] === p[j]) !== (w[i] === w[j])) return false; return true; },
  },
};

export default problem;
