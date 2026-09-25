import type { Problem } from '../../types';
import { Video, recap } from '../../helpers';

const T = 'abxabcabcaby';
const P = 'abcaby';

function lps(p: string) {
  const out = Array(p.length).fill(0);
  let len = 0;
  for (let i = 1; i < p.length; ) {
    if (p[i] === p[len]) out[i++] = ++len;
    else if (len) len = out[len - 1];
    else out[i++] = 0;
  }
  return out;
}

function video() {
  const v = new Video('strstr', 'Find the Index of the First Occurrence in a String');
  v.chapter('intro', 'The problem');
  const t = v.array('t', [...T], { label: 'haystack' });
  v.array('p', [...P], { label: 'needle' });
  v.say('Find the first index where the needle appears inside the haystack, or return minus one.');
  t.toneRange(6, 11, 'ok');
  v.eq('answer: 6', 'ok').hold(800);
  t.clearTones();

  v.chapter('brute', 'Brute force: try every start', { cx: 'O(n·m)', code: ['for s in 0..n−m:', '  j = 0', '  while j < m and T[s+j] == P[j]: j += 1', '  if j == m: return s'] });
  v.clear();
  const bt = v.array('t', [...T], { label: 'haystack' });
  const bp = v.array('p', Array(T.length).fill(null), { label: 'needle aligned at start s', showIdx: false });
  let compares = 0;
  for (let s = 0; s + P.length <= T.length; s++) {
    let j = 0;
    while (j < P.length && T[s + j] === P[j]) j++;
    compares += Math.min(j + 1, P.length);
    bp.setAll(Array.from({ length: T.length }, (_, k) => (k >= s && k < s + P.length ? P[k - s] : null)));
    bt.clearTones().toneRange(s, s + j - 1, 'ok');
    bp.clearTones().toneRange(s, s + j - 1, 'ok');
    if (j < P.length) {
      bt.tone(s + j, 'bad');
      bp.tone(s + j, 'bad');
    }
    v.counter(`char comparisons: ${compares}`).line(2).eq(j === P.length ? `match at ${s}` : `start ${s}: ${j} chars match, then mismatch`, j === P.length ? 'ok' : 'bad');
    if (s === 0) v.say('Try every starting position and compare the needle character by character. At start zero, a and b match, then x does not match c.');
    else if (s === 3) v.say('At start three we match five characters before failing at the last one. Then brute force slides by just one and re-compares characters it has already seen.');
    else if (j === P.length) v.say('Eventually it finds the match at six.');
    else v.hold(600);
    if (j === P.length) break;
  }
  v.note('worst case O(n · m)').hold(700);

  v.chapter('optimal', 'Optimal: KMP never moves backwards in the text', { cx: 'O(n + m)', code: ['lps = longest proper prefix = suffix, for each prefix of P', 'i, j = 0, 0', 'while i < n:', '  if T[i] == P[j]: i += 1; j += 1; if j == m: return i − m', '  elif j > 0: j = lps[j − 1]', '  else: i += 1'] });
  v.clear();
  const L = lps(P);
  const lp = v.array('p', [...P], { label: 'needle' });
  lp.subs(L.map(String));
  v.eq(`lps = [${L.join(', ')}]`).line(0);
  v.say('KMP first studies the needle. For each prefix it records the length of the longest part that is both a proper prefix and a suffix. For a b c a b, that is a b: length two.');
  v.clear();
  const kt = v.array('t', [...T], { label: 'haystack' });
  const kp = v.array('p', Array(T.length).fill(null), { label: 'needle (aligned at i − j)', showIdx: false });
  const vv = v.vars('v', { i: 0, j: 0 });
  let i = 0;
  let j = 0;
  let steps = 0;
  let saidJump = false;
  const show = (tone: 'ok' | 'bad') => {
    const s = i - j;
    kp.setAll(Array.from({ length: T.length }, (_, k) => (k >= s && k < s + P.length ? P[k - s] : null)));
    kt.clearTones().toneRange(s, i - 1, 'ok').ptr('i', Math.min(i, T.length - 1));
    kp.clearTones().toneRange(s, i - 1, 'ok');
    if (i < T.length) {
      kt.tone(i, tone === 'ok' ? 'cmp' : 'bad');
      kp.tone(i, tone === 'ok' ? 'cmp' : 'bad');
    }
    vv.set({ i, j });
  };
  while (i < T.length) {
    steps++;
    if (T[i] === P[j]) {
      i++;
      j++;
      show('ok');
      v.line(3).counter(`steps: ${steps}`).eq(`match → i = ${i}, j = ${j}`, 'ok');
      if (j === P.length) {
        v.eq(`j == m → found at ${i - P.length}`, 'ok').say('j reaches the needle length: found at index six. And i never moved backwards.');
        break;
      }
      v.hold(420);
    } else if (j > 0) {
      const old = j;
      j = L[j - 1];
      show('bad');
      v.line(4).counter(`steps: ${steps}`).eq(`mismatch → j = lps[${old - 1}] = ${j} (i stays)`, 'bad');
      if (!saidJump && old === 5) {
        v.say('Here is the magic. After matching a b c a b and failing, we know the text ends with a b, which is also the start of the needle. So keep i where it is and jump j back to two, instead of re-reading those characters.');
        saidJump = true;
      } else v.hold(700);
    } else {
      i++;
      show('ok');
      v.line(5).counter(`steps: ${steps}`).eq('mismatch at j = 0 → i += 1', 'bad').hold(420);
    }
  }
  kt.noPtr();
  v.note('text pointer only moves forward');
  v.answer(i - P.length);

  recap(v, [{ name: 'Try every start', time: 'O(n·m)', space: 'O(1)' }, { name: 'KMP', time: 'O(n + m)', space: 'O(m)' }], 'Brute force re-reads text after a mismatch. KMP remembers how much of the needle still matches.', ['On a mismatch, reuse the longest prefix that is also a suffix', 'Full details in the string matching module'], 'For interviews, brute force is usually accepted here, but knowing KMP shows depth. We cover it fully in the string matching module.');
  return v.build();
}

const problem: Problem = {
  slug: 'find-the-index-of-the-first-occurrence-in-a-string',
  statement: 'Given two strings `haystack` and `needle`, return the index of the **first occurrence** of `needle` in `haystack`, or `-1` if it does not occur.',
  examples: [
    { input: 'haystack = "sadbutsad", needle = "sad"', output: '0' },
    { input: 'haystack = "leetcode", needle = "leeto"', output: '-1' },
  ],
  constraints: ['1 ≤ haystack.length, needle.length ≤ 10⁴', 'lowercase letters'],
  hints: ['Try every starting position in the haystack.', 'After a partial match fails, do you really need to re-read those characters?'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Try every start', idea: 'For each start `s`, compare `needle` with `haystack[s…]` until a mismatch.', time: 'O(n·m)', space: 'O(1)', bottleneck: 'After a mismatch it slides by one and re-compares characters it already saw.' },
    { id: 'optimal', kind: 'optimal', name: 'KMP', idea: 'Precompute `lps` for the needle. Scan the haystack once; on a mismatch, set `j = lps[j − 1]` instead of moving `i` back.', time: 'O(n + m)', space: 'O(m)' },
  ],
  pitfalls: ['Loop bound for brute force is `s ≤ n − m`.'],
  takeaway: 'Brute force is fine for small inputs; **KMP** avoids re-reading text by reusing the longest prefix that is also a suffix.',
  video,
  videoArgs: [T, P],
  judge: {
    type: 'fn', fn: 'strStr', params: ['String', 'String'], ret: 'int',
    tests: [{ args: ['sadbutsad', 'sad'], out: 0 }, { args: ['leetcode', 'leeto'], out: -1 }, { args: ['abxabcabcaby', 'abcaby'], out: 6 }, { args: ['a', 'a'], out: 0 }, { args: ['aaa', 'aaaa'], out: -1 }, { args: ['mississippi', 'issip'], out: 4 }],
    gen: (r) => [r.str(r.int(1, 20), 'ab'), r.str(r.int(1, 4), 'ab')],
    ref: (h: string, n: string) => h.indexOf(n),
  },
};

export default problem;
