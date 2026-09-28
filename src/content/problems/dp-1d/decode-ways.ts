import type { Problem, Rng } from '../../types';
import { Video, recap, words } from '../../helpers';
import { callTree, fill1D } from '../../dpviz';

const S = '11106';
function tbl(s: string) { const n = s.length; const d = Array(n + 1).fill(0); d[0] = 1; for (let i = 1; i <= n; i++) { if (s[i - 1] !== '0') d[i] += d[i - 1]; if (i > 1) { const two = Number(s.slice(i - 2, i)); if (s[i - 2] !== '0' && two <= 26) d[i] += d[i - 2]; } } return d; }
function decode(s: string) { return tbl(s)[s.length]; }

function video() {
  const v = new Video('decode-ways', 'Decode Ways');
  const n = S.length;
  const d = tbl(S);
  const one = (i: number) => S[i - 1] !== '0';
  const two = (i: number) => i > 1 && S[i - 2] !== '0' && Number(S.slice(i - 2, i)) <= 26;
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say('Letters are encoded as numbers: A is one, B is two, up to Z, twenty-six. Given a string of digits, count the ways to decode it.');
  v.eq(`"${S}" → ${decode(S)} ways: 1 1 10 6 (AAJF) and 11 10 6 (KJF)`);
  v.say('Zeros make it tricky: a zero can never stand alone, and "06" is not a valid code. So the ten must be read as ten, which forces how the ones before it are grouped.');

  v.chapter('brute', 'Brute force: take one digit or two, recursively', { cx: 'O(2ⁿ)', code: ['count(i): ways to decode s[i:]', '  if i == n: return 1; if s[i] == "0": return 0', '  ways = count(i + 1)', '  if s[i:i+2] ≤ "26": ways += count(i + 2)'] });
  v.clear();
  const r = callTree<number>(v, 'rt', `calls for "${S}"`, 0, {
    kids: (i) => { if (i >= n || S[i] === '0') return []; const k = [i + 1]; if (i + 1 < n && Number(S.slice(i, i + 2)) <= 26) k.push(i + 2); return k; },
    key: String, text: (i) => (i >= n ? 'end' : S[i] === '0' ? `"${S.slice(i)}" ✗` : `"${S.slice(i)}"`),
    lines: { call: [2, 3], base: [1] },
    say: (i, info) => (info.calls === 1 ? 'At each position, read one digit as a letter, or two digits if they form ten to twenty-six, and count the ways for what remains.' : S[i] === '0' && i < n ? 'A branch that starts with a zero is dead: no letter is encoded as zero.' : undefined),
  });
  v.eq(`${r.calls} calls · exponential for long strings`, 'bad').say('Every position can split into two branches, and the same suffixes repeat.');

  v.chapter('better', 'Better: memoise count(i)', { cx: 'O(n)', code: ['cache count(i) for each start i'] });
  v.eq('n suffixes, O(1) each', 'warn').say('Only n different suffixes exist, so caching makes it linear.');

  v.chapter('optimal', 'Bottom-up over prefixes', { cx: 'O(n) time, O(1) space', code: ['dp[0] = 1 (empty prefix)', 'if s[i−1] ≠ "0": dp[i] += dp[i−1]', 'if "10" ≤ s[i−2..i−1] ≤ "26": dp[i] += dp[i−2]', 'return dp[n]'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: n + 1 }, (_, i) => (i === 0 ? 1 : '')), { label: 'dp[i] = ways to decode the first i digits' });
  a.subs(['', ...S.split('')]);
  v.line(0).say('Let dp of i count the ways to decode the first i digits. The empty prefix has one way: decode nothing.');
  fill1D(v, a, [...Array(n).keys()].map((k) => k + 1), {
    base: [0], deps: (i) => [...(one(i) ? [i - 1] : []), ...(two(i) ? [i - 2] : [])], val: (i) => d[i], line: [1, 2],
    eq: (i) => `dp[${i}] = ${one(i) ? `dp[${i - 1}] (“${S[i - 1]}”)` : '0 (“0” alone ✗)'} + ${two(i) ? `dp[${i - 2}] (“${S.slice(i - 2, i)}”)` : i > 1 ? `0 (“${S.slice(i - 2, i)}” ✗)` : '0'} = ${d[i]}`,
    say: (i) => (i === 2 ? 'Two digits in: read them as one and one, or as eleven. Two ways.' : i === 4 ? 'The zero cannot stand alone, so the only option is to read one zero as ten, which uses dp of two. The ways that ended with a separate one before the zero are lost.' : i === 5 ? 'Six alone is fine, adding dp of four. Zero six is not a valid pair.' : undefined),
    hold: 600,
  });
  a.tone(n, 'ok');
  v.line(3).eq(`dp[${n}] = ${d[n]}`, 'ok').say(`${words(d[n])[0].toUpperCase()}${words(d[n]).slice(1)} ways. Each cell reads only the previous two, so two variables suffice.`);
  v.answer(decode(S));

  recap(v, [{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n)', space: 'O(n)' }, { name: 'Bottom-up, 2 variables', time: 'O(n)', space: 'O(1)' }], 'dp[i] = (single digit ok ? dp[i−1]) + (pair 10..26 ? dp[i−2]).', ['Count ways to parse a string with 1- or 2-char tokens → Fibonacci-like DP'], 'Handle zeros: never alone, never leading a pair.');
  return v.build();
}

const problem: Problem = {
  slug: 'decode-ways',
  statement: 'A message of letters A–Z is encoded as numbers ("A" → "1", …, "Z" → "26"). Given a string `s` of digits, return the number of ways to decode it. Codes like "06" are invalid.',
  examples: [{ input: 's = "12"', output: '2' }, { input: 's = "226"', output: '3' }, { input: 's = "06"', output: '0' }],
  constraints: ['1 ≤ s.length ≤ 100', 's contains only digits and may contain leading zeros'],
  hints: ['Look at the last one or two digits.', 'A zero can only be the second digit of 10 or 20.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Take one or two digits, recurse on the rest.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache count(i).', time: 'O(n)', space: 'O(n)', bottleneck: 'Memo + stack.' },
    { id: 'optimal', kind: 'optimal', name: 'Two variables', idea: 'dp over prefixes with a rolling pair.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'One digit or two: **Fibonacci with conditions**.',
  video,
  videoArgs: [S],
  judge: {
    type: 'fn', fn: 'numDecodings', params: ['String'], ret: 'int',
    tests: [{ args: ['12'], out: 2 }, { args: ['226'], out: 3 }, { args: ['06'], out: 0 }, { args: [S], out: 2 }, { args: ['10'], out: 1 }, { args: ['2101'], out: 1 }, { args: ['111111111111111111111111111111111111111111111'], out: decode('111111111111111111111111111111111111111111111'), big: true }],
    gen: (r: Rng) => [Array.from({ length: r.int(1, 14) }, () => String(r.chance(0.2) ? 0 : r.int(1, 3))).join('')],
    ref: (s: string) => decode(s),
  },
};

export default problem;
