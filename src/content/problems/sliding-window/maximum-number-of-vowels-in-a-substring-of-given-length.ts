import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'abciiidef';
const K = 3;
const isV = (c: string) => 'aeiou'.includes(c);

function best(s: string, k: number) {
  let c = 0, b = 0;
  for (let r = 0; r < s.length; r++) { if (isV(s[r])) c++; if (r >= k && isV(s[r - k])) c--; if (r >= k - 1) b = Math.max(b, c); }
  return b;
}

function video() {
  const v = new Video('max-vowels', 'Maximum Number of Vowels in a Substring of Given Length');
  v.chapter('intro', 'The problem');
  const a0 = v.array('s', S.split(''), { label: `k = ${K}` });
  S.split('').forEach((c, i) => { if (isV(c)) a0.tone(i, 'ok'); });
  v.say(`Among all substrings of length ${K}, find the largest number of vowels any of them contains.`);

  v.chapter('brute', 'Brute force: count each window from scratch', { cx: 'O(n · k)', code: ['for i in 0..n−k: count vowels in s[i .. i+k−1]'] });
  v.eq('k checks per window, n windows', 'warn').say('Counting every window from scratch costs k per window.');

  v.chapter('optimal', 'Optimal: fixed window with a vowel counter', { cx: 'O(n)', code: ['for r in 0..n−1:', '  if s[r] is a vowel: count += 1', '  if r >= k and s[r − k] is a vowel: count −= 1', '  if r >= k − 1: best = max(best, count)'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: `k = ${K}` });
  let c = 0;
  let b = 0;
  v.say('Slide a window of size three, keeping only a count of vowels inside it. The entering character may add one, the leaving character may subtract one.');
  for (let r = 0; r < S.length; r++) {
    const inV = isV(S[r]);
    const outV = r >= K && isV(S[r - K]);
    if (inV) c++;
    if (outV) c--;
    const full = r >= K - 1;
    if (full) b = Math.max(b, c);
    a.clearTones().win(Math.max(0, r - K + 1), r, 'win', `vowels ${c}`).tone(r, inV ? 'ok' : 'cmp');
    if (r >= K) a.tone(r - K, outV ? 'bad' : 'dim');
    v.line(inV ? 1 : outV ? 2 : 3).counter(`best: ${b}`).eq(`in '${S[r]}'${inV ? ' +1' : ''}${r >= K ? ` · out '${S[r - K]}'${outV ? ' −1' : ''}` : ''} → ${c}`);
    if (r === K) v.say('The window moves: i enters, a vowel, plus one; a leaves, also a vowel, minus one. Still one.');
    else if (b === K && c === K && r === 5) v.say('The window i, i, i holds three vowels, the most a window of size three can.');
    else v.hold(550);
  }
  a.clearTones().noWin();
  v.eq(`best = ${b}`, 'ok').say(`The answer is ${b}. Each step changes the count by at most one in each direction, so the scan is linear.`);
  v.answer(best(S, K));

  recap(v, [{ name: 'Count each window', time: 'O(n · k)', space: 'O(1)' }, { name: 'Fixed sliding window', time: 'O(n)', space: 'O(1)' }], 'Keep a count, adjust for the one entering and the one leaving.', ['Fixed-size window + a simple property count'], 'Any property you can add and subtract, a sum, a vowel count, a zero count, slides in constant time.');
  return v.build();
}

const problem: Problem = {
  slug: 'maximum-number-of-vowels-in-a-substring-of-given-length',
  statement: 'Given a string `s` and an integer `k`, return the maximum number of vowel letters (`a, e, i, o, u`) in any substring of `s` with length `k`.',
  examples: [{ input: 's = "abciiidef", k = 3', output: '3' }, { input: 's = "aeiou", k = 2', output: '2' }, { input: 's = "leetcode", k = 3', output: '2' }],
  constraints: ['1 ≤ k ≤ s.length ≤ 10⁵', 'lowercase letters'],
  hints: ['Window of fixed length k: what changes when it moves?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Count each window', idea: 'Count vowels in every length-k substring.', time: 'O(n · k)', space: 'O(1)', bottleneck: 'Recounts overlapping characters.' },
    { id: 'optimal', kind: 'optimal', name: 'Sliding window count', idea: 'Add 1 if the entering char is a vowel, subtract 1 if the leaving one is.', time: 'O(n)', space: 'O(1)' },
  ],
  takeaway: 'Fixed window + a **countable property**.',
  video,
  videoArgs: [S, K],
  judge: {
    type: 'fn', fn: 'maxVowels', params: ['String', 'int'], ret: 'int',
    tests: [{ args: ['abciiidef', 3], out: 3 }, { args: ['aeiou', 2], out: 2 }, { args: ['leetcode', 3], out: 2 }, { args: ['rhythms', 4], out: 0 }],
    gen: (r: Rng) => { const s = r.str(r.int(1, 14), 'abeiox'); return [s, r.int(1, s.length)]; },
    ref: (s: string, k: number) => best(s, k),
  },
};

export default problem;
