import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';
import { fill1D } from '../../dpviz';

const S = 'applepenapple';
const DICT = ['apple', 'pen'];
function tbl(s: string, dict: string[]) { const set = new Set(dict); const d = Array(s.length + 1).fill(false); d[0] = true; for (let i = 1; i <= s.length; i++) for (let j = 0; j < i; j++) if (d[j] && set.has(s.slice(j, i))) { d[i] = true; break; } return d; }
function brk(s: string, dict: string[]) { return tbl(s, dict)[s.length]; }

function video() {
  const v = new Video('word-break', 'Word Break');
  const n = S.length;
  const d = tbl(S, DICT);
  const set = new Set(DICT);
  const via = (i: number) => { for (let j = 0; j < i; j++) if (d[j] && set.has(S.slice(j, i))) return j; return -1; };
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: 's' });
  v.say(`Can the string be cut into pieces that are all dictionary words? The dictionary holds ${DICT.join(' and ')}, and words may be reused.`);
  v.eq(`"${S}" = apple + pen + apple → ${brk(S, DICT)}`);

  v.chapter('brute', 'Brute force: try every first word, recurse on the rest', { cx: 'O(2ⁿ)', code: ['canBreak(start):', '  if start == n: return true', '  for end in start+1..n: if s[start:end] in dict and canBreak(end): return true', '  return false'] });
  v.eq('"aaaa…ab" with dict {a, aa, aaa, …} explores 2ⁿ cuttings', 'bad').say('Try every dictionary word that the string starts with, then recurse on the rest. On adversarial inputs like many a’s followed by a b, the same suffixes are tried again and again: exponential.');

  v.chapter('better', 'Better: memoise canBreak(start)', { cx: 'O(n² · L)', code: ['cache canBreak(start) for each start index'] });
  v.eq('n suffixes, each tries n cut points', 'warn').say('The answer depends only on where the remaining suffix starts, so there are only n different questions. Caching them gives about n squared substring checks.');

  v.chapter('optimal', 'Bottom-up: dp[i] = can the first i letters be split?', { cx: 'O(n · W · L)', code: ['dp[0] = true', 'for i in 1..n:', '  dp[i] = any(dp[j] and s[j:i] in dict)', '  (only j with i − j ≤ longest word)', 'return dp[n]'] });
  v.clear();
  const a = v.array('dp', Array.from({ length: n + 1 }, (_, i) => (i === 0 ? 'T' : '')), { label: 'dp[i] = first i letters can be split (letter i−1 shown below)' });
  a.subs(['', ...S.split('')]);
  v.line(0).say('Let dp of i say whether the first i letters can be split into words. The empty prefix trivially can.');
  fill1D(v, a, [...Array(n).keys()].map((k) => k + 1), {
    base: [0], deps: (i) => { const j = via(i); return j >= 0 ? [j] : []; }, val: (i) => (d[i] ? 'T' : 'F'), line: [2],
    eq: (i) => { const j = via(i); return j >= 0 ? `dp[${i}] = dp[${j}] ∧ "${S.slice(j, i)}" ∈ dict → T` : `dp[${i}]: no j with dp[j] = T and s[j:${i}] a word → F`; },
    say: (i) => (i === 1 ? 'The first letter alone, a, is not a word, and there is nothing shorter to build on: false.' : i === 5 ? 'At five letters, dp of zero is true and apple is a word: true.' : i === 8 ? 'At eight, dp of five is true and the next three letters spell pen: true.' : i === n ? 'At the end, dp of eight is true and the last five letters spell apple: true.' : undefined),
    hold: 350,
  });
  a.tone(n, 'ok');
  v.line(4).eq(`dp[${n}] = ${d[n] ? 'T' : 'F'}`, 'ok').say('The whole string can be split. Limiting the look-back to the longest word keeps each cell cheap.');
  v.answer(brk(S, DICT));

  recap(v, [{ name: 'Recursion', time: 'O(2ⁿ)', space: 'O(n)' }, { name: 'Memoisation', time: 'O(n² · L)', space: 'O(n)' }, { name: 'Bottom-up, bounded look-back', time: 'O(n · W · L)', space: 'O(n)' }], 'dp[i] = some split point j with dp[j] and s[j:i] a word.', ['Can a string be segmented? → dp over prefixes'], 'Use a set for the dictionary and bound j by the longest word.');
  return v.build();
}

const problem: Problem = {
  slug: 'word-break',
  statement: 'Given a string `s` and a dictionary `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. Words may be reused.',
  examples: [{ input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true' }, { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true' }, { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false' }],
  constraints: ['1 ≤ s.length ≤ 300', '1 ≤ wordDict.length ≤ 1000', '1 ≤ wordDict[i].length ≤ 20', 'all words are unique'],
  hints: ['dp[i]: can the first i characters be split?', 'dp[i] = OR over j of dp[j] and s[j:i] in dict.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Recursion', idea: 'Try every first word, recurse on the rest.', time: 'O(2ⁿ)', space: 'O(n)', bottleneck: 'Exponential on repetitive inputs.' },
    { id: 'better', kind: 'better', name: 'Memoisation', idea: 'Cache canBreak(start).', time: 'O(n² · L)', space: 'O(n)', bottleneck: 'Tries all split points.' },
    { id: 'optimal', kind: 'optimal', name: 'Bottom-up', idea: 'dp over prefixes, looking back at most the longest word.', time: 'O(n · W · L)', space: 'O(n)' },
  ],
  takeaway: 'dp over **prefixes**: a good split point + a word.',
  video,
  videoArgs: [S, DICT],
  judge: {
    type: 'fn', fn: 'wordBreak', params: ['String', 'List<String>'], ret: 'boolean',
    tests: [{ args: ['leetcode', ['leet', 'code']], out: true }, { args: [S, DICT], out: true }, { args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], out: false }, { args: ['aaaaaaaaaaaaaaaaaaaaaaab', ['a', 'aa', 'aaa', 'aaaa', 'aaaaa']], out: false }],
    gen: (r: Rng) => { const al = 'ab'; const w = () => Array.from({ length: r.int(1, 3) }, () => al[r.int(0, 1)]).join(''); return [Array.from({ length: r.int(1, 12) }, () => al[r.int(0, 1)]).join(''), [...new Set(Array.from({ length: r.int(1, 4) }, w))]]; },
    ref: (s: string, dict: string[]) => brk(s, dict),
  },
};

export default problem;
