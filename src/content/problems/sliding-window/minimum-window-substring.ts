import type { Problem, Rng } from '../../types';
import { Video, recap } from '../../helpers';

const S = 'ADOBECODEBANC';
const T = 'ABC';

function minWin(s: string, t: string) {
  const need = new Map<string, number>();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  let missing = t.length, l = 0, bl = 0, br = -1;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    if ((need.get(c) ?? 0) > 0) missing--;
    need.set(c, (need.get(c) ?? 0) - 1);
    while (missing === 0) {
      if (br < 0 || r - l < br - bl) { bl = l; br = r; }
      need.set(s[l], need.get(s[l])! + 1);
      if (need.get(s[l])! > 0) missing++;
      l++;
    }
  }
  return br < 0 ? '' : s.slice(bl, br + 1);
}

function video() {
  const v = new Video('minimum-window-substring', 'Minimum Window Substring');
  v.chapter('intro', 'The problem');
  v.array('s', S.split(''), { label: `s · t = "${T}"` });
  v.say('Find the shortest substring of s that contains every character of t, including repeats. If none exists, return the empty string.');
  v.eq(`answer: "${minWin(S, T)}"`, 'ok');

  v.chapter('brute', 'Brute force: every substring', { cx: 'O(n² · Σ)', code: ['for i: for j ≥ i: if s[i..j] covers t: record, break'] });
  v.eq('n² substrings, each coverage check costs up to Σ', 'bad').say('Checking every start and extending until t is covered is at least n squared.');

  v.chapter('optimal', 'Optimal: shortest-window template with a missing counter', { cx: 'O(n + m)', code: ['need = counts of t; missing = len(t)', 'for r: if need[s[r]] > 0: missing −= 1', '  need[s[r]] −= 1', '  while missing == 0:            # window covers t', '    record if shortest; need[s[l]] += 1', '    if need[s[l]] > 0: missing += 1; l += 1'] });
  v.clear();
  const a = v.array('s', S.split(''), { label: `t = "${T}"` });
  const vars = v.vars('v', { missing: T.length, best: '—' });
  const need = new Map<string, number>();
  for (const c of T) need.set(c, (need.get(c) ?? 0) + 1);
  let missing = T.length;
  let l = 0;
  let bl = 0;
  let br = -1;
  v.say('Keep need, the count of each character we still owe, and missing, the total number of characters still owed. Grow the window to the right. When missing hits zero, the window covers t: record it, then shrink from the left while it still covers t.');
  let told = 0;
  for (let r = 0; r < S.length; r++) {
    const c = S[r];
    const useful = (need.get(c) ?? 0) > 0;
    if (useful) missing--;
    need.set(c, (need.get(c) ?? 0) - 1);
    a.clearTones().win(l, r, 'win').tone(r, useful ? 'ok' : 'cmp');
    vars.set({ missing, best: br < 0 ? '—' : `"${S.slice(bl, br + 1)}"` });
    v.line(1, 2).eq(`add '${c}'${useful ? ' (needed) → missing ' + missing : ''}`);
    v.hold(420);
    while (missing === 0) {
      const rec = br < 0 || r - l < br - bl;
      if (rec) { bl = l; br = r; }
      vars.set({ missing, best: `"${S.slice(bl, br + 1)}"` });
      a.clearTones().win(l, r, 'ok', `len ${r - l + 1}`).tone(l, 'bad');
      v.line(4).eq(`"${S.slice(l, r + 1)}" covers t${rec ? ' ← shortest so far' : ''}; drop '${S[l]}'`, 'ok');
      if (told === 0) { v.say('At the C, the window A, D, O, B, E, C covers A, B and C. Missing is zero. Record it, length six, and try dropping the left end.'); told++; }
      else if (told === 1 && rec && r - l + 1 === 4) { v.say('B, A, N, C covers t with only four characters. The new shortest.'); told++; }
      else v.hold(550);
      need.set(S[l], need.get(S[l])! + 1);
      if (need.get(S[l])! > 0) missing++;
      l++;
    }
  }
  a.clearTones().noWin();
  const ans = minWin(S, T);
  v.eq(`"${ans}" · each index enters and leaves once → O(n + m)`, 'ok').say(`The shortest window is ${ans.split('').join(', ')}. The trick that makes each step constant time is the missing counter: it only changes when a character that is still needed enters or leaves.`);
  v.answer(ans);

  recap(v, [{ name: 'Every substring', time: 'O(n² · Σ)', space: 'O(Σ)' }, { name: 'Sliding window + missing counter', time: 'O(n + m)', space: 'O(Σ)' }], 'Grow until the window covers t, then shrink while it still does.', ['Shortest substring covering a multiset → shortest-window template', 'A single “missing” counter makes validity O(1)'], 'This is the hardest window problem, and it is just the shortest-window template with a clever counter.');
  return v.build();
}

const problem: Problem = {
  slug: 'minimum-window-substring',
  statement: 'Given strings `s` and `t`, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such substring, return `""`. The answer is unique.',
  examples: [{ input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' }, { input: 's = "a", t = "a"', output: '"a"' }, { input: 's = "a", t = "aa"', output: '""' }],
  constraints: ['1 ≤ m, n ≤ 10⁵', 'upper and lowercase letters'],
  hints: ['Grow the window until it contains all of t. Then shrink.', 'Track how many required characters are still missing.'],
  approaches: [
    { id: 'brute', kind: 'brute', name: 'Every substring', idea: 'For each start, extend until t is covered.', time: 'O(n² · Σ)', space: 'O(Σ)', bottleneck: 'Quadratic windows.' },
    { id: 'optimal', kind: 'optimal', name: 'Sliding window + missing counter', idea: 'need[c] counts characters still owed; missing totals them; record and shrink while missing == 0.', time: 'O(n + m)', space: 'O(Σ)' },
  ],
  pitfalls: ['need[c] may go negative for surplus characters; only a positive need counts as missing.', 'Record only strictly shorter windows to keep the first one.'],
  takeaway: 'Shortest covering window: **missing counter** + shrink while valid.',
  video,
  videoArgs: [S, T],
  judge: {
    type: 'fn', fn: 'minWindow', params: ['String', 'String'], ret: 'String',
    tests: [{ args: ['ADOBECODEBANC', 'ABC'], out: 'BANC' }, { args: ['a', 'a'], out: 'a' }, { args: ['a', 'aa'], out: '' }, { args: ['aaflslflsldkalskaaa', 'aaa'], out: 'aaa' }],
    gen: (r: Rng) => {
      for (;;) {
        const s = r.str(r.int(1, 14), 'abcA');
        const t = r.str(r.int(1, 3), 'abcA');
        const ans = minWin(s, t);
        // Keep only inputs whose shortest window is unique, as the problem promises.
        let count = 0;
        if (ans) for (let i = 0; i + ans.length <= s.length; i++) if (minWin(s.slice(i, i + ans.length), t) === s.slice(i, i + ans.length)) count++;
        if (!ans || count === 1) return [s, t];
      }
    },
    ref: (s: string, t: string) => minWin(s, t),
  },
};

export default problem;
