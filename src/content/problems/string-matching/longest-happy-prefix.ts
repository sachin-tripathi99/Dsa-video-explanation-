import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { lpsViz } from '../../kmpviz';

const S = 'abacabab';
function happy(s: string) { for (let len = s.length - 1; len > 0; len--) if (s.slice(0, len) === s.slice(s.length - len)) return s.slice(0, len); return ''; }
const spell = (s: string) => s.split('').join(' ');

function video() {
  const v = new Video('longest-happy-prefix', 'Longest Happy Prefix');
  const n = S.length;
  const ans = happy(S);
  v.chapter('intro', 'The problem');
  const a0 = v.array('s', [...S], { label: 's' });
  v.say('A happy prefix is a non-empty prefix that is also a suffix, but not the whole string. Return the longest one, or an empty string.');
  a0.toneRange(0, ans.length - 1, 'ok').toneRange(n - ans.length, n - 1, 'ok');
  v.eq(`“${ans}” starts and ends s`, 'ok').hold(900);

  v.chapter('brute', 'Brute force: try every length, longest first', { cx: 'O(n²)', code: ['for len = n − 1 down to 1:', '  if s[0 : len] == s[n − len :]:', '    return s[0 : len]', 'return ""'] });
  v.clear();
  const tb = v.table('tb', ['len', 'prefix', 'suffix', 'equal?'], []);
  for (let len = n - 1; len >= ans.length && len > 0; len--) {
    const pre = S.slice(0, len), suf = S.slice(n - len), ok = pre === suf;
    tb.addRow([String(len), pre, suf, ok ? 'yes' : 'no']);
    v.line(ok ? 2 : 1).eq(`len ${len}: ${pre} ${ok ? '=' : '≠'} ${suf}`, ok ? 'ok' : 'bad');
    if (len === n - 1) v.say(`Start with the longest candidate, length ${words(len)}, and compare the prefix with the suffix of the same length. They differ.`);
    else if (ok) v.say(`Length ${words(len)} finally matches. Each comparison can cost up to n, and there can be n of them: order n squared.`);
    else v.hold(650);
  }

  v.chapter('better', 'Better: compare hashes that grow by one letter', { cx: 'O(n)', code: ['pre = pre · B + s[k − 1]', 'suf = s[n − k] · Bᵏ⁻¹ + suf', 'pre == suf → best = k'] });
  v.clear();
  const val = (c: string) => c.charCodeAt(0) - 96;
  const hb = v.table('hb', ['k', 'prefix', 'hash', 'suffix', 'hash', 'equal?'], []);
  let pre = 0, suf = 0, best = 0;
  for (let k = 1; k < n; k++) {
    pre = pre * 10 + val(S[k - 1]);
    suf = val(S[n - k]) * 10 ** (k - 1) + suf;
    const ok = pre === suf;
    if (ok) best = k;
    hb.addRow([String(k), S.slice(0, k), String(pre), S.slice(n - k), String(suf), ok ? 'yes' : 'no']);
    v.line(ok ? 2 : 0, 1).eq(`k = ${k}: ${pre} ${ok ? '=' : '≠'} ${suf}`, ok ? 'ok' : undefined);
    if (k === 1) v.say('Instead of comparing strings, compare numbers. Give each letter a digit, a is one, b is two, c is three, and read strings in base ten. Growing the prefix appends a digit on the right: times ten, plus the new letter.');
    else if (k === 2) v.say('Growing the suffix puts a new digit in front: add the new letter times ten to the power k minus one. Both updates are constant work. At length two the numbers agree: a b equals a b.');
    else v.hold(700);
  }
  v.eq(`best = ${best} → “${S.slice(0, best)}”`, 'ok').say('Real code uses a base like one hundred thirty-one and takes everything modulo a large prime, so the numbers stay small. Rare collisions are the price, which is why the next approach is safer.');

  v.chapter('optimal', 'Optimal: the last value of the lps table', { cx: 'O(n)', code: ['lps = failure table of s', 'return s[0 : lps[n − 1]]'] });
  v.clear();
  const o = v.array('s', [...S], { label: 's' });
  const L = lpsViz(v, o, S, {
    lines: { match: [0], fall: [0], zero: [0] },
    name: 's',
    hold: 480,
    say: (e) => {
      if (e.kind === 'zero' && e.i === 1) return 'The value lps of i is exactly the length of the longest happy prefix of the first i plus one characters. So build the table, and read its last cell.';
      if (e.kind === 'fall' && e.i === n - 1) return `The last character, ${S[e.i]}, cannot extend the border ${spell(S.slice(0, e.from))}. Fall back to its own border, length ${words(e.len)}, and try again.`;
      return undefined;
    },
  });
  o.toneRange(0, L[n - 1] - 1, 'ok').toneRange(n - L[n - 1], n - 1, 'ok');
  v.line(1).eq(`lps[${n - 1}] = ${L[n - 1]} → “${S.slice(0, L[n - 1])}”`, 'ok').say(`The last cell is ${words(L[n - 1])}, so the answer is ${spell(ans)}. No hashing, no collisions, linear time.`);
  v.answer(ans);

  recap(v, [{ name: 'Every length', time: 'O(n²)', space: 'O(n)' }, { name: 'Rolling hash', time: 'O(n)', space: 'O(1)' }, { name: 'lps[n − 1]', time: 'O(n)', space: 'O(n)' }], 'The longest border of s is lps[n − 1].', ['“Prefix that is also a suffix” → lps'], 'Hash solutions can collide; KMP is exact.');
  return v.build();
}

const problem: Problem = {
  slug: 'longest-happy-prefix',
  statement: 'A string is called a happy prefix if it is a non-empty prefix which is also a suffix (excluding itself). Given a string `s`, return the longest happy prefix of `s`. Return an empty string "" if no such prefix exists.',
  examples: [{ input: 's = "level"', output: '"l"' }, { input: 's = "ababab"', output: '"abab"' }],
  constraints: ['1 ≤ s.length ≤ 10⁵', 's contains only lowercase English letters'],
  hints: ['This is exactly the last value of the KMP failure table.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every length', idea: 'Compare prefix and suffix for each length, longest first.', time: 'O(n²)', space: 'O(n)', bottleneck: 'Each comparison is O(n).' },
    { id: 'better', kind: 'better', name: 'Rolling hash', idea: 'Grow prefix and suffix hashes by one letter each step.', time: 'O(n)', space: 'O(1)', bottleneck: 'Possible collisions.' },
    { id: 'optimal', kind: 'optimal', name: 'KMP lps', idea: 'Answer is s[0 : lps[n − 1]].', time: 'O(n)', space: 'O(n)' },
  ],
  takeaway: 'Longest border = **lps[n − 1]**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'longestPrefix', params: ['String'], ret: 'String',
    tests: [{ args: ['level'], out: 'l' }, { args: ['ababab'], out: 'abab' }, { args: ['a'], out: '' }, { args: [S], out: 'ab' }, { args: ['aaaa'], out: 'aaa' }, { args: ['abcd'], out: '' }, { args: ['ab'.repeat(20000)], out: 'ab'.repeat(19999), big: true }],
    gen: (r: Rng) => [r.str(r.int(1, 12), 'ab')],
    ref: (s: string) => happy(s),
  },
};

export default problem;
